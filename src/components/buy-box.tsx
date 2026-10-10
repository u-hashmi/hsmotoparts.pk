"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "./cart";

export function BuyBox({ product, inStock }: { product: Omit<CartItem, "qty">; inStock: boolean }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return <p className="rounded bg-placeholder px-4 py-3 font-semibold">Out of stock — message us on WhatsApp to reserve one.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="font-semibold">Quantity</span>
        <div className="flex items-center rounded border border-[#cfcdc8] bg-white">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="size-11 text-xl">−</button>
          <span aria-live="polite" className="w-10 text-center font-bold">{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))} className="size-11 text-xl">+</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            add(product, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="h-13 flex-1 rounded bg-ink px-6 text-[17px] font-bold text-white hover:bg-black"
        >
          {added ? "Added to cart ✓" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={() => {
            add(product, qty);
            router.push("/checkout");
          }}
          className="h-13 flex-1 rounded bg-brand px-6 text-[17px] font-bold text-white hover:bg-brand-dark"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
