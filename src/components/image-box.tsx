/** Product/blog image with a neutral placeholder when none has been uploaded. */
export function ImageBox({
  src,
  alt,
  className = "",
  dark = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  dark?: boolean;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- images are served from our own upload route
    return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center ${dark ? "bg-ink-3 text-[#8e8e93]" : "bg-placeholder text-[#6b6b70]"} ${className}`}
    >
      <span className="font-display text-2xl font-extrabold opacity-40">HS</span>
    </div>
  );
}
