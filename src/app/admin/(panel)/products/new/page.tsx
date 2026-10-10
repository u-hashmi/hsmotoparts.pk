import Link from "next/link";
import { db } from "@/lib/db";
import { PageTitle } from "../../../ui";
import { ProductForm } from "../product-form";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageTitle action={<Link href="/admin/products" className="font-semibold underline">← All products</Link>}>New product</PageTitle>
      <ProductForm categories={categories} />
    </>
  );
}
