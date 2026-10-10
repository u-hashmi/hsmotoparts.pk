import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-display text-5xl font-extrabold uppercase">Page not found</h1>
      <p className="text-muted">That part or page doesn&apos;t exist. Try searching, or head back home.</p>
      <Link href="/" className="inline-flex h-12 items-center rounded bg-brand px-6 font-bold text-white">Back to home</Link>
    </div>
  );
}
