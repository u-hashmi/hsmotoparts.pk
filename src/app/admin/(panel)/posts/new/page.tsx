import Link from "next/link";
import { PageTitle } from "../../../ui";
import { PostForm } from "../post-form";

export const metadata = { title: "New article" };

export default function NewPostPage() {
  return (
    <>
      <PageTitle action={<Link href="/admin/posts" className="font-semibold underline">← All articles</Link>}>New article</PageTitle>
      <PostForm />
    </>
  );
}
