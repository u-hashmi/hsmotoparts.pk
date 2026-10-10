import Link from "next/link";
import { db } from "@/lib/db";
import { formatPKR, orderCode, PAYMENT_LABELS, STATUS_LABELS } from "@/lib/format";
import { Badge, Card, PageTitle } from "../ui";

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 3600 * 1000);
}

export default async function Dashboard() {
  const since = daysAgo(30);
  const [pending, awaitingPayment, lowStock, recent, month] = await Promise.all([
    db.order.count({ where: { status: "PENDING" } }),
    db.order.count({ where: { paymentStatus: "AWAITING_VERIFICATION" } }),
    db.product.findMany({ where: { active: true, stock: { lte: 3 } }, orderBy: { stock: "asc" }, take: 10 }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    db.order.aggregate({
      where: { createdAt: { gte: since }, status: { notIn: ["CANCELLED", "RETURNED"] } },
      _sum: { total: true },
      _count: true,
    }),
  ]);

  const stats = [
    { label: "New orders to confirm", value: pending, href: "/admin/orders?status=PENDING" },
    { label: "Payments to verify", value: awaitingPayment, href: "/admin/orders?payment=AWAITING_VERIFICATION" },
    { label: "Orders (30 days)", value: month._count },
    { label: "Sales (30 days)", value: formatPKR(month._sum.total ?? 0) },
  ];

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const body = (
            <>
              <span className="text-sm font-semibold text-muted">{s.label}</span>
              <span className="font-display text-4xl font-extrabold">{s.value}</span>
            </>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="flex flex-col gap-1 rounded-md border border-line bg-white p-5 hover:border-ink">{body}</Link>
          ) : (
            <div key={s.label} className="flex flex-col gap-1 rounded-md border border-line bg-white p-5">{body}</div>
          );
        })}
      </div>
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card title="Latest orders">
          {recent.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-line">
                  {recent.map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 pr-3"><Link href={`/admin/orders/${o.id}`} className="font-bold underline">{orderCode(o.number)}</Link></td>
                      <td className="py-2.5 pr-3">{o.customerName}<div className="text-muted">{o.city}</div></td>
                      <td className="py-2.5 pr-3">{PAYMENT_LABELS[o.paymentMethod]}</td>
                      <td className="py-2.5 pr-3"><Badge value={o.status} label={STATUS_LABELS[o.status]} /></td>
                      <td className="py-2.5 text-right font-semibold whitespace-nowrap">{formatPKR(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <Card title="Low stock (3 or fewer)">
          {lowStock.length === 0 ? (
            <p className="text-muted">All good.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {lowStock.map((p) => (
                <li key={p.id} className="flex justify-between gap-3 py-2">
                  <Link href={`/admin/products/${p.id}`} className="underline">{p.name}</Link>
                  <span className={`font-bold ${p.stock === 0 ? "text-brand-dark" : ""}`}>{p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
