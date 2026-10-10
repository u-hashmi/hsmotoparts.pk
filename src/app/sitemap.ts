import type { MetadataRoute } from "next";

// Built on request: the product list lives in the database.
export const dynamic = "force-dynamic";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const [categories, products, posts] = await Promise.all([
    db.category.findMany({ select: { slug: true } }),
    db.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    db.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);
  return [
    { url: site, changeFrequency: "daily", priority: 1 },
    ...["/blog", "/return-policy", "/payment-methods", "/contact"].map((p) => ({ url: site + p })),
    ...categories.map((c) => ({ url: `${site}/category/${c.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${site}/product/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${site}/blog/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
