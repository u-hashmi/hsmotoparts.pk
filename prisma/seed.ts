// Creates the store's categories and the settings row. Safe to run more than once.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const categories = [
  { name: "70cc", slug: "70cc", isBike: true, description: "Parts for Honda CD 70 and other 70cc bikes." },
  { name: "CG 125", slug: "cg-125", isBike: true, description: "Engine, brakes, electrical and body parts that fit the CG 125." },
  { name: "Suzuki 150", slug: "suzuki-150", isBike: true, description: "Parts for Suzuki GS 150 and GR 150." },
  { name: "Suzuki 125", slug: "suzuki-125", isBike: true, description: "Parts for Suzuki GD 110 / GS 125 bikes." },
  { name: "Electric Scooty Parts", slug: "electric-scooty-parts", isBike: true, description: "Batteries, chargers, controllers and more for electric scooties." },
  { name: "Helmets", slug: "helmets", isBike: false, description: "Full-face, open-face and kids helmets." },
  { name: "LED Lights", slug: "led-lights", isBike: false, description: "Headlights, indicators and fog lights." },
  { name: "Packages", slug: "packages", isBike: false, description: "Bundles for a full service." },
  { name: "Motorcycle Gadgets", slug: "motorcycle-gadgets", isBike: false, description: "Phone mounts, chargers, covers and more." },
];

async function main() {
  for (const [i, c] of categories.entries()) {
    await db.category.upsert({ where: { slug: c.slug }, update: {}, create: { ...c, sortOrder: (i + 1) * 10 } });
  }
  await db.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  console.log(`Seeded ${categories.length} categories and settings.`);
}

main().finally(() => db.$disconnect());
