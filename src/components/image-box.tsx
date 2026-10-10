import { responsive } from "@/lib/image-urls";

/** Product/blog image with a neutral placeholder when none has been uploaded. */
export function ImageBox({
  src,
  alt,
  className = "",
  dark = false,
  sizes = "100vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  dark?: boolean;
  /** Rendered width hint for picking a responsive size, as in <img sizes>. */
  sizes?: string;
  /** Above-the-fold image: load immediately with high priority. */
  priority?: boolean;
}) {
  if (src) {
    const r = responsive(src);
    return (
      // eslint-disable-next-line @next/next/no-img-element -- images are served (and resized) by our own upload route
      <img
        src={r?.src ?? src}
        srcSet={r?.srcSet}
        sizes={r ? sizes : undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={`object-cover ${className}`}
      />
    );
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
