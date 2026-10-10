import { readUpload, readVariant } from "@/lib/uploads";

// File names are random and never reused, so responses can be cached forever (by browsers and Cloudflare).
const CACHE = "public, max-age=31536000, immutable";

export async function GET(_req: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  if (name.endsWith(".webp") && name.includes("-")) {
    const data = await readVariant(name);
    if (!data) return new Response("Not found", { status: 404 });
    return new Response(new Uint8Array(data), { headers: { "Content-Type": "image/webp", "Cache-Control": CACHE } });
  }
  const file = await readUpload("images", name);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), { headers: { "Content-Type": file.contentType, "Cache-Control": CACHE } });
}
