import Link from "next/link";
import { db } from "@/lib/db";
import { PageTitle } from "../../ui";

export const metadata = { title: "Blog" };

export default async function PostsPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageTitle action={<Link href="/admin/posts/new" className="inline-flex h-11 items-center rounded bg-brand px-5 font-bold text-white hover:bg-brand-dark">+ New article</Link>}>
        Blog
      </PageTitle>
      <div className="overflow-x-auto rounded-md border border-line bg-white">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-line">
            {posts.length === 0 && <tr><td className="p-6 text-center text-muted">No articles yet.</td></tr>}
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-paper">
                <td className="p-3"><Link href={`/admin/posts/${p.id}`} className="font-semibold underline">{p.title}</Link></td>
                <td className="p-3">{p.tag}</td>
                <td className="p-3">{p.published ? `Published ${p.publishedAt?.toLocaleDateString("en-PK") ?? ""}` : <span className="text-muted">Draft</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
