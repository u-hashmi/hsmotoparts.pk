import type { Post } from "@/generated/prisma/client";
import { ImageBox } from "@/components/image-box";
import { savePost } from "../../actions";
import { ActionForm } from "../../action-form";
import { Card, Checkbox, Field, inputClass, textareaClass } from "../../ui";

export function PostForm({ post }: { post?: Post }) {
  return (
    <ActionForm action={savePost} submitLabel={post ? "Save article" : "Create article"}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <Card>
        <Field label="Title"><input name="title" required defaultValue={post?.title} className={inputClass} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tag" hint="e.g. Maintenance, Buying guide"><input name="tag" defaultValue={post?.tag ?? ""} className={inputClass} /></Field>
          <Field label="URL slug" hint="Blank = from title"><input name="slug" defaultValue={post?.slug} className={inputClass} /></Field>
        </div>
        <Field label="Summary" hint="One or two sentences shown on the blog list and in search results">
          <textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className={textareaClass} />
        </Field>
        <Field label="Article" hint="Blank line = new paragraph · start a line with “## ” for a heading · “- ” for bullet points">
          <textarea name="body" rows={18} defaultValue={post?.body} className={textareaClass} />
        </Field>
        <div className="flex flex-wrap items-end gap-6">
          {post?.coverUrl && <ImageBox src={post.coverUrl} alt="" className="h-20 w-32 rounded" />}
          <Field label="Cover image"><input name="cover" type="file" accept="image/jpeg,image/png,image/webp" /></Field>
          {post?.coverUrl && <Checkbox name="removeCover" label="Remove cover" />}
        </div>
        <Checkbox name="published" label="Published (visible on the site)" defaultChecked={post?.published} />
      </Card>
    </ActionForm>
  );
}
