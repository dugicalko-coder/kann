import { Link, createFileRoute } from "@tanstack/react-router";

import { AiImg, Card, Faq, JsonLd, Kicker, LeadForm, Row, articleHref, faqSchema } from "@/components/site/site";
import { getHome } from "@/lib/api/content.functions";
import { BUNDESLAENDER, CATEGORIES, SITE, SITE_URL, abs, fmtDate, pageHead } from "@/lib/site";

const FAQ: [string, string][] = [
  ["Was ist Baukurier?", "Baukurier ist ein österreichweites Nachrichtenportal für Bau, Sanierung und Abbruch. Es berichtet über Bauwirtschaft, Förderungen, Baukosten, Normen, Bauprojekte und Insolvenzen."],
  ["Wie oft gibt es neue Beiträge?", "Baukurier veröffentlicht dreimal pro Woche neue Beiträge. Neue Meldungen nennen ihre Quellen."],
  ["Kann ich hier ein Bauprojekt anfragen?", "Ja. Über das Formular senden Sie Ihr Projekt kostenlos und unverbindlich. Die Anfrage wird an einen passenden Baubetrieb weitergegeben."],
  ["Wer steht hinter Baukurier?", "Baukurier ist ein Medium von Digital Denker e.U. aus Wien. Zur Firmengruppe gehören auch Bau- und Vermittlungsbetriebe, das ist im Impressum offengelegt."],
];

export const Route = createFileRoute("/")({
  loader: () => getHome(),
  head: () => pageHead({ title: `${SITE.name}: Baunews für Österreich, Förderungen, Kosten`, description: SITE.description, path: "/" }),
  component: Home,
});

function Home() {
  const { latest, insolvenz, foerderung, ratgeber } = Route.useLoaderData();
  const [lead, ...rest] = latest;
  // Kein Bild doppelt auf der Startseite: jeder Beitrag erscheint nur einmal mit Foto.
  const seen = new Set<string>(lead ? [lead.slug] : []);
  const once = <T extends { slug: string }>(list: T[]) =>
    list.filter((a) => {
      if (seen.has(a.slug)) return false;
      seen.add(a.slug);
      return true;
    });
  const more = once(rest.slice(5, 11));
  const insolvenzRows = once(insolvenz);
  const foerderRows = once(foerderung);
  const ratgeberCards = once(ratgeber);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "NewsMediaOrganization", "@id": `${SITE_URL}/#org`, name: SITE.name, url: SITE_URL, logo: abs("/logo.png"), publishingPrinciples: `${SITE_URL}/redaktion`,
          address: { "@type": "PostalAddress", streetAddress: "Wattgasse 33/1", postalCode: "1160", addressLocality: "Wien", addressCountry: "AT" } },
        { "@type": "WebSite", "@id": `${SITE_URL}/#site`, name: SITE.name, url: SITE_URL, inLanguage: "de-AT", publisher: { "@id": `${SITE_URL}/#org` } },
      ] }} />
      <JsonLd data={faqSchema(FAQ)} />
      <div className="bk-wrap">
        <h1 className="bk-h bk-home-h1">Baunews für Österreich: Förderungen, Baukosten, Bauprojekte und Insolvenzen</h1>
        {lead ? (
          <section className="bk-lead">
            <div>
              <a className="bk-lead-main" href={articleHref(lead.slug)}>
                {lead.image ? <AiImg src={lead.image} alt={lead.image_alt ?? lead.title} width={1200} height={800} priority /> : null}
                <h2 className="bk-h">{lead.title}</h2>
              </a>
              <p style={{ margin: "0 0 6px", color: "#d7dde8" }}>{lead.teaser}</p>
              <p className="bk-meta" style={{ margin: 0 }}><Kicker slug={lead.category} /> · {fmtDate(lead.published_at)}</p>
            </div>
            <div className="bk-side">
              {rest.slice(0, 5).map((a) => (
                <a className="bk-side-item" key={a.slug} href={articleHref(a.slug)}>
                  <span className="bk-kicker">{CATEGORIES.find((c) => c.slug === a.category)?.label}</span>
                  <h3 className="bk-h">{a.title}</h3>
                </a>
              ))}
            </div>
          </section>
        ) : null}
        <nav className="bk-chips" aria-label="Rubriken" style={{ paddingBottom: 36 }}>
          {CATEGORIES.map((c) => <a key={c.slug} className="bk-chip" href={`/${c.slug}`}>{c.label}</a>)}
        </nav>
      </div>

      <section className="bk-band">
        <img src="/assets/img/skyline.webp" alt="" loading="lazy" />
        <span className="bk-ai bk-ai-band">KI-Bild</span>
        <div className="bk-wrap bk-band-grid">
          <div>
            <h2 className="bk-h">Haus bauen. Sanieren. Abreißen.</h2>
            <p style={{ color: "#d7dde8", maxWidth: "46ch" }}>Sie planen ein Bauprojekt in Österreich? Schicken Sie uns die Eckdaten, wir leiten Ihre Anfrage an einen passenden Baubetrieb weiter.</p>
          </div>
          <LeadForm />
        </div>
      </section>

      <div className="bk-wrap">
        {more.length ? (
          <section className="bk-sec" style={{ borderTop: 0 }}>
            <div className="bk-sec-h"><h2 className="bk-h">Weitere News</h2><Link to="/news">Alle News</Link></div>
            <div className="bk-grid">{more.map((a) => <Card key={a.slug} a={a} />)}</div>
          </section>
        ) : null}

        <section className="bk-sec bk-two">
          <div>
            <div className="bk-sec-h"><h2 className="bk-h">Insolvenzen am Bau</h2><a href="/baufirma-insolvenz">Alle Meldungen</a></div>
            {insolvenzRows.map((a) => <Row key={a.slug} a={a} />)}
          </div>
          <div>
            <div className="bk-sec-h"><h2 className="bk-h">Förderungen</h2><a href="/sanierung-foerderung">Alle Förderungen</a></div>
            {foerderRows.map((a) => <Row key={a.slug} a={a} />)}
          </div>
        </section>

        <section className="bk-sec">
          <div className="bk-sec-h"><h2 className="bk-h">Ratgeber für Bauherren</h2><a href="/bau">Alle Beiträge</a></div>
          <div className="bk-grid">{ratgeberCards.map((a) => <Card key={a.slug} a={a} />)}</div>
        </section>

        <section className="bk-sec">
          <div className="bk-sec-h"><h2 className="bk-h">Bauen in Ihrem Bundesland</h2></div>
          <div className="bk-chips">
            {BUNDESLAENDER.map((b) => <Link key={b.slug} className="bk-chip" to="/bundesland/$slug" params={{ slug: b.slug }}>{b.name}</Link>)}
          </div>
        </section>

        <section className="bk-sec" style={{ maxWidth: 860 }}><Faq items={FAQ} /></section>
      </div>
    </>
  );
}
