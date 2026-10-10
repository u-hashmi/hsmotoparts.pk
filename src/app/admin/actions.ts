"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { OrderStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/format";
import { deleteUpload, imageUrl, saveUpload, UploadError } from "@/lib/uploads";
import type { FormState } from "./action-form";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const int = (fd: FormData, k: string) => {
  const v = str(fd, k);
  return v === "" ? null : Math.round(Number(v));
};
const bool = (fd: FormData, k: string) => fd.get(k) === "on";

function done(path: string) {
  revalidatePath("/", "layout");
  redirect(path);
}

class FormError extends Error {}

function fail(e: unknown): FormState {
  if (e instanceof UploadError || e instanceof FormError) return { error: e.message };
  if (e instanceof z.ZodError) return { error: e.issues[0]?.message ?? "Invalid input" };
  throw e;
}

async function uniqueSlug(base: string, taken: (slug: string) => Promise<boolean>) {
  const root = slugify(base) || "item";
  let slug = root;
  for (let n = 2; await taken(slug); n++) slug = `${root}-${n}`;
  return slug;
}

/** Saves newly chosen image files from a multi-file input; returns their public URLs. */
async function saveImages(fd: FormData, field: string) {
  const files = fd.getAll(field).filter((f): f is File => f instanceof File && f.size > 0);
  const urls: string[] = [];
  for (const f of files) urls.push(imageUrl(await saveUpload(f, "images")));
  return urls;
}

function uploadName(url: string) {
  return url.startsWith("/uploads/") ? url.slice("/uploads/".length) : null;
}

async function removeImages(urls: string[]) {
  for (const u of urls) {
    const name = uploadName(u);
    if (name) await deleteUpload("images", name);
  }
}

// ---------- Products ----------

const productSchema = z.object({
  name: z.string().min(2, "Name is required").max(140),
  price: z.number({ message: "Price is required" }).int().min(0, "Price can't be negative"),
  compareAtPrice: z.number().int().min(0).nullable(),
  stock: z.number({ message: "Stock is required" }).int().min(0),
  sku: z.string().max(60),
  partType: z.string().max(60),
  description: z.string().max(10000),
});

export async function saveProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id") || null;
  try {
    const data = productSchema.parse({
      name: str(fd, "name"),
      price: int(fd, "price"),
      compareAtPrice: int(fd, "compareAtPrice"),
      stock: int(fd, "stock"),
      sku: str(fd, "sku"),
      partType: str(fd, "partType"),
      description: str(fd, "description"),
    });
    const categoryIds = fd.getAll("categories").map(String);
    const existing = id ? await db.product.findUnique({ where: { id } }) : null;
    if (id && !existing) return { error: "Product not found." };

    const keep = fd.getAll("keepImages").map(String).filter((u) => existing?.images.includes(u));
    const added = await saveImages(fd, "newImages");
    const images = [...keep, ...added];

    const slugInput = str(fd, "slug");
    const slug =
      existing && (!slugInput || slugInput === existing.slug)
        ? existing.slug
        : await uniqueSlug(slugInput || data.name, async (s) => !!(await db.product.findFirst({ where: { slug: s, NOT: id ? { id } : undefined } })));

    const fields = {
      ...data,
      sku: data.sku || null,
      partType: data.partType || null,
      slug,
      images,
      featured: bool(fd, "featured"),
      active: bool(fd, "active"),
      categories: { set: categoryIds.map((cid) => ({ id: cid })) },
    };

    if (existing) {
      await db.product.update({ where: { id: existing.id }, data: fields });
      await removeImages(existing.images.filter((u) => !images.includes(u)));
    } else {
      await db.product.create({ data: { ...fields, categories: { connect: categoryIds.map((cid) => ({ id: cid })) } } });
    }
  } catch (e) {
    return fail(e);
  }
  done("/admin/products");
  return {};
}

export async function deleteProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const product = await db.product.findUnique({ where: { id: str(fd, "id") } });
  if (product) {
    await db.product.delete({ where: { id: product.id } });
    await removeImages(product.images);
  }
  done("/admin/products");
  return {};
}

// ---------- Categories ----------

export async function saveCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id") || null;
  const name = str(fd, "name");
  if (name.length < 2) return { error: "Name is required." };
  try {
    const existing = id ? await db.category.findUnique({ where: { id } }) : null;
    const [newImage] = await saveImages(fd, "image");
    const removeImage = bool(fd, "removeImage");
    const image = newImage ?? (removeImage ? null : existing?.imageUrl ?? null);
    const slugInput = slugify(str(fd, "slug"));
    const slug =
      existing && (!slugInput || slugInput === existing.slug)
        ? existing.slug
        : await uniqueSlug(slugInput || name, async (s) => !!(await db.category.findFirst({ where: { slug: s, NOT: id ? { id } : undefined } })));
    const data = {
      name,
      slug,
      description: str(fd, "description") || null,
      isBike: bool(fd, "isBike"),
      sortOrder: int(fd, "sortOrder") ?? 0,
      imageUrl: image,
    };
    if (existing) {
      await db.category.update({ where: { id: existing.id }, data });
      if (existing.imageUrl && existing.imageUrl !== image) await removeImages([existing.imageUrl]);
    } else {
      await db.category.create({ data });
    }
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/", "layout");
  return { ok: "Saved." };
}

export async function deleteCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const category = await db.category.findUnique({ where: { id: str(fd, "id") } });
  if (category) {
    await db.category.delete({ where: { id: category.id } });
    if (category.imageUrl) await removeImages([category.imageUrl]);
  }
  done("/admin/categories");
  return {};
}

// ---------- Blog ----------

export async function savePost(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id") || null;
  const title = str(fd, "title");
  if (title.length < 3) return { error: "Title is required." };
  try {
    const existing = id ? await db.post.findUnique({ where: { id } }) : null;
    const [newCover] = await saveImages(fd, "cover");
    const coverUrl = newCover ?? (bool(fd, "removeCover") ? null : existing?.coverUrl ?? null);
    const slugInput = str(fd, "slug");
    const slug =
      existing && (!slugInput || slugInput === existing.slug)
        ? existing.slug
        : await uniqueSlug(slugInput || title, async (s) => !!(await db.post.findFirst({ where: { slug: s, NOT: id ? { id } : undefined } })));
    const published = bool(fd, "published");
    const data = {
      title,
      slug,
      tag: str(fd, "tag") || null,
      excerpt: str(fd, "excerpt"),
      body: str(fd, "body"),
      coverUrl,
      published,
      publishedAt: published ? existing?.publishedAt ?? new Date() : existing?.publishedAt ?? null,
    };
    if (existing) {
      await db.post.update({ where: { id: existing.id }, data });
      if (existing.coverUrl && existing.coverUrl !== coverUrl) await removeImages([existing.coverUrl]);
    } else {
      await db.post.create({ data });
    }
  } catch (e) {
    return fail(e);
  }
  done("/admin/posts");
  return {};
}

export async function deletePost(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const post = await db.post.findUnique({ where: { id: str(fd, "id") } });
  if (post) {
    await db.post.delete({ where: { id: post.id } });
    if (post.coverUrl) await removeImages([post.coverUrl]);
  }
  done("/admin/posts");
  return {};
}

// ---------- Settings ----------

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const url = (k: string) => {
      const v = str(fd, k);
      if (v && !/^https:\/\//.test(v)) throw new FormError(`${k === "facebookUrl" ? "Facebook" : "Instagram"} link must start with https://`);
      return v;
    };
    const current = await db.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
    const [newHero] = await saveImages(fd, "heroImage");
    const heroImage = newHero ?? (bool(fd, "removeHero") ? "" : current.heroImage);
    const pixel = str(fd, "metaPixelId");
    if (pixel && !/^\d{5,20}$/.test(pixel)) return { error: "Meta Pixel ID should be digits only." };

    await db.settings.update({
      where: { id: 1 },
      data: {
        whatsapp: str(fd, "whatsapp"),
        phone: str(fd, "phone"),
        email: str(fd, "email"),
        address: str(fd, "address"),
        facebookUrl: url("facebookUrl"),
        instagramUrl: url("instagramUrl"),
        metaPixelId: pixel,
        heroImage,
        jazzcashNumber: str(fd, "jazzcashNumber"),
        jazzcashTitle: str(fd, "jazzcashTitle"),
        easypaisaNumber: str(fd, "easypaisaNumber"),
        easypaisaTitle: str(fd, "easypaisaTitle"),
        bankName: str(fd, "bankName"),
        bankTitle: str(fd, "bankTitle"),
        bankIban: str(fd, "bankIban").toUpperCase(),
        deliveryFee: Math.max(0, int(fd, "deliveryFee") ?? 0),
        freeDeliveryOver: Math.max(0, int(fd, "freeDeliveryOver") ?? 0),
        codEnabled: bool(fd, "codEnabled"),
        jazzcashEnabled: bool(fd, "jazzcashEnabled"),
        easypaisaEnabled: bool(fd, "easypaisaEnabled"),
        bankEnabled: bool(fd, "bankEnabled"),
      },
    });
    if (current.heroImage && current.heroImage !== heroImage) await removeImages([current.heroImage]);
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/", "layout");
  return { ok: "Settings saved." };
}

// ---------- Orders ----------

const INACTIVE: OrderStatus[] = ["CANCELLED", "RETURNED"];

export async function updateOrder(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const status = z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]).parse(str(fd, "status"));
  const paymentStatus = z.enum(["UNPAID", "AWAITING_VERIFICATION", "PAID", "REFUNDED"]).parse(str(fd, "paymentStatus"));

  await db.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({ where: { id }, include: { items: true } });
    const wasActive = !INACTIVE.includes(order.status);
    const isActive = !INACTIVE.includes(status);
    // Put stock back when an order is cancelled/returned, and take it again if reinstated.
    if (wasActive !== isActive) {
      for (const item of order.items) {
        if (!item.productId) continue;
        await tx.product.updateMany({
          where: { id: item.productId },
          data: { stock: isActive ? { decrement: item.quantity } : { increment: item.quantity } },
        });
      }
    }
    await tx.order.update({ where: { id }, data: { status, paymentStatus } });
  });
  revalidatePath("/admin", "layout");
  return { ok: "Order updated." };
}
