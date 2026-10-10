"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useCart } from "@/components/cart";
import { LockIcon, ReturnIcon } from "@/components/icons";
import { ImageBox } from "@/components/image-box";
import { deliveryFeeFor, PK_CITIES } from "@/lib/checkout";
import { formatPKR, PAYMENT_LABELS } from "@/lib/format";
import { placeOrder, type CheckoutState } from "./actions";

type Method = keyof typeof PAYMENT_LABELS;

type Props = {
  settings: {
    deliveryFee: number;
    freeDeliveryOver: number;
    methods: Record<Method, boolean>;
    jazzcash: { number: string; title: string };
    easypaisa: { number: string; title: string };
    bank: { name: string; title: string; iban: string };
  };
};

const DESCRIPTIONS: Record<Method, string> = {
  COD: "Pay the rider in cash when your parts arrive.",
  JAZZCASH: "Send to our JazzCash account and enter the transaction ID.",
  EASYPAISA: "Send to our Easypaisa account and enter the transaction ID.",
  BANK: "Transfer to our bank account and upload the screenshot.",
};

const input = "h-12 rounded border border-[#cfcdc8] bg-white px-3 text-base font-normal aria-[invalid=true]:border-brand";

export function CheckoutForm({ settings }: Props) {
  const { items, ready, subtotal, clear } = useCart();
  const router = useRouter();
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const methods = (Object.keys(settings.methods) as Method[]).filter((m) => settings.methods[m]);
  const [method, setMethod] = useState<Method>(methods[0] ?? "COD");
  const fee = deliveryFeeFor(subtotal, settings);
  const total = subtotal + fee;
  const err = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.orderId) {
      clear();
      router.replace(`/order/${state.orderId}`);
    }
  }, [state.orderId, clear, router]);

  if (!ready) return null;
  if (items.length === 0 && !state.orderId) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-extrabold uppercase">Your cart is empty</h1>
        <Link href="/" className="inline-flex h-12 items-center rounded bg-brand px-6 font-bold text-white">Continue shopping</Link>
      </div>
    );
  }

  const wallet = method === "JAZZCASH" ? settings.jazzcash : method === "EASYPAISA" ? settings.easypaisa : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("items", JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty }))));
        startTransition(() => formAction(fd));
      }}
      className="mx-auto flex max-w-6xl flex-wrap items-start gap-8 px-4 pt-8 pb-16"
      noValidate
    >
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-5xl font-extrabold uppercase">Checkout</h1>
          <span className="flex items-center gap-2 text-muted"><LockIcon /> Secure checkout</span>
        </div>

        <section className="flex flex-col gap-4 rounded-md border border-line bg-white p-6">
          <h2 className="text-xl font-bold">1. Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={err.customerName}>
              <input name="customerName" autoComplete="name" required aria-invalid={!!err.customerName} className={input} />
            </Field>
            <Field label="Mobile number" error={err.phone}>
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="03XX XXXXXXX" required aria-invalid={!!err.phone} className={input} />
            </Field>
            <Field label="City" error={err.city}>
              <input name="city" list="pk-cities" autoComplete="address-level2" required aria-invalid={!!err.city} className={input} />
              <datalist id="pk-cities">
                {PK_CITIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </Field>
            <Field label="Bike model (optional)">
              <input name="bikeModel" placeholder="e.g. CG 125, 2021" className={input} />
            </Field>
          </div>
          <Field label="Full address" error={err.address}>
            <textarea name="address" rows={2} autoComplete="street-address" required aria-invalid={!!err.address} className={`${input} h-auto py-2.5`} />
          </Field>
          <Field label="Order notes (optional)">
            <textarea name="notes" rows={2} className={`${input} h-auto py-2.5`} />
          </Field>
        </section>

        <fieldset className="flex flex-col gap-3.5 rounded-md border border-line bg-white p-6">
          <legend className="float-left mb-1 text-xl font-bold">2. Payment method</legend>
          {methods.map((m) => (
            <label
              key={m}
              className={`flex cursor-pointer items-start gap-3.5 rounded-md border-2 p-4 ${m === method ? "border-brand bg-[#fff6f6]" : "border-line"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m}
                checked={m === method}
                onChange={() => setMethod(m)}
                className="mt-0.5 size-5 accent-brand"
              />
              <span className="flex flex-col gap-1">
                <span className="text-[17px] font-bold">{PAYMENT_LABELS[m]}</span>
                <span className="text-sm leading-snug text-muted">{DESCRIPTIONS[m]}</span>
              </span>
            </label>
          ))}

          {wallet && (
            <div className="flex flex-col gap-3 rounded bg-paper p-4 leading-relaxed">
              <p>
                Send <strong>{formatPKR(total)}</strong> to our {PAYMENT_LABELS[method]} account{" "}
                <strong>{wallet.number || "—"}</strong>
                {wallet.title && <> (Title: <strong>{wallet.title}</strong>)</>}, then enter the transaction ID below. We&apos;ll confirm
                your order on WhatsApp.
              </p>
              <Field label="Transaction ID (TID)" error={err.paymentRef}>
                <input name="paymentRef" required aria-invalid={!!err.paymentRef} className={input} />
              </Field>
            </div>
          )}
          {method === "BANK" && (
            <div className="flex flex-col gap-3 rounded bg-paper p-4 leading-relaxed">
              <p>
                Transfer <strong>{formatPKR(total)}</strong> to:
                <br />
                Bank: <strong>{settings.bank.name || "—"}</strong> · Title: <strong>{settings.bank.title || "—"}</strong>
                <br />
                IBAN: <strong className="break-all">{settings.bank.iban || "—"}</strong>
                <br />
                Upload the payment screenshot — we dispatch once it&apos;s confirmed.
              </p>
              <Field label="Payment screenshot" error={err.paymentProof}>
                <input name="paymentProof" type="file" accept="image/jpeg,image/png,image/webp" required aria-invalid={!!err.paymentProof} />
              </Field>
              <Field label="Reference number (optional)">
                <input name="paymentRef" className={input} />
              </Field>
            </div>
          )}
        </fieldset>
      </div>

      <aside aria-label="Order summary" className="flex max-w-full flex-[1_1_320px] flex-col gap-4">
        <section className="flex flex-col gap-4 rounded-md border border-line bg-white p-6">
          <h2 className="text-xl font-bold">Order summary</h2>
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3">
              <ImageBox src={i.image} alt="" className="size-16 flex-none rounded" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{i.name}</div>
                <div className="text-sm text-muted">Qty {i.qty}</div>
              </div>
              <span className="font-bold whitespace-nowrap">{formatPKR(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="flex flex-col gap-2 border-t border-line pt-3.5">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{fee === 0 ? "Free" : formatPKR(fee)}</span></div>
            <div className="mt-1.5 flex justify-between font-display text-3xl font-extrabold"><span>Total</span><span>{formatPKR(total)}</span></div>
          </div>
          {state.error && (
            <p role="alert" className="rounded border border-brand bg-[#fff6f6] p-3 font-semibold text-brand-dark">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="h-14 rounded bg-brand text-lg font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? "Placing order…" : method === "COD" ? "Place order — pay on delivery" : "Place order"}
          </button>
        </section>
        <div className="flex items-start gap-3.5 rounded-md bg-ink p-5 text-white">
          <span className="flex-none text-brand-light"><ReturnIcon className="size-7" /></span>
          <span className="leading-normal">
            <strong>15-day return policy.</strong> Wrong part or a fault? Return it within 15 days of delivery.{" "}
            <Link href="/return-policy" className="underline">Read the policy</Link>
          </span>
        </div>
      </aside>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold">
      {label}
      {children}
      {error && <span className="font-semibold text-brand-dark">{error}</span>}
    </label>
  );
}
