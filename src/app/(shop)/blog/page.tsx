import type { Metadata } from "next";
import Link from "next/link";
import { ImageBox } from "@/components/image-box";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blog",
  description: "Motorcycle maintenance tips, buying guides and news from HSmotoparts.pk.",
};

export default async function BlogPage() {
  const posts = await db.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
  return (
    <>
      <PageHero title="Blog" sub="Maintenance tips, buying guides and fitting how-tos." />
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-16">
        {posts.length === 0 ? (
          <p className="text-muted">No articles yet — check back soon.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((g) => (
              <Link key={g.id} href={`/blog/${g.slug}`} className="flex flex-col overflow-hidden rounded-md border border-line bg-white">
                <ImageBox src={g.coverUrl} alt="" className="aspect-video w-full" />
                <span className="flex flex-col gap-2 p-5">
                  {g.tag && <span className="text-xs font-bold tracking-wider text-brand-dark uppercase">{g.tag}</span>}
                  <span className="text-xl leading-snug font-bold">{g.title}</span>
                  {g.excerpt && <span className="text-muted">{g.excerpt}</span>}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
