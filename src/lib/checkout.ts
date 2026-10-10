export const PK_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Hyderabad",
  "Gujranwala", "Sialkot", "Sargodha", "Bahawalpur", "Sukkur", "Abbottabad", "Mardan", "Sahiwal", "Okara",
  "Rahim Yar Khan", "Gujrat", "Sheikhupura", "Jhang", "Dera Ghazi Khan", "Larkana", "Mirpur (AJK)", "Muzaffarabad",
];

export function deliveryFeeFor(subtotal: number, settings: { deliveryFee: number; freeDeliveryOver: number }) {
  if (settings.freeDeliveryOver > 0 && subtotal >= settings.freeDeliveryOver) return 0;
  return settings.deliveryFee;
}
