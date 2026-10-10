import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons";
import { db } from "@/lib/db";
import { formatPKR, orderCode, PAYMENT_LABELS, PAYMENT_STATUS_LABELS, STATUS_LABELS, whatsappLink } from "@/lib/format";
import { getSettings } from "@/lib/settings";
import { PurchaseEvent } from "./purchase-event";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default async function OrderPage({ params }: PageProps<"/order/[id]">) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    db.order.findUnique({ where: { id }, include: { items: true } }),
    getSettings(),
  ]);
  if (!order) notFound();
  const code = orderCode(order.number);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-10 pb-16">
      <PurchaseEvent orderId={order.id} value={order.total} />
      <div className="flex flex-col gap-2 rounded-md bg-ink p-8 text-white">
        <span className="font-display text-lg font-bold tracking-[3px] text-brand-light">THANK YOU!</span>
        <h1 className="font-display text-4xl leading-none font-extrabold uppercase md:text-5xl">Order {code} received</h1>
        <p className="text-soft">
          We&apos;ll call or WhatsApp you on <strong className="text-white">{order.phone}</strong> to confirm before dispatch.
        </p>
      </div>

      <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-6">
        <h2 className="text-xl font-bold">Status</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-1">
          <span>Order: <strong>{STATUS_LABELS[order.status]}</strong></span>
          <span>Payment: <strong>{PAYMENT_LABELS[order.paymentMethod]}</strong> — {PAYMENT_STATUS_LABELS[order.paymentStatus]}</span>
        </div>
        {order.paymentMethod === "COD" && (
          <p className="text-muted">Please keep {formatPKR(order.total)} in cash ready for the rider.</p>
        )}
        {order.paymentStatus === "AWAITING_VERIFICATION" && (
          <p className="text-muted">We&apos;ll verify your payment and confirm your order shortly.</p>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-6">
        <h2 className="text-xl font-bold">Items</h2>
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between gap-4">
            <span>{i.name} × {i.quantity}</span>
            <span className="font-semibold whitespace-nowrap">{formatPKR(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="flex flex-col gap-1.5 border-t border-line pt-3">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPKR(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{order.deliveryFee === 0 ? "Free" : formatPKR(order.deliveryFee)}</span></div>
          <div className="flex justify-between font-display text-2xl font-extrabold"><span>Total</span><span>{formatPKR(order.total)}</span></div>
        </div>
      </section>

      <section className="flex flex-col gap-1 rounded-md border border-line bg-white p-6">
        <h2 className="mb-2 text-xl font-bold">Delivering to</h2>
        <span>{order.customerName}</span>
        <span>{order.address}</span>
        <span>{order.city}</span>
      </section>

      <div className="flex flex-wrap gap-3">
        {settings.whatsapp && (
          <a
            href={whatsappLink(settings.whatsapp, `Assalam o Alaikum, I placed order ${code}.`)}
            target="_blank"
            rel="noopener"
            className="inline-flex h-12 items-center gap-2.5 rounded bg-ink px-6 font-bold text-white hover:bg-black"
          >
            <WhatsAppIcon /> Message us about this order
          </a>
        )}
        <Link href="/" className="inline-flex h-12 items-center rounded border-2 border-ink px-6 font-bold">Continue shopping</Link>
      </div>
      <p className="text-sm text-muted">Bookmark this page to check your order status later.</p>
    </div>
  );
}
