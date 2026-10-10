import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { formatPKR, orderCode, PAYMENT_LABELS, PAYMENT_STATUS_LABELS, STATUS_LABELS } from "@/lib/format";
import { Badge, PageTitle } from "../../ui";

export const metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" && sp.status in STATUS_LABELS ? (sp.status as keyof typeof STATUS_LABELS) : undefined;
  const payment =
    typeof sp.payment === "string" && sp.payment in PAYMENT_STATUS_LABELS ? (sp.payment as keyof typeof PAYMENT_STATUS_LABELS) : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const num = Number(q.replace(/^HS-/i, ""));

  const where: Prisma.OrderWhereInput = {
    ...(status && { status }),
    ...(payment && { paymentStatus: payment }),
    ...(q && {
      OR: [
        ...(Number.isInteger(num) && num > 0 ? [{ number: num }] : []),
        { customerName: { contains: q, mode: "insensitive" as const } },
        { phone: { contains: q.replace(/\D/g, "") || q } },
      ],
    }),
  };
  const orders = await db.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });

  const tabs = [{ label: "All", value: undefined }, ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ label, value }))];

  return (
    <>
      <PageTitle>Orders</PageTitle>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.value ? `/admin/orders?status=${t.value}` : "/admin/orders"}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${status === t.value && !payment ? "bg-ink text-white" : "border border-line bg-white"}`}
          >
            {t.label}
          </Link>
        ))}
        <form className="ml-auto flex gap-2">
          <label className="sr-only" htmlFor="oq">Search orders</label>
          <input id="oq" name="q" defaultValue={q} placeholder="Order #, name or phone" className="h-10 rounded border border-[#cfcdc8] bg-white px-3" />
          <button className="h-10 rounded bg-ink px-4 font-semibold text-white">Search</button>
        </form>
      </div>
      <div className="overflow-x-auto rounded-md border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="p-3">Order</th><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Payment</th>
              <th className="p-3">Status</th><th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted">No orders found.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-paper">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-bold underline">{orderCode(o.number)}</Link></td>
                <td className="p-3 whitespace-nowrap">{o.createdAt.toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</td>
                <td className="p-3">{o.customerName}<div className="text-muted">{o.phone} · {o.city}</div></td>
                <td className="p-3">{PAYMENT_LABELS[o.paymentMethod]}<div><Badge value={o.paymentStatus} label={PAYMENT_STATUS_LABELS[o.paymentStatus]} /></div></td>
                <td className="p-3"><Badge value={o.status} label={STATUS_LABELS[o.status]} /></td>
                <td className="p-3 text-right font-semibold whitespace-nowrap">{formatPKR(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
