import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { cardSelect, toCard } from "@/lib/products";
import { ProductCard } from "./product-card";

const PAGE_SIZE = 24;

const SORTS = {
  popular: { label: "Best selling", orderBy: [{ featured: "desc" }, { createdAt: "desc" }] },
  "price-asc": { label: "Price: low to high", orderBy: [{ price: "asc" }] },
  "price-desc": { label: "Price: high to low", orderBy: [{ price: "desc" }] },
  newest: { label: "Newest", orderBy: [{ createdAt: "desc" }] },
} satisfies Record<string, { label: string; orderBy: Prisma.ProductOrderByWithRelationInput[] }>;

type Params = { type?: string; sort?: string; page?: string; min?: string; max?: string; stock?: string; q?: string };

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

/** Filter sidebar + sortable, paginated product grid. Works without JavaScript (plain GET forms). */
export async function ProductListing({
  baseWhere,
  searchParams,
  basePath,
}: {
  baseWhere: Prisma.ProductWhereInput;
  searchParams: Record<string, string | string[] | undefined>;
  basePath: string;
}) {
  const p: Params = Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, one(v)]));
  const sortKey = (p.sort && p.sort in SORTS ? p.sort : "popular") as keyof typeof SORTS;
  const page = Math.max(1, Number(p.page) || 1);
  const min = Number(p.min) || undefined;
  const max = Number(p.max) || undefined;

  const where: Prisma.ProductWhereInput = {
    ...baseWhere,
    active: true,
    ...(p.type ? { partType: p.type } : {}),
    ...(min || max ? { price: { gte: min, lte: max } } : {}),
    ...(p.stock ? { stock: { gt: 0 } } : {}),
  };

  const [types, total, products] = await Promise.all([
    db.product.groupBy({ by: ["partType"], where: { ...baseWhere, active: true, partType: { not: null } }, _count: true }),
    db.product.count({ where }),
    db.product.findMany({
      where,
      orderBy: SORTS[sortKey].orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: cardSelect,
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const href = (changes: Partial<Params>) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...p, page: undefined, ...changes })) if (v) qs.set(k, String(v));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-start gap-8 px-4 pt-8 pb-16">
      <aside aria-label="Filters" className="order-last flex max-w-full flex-[1_1_240px] lg:order-none flex-col gap-6 rounded-md border border-line bg-white p-5">
        {types.length > 0 && (
          <div className="flex flex-col gap-1">
            <h2 className="mb-2 font-bold">Part type</h2>
            <FilterLink href={href({ type: undefined })} active={!p.type} label="All parts" />
            {types
              .sort((a, b) => a.partType!.localeCompare(b.partType!))
              .map((t) => (
                <FilterLink key={t.partType} href={href({ type: t.partType! })} active={p.type === t.partType} label={t.partType!} count={t._count} />
              ))}
          </div>
        )}
        <form action={basePath} className="flex flex-col gap-3">
          {p.q && <input type="hidden" name="q" value={p.q} />}
          {p.type && <input type="hidden" name="type" value={p.type} />}
          {p.sort && <input type="hidden" name="sort" value={p.sort} />}
          <h2 className="font-bold">Price (Rs.)</h2>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="pmin">Minimum price</label>
            <input id="pmin" name="min" type="number" min={0} inputMode="numeric" defaultValue={p.min} placeholder="Min" className="h-10 w-full min-w-0 rounded border border-[#cfcdc8] px-2.5" />
            <span aria-hidden="true">–</span>
            <label className="sr-only" htmlFor="pmax">Maximum price</label>
            <input id="pmax" name="max" type="number" min={0} inputMode="numeric" defaultValue={p.max} placeholder="Max" className="h-10 w-full min-w-0 rounded border border-[#cfcdc8] px-2.5" />
          </div>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" name="stock" value="1" defaultChecked={!!p.stock} className="size-[18px] accent-brand" />
            In stock only
          </label>
          <button type="submit" className="h-10 rounded bg-ink font-bold text-white hover:bg-brand">Apply</button>
        </form>
      </aside>

      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
        <form action={basePath} className="flex flex-wrap items-center justify-between gap-3">
          {(["q", "type", "min", "max", "stock"] as const).map((k) => p[k] && <input key={k} type="hidden" name={k} value={p[k]} />)}
          <span className="text-muted">
            {total} {total === 1 ? "part" : "parts"}
          </span>
          <label className="flex items-center gap-2.5">
            Sort by
            <select name="sort" defaultValue={sortKey} className="h-10 rounded border border-[#cfcdc8] bg-white px-2.5">
              {Object.entries(SORTS).map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
            </select>
            <button type="submit" className="h-10 rounded border border-ink px-3 font-semibold">Go</button>
          </label>
        </form>
        {types.length > 0 && (
          <nav aria-label="Part type" className="-mx-4 flex gap-2 overflow-x-auto px-4 whitespace-nowrap lg:hidden">
            {[{ partType: undefined as string | undefined, label: "All" }, ...types.map((t) => ({ partType: t.partType!, label: t.partType! }))].map((t) => (
              <Link
                key={t.label}
                href={href({ type: t.partType })}
                className={`inline-flex h-9 flex-none items-center rounded-full px-3.5 text-sm font-semibold ${p.type === t.partType ? "bg-ink text-white" : "border border-line bg-white"}`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        )}
        {products.length === 0 ? (
          <div className="rounded-md border border-line bg-white p-10 text-center text-muted">
            No parts found. Try another filter, or ask us on WhatsApp — we can usually source it.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={toCard(prod, true)} headingLevel={2} />
            ))}
          </div>
        )}
        {pages > 1 && (
          <nav aria-label="Pages" className="mt-3 flex flex-wrap justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={href({ page: n === 1 ? undefined : String(n) })}
                aria-current={n === page ? "page" : undefined}
                className={`flex size-11 items-center justify-center rounded font-bold ${n === page ? "bg-ink text-white" : "border border-line bg-white"}`}
              >
                {n}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

function FilterLink({ href, active, label, count }: { href: string; active: boolean; label: string; count?: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`flex min-h-9 items-center justify-between rounded px-2 ${active ? "bg-ink font-semibold text-white" : "hover:bg-paper"}`}
    >
      <span>{label}</span>
      {count !== undefined && <span className={`text-sm ${active ? "text-soft" : "text-muted"}`}>{count}</span>}
    </Link>
  );
}
