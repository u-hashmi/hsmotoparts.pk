"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Reports the purchase to the Meta Pixel once per order (for Facebook/Instagram ads). */
export function PurchaseEvent({ orderId, value }: { orderId: string; value: number }) {
  useEffect(() => {
    const key = `hs-purchase-${orderId}`;
    const send = () => {
      if (!window.fbq) return;
      try {
        if (localStorage.getItem(key)) return;
        localStorage.setItem(key, "1");
      } catch {}
      window.fbq("track", "Purchase", { value, currency: "PKR" }, { eventID: orderId });
    };
    // The pixel script loads after hydration; give it a moment.
    const t = setTimeout(send, 1500);
    return () => clearTimeout(t);
  }, [orderId, value]);
  return null;
}
