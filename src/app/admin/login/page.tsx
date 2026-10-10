import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-md bg-white p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-11 -skew-x-10 items-center justify-center bg-brand font-display text-2xl font-extrabold text-white">HS</span>
          <h1 className="font-display text-2xl font-extrabold uppercase">Admin login</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
