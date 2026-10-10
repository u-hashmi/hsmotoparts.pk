type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  viewBox: "0 0 24 24",
};

export const SearchIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
);
export const CartIcon = ({ className = "size-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M3 4h2l2.4 11h11.2L21 7H6.2" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /></svg>
);
export const MenuIcon = ({ className = "size-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = ({ className = "size-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const ArrowIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const WhatsAppIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.6z" /><path d="M9 9.5c.3 2.5 2.5 4.7 5 5l1.2-1.3 2 1-.5 1.6c-3.8.4-8.4-4.2-8-8l1.6-.5 1 2z" /></svg>
);
export const FacebookIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5h2.7l.5-3.5h-3.2V7.2c0-.6.4-1 1-1H15z" /></svg>
);
export const InstagramIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg>
);
export const CashIcon = ({ className = "size-8" }: IconProps) => (
  <svg {...base} strokeWidth={1.8} className={className}><rect x="2.5" y="6" width="19" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v6M18 9v6" /></svg>
);
export const PhoneIcon = ({ className = "size-8" }: IconProps) => (
  <svg {...base} strokeWidth={1.8} className={className}><rect x="6" y="2.5" width="12" height="19" rx="2" /><path d="M10.5 18.5h3" /></svg>
);
export const BankIcon = ({ className = "size-8" }: IconProps) => (
  <svg {...base} strokeWidth={1.8} className={className}><path d="M3 10l9-6 9 6" /><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18" /></svg>
);
export const ReturnIcon = ({ className = "size-8" }: IconProps) => (
  <svg {...base} strokeWidth={1.8} className={className}><path d="M4 12a8 8 0 1 0 2.3-5.6" /><path d="M4 4v4h4" /></svg>
);
export const UserIcon = ({ className = "size-6" }: IconProps) => (
  <svg {...base} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
);
export const LockIcon = ({ className = "size-5" }: IconProps) => (
  <svg {...base} className={className}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
