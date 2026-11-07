import { createFileRoute } from "@tanstack/react-router";

import { LeadForm, PageHead } from "@/components/site/site";
import { SITE, pageHead } from "@/lib/site";

export const Route = createFileRoute("/kontakt")({
  head: () => pageHead({ title: "Kontakt zur Redaktion", description: "So erreichen Sie die Baukurier-Redaktion: Telefon, E-Mail und Adresse von Digital Denker e.U. in Wien.", path: "/kontakt" }),
  component: () => (
    <>
      <PageHead title="Kontakt" intro={["Hinweise, Korrekturen und Fragen an die Redaktion."]} />
      <div className="bk-wrap">
        <section className="bk-sec bk-two" style={{ borderTop: 0 }}>
          <div className="bk-prose">
            <h2>Baukurier</h2>
            <p>{SITE.publisher}<br />{SITE.address}<br />Telefon: <a href={`tel:${SITE.phoneIntl}`}>{SITE.phone}</a><br />E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            <iframe className="bk-map" title="Karte: Wattgasse 33, 1160 Wien" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Wattgasse%2033%2C%201160%20Wien&z=15&output=embed" />
          </div>
          <LeadForm />
        </section>
      </div>
    </>
  ),
});
