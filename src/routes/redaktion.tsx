import { createFileRoute } from "@tanstack/react-router";

import { PageHead } from "@/components/site/site";
import { SITE, pageHead } from "@/lib/site";

export const Route = createFileRoute("/redaktion")({
  head: () => pageHead({ title: "Redaktion und Grundsätze", description: "Wie Baukurier arbeitet: Quellen, KI-Einsatz, Insolvenzberichte, Korrekturen und Trennung von Werbung und Redaktion.", path: "/redaktion" }),
  component: () => (
    <>
      <PageHead title="Redaktion und Grundsätze" intro={["So entstehen die Beiträge von Baukurier."]} />
      <div className="bk-wrap bk-prose" style={{ padding: "30px 20px 60px" }}>
        <h2>Quellen</h2>
        <p>Neue Beiträge stützen sich auf amtliche Stellen, Forschungsinstitute, Kammern, Gläubigerschutzverbände und Medienberichte. Die Quellen stehen unter jedem Beitrag. Zahlen ohne Beleg veröffentlichen wir nicht. Ältere Beiträge aus der Zeit vor November 2026 tragen teils keine Quellenliste und werden schrittweise überarbeitet.</p>
        <h2>KI-Einsatz</h2>
        <p>Beiträge werden mit KI-Unterstützung erstellt und gegen die genannten Quellen geprüft. Alle Bilder auf Baukurier sind KI-generierte Symbolbilder und direkt am Bild gekennzeichnet. Sie zeigen keine realen Baustellen, Personen oder Firmen.</p>
        <h2>Berichte über Insolvenzen</h2>
        <p>Wir berichten nur über Unternehmen, nicht über Privatpersonen, und nur auf Basis öffentlicher Quellen wie Gläubigerschutzverbänden, Ediktsdatei oder Medien. Genannt werden die dort angeführten Gründe, keine Vermutungen. Ein Insolvenzverfahren bedeutet nicht automatisch das Ende eines Unternehmens.</p>
        <h2>Werbung und Unabhängigkeit</h2>
        <p>Baukurier gehört zu {SITE.publisher}. Zur Firmengruppe gehören auch Unternehmen aus Bau und Vermittlung. Bezahlte Inhalte und Eigenwerbung kennzeichnen wir als Werbung. Anfragen über unser Formular werden an Baubetriebe vermittelt, auch aus der eigenen Gruppe.</p>
        <h2>Korrekturen</h2>
        <p>Fehler korrigieren wir rasch. Hinweise bitte an <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </div>
    </>
  ),
});
