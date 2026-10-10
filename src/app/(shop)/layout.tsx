import { CartProvider } from "@/components/cart";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MetaPixel } from "@/components/meta-pixel";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getNavCategories, getSettings } from "@/lib/settings";

export default async function ShopLayout({ children }: LayoutProps<"/">) {
  const [settings, categories] = await Promise.all([getSettings(), getNavCategories()]);
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header categories={categories} settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer categories={categories} settings={settings} />
      </div>
      <WhatsAppFloat number={settings.whatsapp} />
      <MetaPixel pixelId={settings.metaPixelId} />
    </CartProvider>
  );
}
