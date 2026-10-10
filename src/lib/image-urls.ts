/** Widths of the WebP copies generated on demand for every uploaded image. */
export const VARIANT_WIDTHS = [320, 640, 960] as const;

const UPLOAD = /^\/uploads\/([a-f0-9]{24})\.(jpg|png|webp)$/;

/** For an uploaded image, the responsive WebP src/srcSet; null for anything else. */
export function responsive(src: string) {
  const m = UPLOAD.exec(src);
  if (!m) return null;
  return {
    src: `/uploads/${m[1]}-640.webp`,
    srcSet: VARIANT_WIDTHS.map((w) => `/uploads/${m[1]}-${w}.webp ${w}w`).join(", "),
  };
}
