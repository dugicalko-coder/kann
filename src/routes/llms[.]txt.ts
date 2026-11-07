import { createFileRoute } from "@tanstack/react-router";

import { BUNDESLAENDER, CATEGORIES, SITE, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          `# ${SITE.name}`, "", `> ${SITE.description}`, "",
          `Betreiber: ${SITE.publisher}, ${SITE.address}. Telefon ${SITE.phone}. Gebiet: ganz Österreich.`, "",
          "## Rubriken", ...CATEGORIES.map((c) => `- [${c.label}](${SITE_URL}/${c.slug}): ${c.description}`), "",
          "## Bundesländer", ...BUNDESLAENDER.map((b) => `- [${b.name}](${SITE_URL}/bundesland/${b.slug})`), "",
          "## Weiteres", `- [Alle News](${SITE_URL}/news)`, `- [Projekt anfragen](${SITE_URL}/anfrage)`, `- [Redaktionsgrundsätze](${SITE_URL}/redaktion)`,
        ].join("\n");
        return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
      },
    },
  },
});
