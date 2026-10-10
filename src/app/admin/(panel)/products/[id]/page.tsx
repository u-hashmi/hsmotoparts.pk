import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteProduct } from "../../../actions";
import { ActionForm } from "../../../action-form";
import { PageTitle } from "../../../ui";
import { ProductForm } from "../product-form";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id }, include: { categories: true } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();
  return (
    <>
      <PageTitle
        action={
          <span className="flex gap-4">
            <Link href={`/product/${product.slug}`} target="_blank" className="font-semibold underline">View in store ↗</Link>
            <Link href="/admin/products" className="font-semibold underline">← All products</Link>
          </span>
        }
      >
        {product.name}
      </PageTitle>
      <ProductForm product={product} categories={categories} />
      <div className="mt-10 border-t border-line pt-6">
        <ActionForm action={deleteProduct} submitLabel="Delete product" confirm={`Delete “${product.name}”? This can't be undone.`}>
          <input type="hidden" name="id" value={product.id} />
          <p className="text-sm text-muted">Tip: untick “Show in store” to hide a product without deleting it. Past orders keep their details either way.</p>
        </ActionForm>
      </div>
    </>
  );
}
