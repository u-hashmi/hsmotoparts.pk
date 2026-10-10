import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Gallery } from "@/components/gallery";
import { CashIcon, ReturnIcon, WhatsAppIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/db";
import { formatPKR, whatsappLink } from "@/lib/format";
import { cardSelect, toCard } from "@/lib/products";
import { getSettings } from "@/lib/settings";

async function getProduct(slug: string) {
  return db.product.findFirst({
    where: { slug, active: true },
    include: { categories: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  const description = product.description.slice(0, 160) || `${product.name} — ${formatPKR(product.price)}. Cash on Delivery across Pakistan.`;
  return {
    title: product.name,
    description,
    openGraph: { title: product.name, description, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!product) notFound();

  const related = await db.product.findMany({
    where: {
      active: true,
      id: { not: product.id },
      categories: { some: { id: { in: product.categories.map((c) => c.id) } } },
    },
    orderBy: { featured: "desc" },
    take: 4,
    select: cardSelect,
  });

  const primary = product.categories[0];
  const inStock = product.stock > 0;
  const siteUrl = process.env.SITE_URL || "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku || product.id,
    image: product.images.map((i) => siteUrl + i),
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteUrl}/product/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        {primary && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/category/${primary.slug}`} className="hover:text-ink">{primary.name}</Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <Gallery images={product.images} alt={product.name} />
        <div className="flex flex-col gap-5">
          {product.partType && <span className="text-sm font-bold tracking-wider text-brand-dark uppercase">{product.partType}</span>}
          <h1 className="font-display text-4xl leading-none font-extrabold uppercase md:text-5xl">{product.name}</h1>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">{formatPKR(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-muted line-through">{formatPKR(product.compareAtPrice)}</span>
            )}
          </div>
          <span className={`font-semibold ${inStock ? "text-[#1d7a3a]" : "text-brand-dark"}`}>
            {inStock ? (product.stock <= 5 ? `Only ${product.stock} left in stock` : "In stock") : "Out of stock"}
          </span>
          {product.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">Fits / category:</span>
              {product.categories.map((c) => (
                <Link key={c.id} href={`/category/${c.slug}`} className="rounded-full border border-line bg-white px-3 py-1 text-sm hover:border-ink">
                  {c.name}
                </Link>
              ))}
            </div>
          )}
          <BuyBox
            inStock={inStock}
            product={{ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0] }}
          />
          {settings.whatsapp && (
            <a
              href={whatsappLink(settings.whatsapp, `Assalam o Alaikum, I want to order: ${product.name} (${siteUrl}/product/${product.slug})`)}
              target="_blank"
              rel="noopener"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded border-2 border-ink font-bold hover:bg-ink hover:text-white"
            >
              <WhatsAppIcon /> Ask or order on WhatsApp
            </a>
          )}
          <ul className="grid gap-3 rounded-md border border-line bg-white p-4 sm:grid-cols-2">
            <li className="flex items-center gap-3"><span className="text-brand"><CashIcon className="size-7" /></span>Cash on Delivery available</li>
            <li className="flex items-center gap-3">
              <span className="text-brand"><ReturnIcon className="size-7" /></span>
              <Link href="/return-policy" className="underline">15-day returns</Link>
            </li>
          </ul>
          {product.description && (
            <div className="prose-shop">
              <h2>Details</h2>
              {product.description.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="whitespace-pre-line">{para}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-4xl font-extrabold uppercase">You may also need</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
