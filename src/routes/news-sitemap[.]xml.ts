import { createFileRoute } from "@tanstack/react-router";

import { listArticles } from "@/lib/db.server";
import { SITE, SITE_URL } from "@/lib/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Google-News-Sitemap: nur Beitraege der letzten 48 Stunden.
export const Route = createFileRoute("/news-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const since = Date.now() - 48 * 3600 * 1000;
        const items = (await listArticles({ limit: 100, kind: "news" })).filter((a) => new Date(a.published_at).getTime() >= since);
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
          ...items.map((a) => `<url><loc>${SITE_URL}/${a.slug}</loc><news:news><news:publication><news:name>${SITE.name}</news:name><news:language>de</news:language></news:publication><news:publication_date>${a.published_at}</news:publication_date><news:title>${esc(a.title)}</news:title></news:news></url>`),
          "</urlset>",
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
      },
    },
  },
});
