import { createFileRoute, notFound } from "@tanstack/react-router";

import { LeadForm, PageHead } from "@/components/site/site";
import { BUNDESLAENDER, bundeslandBySlug, pageHead } from "@/lib/site";

export const Route = createFileRoute("/bundesland/$slug")({
  loader: ({ params }) => {
    if (!bundeslandBySlug(params.slug)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const b = bundeslandBySlug(params.slug);
    return b ? pageHead({ title: `Bauen in ${b.name}: Förderung und Lage`, description: b.description, path: `/bundesland/${b.slug}` }) : {};
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const b = bundeslandBySlug(slug)!;
  return (
    <>
      <PageHead title={`Bauen in ${b.name}`} intro={[b.description]} crumb={[{ label: b.name, href: `/bundesland/${b.slug}` }]} />
      <div className="bk-wrap">
        <section className="bk-sec bk-two" style={{ borderTop: 0 }}>
          <div className="bk-prose">
            <h2>Wohnbauförderung in {b.name}</h2>
            <p>{b.foerderung}</p>
            <p className="bk-meta">Stand: Überblick von INFINA, 1. September 2026. Aktuelle Bedingungen kennt die Landesstelle.</p>
            <h2>Insolvenzen in {b.name}</h2>
            <p>{b.insolvenz}</p>
            <p className="bk-meta">Zeitraum: 1. bis 3. Quartal 2026 gegenüber dem Vorjahr.</p>
            <h2>Gut zu wissen</h2>
            <p>{b.hinweis}</p>
            <p>Mehr dazu in der <a href="/wohnbaufoerderung-neubau-oesterreich-2026-bundeslaender">Übersicht aller Bundesländer</a>, zu <a href="/sanierung-foerderung">Sanierungsförderungen</a> und <a href="/haus-bau-kosten">Baukosten</a>.</p>
          </div>
          <LeadForm title={`Bauprojekt in ${b.name} anfragen`} />
        </section>
        <section className="bk-sec">
          <div className="bk-chips">
            {BUNDESLAENDER.filter((x) => x.slug !== b.slug).map((x) => <a key={x.slug} className="bk-chip" href={`/bundesland/${x.slug}`}>{x.name}</a>)}
          </div>
        </section>
      </div>
    </>
  );
}
