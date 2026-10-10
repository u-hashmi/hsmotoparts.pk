import type { Category } from "@/generated/prisma/client";
import { ImageBox } from "@/components/image-box";
import { db } from "@/lib/db";
import { deleteCategory, saveCategory } from "../../actions";
import { ActionForm } from "../../action-form";
import { Card, Checkbox, Field, inputClass, PageTitle } from "../../ui";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  return (
    <>
      <PageTitle>Categories</PageTitle>
      <p className="mb-6 max-w-3xl text-muted">
        These are the store&apos;s menu pages. Tick “Bike model” for 70cc, CG 125 and so on — they appear under “Shop by bike” on the
        home page; the rest show as big tiles. Lower sort numbers come first.
      </p>
      <div className="flex flex-col gap-4">
        {categories.map((c) => (
          <details key={c.id} className="rounded-md border border-line bg-white">
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-4">
              <ImageBox src={c.imageUrl} alt="" className="size-10 rounded" sizes="80px" />
              <span className="font-bold">{c.name}</span>
              <span className="text-sm text-muted">/category/{c.slug} · {c._count.products} products{c.isBike ? " · Bike model" : ""}</span>
            </summary>
            <div className="flex flex-col gap-6 border-t border-line p-4">
              <CategoryForm category={c} />
              <ActionForm action={deleteCategory} submitLabel="Delete category" confirm={`Delete “${c.name}”? Products stay but are removed from it.`}>
                <input type="hidden" name="id" value={c.id} />
              </ActionForm>
            </div>
          </details>
        ))}
        <Card title="Add a category">
          <CategoryForm />
        </Card>
      </div>
    </>
  );
}

function CategoryForm({ category }: { category?: Category }) {
  return (
    <ActionForm action={saveCategory} submitLabel={category ? "Save" : "Add category"}>
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Name"><input name="name" required defaultValue={category?.name} className={inputClass} /></Field>
        <Field label="URL slug" hint="Blank = from name"><input name="slug" defaultValue={category?.slug} className={inputClass} /></Field>
        <Field label="Sort order"><input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 100} className={inputClass} /></Field>
      </div>
      <Field label="Short description"><input name="description" defaultValue={category?.description ?? ""} className={inputClass} /></Field>
      <div className="flex flex-wrap items-end gap-6">
        <Checkbox name="isBike" label="Bike model" defaultChecked={category?.isBike} />
        <Field label="Image"><input name="image" type="file" accept="image/jpeg,image/png,image/webp" /></Field>
        {category?.imageUrl && <Checkbox name="removeImage" label="Remove current image" />}
      </div>
    </ActionForm>
  );
}
