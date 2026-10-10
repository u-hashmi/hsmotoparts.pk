import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { CardProduct } from "@/components/product-card";

export const cardSelect = {
  id: true,
  slug: true,
  name: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  images: true,
  partType: true,
  categories: { select: { name: true }, orderBy: { sortOrder: "asc" }, take: 1 },
} satisfies Prisma.ProductSelect;

type Selected = Prisma.ProductGetPayload<{ select: typeof cardSelect }>;

/** Adds the small label shown above a product name: its part type, else its first category. */
export function toCard(p: Selected, preferPartType = false): CardProduct {
  const label = preferPartType ? p.partType || p.categories[0]?.name : p.categories[0]?.name || p.partType;
  return { ...p, label };
}
