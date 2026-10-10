import Link from "next/link";
import type { Category, Settings } from "@/generated/prisma/client";
import { FacebookIcon, InstagramIcon } from "./icons";

export function Footer({ categories, settings }: { categories: Category[]; settings: Settings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t-4 border-brand bg-ink text-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-14 pb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3.5">
          <span className="font-display text-[28px] font-extrabold text-white">
            HS MOTOPARTS<span className="text-brand-light">.pk</span>
          </span>
          <p className="leading-relaxed">Motorcycle parts, helmets and accessories delivered across Pakistan.</p>
          <SocialLinks settings={settings} />
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="font-bold text-white">Shop</h2>
          {categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="hover:text-white">
              {c.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="font-bold text-white">Help</h2>
          <Link href="/return-policy" className="hover:text-white">15-day return policy</Link>
          <Link href="/payment-methods" className="hover:text-white">Payment methods</Link>
          <Link href="/contact" className="hover:text-white">Contact us</Link>
          <Link href="/blog" className="hover:text-white">Blog</Link>
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="font-bold text-white">Contact</h2>
          {settings.whatsapp && <span>WhatsApp: {settings.whatsapp}</span>}
          {settings.phone && <span>Phone: {settings.phone}</span>}
          {settings.email && <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>}
          {settings.address && <span>{settings.address}</span>}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-[#262628] px-4 pt-5 pb-8 text-sm">
        <span>© {year} HSmotoparts.pk</span>
        <div className="flex flex-wrap gap-2">
          {["Cash on Delivery", "JazzCash", "Easypaisa", "Bank Transfer"].map((m) => (
            <span key={m} className="rounded border border-[#3a3a3e] px-3 py-1.5 text-white">{m}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function SocialLinks({ settings, variant = "icon" }: { settings: Settings; variant?: "icon" | "button" }) {
  const links = [
    settings.facebookUrl && { href: settings.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    settings.instagramUrl && { href: settings.instagramUrl, label: "Instagram", Icon: InstagramIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof FacebookIcon }[];
  if (!links.length) return null;

  if (variant === "button") {
    return (
      <div className="flex flex-wrap gap-3">
        {links.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener"
            className="inline-flex h-12 items-center gap-2.5 rounded bg-ink px-5 font-bold text-white hover:bg-brand"
          >
            <Icon /> {label}
          </a>
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener"
          aria-label={`HSmotoparts on ${label}`}
          className="flex size-11 items-center justify-center rounded border border-[#3a3a3e] text-white hover:border-brand"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
