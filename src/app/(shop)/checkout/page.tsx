import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const s = await getSettings();
  return (
    <CheckoutForm
      settings={{
        deliveryFee: s.deliveryFee,
        freeDeliveryOver: s.freeDeliveryOver,
        methods: {
          COD: s.codEnabled,
          JAZZCASH: s.jazzcashEnabled,
          EASYPAISA: s.easypaisaEnabled,
          BANK: s.bankEnabled,
        },
        jazzcash: { number: s.jazzcashNumber, title: s.jazzcashTitle },
        easypaisa: { number: s.easypaisaNumber, title: s.easypaisaTitle },
        bank: { name: s.bankName, title: s.bankTitle, iban: s.bankIban },
      }}
    />
  );
}
