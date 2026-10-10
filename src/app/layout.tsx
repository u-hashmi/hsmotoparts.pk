import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "800"],
});

// Every page reads live products, orders or settings from the database.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "HSmotoparts.pk — Motorcycle parts delivered across Pakistan",
    template: "%s | HSmotoparts.pk",
  },
  description:
    "Motorcycle parts for 70cc, CG 125, Suzuki 125 & 150 and electric scooties, plus helmets, LED lights and gadgets. Cash on Delivery all over Pakistan, 15-day returns.",
  openGraph: { siteName: "HSmotoparts.pk", type: "website", locale: "en_PK" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
