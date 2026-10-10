import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../login/actions";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false } };

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-wrap">
      <aside className="flex w-full flex-col gap-1 bg-ink p-4 text-white md:sticky md:top-0 md:h-screen md:w-56">
        <Link href="/admin" className="mb-4 flex items-center gap-2.5">
          <span className="flex size-9 -skew-x-10 items-center justify-center bg-brand font-display text-xl font-extrabold">HS</span>
          <span className="font-display text-xl font-extrabold">ADMIN</span>
        </Link>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded px-3 py-2.5 font-semibold hover:bg-ink-3">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-wrap gap-1 pt-4 md:flex-col">
          <Link href="/" target="_blank" className="rounded px-3 py-2.5 text-soft hover:bg-ink-3">View store ↗</Link>
          <form action={logout}>
            <button type="submit" className="w-full rounded px-3 py-2.5 text-left text-soft hover:bg-ink-3">Log out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 bg-paper p-4 sm:p-8">{children}</main>
    </div>
  );
}
