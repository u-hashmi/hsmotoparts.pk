"use client";

import { useState } from "react";
import { useCart, type CartItem } from "./cart";

export function AddToCartButton({
  product,
  disabled,
  className = "",
  qty = 1,
}: {
  product: Omit<CartItem, "qty">;
  disabled?: boolean;
  className?: string;
  qty?: number;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        add(product, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={`h-11 rounded bg-ink font-bold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:bg-[#9a9a9e] ${className}`}
    >
      {disabled ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
