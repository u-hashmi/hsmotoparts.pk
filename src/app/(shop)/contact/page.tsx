import type { Metadata } from "next";
import { SocialLinks } from "@/components/footer";
import { WhatsAppIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { whatsappLink } from "@/lib/format";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Contact us" };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero title="Contact us" sub="Not sure a part fits? Send us your bike's photo and we'll check." />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-10 pb-16 text-lg">
        {s.whatsapp && (
          <a
            href={whatsappLink(s.whatsapp)}
            target="_blank"
            rel="noopener"
            className="inline-flex h-13 items-center gap-2.5 self-start rounded bg-brand px-6 font-bold text-white hover:bg-brand-dark"
          >
            <WhatsAppIcon /> WhatsApp {s.whatsapp}
          </a>
        )}
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
          {s.phone && (<><dt className="font-bold">Phone</dt><dd><a href={`tel:${s.phone}`} className="underline">{s.phone}</a></dd></>)}
          {s.email && (<><dt className="font-bold">Email</dt><dd><a href={`mailto:${s.email}`} className="underline">{s.email}</a></dd></>)}
          {s.address && (<><dt className="font-bold">Address</dt><dd>{s.address}</dd></>)}
        </dl>
        <SocialLinks settings={s} variant="button" />
      </div>
    </>
  );
}
