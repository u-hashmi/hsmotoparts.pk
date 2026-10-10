// DEV ONLY: fills the store with sample products and an article so pages can be tried out.
// Prices are made up. Never run this against the live database.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

if (process.env.NODE_ENV === "production") throw new Error("Refusing to load demo data in production");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const products: [string, string, number, string[], number, boolean?][] = [
  ["Clutch plate set", "Clutch", 1450, ["cg-125"], 12, true],
  ["Chain & sprocket kit", "Chain & Sprocket", 2350, ["70cc"], 8, true],
  ["Front brake shoes", "Brakes", 650, ["suzuki-150"], 20, true],
  ["LED headlight bulb H4", "Lights", 1800, ["led-lights", "70cc", "cg-125"], 15, true],
  ["CDI unit", "Electrical", 1200, ["cg-125"], 3],
  ["Piston & ring kit", "Engine", 3200, ["cg-125"], 5],
  ["Carburettor", "Engine", 2900, ["70cc"], 0],
  ["Rear shock absorber pair", "Suspension", 4800, ["suzuki-125"], 4],
  ["Full-face helmet — matte black", "Helmets", 5500, ["helmets"], 6, true],
  ["Mobile phone holder with charger", "Accessories", 1650, ["motorcycle-gadgets"], 25],
  ["48V scooty charger", "Electrical", 4200, ["electric-scooty-parts"], 7],
  ["CG 125 service package", "Engine", 3600, ["packages", "cg-125"], 10],
];

async function main() {
  for (const [name, partType, price, cats, stock, featured] of products) {
    const slug = name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await db.product.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        partType,
        price,
        stock,
        featured: !!featured,
        description: `Sample description for ${name}.\n\nReplace this with real details in the admin panel.`,
        categories: { connect: cats.map((s) => ({ slug: s })) },
      },
    });
  }
  await db.post.upsert({
    where: { slug: "how-often-change-engine-oil-cg-125" },
    update: {},
    create: {
      title: "How often should you change engine oil on a CG 125?",
      slug: "how-often-change-engine-oil-cg-125",
      tag: "Maintenance",
      excerpt: "Sample article — replace with your own.",
      body: "This is a sample article.\n\n## A heading\n\n- Bullet one\n- Bullet two",
      published: true,
      publishedAt: new Date(),
    },
  });
  await db.settings.update({
    where: { id: 1 },
    data: { whatsapp: "0300 0000000", facebookUrl: "https://www.facebook.com/", instagramUrl: "https://www.instagram.com/" },
  });
  console.log(`Loaded ${products.length} demo products.`);
}

main().finally(() => db.$disconnect());
