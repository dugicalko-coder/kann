import data from "../../data/articles.json";

import type { Article, ArticleCard } from "./types";

// Beitraege liegen als JSON im Repo. Neue Beitraege = neue Eintraege in data/articles.json (Vercel baut automatisch neu).
const ALL = (data as Article[]).slice().sort((a, b) => (a.published_at < b.published_at ? 1 : -1));

function card(a: Article): ArticleCard {
  const { body: _b, sources: _s, faq: _f, ...rest } = a;
  return rest;
}

export async function listArticles(opts: { category?: string; limit?: number; excludeSlug?: string; kind?: string } = {}): Promise<ArticleCard[]> {
  const now = new Date().toISOString();
  return ALL.filter((a) => {
    if (a.status !== "published") return false;
    if (new Date(a.published_at).toISOString() > now) return false;
    if (opts.category && opts.category !== "bau" && a.category !== opts.category && !a.cats.includes(`,${opts.category},`)) return false;
    if (opts.kind && a.kind !== opts.kind) return false;
    if (opts.excludeSlug && a.slug === opts.excludeSlug) return false;
    return true;
  })
    .slice(0, opts.limit ?? 30)
    .map(card);
}

/** Auch archivierte Beitraege bleiben unter ihrer alten Adresse erreichbar (noindex). */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return ALL.find((a) => a.slug === slug && (a.status === "published" || a.status === "archived")) ?? null;
}
