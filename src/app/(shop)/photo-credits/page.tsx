import type { Metadata } from "next";
import credits from "@/content/photo-credits.json";
import { ImageBox } from "@/components/image-box";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Photo credits" };

type Credit = { url: string; title: string; author: string; license: string; licenseUrl: string; source: string };

/** Lists the openly licensed photos the site currently uses, as their licenses require. */
export default async function PhotoCreditsPage() {
  const [products, categories, posts, settings] = await Promise.all([
    db.product.findMany({ where: { active: true }, select: { images: true } }),
    db.category.findMany({ select: { imageUrl: true } }),
    db.post.findMany({ where: { published: true }, select: { coverUrl: true } }),
    db.settings.findUnique({ where: { id: 1 }, select: { heroImage: true } }),
  ]);
  const inUse = new Set<string>([
    ...products.flatMap((p) => p.images),
    ...categories.map((c) => c.imageUrl ?? ""),
    ...posts.map((p) => p.coverUrl ?? ""),
    settings?.heroImage ?? "",
  ]);
  const shown = (credits as Credit[]).filter((c) => inUse.has(c.url));

  return (
    <>
      <PageHero title="Photo credits" sub="Some photos on this site are shared by their authors under free licenses. Thank you!" />
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-16">
        {shown.length === 0 ? (
          <p className="text-muted">All photos on this site are our own.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {shown.map((c) => (
              <li key={c.url} className="flex gap-4 rounded-md border border-line bg-white p-4">
                <ImageBox src={c.url} alt="" className="size-20 flex-none rounded" />
                <div className="flex min-w-0 flex-col gap-1 text-sm">
                  <a href={c.source} target="_blank" rel="noopener" className="font-semibold break-words underline">{c.title}</a>
                  <span className="text-muted">by {c.author}</span>
                  {c.licenseUrl ? (
                    <a href={c.licenseUrl} target="_blank" rel="noopener license" className="underline">{c.license}</a>
                  ) : (
                    <span>{c.license}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8 text-sm text-muted">Photos are from Wikimedia Commons and are shown unchanged apart from resizing.</p>
      </div>
    </>
  );
}
