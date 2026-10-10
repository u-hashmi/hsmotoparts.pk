export const inputClass = "h-11 w-full rounded border border-[#cfcdc8] bg-white px-3 text-base font-normal";
export const textareaClass = "w-full rounded border border-[#cfcdc8] bg-white px-3 py-2.5 text-base font-normal";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold">
      {label}
      {children}
      {hint && <span className="font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-[18px] accent-brand" />
      {label}
    </label>
  );
}

export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-md border border-line bg-white p-5 sm:p-6">
      {title && <h2 className="text-lg font-bold">{title}</h2>}
      {children}
    </section>
  );
}

export function PageTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-4xl font-extrabold uppercase">{children}</h1>
      {action}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-[#fff3cd] text-[#7a5a00]",
  CONFIRMED: "bg-[#dbeafe] text-[#1e40af]",
  SHIPPED: "bg-[#e0e7ff] text-[#3730a3]",
  DELIVERED: "bg-[#dcfce7] text-[#166534]",
  CANCELLED: "bg-[#f3f4f6] text-[#4b5563]",
  RETURNED: "bg-[#fde2e2] text-[#991b1b]",
  UNPAID: "bg-[#f3f4f6] text-[#4b5563]",
  AWAITING_VERIFICATION: "bg-[#fff3cd] text-[#7a5a00]",
  PAID: "bg-[#dcfce7] text-[#166534]",
  REFUNDED: "bg-[#fde2e2] text-[#991b1b]",
};

export function Badge({ value, label }: { value: string; label: string }) {
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold whitespace-nowrap ${STATUS_COLORS[value] ?? ""}`}>{label}</span>;
}
