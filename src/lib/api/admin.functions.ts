import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

import { rpc } from "../supabase.server";
import type { Lead } from "../types";

const COOKIE = "bk_admin";

async function tokenFor(password: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${password}:baukurier-admin-v1`));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function isAdmin(): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const cookie = getCookie(COOKIE);
  return !!cookie && cookie === (await tokenFor(pw));
}

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => ({
  configured: !!process.env.ADMIN_PASSWORD,
  loggedIn: await isAdmin(),
}));

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    const pw = process.env.ADMIN_PASSWORD;
    if (!pw || data.password !== pw) return { ok: false };
    setCookie(COOKIE, await tokenFor(pw), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE, { path: "/" });
  return { ok: true };
});

export const adminLeads = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await isAdmin())) throw new Error("Nicht angemeldet");
  return (await rpc<Lead[]>("baukurier_list_leads", { p_secret: process.env.ADMIN_PASSWORD })) ?? [];
});

export const adminSetStatus = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int(), status: z.enum(["neu", "in Arbeit", "weitergeleitet", "erledigt"]) }))
  .handler(async ({ data }) => {
    if (!(await isAdmin())) throw new Error("Nicht angemeldet");
    await rpc("baukurier_set_status", { p_secret: process.env.ADMIN_PASSWORD, p_id: data.id, p_status: data.status });
    return { ok: true };
  });
