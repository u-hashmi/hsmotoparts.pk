# HSmotoparts.pk

Online store for motorcycle parts in Pakistan — Next.js 16, Prisma 7, PostgreSQL.

- **Storefront:** home, bike-model and accessory categories (70cc, CG 125, Suzuki 150/125, Electric Scooty Parts,
  Helmets, LED Lights, Packages, Motorcycle Gadgets), product pages, search, cart, blog, 15-day return policy.
- **Checkout:** Cash on Delivery, JazzCash / Easypaisa (customer enters the transaction ID), Bank Transfer
  (customer uploads a screenshot). Prices and stock are always checked on the server.
- **Admin panel** at `/admin` (single password): orders and payment verification, products with photos,
  categories, blog, shop settings (WhatsApp, payment accounts, delivery fee, social links).
- **Facebook & Instagram:** page links across the site, WhatsApp ordering, optional Meta Pixel (page views +
  purchases), and a product catalog feed at `/feeds/meta-catalog.csv` for Facebook Shop / Instagram Shopping.

## Local development

Needs Node 20.19+. No Docker needed — a local Postgres runs through PGlite.

```bash
npm install
cp .env.example .env        # then set the values below for local use
#   DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/postgres?sslmode=disable"
#   DB_POOL_MAX=1           # PGlite serves one connection at a time
#   SESSION_SECRET=<any 32+ chars>   ADMIN_PASSWORD=<anything>
#   UPLOAD_DIR=<a folder OUTSIDE this project>   SITE_URL=http://localhost:3000
npm run dev:db              # terminal 1: local Postgres on :5433 (data in ~/.cache/hsmotoparts)
npm run db:migrate && npm run db:seed
npm run db:demo             # optional: sample products (dev only)
npm run dev                 # terminal 2: http://localhost:3000
```

Keep the dev database and uploads outside the project folder, or the dev server reloads on every write.

## Deploying (home server)

```bash
cp .env.example .env        # real passwords; SESSION_SECRET from `openssl rand -hex 32`
docker compose up -d --build
```

`migrate` applies migrations and seeds the categories on every deploy, then the app starts on the `edge`
network (port 3000). For public access, put a Cloudflare Tunnel token in `.cloudflared.env`
(`TUNNEL_TOKEN=...`) and run `docker compose --profile tunnel up -d`.

## Schema changes

Edit `prisma/schema.prisma`, then create a migration against a real Postgres
(`npx prisma migrate dev --name <change>`; PGlite can't host the shadow database, so use
`npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script` to write the SQL
into a new `prisma/migrations/<timestamp>_<change>/migration.sql` locally).
