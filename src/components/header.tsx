import Link from "next/link";
import type { Category, Settings } from "@/generated/prisma/client";
import { CartLink } from "./cart-link";
import { SearchIcon } from "./icons";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

export function Header({ categories, settings }: { categories: Category[]; settings: Settings }) {
  const nav = [
    { label: "Home", href: "/" },
    ...categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <div className="bg-brand text-sm font-semibold text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-1 px-4 py-2">
          <span>Cash on Delivery all over Pakistan</span>
          <span className="hidden sm:inline">15-day easy returns</span>
          {settings.whatsapp && <span className="hidden md:inline">WhatsApp orders: {settings.whatsapp}</span>}
        </div>
      </div>
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:gap-x-8 sm:py-5">
          <MobileMenu nav={nav} />
          <Logo />
          <form action="/search" role="search" className="order-last flex min-w-0 basis-full md:order-none md:flex-1 md:basis-80">
            <label htmlFor="site-search" className="sr-only">
              Search parts
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Search parts — e.g. CG 125 clutch plate"
              className="h-11 min-w-0 flex-1 rounded-l bg-white px-4 text-base text-ink md:h-12"
            />
            <button type="submit" aria-label="Search" className="flex h-11 w-14 items-center justify-center rounded-r bg-brand md:h-12">
              <SearchIcon />
            </button>
          </form>
          <div className="ml-auto flex items-center md:ml-0">
            <CartLink />
          </div>
        </div>
        <nav aria-label="Categories" className="hidden border-t border-[#262628] bg-ink-2 lg:block">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-x-1 px-4">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex min-h-12 items-center border-b-3 border-transparent px-3 text-[15px] font-semibold hover:border-brand"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
        <nav aria-label="Categories" className="flex gap-2 overflow-x-auto bg-ink-2 px-4 py-2.5 whitespace-nowrap lg:hidden">
          {nav.slice(1).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="inline-flex h-9 flex-none items-center rounded-full border border-[#3a3a3e] px-3.5 text-sm font-semibold"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
