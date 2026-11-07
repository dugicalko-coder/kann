import { createFileRoute } from "@tanstack/react-router";

import { PageHead } from "@/components/site/site";
import { SITE, pageHead } from "@/lib/site";

export const Route = createFileRoute("/datenschutz")({
  head: () => pageHead({ title: "Datenschutzerklärung", description: "Welche Daten Baukurier verarbeitet, warum und welche Rechte Sie haben.", path: "/datenschutz" }),
  component: () => (
    <>
      <PageHead title="Datenschutz" />
      <div className="bk-wrap bk-prose" style={{ padding: "30px 20px 60px" }}>
        <h2>Verantwortlicher</h2>
        <p>{SITE.publisher}, {SITE.address}, E-Mail: {SITE.email}.</p>
        <h2>Anfrageformular</h2>
        <p>Wenn Sie das Formular absenden, speichern wir Projektart, Bundesland, Zeitraum, Name, Telefon, optional E-Mail und Nachricht sowie die Seite, von der die Anfrage kam. Wir nutzen die Daten, um Sie zu kontaktieren, und geben sie zur Bearbeitung an einen passenden Baubetrieb weiter, auch aus unserer Firmengruppe. Für die Benachrichtigung per E-Mail nutzen wir den Dienst Zapier (Zapier Inc., USA), dabei werden Ihre Angaben dorthin übermittelt. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit widerrufen können. Wir löschen die Daten, wenn sie für die Bearbeitung nicht mehr nötig sind und keine gesetzlichen Fristen entgegenstehen.</p>
        <h2>Server-Protokolle</h2>
        <p>Beim Aufruf der Seite werden technisch notwendige Daten wie IP-Adresse, Zeitpunkt und aufgerufene Adresse kurzzeitig verarbeitet, um die Website sicher auszuliefern. Die Website läuft auf der Infrastruktur von Cloudflare.</p>
        <h2>Schriften und Karten</h2>
        <p>Wir laden Schriftarten von Google Fonts. Dabei wird Ihre IP-Adresse an Google übermittelt. Auf der Kontaktseite binden wir Google Maps ein. Beim Laden der Karte werden Daten an Google übertragen.</p>
        <h2>Cookies</h2>
        <p>Für Leser setzen wir keine Tracking-Cookies. Nur der Verwaltungsbereich verwendet ein technisch notwendiges Anmelde-Cookie.</p>
        <h2>Ihre Rechte</h2>
        <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dazu an {SITE.email}. Beschwerden können Sie bei der österreichischen Datenschutzbehörde einbringen.</p>
      </div>
    </>
  ),
});
