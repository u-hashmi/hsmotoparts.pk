import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "15-day return policy" };

export default async function ReturnPolicyPage() {
  const s = await getSettings();
  const contact = [s.whatsapp && `WhatsApp ${s.whatsapp}`, s.email].filter(Boolean).join(" or ");
  return (
    <>
      <PageHero title="15-day return policy" sub="Wrong part, or a fault? Send it back within 15 days." />
      <div className="prose-shop mx-auto max-w-3xl px-4 pt-10 pb-16">
        <p>
          We want every part to fit and work. If something isn&apos;t right, you can return it within <strong>15 days of delivery</strong>.
        </p>
        <h2>What can be returned</h2>
        <ul>
          <li>Items that arrive damaged, faulty or different from what you ordered.</li>
          <li>Parts that don&apos;t fit your bike, as long as they are unused and not fitted.</li>
          <li>Items must be in their original packaging with all accessories.</li>
        </ul>
        <h2>What can&apos;t be returned</h2>
        <ul>
          <li>Parts that have been fitted, used, or damaged during installation.</li>
          <li>Electrical parts that failed because of incorrect wiring.</li>
          <li>Helmets that have been worn, for hygiene reasons (unless faulty).</li>
        </ul>
        <h2>How to return</h2>
        <ul>
          <li>Contact us{contact ? ` on ${contact}` : ""} with your order number and a photo of the item.</li>
          <li>We&apos;ll confirm the return and share the return address.</li>
          <li>Once we receive and check the item, we&apos;ll exchange it or refund you within 5 working days.</li>
        </ul>
        <h2>Refunds</h2>
        <p>
          Refunds are sent to your JazzCash, Easypaisa or bank account. If the mistake was ours (wrong or faulty item), we cover
          the return delivery. For change-of-mind returns, the return delivery cost is paid by the customer.
        </p>
      </div>
    </>
  );
}
