# baukurier.at

Bau-News für Österreich (TanStack Start, Vercel).

- Beiträge: `data/articles.json` (neuer Eintrag = neuer Beitrag, `status: "published"`, Bilder in `public/assets/`)
- Leads: Supabase-RPC `baukurier_add_lead` + E-Mail über Zapier-Webhook (`LEAD_WEBHOOK`)
- Env: `SUPABASE_ANON_KEY`, `LEAD_WEBHOOK`, `ADMIN_PASSWORD`
- Weiterleitungen und Header: `vercel.json`
