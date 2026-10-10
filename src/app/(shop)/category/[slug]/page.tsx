import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/product-listing";
import { db } from "@/lib/db";

async function getCategory(slug: string) {
  return db.category.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  if (!category) return {};
  return {
    title: category.isBike ? `${category.name} parts` : category.name,
    description: category.description || `Shop ${category.name} with Cash on Delivery across Pakistan.`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <section className="border-b-4 border-brand bg-ink-2 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 pt-7 pb-8">
          <nav aria-label="Breadcrumb" className="flex gap-2 text-sm text-soft">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="font-display text-5xl leading-none font-extrabold uppercase md:text-6xl">
            {category.isBike ? `${category.name} parts` : category.name}
          </h1>
          {category.description && <p className="text-[17px] text-soft">{category.description}</p>}
        </div>
      </section>
      <ProductListing
        baseWhere={{ categories: { some: { id: category.id } } }}
        searchParams={await searchParams}
        basePath={`/category/${category.slug}`}
      />
    </>
  );
}
