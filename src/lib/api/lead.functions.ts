import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { rpc } from "../supabase.server";
import { LEAD_PROJECTS, LEAD_TIMELINES } from "../site";

const LeadInput = z.object({
  project: z.enum(LEAD_PROJECTS as [string, ...string[]]),
  bundesland: z.string().trim().min(2).max(40),
  timeline: z.enum(LEAD_TIMELINES as [string, ...string[]]),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40).regex(/^[+0-9 ()/-]+$/),
  email: z.union([z.literal(""), z.string().trim().email().max(160)]),
  message: z.string().trim().max(2000),
  page: z.string().max(200),
  website: z.string().max(200), // Honeypot: echte Besucher lassen das Feld leer.
  consent: z.literal(true),
});

// Zapier-Webhook: schickt jede Anfrage per E-Mail an Alko. Fehler duerfen den Lead nicht verhindern.
const LEAD_WEBHOOK = process.env.LEAD_WEBHOOK ?? "";

export const submitLead = createServerFn({ method: "POST" })
  .validator(LeadInput)
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    let saved = true;
    try {
      await rpc("baukurier_add_lead", {
        p_project: data.project, p_bundesland: data.bundesland, p_timeline: data.timeline, p_name: data.name,
        p_phone: data.phone, p_email: data.email || null, p_message: data.message || null, p_page: data.page,
      });
    } catch (error) {
      saved = false;
      console.error("Lead speichern fehlgeschlagen", error);
    }
    let mailed = false;
    try {
      if (!LEAD_WEBHOOK) throw new Error("LEAD_WEBHOOK fehlt");
      const r = await fetch(LEAD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: data.project, bundesland: data.bundesland, timeline: data.timeline, name: data.name, phone: data.phone, email: data.email, message: data.message, page: data.page }),
        signal: AbortSignal.timeout(5000),
      });
      mailed = r.ok;
    } catch (error) {
      console.error("Lead-E-Mail fehlgeschlagen", error);
    }
    return { ok: saved || mailed };
  });
