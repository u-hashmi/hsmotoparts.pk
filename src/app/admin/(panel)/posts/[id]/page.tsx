import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deletePost } from "../../../actions";
import { ActionForm } from "../../../action-form";
import { PageTitle } from "../../../ui";
import { PostForm } from "../post-form";

export const metadata = { title: "Edit article" };

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <>
      <PageTitle action={<Link href="/admin/posts" className="font-semibold underline">← All articles</Link>}>Edit article</PageTitle>
      <PostForm post={post} />
      <div className="mt-10 border-t border-line pt-6">
        <ActionForm action={deletePost} submitLabel="Delete article" confirm="Delete this article? This can't be undone.">
          <input type="hidden" name="id" value={post.id} />
        </ActionForm>
      </div>
    </>
  );
}
