// Example catalogue and blog posts so the store doesn't look empty while real stock is being added.
// Prices are typical Pakistani retail prices (Oct 2026) — review them before selling.
// Safe to run more than once: existing products/posts with the same slug are left untouched.
// Run: npx tsx prisma/examples.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

type Example = {
  name: string;
  partType: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  categories: string[];
  featured?: boolean;
  description: string;
};

const products: Example[] = [
  // ---- 70cc ----
  {
    name: "Chain & Sprocket Kit — CD 70 (14T/41T)",
    partType: "Chain & Sprocket",
    price: 2450,
    compareAtPrice: 2700,
    stock: 15,
    categories: ["70cc"],
    featured: true,
    description:
      "Complete drive kit for Honda CD 70 and other 70cc bikes: 420 chain (104 links), 14-tooth front sprocket and 41-tooth rear sprocket.\n\nReplace the chain and both sprockets together — a new chain on worn sprockets stretches quickly.",
  },
  {
    name: "Clutch Plate Set — CD 70",
    partType: "Clutch",
    price: 1150,
    stock: 20,
    categories: ["70cc"],
    description: "Friction plate set for Honda CD 70. Fixes slipping clutch, poor pickup and high revs without speed.",
  },
  {
    name: "Carburettor — CD 70",
    partType: "Engine",
    price: 2900,
    stock: 6,
    categories: ["70cc"],
    description: "Replacement carburettor for CD 70 / 70cc engines. Restores smooth idling and fuel economy.\n\nFits standard air filter and throttle cable.",
  },
  // ---- CG 125 ----
  {
    name: "Clutch Plate Set — CG 125",
    partType: "Clutch",
    price: 1700,
    compareAtPrice: 1900,
    stock: 18,
    categories: ["cg-125"],
    featured: true,
    description:
      "Friction plate set for Honda CG 125. If your bike revs but doesn't pull, especially in top gear or on a slope, the clutch plates are usually worn.\n\nWe recommend changing the clutch spring set at the same time.",
  },
  {
    name: "Piston & Ring Kit — CG 125 (Standard)",
    partType: "Engine",
    price: 3400,
    stock: 8,
    categories: ["cg-125"],
    description: "Standard-size piston with ring set, pin and clips for CG 125. For blue smoke, oil burning or low compression.\n\nOversize kits available on request — message us on WhatsApp with your bore size.",
  },
  {
    name: "CDI Unit — CG 125",
    partType: "Electrical",
    price: 1250,
    stock: 10,
    categories: ["cg-125"],
    description: "Ignition CDI for CG 125. Fixes hard starting, misfiring and the engine cutting out at high revs.",
  },
  {
    name: "Rear Brake Shoe Pair — CG 125",
    partType: "Brakes",
    price: 650,
    stock: 30,
    categories: ["cg-125"],
    description: "Pair of rear drum brake shoes for CG 125.",
  },
  // ---- Suzuki 150 ----
  {
    name: "Brake Shoe Set — Suzuki GS 150",
    partType: "Brakes",
    price: 750,
    stock: 25,
    categories: ["suzuki-150"],
    featured: true,
    description: "Drum brake shoes for Suzuki GS 150 / GR 150. Good grip and long life for daily city riding.",
  },
  {
    name: "Clutch Plate Set — Suzuki GS 150",
    partType: "Clutch",
    price: 2300,
    stock: 9,
    categories: ["suzuki-150"],
    description: "Friction plate set for Suzuki GS 150.",
  },
  // ---- Suzuki 125 ----
  {
    name: "Air Filter — Suzuki GS 125 / GD 110",
    partType: "Engine",
    price: 550,
    stock: 22,
    categories: ["suzuki-125"],
    description: "Replacement air filter element. Change every 3,000–5,000 km, sooner on dusty roads.",
  },
  {
    name: "Rear Shock Absorber Pair — Suzuki GS 125",
    partType: "Suspension",
    price: 4800,
    stock: 5,
    categories: ["suzuki-125"],
    description: "Pair of rear shocks. Restores a firm, stable ride when the old shocks bounce or leak oil.",
  },
  // ---- Electric scooty ----
  {
    name: "48V Lithium Battery Charger — Electric Scooty",
    partType: "Electrical",
    price: 4200,
    stock: 7,
    categories: ["electric-scooty-parts"],
    description: "48V charger for lithium electric scooty batteries, with auto cut-off when full.\n\nCheck your battery voltage and connector type before ordering — send us a photo on WhatsApp if unsure.",
  },
  {
    name: "Brushless Motor Controller 48V — Electric Scooty",
    partType: "Electrical",
    price: 6500,
    stock: 4,
    categories: ["electric-scooty-parts"],
    description: "48V brushless controller for common electric scooty hub motors.",
  },
  // ---- Helmets ----
  {
    name: "Full-Face Helmet — Matte Black",
    partType: "Helmets",
    price: 6500,
    compareAtPrice: 7500,
    stock: 10,
    categories: ["helmets"],
    featured: true,
    description: "Full-face helmet with clear visor, padded removable lining and quick-release strap. Sizes M, L and XL.\n\nMention your size in the order notes.",
  },
  {
    name: "Open-Face Helmet with Visor",
    partType: "Helmets",
    price: 3500,
    stock: 14,
    categories: ["helmets"],
    description: "Lightweight open-face helmet with flip-down visor. Comfortable for city riding in the heat.",
  },
  // ---- LED lights ----
  {
    name: "H4 LED Headlight Bulb — 6000K White",
    partType: "Lights",
    price: 1500,
    stock: 40,
    categories: ["led-lights", "70cc", "cg-125", "suzuki-125", "suzuki-150"],
    featured: true,
    description: "Bright white H4 LED bulb that fits most bikes with an H4 headlight. Plug-and-play, uses less power than the stock halogen bulb.",
  },
  {
    name: "LED Fog Light Pair with Switch",
    partType: "Lights",
    price: 2200,
    stock: 12,
    categories: ["led-lights"],
    description: "Pair of compact LED fog lights with handlebar switch and wiring. White and yellow modes.",
  },
  // ---- Gadgets ----
  {
    name: "Waterproof Mobile Holder with USB Charger",
    partType: "Accessories",
    price: 1650,
    stock: 25,
    categories: ["motorcycle-gadgets"],
    featured: true,
    description: "Handlebar phone holder with rain cover and a built-in USB charger for phones up to 6.8 inches.",
  },
  {
    name: "Motorcycle Body Cover — Waterproof",
    partType: "Accessories",
    price: 1200,
    stock: 30,
    categories: ["motorcycle-gadgets"],
    description: "Full body cover that protects from sun, rain and dust. Fits 70cc to 150cc bikes.",
  },
  // ---- Packages ----
  {
    name: "CG 125 Service Package",
    partType: "Packages",
    price: 3200,
    compareAtPrice: 3600,
    stock: 10,
    categories: ["packages", "cg-125"],
    description:
      "Everything for a routine CG 125 service in one order:\n- Engine oil (1 litre)\n- Air filter\n- Spark plug\n- Rear brake shoe pair\n\nCheaper than buying the parts separately.",
  },
  {
    name: "CD 70 Service Package",
    partType: "Packages",
    price: 2600,
    compareAtPrice: 2900,
    stock: 10,
    categories: ["packages", "70cc"],
    description:
      "Routine service bundle for CD 70:\n- Engine oil (0.8 litre)\n- Air filter\n- Spark plug\n- Brake shoe pair",
  },
];

const posts = [
  {
    title: "How often should you change engine oil on a CG 125?",
    slug: "how-often-change-engine-oil-cg-125",
    tag: "Maintenance",
    excerpt: "Fresh oil is the cheapest way to make your engine last. Here's how often to change it and how to tell when it's due.",
    body: `Engine oil keeps the moving parts inside your engine from grinding against each other. Old oil gets thin and dirty, and the engine wears faster — so changing it on time is the cheapest maintenance you can do.

## How often?

Always check your owner's manual first. As a rule of thumb, most mechanics in Pakistan recommend changing mineral oil roughly every 1,000 km on a CG 125, and a little later for semi-synthetic oil. If you ride in heavy traffic, carry a passenger every day, or ride on dusty roads, change it sooner.

## Signs your oil is due

- The oil on the dipstick is black and gritty instead of brown.
- The level is below the lower mark.
- The engine sounds louder or more "tappety" than usual.
- Gear changes feel rough.

## Tips

- Check the level every week with the bike upright on level ground.
- Change the oil while the engine is warm — it drains faster and carries more dirt out.
- Clean the oil strainer every few changes.
- Use the grade your manual recommends (usually 20W-50 for older Pakistani bikes).

Not sure what to buy? Our service packages bundle oil, air filter, spark plug and brake shoes for your bike model.`,
  },
  {
    title: "Full-face vs open-face helmet: which should you buy?",
    slug: "full-face-vs-open-face-helmet",
    tag: "Buying guide",
    excerpt: "Both are better than no helmet. Here's how they compare on safety, comfort and price for riding in Pakistan.",
    body: `A helmet is the most important thing you can buy for your ride. The two most common types are full-face and open-face, and each has its place.

## Full-face helmets

A full-face helmet covers your whole head, including your chin and jaw. In a fall, the chin is one of the most common points of impact, so a full-face helmet gives the most protection.

- Best for highways, long rides and higher speeds.
- Keeps out dust, wind and rain.
- Heavier and warmer in summer.

## Open-face helmets

An open-face helmet covers the top, back and sides of your head but leaves your face open (usually with a flip-down visor).

- Lighter and cooler in hot weather.
- Easier to talk and see around you in city traffic.
- No protection for the chin and face.

## How to get the right size

Measure around your head just above the eyebrows. The helmet should feel snug all round, with no pressure points, and shouldn't move when you shake your head with the strap done up. If you're between sizes, send us your measurement on WhatsApp and we'll help you choose.

## Our advice

If you ride on highways or ride fast, choose full-face. For short city trips in summer, a good open-face helmet is far better than none. Whatever you choose, always fasten the strap.`,
  },
  {
    title: "5 signs your chain and sprockets need replacing",
    slug: "signs-chain-and-sprockets-need-replacing",
    tag: "Maintenance",
    excerpt: "A worn chain wastes power, makes noise and can snap. Here's how to check yours in two minutes.",
    body: `Your chain and sprockets carry all the power from the engine to the rear wheel. When they wear out, your bike feels slower, uses more fuel and can even throw the chain.

## 1. The chain keeps going slack

If you have to tighten the chain much more often than before, it has stretched and is near the end of its life.

## 2. You can pull the chain away from the rear sprocket

Hold the chain at the back of the rear sprocket and pull it backwards. If you can see a large gap or more than half a tooth, the chain is worn.

## 3. Hooked or sharp sprocket teeth

Healthy teeth are evenly rounded. Worn teeth look hooked or pointed like a shark fin.

## 4. Stiff or rusty links

Links that stay bent when the chain is slack cause jerky riding and wear the sprockets fast.

## 5. Clunking noise or jerky pickup

A worn drive set makes a clunking noise when you accelerate or change gear.

## Replace them together

Always replace the chain and both sprockets as a set. A new chain on old sprockets (or the other way round) wears out much faster. Clean and lubricate your chain every 500 km or after riding in rain to make the new kit last.`,
  },
];

async function main() {
  let created = 0;
  for (const p of products) {
    const slug = p.name
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (await db.product.findUnique({ where: { slug } })) continue;
    await db.product.create({
      data: {
        name: p.name,
        slug,
        partType: p.partType,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        stock: p.stock,
        featured: !!p.featured,
        description: p.description,
        categories: { connect: p.categories.map((s) => ({ slug: s })) },
      },
    });
    created++;
  }
  let postsCreated = 0;
  for (const [i, post] of posts.entries()) {
    if (await db.post.findUnique({ where: { slug: post.slug } })) continue;
    // Stagger dates so the newest post is listed first.
    await db.post.create({ data: { ...post, published: true, publishedAt: new Date(Date.now() - i * 86400000) } });
    postsCreated++;
  }
  console.log(`Added ${created} example products and ${postsCreated} blog posts.`);
}

main().finally(() => db.$disconnect());
