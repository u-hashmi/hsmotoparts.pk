import Link from "next/link";
import { formatPKR } from "@/lib/format";
import { AddToCartButton } from "./add-to-cart";
import { ImageBox } from "./image-box";

export type CardProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
  label?: string | null;
};

export function ProductCard({ product, headingLevel = 3 }: { product: CardProduct; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-line bg-white">
      <Link href={`/product/${product.slug}`} className="block" tabIndex={-1} aria-hidden="true">
        <ImageBox src={product.images[0]} alt="" className="aspect-square w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        {product.label && (
          <span className="text-[11px] font-bold tracking-wider text-brand-dark uppercase sm:text-xs">{product.label}</span>
        )}
        <H className="text-[15px] leading-snug font-semibold sm:text-[17px]">
          <Link href={`/product/${product.slug}`} className="hover:text-brand-dark">
            {product.name}
          </Link>
        </H>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-display text-[22px] font-bold sm:text-[26px]">{formatPKR(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-muted line-through">{formatPKR(product.compareAtPrice)}</span>
          )}
        </div>
        <AddToCartButton
          disabled={product.stock <= 0}
          product={{ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0] }}
        />
      </div>
    </article>
  );
}
