import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-ink px-4 py-4">
        <div className="mx-auto max-w-7xl"><Logo /></div>
      </header>
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="font-display text-5xl font-extrabold uppercase">Page not found</h1>
        <p className="text-muted">That part or page doesn&apos;t exist.</p>
        <Link href="/" className="inline-flex h-12 items-center rounded bg-brand px-6 font-bold text-white">Back to home</Link>
      </main>
    </div>
  );
}
