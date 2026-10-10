"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

export function MobileMenu({ nav }: { nav: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the drawer after navigating
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="-ml-2 flex size-11 items-center justify-center"
      >
        <MenuIcon />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <nav className="relative flex w-80 max-w-[85%] flex-col overflow-y-auto bg-ink p-4">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="mb-2 flex size-11 items-center justify-center self-end"
            >
              <CloseIcon />
            </button>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="border-b border-[#262628] py-3.5 text-lg font-semibold">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
