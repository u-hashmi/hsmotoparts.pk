import Link from "next/link";
import { ImageBox } from "@/components/image-box";
import { db } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import { PageTitle } from "../../ui";

export const metadata = { title: "Products" };

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const products = await db.product.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] } : {},
    include: { categories: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <PageTitle
        action={<Link href="/admin/products/new" className="inline-flex h-11 items-center rounded bg-brand px-5 font-bold text-white hover:bg-brand-dark">+ Add product</Link>}
      >
        Products
      </PageTitle>
      <form className="mb-4 flex gap-2">
        <label className="sr-only" htmlFor="pq">Search products</label>
        <input id="pq" name="q" defaultValue={q} placeholder="Search name or SKU" className="h-10 w-72 max-w-full rounded border border-[#cfcdc8] bg-white px-3" />
        <button className="h-10 rounded bg-ink px-4 font-semibold text-white">Search</button>
      </form>
      <div className="overflow-x-auto rounded-md border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs tracking-wide text-muted uppercase">
            <tr><th className="p-3">Product</th><th className="p-3">Categories</th><th className="p-3 text-right">Price</th><th className="p-3 text-right">Stock</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted">No products yet.</td></tr>}
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-paper">
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                    <ImageBox src={p.images[0]} alt="" className="size-12 flex-none rounded" sizes="80px" />
                    <span><span className="font-semibold underline">{p.name}</span>{p.sku && <span className="block text-muted">{p.sku}</span>}</span>
                  </Link>
                </td>
                <td className="p-3">{p.categories.map((c) => c.name).join(", ")}</td>
                <td className="p-3 text-right whitespace-nowrap">{formatPKR(p.price)}</td>
                <td className={`p-3 text-right font-semibold ${p.stock === 0 ? "text-brand-dark" : ""}`}>{p.stock}</td>
                <td className="p-3">{p.active ? (p.featured ? "Live · Featured" : "Live") : <span className="text-muted">Hidden</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
