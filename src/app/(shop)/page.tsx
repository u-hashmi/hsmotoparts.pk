import Link from "next/link";
import { SocialLinks } from "@/components/footer";
import { ArrowIcon, BankIcon, CashIcon, PhoneIcon, ReturnIcon, WhatsAppIcon } from "@/components/icons";
import { ImageBox } from "@/components/image-box";
import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/db";
import { whatsappLink } from "@/lib/format";
import { cardSelect, toCard } from "@/lib/products";
import { getNavCategories, getSettings } from "@/lib/settings";

export default async function HomePage() {
  const [settings, categories, featured, posts] = await Promise.all([
    getSettings(),
    getNavCategories(),
    db.product.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 8,
      select: cardSelect,
    }),
    db.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);
  const bikes = categories.filter((c) => c.isBike);
  const accessories = categories.filter((c) => !c.isBike);
  const packages = categories.find((c) => c.slug === "packages");

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-12 px-4 pt-10 pb-12 md:pt-16 md:pb-20">
          <div className="flex flex-[1_1_460px] flex-col gap-5">
            <span className="font-display text-base font-bold tracking-[3px] text-brand-light md:text-lg">
              GENUINE &amp; REPLACEMENT PARTS
            </span>
            <h1 className="font-display text-5xl leading-[0.95] font-extrabold uppercase md:text-[76px]">
              Parts for every ride on Pakistan&apos;s roads.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-soft md:text-[19px]">
              70cc, CG 125, Suzuki 125 &amp; 150, electric scooties — plus helmets, LED lights and gadgets. Pay cash when it
              arrives at your door.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link href="#bikes" className="inline-flex h-13 items-center rounded bg-brand px-7 text-[17px] font-bold hover:bg-brand-dark">
                Shop by bike
              </Link>
              {settings.whatsapp && (
                <a
                  href={whatsappLink(settings.whatsapp, "Assalam o Alaikum, I want to order a part from HSmotoparts.pk")}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-13 items-center gap-2.5 rounded border-2 border-white px-6 text-[17px] font-bold hover:bg-white hover:text-ink"
                >
                  <WhatsAppIcon /> Order on WhatsApp
                </a>
              )}
            </div>
          </div>
          <div className="relative flex aspect-[4/3] flex-[1_1_420px] items-center justify-center overflow-hidden border border-ink-line bg-ink-3">
            <div className="absolute top-0 -right-10 bottom-0 w-[120px] -skew-x-12 bg-brand" />
            {settings.heroImage && <ImageBox src={settings.heroImage} alt="" className="relative h-full w-full" />}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-6 lg:grid-cols-4">
          {[
            { Icon: CashIcon, title: "Cash on Delivery", sub: "Pay when it arrives" },
            { Icon: PhoneIcon, title: "JazzCash & Easypaisa", sub: "Mobile wallet payments" },
            { Icon: BankIcon, title: "Bank Transfer", sub: "Direct to our account" },
            { Icon: ReturnIcon, title: "15-Day Returns", sub: "Wrong part? Send it back" },
          ].map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3.5">
              <span className="text-brand"><Icon /></span>
              <div>
                <div className="font-bold">{title}</div>
                <div className="text-sm text-muted">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {bikes.length > 0 && (
        <section id="bikes" className="mx-auto max-w-7xl scroll-mt-4 px-4 pt-14 pb-4">
          <SectionHeading title="Shop by bike" aside="Pick your model — see only parts that fit." />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {bikes.map((b) => (
              <Link key={b.id} href={`/category/${b.slug}`} className="group flex flex-col overflow-hidden rounded-md bg-ink text-white">
                <ImageBox src={b.imageUrl} alt="" dark className="aspect-[4/3] w-full" />
                <span className="flex items-center justify-between border-t-4 border-brand px-4 py-3.5">
                  <span className="font-display text-xl font-bold uppercase sm:text-2xl">{b.name}</span>
                  <ArrowIcon className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 pb-4">
          <SectionHeading title="Best sellers" link={{ href: "/search", label: "View all parts" }} />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}

      {accessories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 pb-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {accessories.map((t) => (
              <Link
                key={t.id}
                href={`/category/${t.slug}`}
                className="relative flex min-h-48 flex-col justify-end gap-1.5 overflow-hidden rounded-md bg-ink p-7 text-white"
              >
                <ImageBox src={t.imageUrl} alt="" dark className="absolute top-0 right-0 h-full w-[45%]" />
                <span className="relative font-display text-4xl leading-none font-extrabold uppercase">{t.name}</span>
                {t.description && <span className="relative max-w-[55%] text-soft">{t.description}</span>}
                <span className="relative mt-2 h-1 w-12 bg-brand" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {packages && (
        <section className="mx-auto max-w-7xl px-4 pt-12 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-md bg-brand p-8 text-white md:p-10">
            <div className="flex max-w-2xl flex-col gap-2">
              <span className="font-display text-4xl leading-none font-extrabold uppercase md:text-[44px]">Service packages</span>
              <span className="text-lg leading-normal">Everything for a full service in one order — bundled for your bike model.</span>
            </div>
            <Link href={`/category/${packages.slug}`} className="inline-flex h-13 items-center rounded bg-ink px-7 text-[17px] font-bold hover:bg-black">
              See packages
            </Link>
          </div>
        </section>
      )}

      {(settings.facebookUrl || settings.instagramUrl) && (
        <section className="mx-auto max-w-7xl px-4 pt-12 pb-4">
          <div className="flex flex-wrap items-end justify-between gap-4 rounded-md border border-line bg-white p-8">
            <div>
              <h2 className="font-display text-4xl font-extrabold uppercase md:text-[44px]">Follow the garage</h2>
              <p className="text-muted">New arrivals, offers and fitting videos on our pages.</p>
            </div>
            <SocialLinks settings={settings} variant="button" />
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 pb-16">
          <SectionHeading title="From the blog" link={{ href: "/blog", label: "All articles" }} />
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((g) => (
              <Link key={g.id} href={`/blog/${g.slug}`} className="flex flex-col overflow-hidden rounded-md border border-line bg-white">
                <ImageBox src={g.coverUrl} alt="" className="aspect-video w-full" />
                <span className="flex flex-col gap-2 p-5">
                  {g.tag && <span className="text-xs font-bold tracking-wider text-brand-dark uppercase">{g.tag}</span>}
                  <span className="text-xl leading-snug font-bold">{g.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <div className="pb-12" />
    </>
  );
}

function SectionHeading({ title, aside, link }: { title: string; aside?: string; link?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <h2 className="font-display text-4xl font-extrabold uppercase md:text-[44px]">{title}</h2>
      {aside && <span className="text-muted">{aside}</span>}
      {link && (
        <Link href={link.href} className="font-bold text-brand-dark hover:underline">
          {link.label}
        </Link>
      )}
    </div>
  );
}
