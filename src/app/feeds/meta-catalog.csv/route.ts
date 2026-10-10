import { db } from "@/lib/db";

/**
 * Product catalog feed for Meta Commerce Manager (Facebook Shop / Instagram Shopping).
 * Add this URL as a scheduled data feed in Commerce Manager.
 */
export async function GET() {
  const site = (process.env.SITE_URL || "").replace(/\/$/, "");
  const products = await db.product.findMany({
    where: { active: true, images: { isEmpty: false } },
    include: { categories: { select: { name: true }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const header = ["id", "title", "description", "availability", "condition", "price", "sale_price", "link", "image_link", "additional_image_link", "brand", "product_type"];
  const rows = products.map((p) => {
    const onSale = p.compareAtPrice && p.compareAtPrice > p.price;
    return [
      p.sku || p.id,
      p.name,
      p.description || p.name,
      p.stock > 0 ? "in stock" : "out of stock",
      "new",
      `${onSale ? p.compareAtPrice : p.price} PKR`,
      onSale ? `${p.price} PKR` : "",
      `${site}/product/${p.slug}`,
      site + p.images[0],
      p.images.slice(1, 10).map((i) => site + i).join(","),
      "HSmotoparts",
      p.categories[0]?.name ?? "",
    ];
  });

  const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "public, max-age=900" } });
}

function csvCell(value: string | number) {
  const s = String(value).replace(/\r?\n/g, " ");
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
