"use server";

import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession } from "@/lib/auth";

// Simple in-memory throttle against password guessing (single server process).
const attempts = new Map<string, { count: number; until: number }>();

export async function login(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const key = "admin";
  const now = Date.now();
  const a = attempts.get(key);
  if (a && a.count >= 5 && a.until > now) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }
  if (!checkPassword(String(formData.get("password") || ""))) {
    const count = a && a.until > now ? a.count + 1 : 1;
    attempts.set(key, { count, until: now + 10 * 60 * 1000 });
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Wrong password." };
  }
  attempts.delete(key);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
