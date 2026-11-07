import { createFileRoute, notFound } from "@tanstack/react-router";

import { AiImg, ArticleBody, Card, Faq, JsonLd, Kicker, LeadForm, PageHead, Row, faqSchema } from "@/components/site/site";
import { getSlugPage } from "@/lib/api/content.functions";
import { CATEGORIES, SITE, SITE_URL, abs, categoryBySlug, fmtDate, pageHead } from "@/lib/site";
import type { Article, ArticleCard } from "@/lib/types";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const data = await getSlugPage({ data: { slug: params.slug } });
    if (data.type === "none") throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const path = `/${params.slug}`;
    if (loaderData.type === "category") {
      const c = categoryBySlug(params.slug)!;
      return pageHead({ title: c.title, description: c.description, path });
    }
    if (loaderData.type === "article") {
      const a = loaderData.article;
      const h = pageHead({ title: a.title, description: a.teaser, path, image: a.image ?? undefined, type: "article", noindex: a.status === "archived" });
      return { ...h, meta: [...h.meta, { property: "article:published_time", content: a.published_at }, { property: "article:modified_time", content: a.updated_at }] };
    }
    return {};
  },
  component: SlugPage,
});

function SlugPage() {
  const d = Route.useLoaderData();
  if (d.type === "category") return <CategoryPage slug={d.slug} articles={d.articles} />;
  if (d.type === "article") return <ArticlePage a={d.article} related={d.related} />;
  return null;
}

function CategoryPage({ slug, articles }: { slug: string; articles: ArticleCard[] }) {
  const c = categoryBySlug(slug)!;
  const siblings = CATEGORIES.filter((x) => x.group === c.group && x.slug !== c.slug);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: c.label, item: `${SITE_URL}/${c.slug}` },
      ] }} />
      <JsonLd data={faqSchema(c.faq)} />
      <PageHead title={c.title} intro={c.intro} crumb={[{ label: c.label, href: `/${c.slug}` }]}>
        <div className="bk-chips" style={{ marginTop: 14 }}>
          {siblings.map((s) => <a key={s.slug} className="bk-chip" href={`/${s.slug}`}>{s.label}</a>)}
        </div>
      </PageHead>
      <div className="bk-wrap">
        <section className="bk-sec" style={{ borderTop: 0 }}>
          {articles.length ? (
            <div className="bk-grid">{articles.map((a) => <Card key={a.slug} a={a} />)}</div>
          ) : (
            <p>In dieser Rubrik erscheinen demnächst Beiträge. Aktuelles finden Sie unter <a href="/news" style={{ color: "var(--bk-yellow)" }}>Alle News</a>.</p>
          )}
        </section>
        <section className="bk-sec bk-two">
          <Faq items={c.faq} />
          <LeadForm title={`${c.label}: Projekt kostenlos anfragen`} />
        </section>
      </div>
    </>
  );
}

function parse<T>(s: string): T[] {
  try {
    return JSON.parse(s) as T[];
  } catch {
    return [];
  }
}

function ArticlePage({ a, related }: { a: Article; related: ArticleCard[] }) {
  const cat = categoryBySlug(a.category);
  const sources = parse<[string, string]>(a.sources);
  const faq = parse<[string, string]>(a.faq);
  const isAd = a.kind === "werbung";
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": a.kind === "news" ? "NewsArticle" : "Article", headline: a.title, description: a.teaser,
        image: a.image ? [abs(a.image)] : undefined, datePublished: a.published_at, dateModified: a.updated_at,
        author: { "@type": "Organization", name: a.author, url: `${SITE_URL}/redaktion` },
        publisher: { "@type": "NewsMediaOrganization", name: SITE.name, logo: { "@type": "ImageObject", url: abs("/logo.png") } },
        mainEntityOfPage: `${SITE_URL}/${a.slug}`, inLanguage: "de-AT" }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: cat?.label ?? "Bau", item: `${SITE_URL}/${a.category}` },
        { "@type": "ListItem", position: 3, name: a.title, item: `${SITE_URL}/${a.slug}` },
      ] }} />
      {faq.length ? <JsonLd data={faqSchema(faq)} /> : null}
      <div className="bk-wrap bk-article-grid">
        <article className="bk-article">
          <p className="bk-crumb" style={{ margin: 0 }}><a href="/">Start</a> / <Kicker slug={a.category} />{isAd ? <span className="bk-tag-ad">Werbung</span> : null}</p>
          <h1 className="bk-h">{a.title}</h1>
          <p className="bk-teaser">{a.teaser}</p>
          <p className="bk-meta" style={{ margin: 0 }}>
            {a.author} · {fmtDate(a.published_at)}
            {a.updated_at.slice(0, 10) !== a.published_at.slice(0, 10) ? ` · aktualisiert am ${fmtDate(a.updated_at)}` : ""}
          </p>
          {a.image ? (
            <figure className="bk-fig">
              <AiImg src={a.image} alt={a.image_alt ?? a.title} width={1200} height={800} priority />
              <figcaption>KI-generiertes Symbolbild</figcaption>
            </figure>
          ) : null}
          <ArticleBody body={a.body} format={a.body_format} />
          {faq.length ? <Faq items={faq} /> : null}
          {sources.length ? (
            <section className="bk-sources">
              <h2 className="bk-h">Quellen</h2>
              <ul>{sources.map(([t, u]) => <li key={u}><a href={u} rel="noopener nofollow" target="_blank">{t}</a></li>)}</ul>
            </section>
          ) : null}
          <div style={{ marginTop: 34 }}><LeadForm /></div>
        </article>
        <aside className="bk-aside">
          <h2 className="bk-h">Bauprojekt geplant?</h2>
          <p>Haus bauen, sanieren oder abreißen: Senden Sie uns Ihr Projekt.</p>
          <a className="bk-cta-head" style={{ display: "inline-block" }} href="#anfrage">Kostenlos anfragen</a>
        </aside>
      </div>
      {related.length ? (
        <div className="bk-wrap">
          <section className="bk-sec">
            <div className="bk-sec-h"><h2 className="bk-h">Mehr zum Thema</h2></div>
            <div className="bk-two">{related.map((r) => <Row key={r.slug} a={r} />)}</div>
          </section>
        </div>
      ) : null}
    </>
  );
}
