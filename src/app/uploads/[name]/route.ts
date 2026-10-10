import { readUpload } from "@/lib/uploads";

export async function GET(_req: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  const file = await readUpload("images", name);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      // File names are random and never reused, so they can be cached forever.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
