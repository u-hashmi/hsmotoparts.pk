import type { Category, Product } from "@/generated/prisma/client";
import { ImageBox } from "@/components/image-box";
import { saveProduct } from "../../actions";
import { ActionForm } from "../../action-form";
import { Card, Checkbox, Field, inputClass, textareaClass } from "../../ui";

export function ProductForm({ product, categories }: { product?: Product & { categories: Category[] }; categories: Category[] }) {
  const selected = new Set(product?.categories.map((c) => c.id));
  return (
    <ActionForm action={saveProduct} submitLabel={product ? "Save product" : "Create product"}>
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <Field label="Name"><input name="name" required defaultValue={product?.name} className={inputClass} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Price (Rs.)"><input name="price" type="number" min={0} required defaultValue={product?.price} className={inputClass} /></Field>
              <Field label="Was price (Rs.)" hint="Optional, shows as crossed out">
                <input name="compareAtPrice" type="number" min={0} defaultValue={product?.compareAtPrice ?? ""} className={inputClass} />
              </Field>
              <Field label="Stock"><input name="stock" type="number" min={0} required defaultValue={product?.stock ?? 0} className={inputClass} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Part type" hint="e.g. Engine, Brakes, Electrical — used for filters">
                <input name="partType" defaultValue={product?.partType ?? ""} list="part-types" className={inputClass} />
                <datalist id="part-types">
                  {["Engine", "Clutch", "Brakes", "Electrical", "Body", "Suspension", "Chain & Sprocket", "Lights", "Accessories"].map((t) => <option key={t} value={t} />)}
                </datalist>
              </Field>
              <Field label="SKU (optional)"><input name="sku" defaultValue={product?.sku ?? ""} className={inputClass} /></Field>
            </div>
            <Field label="Description" hint="Blank line = new paragraph">
              <textarea name="description" rows={8} defaultValue={product?.description} className={textareaClass} />
            </Field>
            <Field label="URL slug" hint="Leave blank to generate from the name">
              <input name="slug" defaultValue={product?.slug} className={inputClass} />
            </Field>
          </Card>
          <Card title="Photos">
            {product && product.images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {product.images.map((src) => (
                  <label key={src} className="flex flex-col items-center gap-1.5 text-sm">
                    <ImageBox src={src} alt="" className="size-24 rounded border border-line" sizes="160px" />
                    <span className="flex items-center gap-1.5"><input type="checkbox" name="keepImages" value={src} defaultChecked className="accent-brand" /> Keep</span>
                  </label>
                ))}
              </div>
            )}
            <Field label="Add photos" hint="JPG, PNG or WEBP, up to 6 MB each. The first photo is the main one.">
              <input name="newImages" type="file" multiple accept="image/jpeg,image/png,image/webp" />
            </Field>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card title="Visibility">
            <Checkbox name="active" label="Show in store" defaultChecked={product?.active ?? true} />
            <Checkbox name="featured" label="Feature on home page (Best sellers)" defaultChecked={product?.featured} />
          </Card>
          <Card title="Categories / fits">
            {categories.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" name="categories" value={c.id} defaultChecked={selected.has(c.id)} className="size-[18px] accent-brand" />
                {c.name}
              </label>
            ))}
          </Card>
        </div>
      </div>
    </ActionForm>
  );
}
