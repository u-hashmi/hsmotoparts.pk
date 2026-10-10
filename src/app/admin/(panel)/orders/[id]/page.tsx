import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPKR, orderCode, PAYMENT_LABELS, PAYMENT_STATUS_LABELS, STATUS_LABELS, whatsappLink } from "@/lib/format";
import { updateOrder } from "../../../actions";
import { ActionForm } from "../../../action-form";
import { Card, Field, inputClass, PageTitle } from "../../../ui";

export default async function OrderDetail({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, include: { items: { include: { product: { select: { slug: true } } } } } });
  if (!order) notFound();
  const code = orderCode(order.number);
  const site = process.env.SITE_URL || "";

  return (
    <>
      <PageTitle action={<Link href="/admin/orders" className="font-semibold underline">← All orders</Link>}>Order {code}</PageTitle>
      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-6">
          <Card title="Items">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {order.items.map((i) => (
                  <tr key={i.id}>
                    <td className="py-2">
                      {i.product ? <Link href={`/product/${i.product.slug}`} target="_blank" className="underline">{i.name}</Link> : i.name}
                    </td>
                    <td className="py-2 text-right whitespace-nowrap">{formatPKR(i.price)} × {i.quantity}</td>
                    <td className="py-2 text-right font-semibold whitespace-nowrap">{formatPKR(i.price * i.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col gap-1 border-t border-line pt-3 text-right">
              <span>Subtotal {formatPKR(order.subtotal)}</span>
              <span>Delivery {formatPKR(order.deliveryFee)}</span>
              <span className="text-xl font-bold">Total {formatPKR(order.total)}</span>
            </div>
          </Card>
          <Card title="Customer">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
              <dt className="font-semibold">Name</dt><dd>{order.customerName}</dd>
              <dt className="font-semibold">Phone</dt><dd><a href={`tel:${order.phone}`} className="underline">{order.phone}</a></dd>
              <dt className="font-semibold">City</dt><dd>{order.city}</dd>
              <dt className="font-semibold">Address</dt><dd className="whitespace-pre-line">{order.address}</dd>
              {order.bikeModel && (<><dt className="font-semibold">Bike</dt><dd>{order.bikeModel}</dd></>)}
              {order.notes && (<><dt className="font-semibold">Notes</dt><dd className="whitespace-pre-line">{order.notes}</dd></>)}
              <dt className="font-semibold">Placed</dt><dd>{order.createdAt.toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</dd>
            </dl>
            <a
              href={whatsappLink(order.phone, `Assalam o Alaikum ${order.customerName}, this is HSmotoparts.pk about your order ${code} (${formatPKR(order.total)}). ${site}/order/${order.id}`)}
              target="_blank"
              rel="noopener"
              className="inline-flex h-11 items-center self-start rounded bg-ink px-5 font-bold text-white hover:bg-black"
            >
              WhatsApp customer
            </a>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card title="Payment">
            <p><strong>{PAYMENT_LABELS[order.paymentMethod]}</strong></p>
            {order.paymentRef && <p>Transaction / reference: <strong className="break-all">{order.paymentRef}</strong></p>}
            {order.paymentProof && (
              <a href={`/admin/proof/${order.paymentProof}`} target="_blank" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-only protected image */}
                <img src={`/admin/proof/${order.paymentProof}`} alt="Bank transfer screenshot" className="max-h-96 rounded border border-line" />
              </a>
            )}
          </Card>
          <Card title="Update order">
            <ActionForm action={updateOrder}>
              <input type="hidden" name="id" value={order.id} />
              <Field label="Order status">
                <select name="status" defaultValue={order.status} className={inputClass}>
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
              <Field label="Payment status">
                <select name="paymentStatus" defaultValue={order.paymentStatus} className={inputClass}>
                  {Object.entries(PAYMENT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
              <p className="text-sm text-muted">Cancelling or marking returned puts the items back in stock.</p>
            </ActionForm>
          </Card>
        </div>
      </div>
    </>
  );
}
