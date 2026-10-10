import { isAdmin } from "@/lib/auth";
import { readUpload } from "@/lib/uploads";

export async function GET(_req: Request, ctx: RouteContext<"/admin/proof/[name]">) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const { name } = await ctx.params;
  const file = await readUpload("proofs", name);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: { "Content-Type": file.contentType, "Cache-Control": "private, no-store" },
  });
}
