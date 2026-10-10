import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const mark = size === "sm" ? "size-9 text-[19px]" : "size-10 text-[22px] sm:size-12 sm:text-[26px]";
  const word = size === "sm" ? "text-[23px]" : "text-[25px] sm:text-[30px]";
  return (
    <Link href="/" className="flex items-center gap-2.5 text-white sm:gap-3 no-underline" aria-label="HSmotoparts.pk home">
      <span className={`${mark} flex -skew-x-10 items-center justify-center bg-brand font-display font-extrabold`}>HS</span>
      <span className={`${word} font-display font-extrabold tracking-wide`}>
        MOTOPARTS<span className="text-brand-light">.pk</span>
      </span>
    </Link>
  );
}
