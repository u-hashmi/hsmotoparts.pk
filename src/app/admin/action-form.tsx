"use client";

import { startTransition, useActionState } from "react";

export type FormState = { error?: string; ok?: string };
type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

/**
 * Form wrapper for admin server actions: shows the returned error/success message and,
 * unlike a bare `action=`, keeps what was typed when the server rejects it.
 */
export function ActionForm({
  action,
  children,
  className,
  submitLabel = "Save",
  confirm,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  confirm?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      className={className ?? "flex flex-col gap-5"}
      onSubmit={(e) => {
        e.preventDefault();
        if (confirm && !window.confirm(confirm)) return;
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      {children}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="h-11 rounded bg-brand px-6 font-bold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : submitLabel}
        </button>
        {state.error && <p role="alert" className="font-semibold text-brand-dark">{state.error}</p>}
        {state.ok && <p role="status" className="font-semibold text-[#1d7a3a]">{state.ok}</p>}
      </div>
    </form>
  );
}
