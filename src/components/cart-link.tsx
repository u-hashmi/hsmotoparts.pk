"use client";

import Link from "next/link";
import { useCart } from "./cart";
import { CartIcon } from "./icons";

export function CartLink() {
  const { count, ready } = useCart();
  const shown = ready ? count : 0;
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${shown} item${shown === 1 ? "" : "s"}`}
      className="relative flex size-12 items-center justify-center text-white"
    >
      <CartIcon />
      {shown > 0 && (
        <span className="absolute top-1 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold">
          {shown}
        </span>
      )}
    </Link>
  );
}
