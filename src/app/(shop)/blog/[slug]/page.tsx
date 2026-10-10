import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageBox } from "@/components/image-box";
import { RichText } from "@/components/rich-text";
import { db } from "@/lib/db";

async function getPost(slug: string) {
  return db.post.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: { type: "article", title: post.title, images: post.coverUrl ? [post.coverUrl] : undefined },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-8 pb-16">
      <nav aria-label="Breadcrumb" className="flex gap-2 text-sm text-muted">
        <Link href="/blog" className="hover:text-ink">Blog</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{post.title}</span>
      </nav>
      {post.tag && <span className="text-sm font-bold tracking-wider text-brand-dark uppercase">{post.tag}</span>}
      <h1 className="font-display text-4xl leading-none font-extrabold uppercase md:text-5xl">{post.title}</h1>
      {post.publishedAt && (
        <time dateTime={post.publishedAt.toISOString()} className="text-muted">
          {post.publishedAt.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
        </time>
      )}
      {post.coverUrl && <ImageBox src={post.coverUrl} alt="" className="aspect-video w-full rounded-md" />}
      <RichText text={post.body} />
    </article>
  );
}
