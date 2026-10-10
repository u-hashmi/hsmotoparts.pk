import { ImageBox } from "@/components/image-box";
import { getSettings } from "@/lib/settings";
import { saveSettings } from "../../actions";
import { ActionForm } from "../../action-form";
import { Card, Checkbox, Field, inputClass, PageTitle } from "../../ui";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const s = await getSettings();
  const site = (process.env.SITE_URL || "").replace(/\/$/, "");
  return (
    <>
      <PageTitle>Settings</PageTitle>
      <ActionForm action={saveSettings} submitLabel="Save settings">
        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Shop contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="WhatsApp number" hint="Shown on the site; powers all WhatsApp buttons"><input name="whatsapp" defaultValue={s.whatsapp} placeholder="03XX XXXXXXX" className={inputClass} /></Field>
              <Field label="Phone"><input name="phone" defaultValue={s.phone} className={inputClass} /></Field>
              <Field label="Email"><input name="email" type="email" defaultValue={s.email} className={inputClass} /></Field>
              <Field label="Address / city"><input name="address" defaultValue={s.address} className={inputClass} /></Field>
            </div>
          </Card>
          <Card title="Facebook & Instagram">
            <Field label="Facebook page link"><input name="facebookUrl" defaultValue={s.facebookUrl} placeholder="https://www.facebook.com/yourpage" className={inputClass} /></Field>
            <Field label="Instagram link"><input name="instagramUrl" defaultValue={s.instagramUrl} placeholder="https://www.instagram.com/yourpage" className={inputClass} /></Field>
            <Field label="Meta Pixel ID (optional)" hint="From Meta Events Manager. Tracks visits and purchases for Facebook/Instagram ads.">
              <input name="metaPixelId" defaultValue={s.metaPixelId} inputMode="numeric" className={inputClass} />
            </Field>
            <p className="text-sm text-muted">
              Facebook Shop / Instagram Shopping catalog feed (add in Meta Commerce Manager → Data sources → Data feed → Scheduled feed):
              <br />
              <code className="break-all text-ink">{site}/feeds/meta-catalog.csv</code>
            </p>
          </Card>
          <Card title="Payment methods">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Checkbox name="codEnabled" label="Cash on Delivery" defaultChecked={s.codEnabled} />
              <Checkbox name="jazzcashEnabled" label="JazzCash" defaultChecked={s.jazzcashEnabled} />
              <Checkbox name="easypaisaEnabled" label="Easypaisa" defaultChecked={s.easypaisaEnabled} />
              <Checkbox name="bankEnabled" label="Bank Transfer" defaultChecked={s.bankEnabled} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="JazzCash number"><input name="jazzcashNumber" defaultValue={s.jazzcashNumber} className={inputClass} /></Field>
              <Field label="JazzCash account title"><input name="jazzcashTitle" defaultValue={s.jazzcashTitle} className={inputClass} /></Field>
              <Field label="Easypaisa number"><input name="easypaisaNumber" defaultValue={s.easypaisaNumber} className={inputClass} /></Field>
              <Field label="Easypaisa account title"><input name="easypaisaTitle" defaultValue={s.easypaisaTitle} className={inputClass} /></Field>
              <Field label="Bank name"><input name="bankName" defaultValue={s.bankName} className={inputClass} /></Field>
              <Field label="Bank account title"><input name="bankTitle" defaultValue={s.bankTitle} className={inputClass} /></Field>
            </div>
            <Field label="IBAN"><input name="bankIban" defaultValue={s.bankIban} placeholder="PK00XXXX0000000000000000" className={inputClass} /></Field>
          </Card>
          <Card title="Delivery">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Delivery fee (Rs.)"><input name="deliveryFee" type="number" min={0} defaultValue={s.deliveryFee} className={inputClass} /></Field>
              <Field label="Free delivery over (Rs.)" hint="0 = never free"><input name="freeDeliveryOver" type="number" min={0} defaultValue={s.freeDeliveryOver} className={inputClass} /></Field>
            </div>
          </Card>
          <Card title="Home page banner photo">
            <div className="flex flex-wrap items-end gap-6">
              {s.heroImage && <ImageBox src={s.heroImage} alt="" className="h-24 w-32 rounded" />}
              <Field label="Upload photo" hint="Landscape, roughly 4:3"><input name="heroImage" type="file" accept="image/jpeg,image/png,image/webp" /></Field>
              {s.heroImage && <Checkbox name="removeHero" label="Remove photo" />}
            </div>
          </Card>
        </div>
      </ActionForm>
    </>
  );
}
