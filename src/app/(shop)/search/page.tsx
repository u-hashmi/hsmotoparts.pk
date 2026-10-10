import type { Metadata } from "next";
import { ProductListing } from "@/components/product-listing";

export const metadata: Metadata = { title: "Search parts" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim().slice(0, 100) || "";
  // Every word must match the name, part type, SKU or a category name.
  const words = q.split(/\s+/).filter(Boolean);
  const baseWhere = {
    AND: words.map((w) => ({
      OR: [
        { name: { contains: w, mode: "insensitive" as const } },
        { partType: { contains: w, mode: "insensitive" as const } },
        { sku: { contains: w, mode: "insensitive" as const } },
        { categories: { some: { name: { contains: w, mode: "insensitive" as const } } } },
      ],
    })),
  };

  return (
    <>
      <section className="border-b-4 border-brand bg-ink-2 text-white">
        <div className="mx-auto max-w-7xl px-4 pt-7 pb-8">
          <h1 className="font-display text-4xl leading-none font-extrabold uppercase md:text-5xl">
            {q ? `Results for “${q}”` : "All parts"}
          </h1>
        </div>
      </section>
      <ProductListing baseWhere={baseWhere} searchParams={sp} basePath="/search" />
    </>
  );
}
