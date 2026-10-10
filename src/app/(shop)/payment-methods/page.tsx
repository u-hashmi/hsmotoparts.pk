import type { Metadata } from "next";
import { BankIcon, CashIcon, PhoneIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Payment methods" };

export default async function PaymentMethodsPage() {
  const s = await getSettings();
  const cards = [
    s.codEnabled && { Icon: CashIcon, title: "Cash on Delivery", body: "Pay the rider in cash when your parts arrive. Available all over Pakistan." },
    s.jazzcashEnabled && {
      Icon: PhoneIcon,
      title: "JazzCash",
      body: `Send the total to ${s.jazzcashNumber || "our JazzCash account"}${s.jazzcashTitle ? ` (${s.jazzcashTitle})` : ""} and enter the transaction ID at checkout.`,
    },
    s.easypaisaEnabled && {
      Icon: PhoneIcon,
      title: "Easypaisa",
      body: `Send the total to ${s.easypaisaNumber || "our Easypaisa account"}${s.easypaisaTitle ? ` (${s.easypaisaTitle})` : ""} and enter the transaction ID at checkout.`,
    },
    s.bankEnabled && {
      Icon: BankIcon,
      title: "Bank Transfer",
      body: [s.bankName && `Bank: ${s.bankName}`, s.bankTitle && `Title: ${s.bankTitle}`, s.bankIban && `IBAN: ${s.bankIban}`]
        .filter(Boolean)
        .join(" · ") || "Transfer to our bank account and upload the screenshot at checkout.",
    },
  ].filter(Boolean) as { Icon: typeof CashIcon; title: string; body: string }[];

  return (
    <>
      <PageHero title="Payment methods" sub="Pay the way that suits you." />
      <div className="mx-auto grid max-w-5xl gap-5 px-4 pt-10 pb-16 sm:grid-cols-2">
        {cards.map(({ Icon, title, body }) => (
          <div key={title} className="flex gap-4 rounded-md border border-line bg-white p-6">
            <span className="text-brand"><Icon /></span>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="leading-relaxed break-words text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
