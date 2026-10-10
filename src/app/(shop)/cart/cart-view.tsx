"use client";

import Link from "next/link";
import { useCart } from "@/components/cart";
import { ImageBox } from "@/components/image-box";
import { deliveryFeeFor } from "@/lib/checkout";
import { formatPKR } from "@/lib/format";

export function CartView({ deliveryFee, freeDeliveryOver }: { deliveryFee: number; freeDeliveryOver: number }) {
  const { items, ready, subtotal, setQty, remove } = useCart();
  const fee = deliveryFeeFor(subtotal, { deliveryFee, freeDeliveryOver });

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-16">
      <h1 className="mb-6 font-display text-5xl font-extrabold uppercase">Your cart</h1>
      {!ready ? null : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-md border border-line bg-white p-12 text-center">
          <p className="text-lg">Your cart is empty.</p>
          <Link href="/" className="inline-flex h-12 items-center rounded bg-brand px-6 font-bold text-white hover:bg-brand-dark">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-8">
          <ul className="flex min-w-0 flex-[999_1_480px] flex-col divide-y divide-line rounded-md border border-line bg-white">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-4">
                <Link href={`/product/${item.slug}`} className="flex-none">
                  <ImageBox src={item.image} alt="" className="size-20 rounded" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Link href={`/product/${item.slug}`} className="font-semibold hover:text-brand-dark">{item.name}</Link>
                  <span className="text-muted">{formatPKR(item.price)} each</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center rounded border border-[#cfcdc8]">
                      <button type="button" aria-label={`Decrease ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)} className="size-10 text-lg">−</button>
                      <span className="w-8 text-center font-bold">{item.qty}</span>
                      <button type="button" aria-label={`Increase ${item.name}`} onClick={() => setQty(item.id, item.qty + 1)} className="size-10 text-lg">+</button>
                    </div>
                    <button type="button" onClick={() => remove(item.id)} className="text-sm font-semibold text-brand-dark underline">
                      Remove
                    </button>
                  </div>
                </div>
                <span className="font-display text-xl font-bold whitespace-nowrap">{formatPKR(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <aside className="flex flex-[1_1_300px] flex-col gap-3 rounded-md border border-line bg-white p-6">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{fee === 0 ? "Free" : formatPKR(fee)}</span></div>
            {freeDeliveryOver > 0 && fee > 0 && (
              <p className="text-sm text-muted">Free delivery on orders over {formatPKR(freeDeliveryOver)}.</p>
            )}
            <div className="mt-1 flex justify-between font-display text-3xl font-extrabold">
              <span>Total</span><span>{formatPKR(subtotal + fee)}</span>
            </div>
            <Link href="/checkout" className="mt-2 inline-flex h-14 items-center justify-center rounded bg-brand text-lg font-bold text-white hover:bg-brand-dark">
              Checkout
            </Link>
            <p className="text-center text-sm text-muted">Cash on Delivery · JazzCash · Easypaisa · Bank Transfer</p>
          </aside>
        </div>
      )}
    </div>
  );
}
