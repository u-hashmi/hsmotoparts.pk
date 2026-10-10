export function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function orderCode(number: number) {
  return `HS-${number}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalises a Pakistani mobile number to 03XXXXXXXXX, or returns null. */
export function normalizePkMobile(input: string) {
  const digits = input.replace(/\D/g, "");
  if (/^03\d{9}$/.test(digits)) return digits;
  if (/^923\d{9}$/.test(digits)) return "0" + digits.slice(2);
  return null;
}

/** wa.me link for a number stored in any common Pakistani format. */
export function whatsappLink(number: string, text?: string) {
  let digits = number.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "92" + digits.slice(1);
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export const PAYMENT_LABELS = {
  COD: "Cash on Delivery",
  JAZZCASH: "JazzCash",
  EASYPAISA: "Easypaisa",
  BANK: "Bank Transfer",
} as const;

export const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
} as const;

export const PAYMENT_STATUS_LABELS = {
  UNPAID: "Unpaid",
  AWAITING_VERIFICATION: "Awaiting verification",
  PAID: "Paid",
  REFUNDED: "Refunded",
} as const;
