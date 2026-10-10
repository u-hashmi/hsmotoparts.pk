"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { deliveryFeeFor } from "@/lib/checkout";
import { normalizePkMobile } from "@/lib/format";
import { getSettings } from "@/lib/settings";
import { saveUpload, UploadError } from "@/lib/uploads";

export type CheckoutState = { error?: string; fieldErrors?: Record<string, string>; orderId?: string };

const schema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().transform((v, ctx) => {
    const n = normalizePkMobile(v);
    if (!n) ctx.addIssue({ code: "custom", message: "Enter a mobile number like 03XX XXXXXXX" });
    return n ?? "";
  }),
  city: z.string().trim().min(2, "Select your city").max(60),
  address: z.string().trim().min(8, "Enter your full address").max(400),
  bikeModel: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(500).optional(),
  paymentMethod: z.enum(["COD", "JAZZCASH", "EASYPAISA", "BANK"]),
  paymentRef: z.string().trim().max(60).optional(),
  items: z
    .array(z.object({ id: z.string().min(1).max(40), qty: z.number().int().min(1).max(20) }))
    .min(1, "Your cart is empty")
    .max(50),
});

class StockError extends Error {}

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("items") || "[]"));
  } catch {
    return { error: "Your cart could not be read. Please refresh and try again." };
  }

  const parsed = schema.safeParse({
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    address: formData.get("address"),
    bikeModel: formData.get("bikeModel") || undefined,
    notes: formData.get("notes") || undefined,
    paymentMethod: formData.get("paymentMethod"),
    paymentRef: formData.get("paymentRef") || undefined,
    items,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { error: fieldErrors.items ?? "Please check the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  const settings = await getSettings();
  const enabled = {
    COD: settings.codEnabled,
    JAZZCASH: settings.jazzcashEnabled,
    EASYPAISA: settings.easypaisaEnabled,
    BANK: settings.bankEnabled,
  };
  if (!enabled[data.paymentMethod]) return { error: "That payment method isn't available right now." };

  const isWallet = data.paymentMethod === "JAZZCASH" || data.paymentMethod === "EASYPAISA";
  if (isWallet && !data.paymentRef) {
    return { error: "Enter the transaction ID (TID) from your payment.", fieldErrors: { paymentRef: "Enter the transaction ID" } };
  }

  let paymentProof: string | undefined;
  const proof = formData.get("paymentProof");
  if (data.paymentMethod === "BANK") {
    if (!(proof instanceof File) || proof.size === 0) {
      return { error: "Upload a screenshot of your bank transfer.", fieldErrors: { paymentProof: "Upload the payment screenshot" } };
    }
    try {
      paymentProof = await saveUpload(proof, "proofs");
    } catch (e) {
      if (e instanceof UploadError) return { error: e.message, fieldErrors: { paymentProof: e.message } };
      throw e;
    }
  }

  // Merge duplicate lines, then price everything from the database — never trust client prices.
  const qtyById = new Map<string, number>();
  for (const i of data.items) qtyById.set(i.id, Math.min(20, (qtyById.get(i.id) ?? 0) + i.qty));

  try {
    const order = await db.$transaction(async (tx) => {
      const products = await tx.product.findMany({ where: { id: { in: [...qtyById.keys()] }, active: true } });
      if (products.length !== qtyById.size) throw new StockError("Some items in your cart are no longer available. Please review your cart.");

      for (const p of products) {
        const qty = qtyById.get(p.id)!;
        const updated = await tx.product.updateMany({ where: { id: p.id, stock: { gte: qty } }, data: { stock: { decrement: qty } } });
        if (updated.count === 0) {
          throw new StockError(p.stock > 0 ? `Only ${p.stock} of “${p.name}” left in stock.` : `“${p.name}” is out of stock.`);
        }
      }

      const subtotal = products.reduce((n, p) => n + p.price * qtyById.get(p.id)!, 0);
      const deliveryFee = deliveryFeeFor(subtotal, settings);

      return tx.order.create({
        data: {
          customerName: data.customerName,
          phone: data.phone,
          city: data.city,
          address: data.address,
          bikeModel: data.bikeModel,
          notes: data.notes,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === "COD" ? "UNPAID" : "AWAITING_VERIFICATION",
          paymentRef: data.paymentRef,
          paymentProof,
          subtotal,
          deliveryFee,
          total: subtotal + deliveryFee,
          items: {
            create: products.map((p) => ({ productId: p.id, name: p.name, price: p.price, quantity: qtyById.get(p.id)! })),
          },
        },
      });
    });
    return { orderId: order.id };
  } catch (e) {
    if (e instanceof StockError) return { error: e.message };
    throw e;
  }
}
