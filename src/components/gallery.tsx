"use client";

import { useState } from "react";
import { ImageBox } from "./image-box";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <ImageBox src={images[active]} alt={alt} className="aspect-square w-full rounded-md border border-line bg-white" />
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`size-18 overflow-hidden rounded border-2 ${i === active ? "border-brand" : "border-line"}`}
            >
              <ImageBox src={src} alt="" className="size-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
