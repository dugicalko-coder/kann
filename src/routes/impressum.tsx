import { createFileRoute } from "@tanstack/react-router";

import { PageHead } from "@/components/site/site";
import { SITE, pageHead } from "@/lib/site";

export const Route = createFileRoute("/impressum")({
  head: () => pageHead({ title: "Impressum und Offenlegung", description: "Impressum und Offenlegung nach § 25 Mediengesetz von Baukurier, Digital Denker e.U., Wien.", path: "/impressum" }),
  component: () => (
    <>
      <PageHead title="Impressum" intro={["Informationen gemäß § 5 E-Commerce-Gesetz, § 14 Unternehmensgesetzbuch und Offenlegung gemäß § 25 Mediengesetz."]} />
      <div className="bk-wrap bk-prose" style={{ padding: "30px 20px 60px" }}>
        <h2>Medieninhaber und Herausgeber</h2>
        <p>{SITE.publisher}<br />Wattgasse 33/1, 1160 Wien, Österreich<br />Telefon: {SITE.phone}<br />E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        <p>Rechtsform: Einzelunternehmen, eingetragen im Firmenbuch<br />Firmenbuchnummer: FN 512208 y<br />Firmenbuchgericht: Handelsgericht Wien<br />Kammerzugehörigkeit: Wirtschaftskammer Wien<br />Anwendbare Rechtsvorschriften: Gewerbeordnung, abrufbar unter www.ris.bka.gv.at</p>
        <h2>Unternehmensgegenstand und Vermittlung</h2>
        <p>Baukurier ist ein Online-Medium und eine Vermittlungsplattform für Bau, Sanierung und Abbruch in Österreich. {SITE.publisher} führt selbst keine Bauarbeiten aus. Anfragen werden an Baubetriebe weitergeleitet. Vertragspartner für die Ausführung ist ausschließlich der jeweilige Betrieb.</p>
        <h2>Grundlegende Richtung (Blattlinie)</h2>
        <p>Baukurier informiert unabhängig über Bauwirtschaft, Förderungen, Baukosten, Normen, Bauprojekte und Insolvenzen in Österreich. Redaktionelle Inhalte und Werbung werden klar getrennt.</p>
        <h2>Haftung für Inhalte und Links</h2>
        <p>Die Inhalte wurden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität, insbesondere bei Förderungen, Preisen und Rechtslagen, übernehmen wir keine Gewähr. Die Beiträge ersetzen keine Rechts-, Steuer- oder Fachberatung. Für Inhalte externer Links sind deren Betreiber verantwortlich.</p>
        <h2>Urheberrecht</h2>
        <p>Texte und Bilder dieser Website sind geschützt. Eine Verwendung ist nur mit Zustimmung erlaubt.</p>
      </div>
    </>
  ),
});
