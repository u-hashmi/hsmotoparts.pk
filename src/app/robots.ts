import type { MetadataRoute } from "next";

// Read SITE_URL at request time; the build has no idea where the site will live.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const site = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/checkout", "/cart", "/order/"] },
    sitemap: `${site}/sitemap.xml`,
  };
}
