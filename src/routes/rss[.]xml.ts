import { createFileRoute } from "@tanstack/react-router";

import { listArticles } from "@/lib/db.server";
import { SITE, SITE_URL } from "@/lib/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const items = await listArticles({ limit: 30 });
        const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE.name}</title><link>${SITE_URL}</link><description>${esc(SITE.description)}</description><language>de-AT</language>${items
          .map((a) => `<item><title>${esc(a.title)}</title><link>${SITE_URL}/${a.slug}</link><guid>${SITE_URL}/${a.slug}</guid><pubDate>${new Date(a.published_at).toUTCString()}</pubDate><description>${esc(a.teaser)}</description></item>`)
          .join("")}</channel></rss>`;
        return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
      },
    },
  },
});
