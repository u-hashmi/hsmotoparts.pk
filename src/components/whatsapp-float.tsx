import { whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFloat({ number }: { number: string }) {
  if (!number) return null;
  return (
    <a
      href={whatsappLink(number, "Assalam o Alaikum, I want to order a part from HSmotoparts.pk")}
      target="_blank"
      rel="noopener"
      aria-label="Order on WhatsApp"
      className="fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full border-3 border-brand bg-ink text-white shadow-lg hover:bg-brand"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
