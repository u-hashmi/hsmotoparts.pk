import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { CartView } from "./cart-view";

export const metadata: Metadata = { title: "Your cart" };

export default async function CartPage() {
  const settings = await getSettings();
  return <CartView deliveryFee={settings.deliveryFee} freeDeliveryOver={settings.freeDeliveryOver} />;
}
