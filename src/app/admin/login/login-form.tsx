"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Password
        <input name="password" type="password" autoComplete="current-password" required autoFocus className="h-12 rounded border border-[#cfcdc8] px-3 text-base" />
      </label>
      {state.error && <p role="alert" className="font-semibold text-brand-dark">{state.error}</p>}
      <button type="submit" disabled={pending} className="h-12 rounded bg-brand font-bold text-white hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
