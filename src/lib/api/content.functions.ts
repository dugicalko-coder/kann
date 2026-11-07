import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getArticleBySlug, listArticles } from "../db.server";
import { categoryBySlug } from "../site";

export const getHome = createServerFn({ method: "GET" }).handler(async () => {
  const latest = await listArticles({ limit: 13, kind: "news" });
  const [insolvenz, foerderung, ratgeber] = await Promise.all([
    listArticles({ category: "baufirma-insolvenz", limit: 4 }),
    listArticles({ category: "sanierung-foerderung", limit: 4 }),
    listArticles({ limit: 6, kind: "ratgeber" }),
  ]);
  return { latest, insolvenz, foerderung, ratgeber };
});

export const getSlugPage = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(160) }))
  .handler(async ({ data }) => {
    const category = categoryBySlug(data.slug);
    if (category) {
      return { type: "category" as const, slug: data.slug, articles: await listArticles({ category: data.slug, limit: 100 }) };
    }
    const article = await getArticleBySlug(data.slug);
    if (!article) return { type: "none" as const };
    const related = await listArticles({ category: article.category, limit: 4, excludeSlug: article.slug });
    return { type: "article" as const, article, related };
  });

export const getList = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().int().min(1).max(100).optional(), category: z.string().optional() }))
  .handler(async ({ data }) => listArticles({ limit: data.limit ?? 30, category: data.category }));
