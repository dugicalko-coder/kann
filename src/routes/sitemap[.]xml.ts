import { createFileRoute } from "@tanstack/react-router";

import { listArticles } from "@/lib/db.server";
import { BUNDESLAENDER, CATEGORIES, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const articles = await listArticles({ limit: 5000 });
        const u = (path: string, lastmod?: string) => `<url><loc>${SITE_URL}${path}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""}</url>`;
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          u(""), u("/news"), u("/anfrage"), u("/kontakt"), u("/redaktion"), u("/impressum"),
          ...CATEGORIES.map((c) => u(`/${c.slug}`)),
          ...BUNDESLAENDER.map((b) => u(`/bundesland/${b.slug}`)),
          ...articles.map((a) => u(`/${a.slug}`, a.updated_at)),
          "</urlset>",
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
