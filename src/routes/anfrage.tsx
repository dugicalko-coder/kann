import { createFileRoute } from "@tanstack/react-router";

import { LeadForm, PageHead } from "@/components/site/site";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/anfrage")({
  head: () => pageHead({ title: "Bauprojekt kostenlos anfragen", description: "Haus bauen, sanieren oder abreißen in Österreich: Projekt kostenlos anfragen und an einen passenden Baubetrieb weiterleiten lassen.", path: "/anfrage" }),
  component: () => (
    <>
      <PageHead title="Bauprojekt anfragen" intro={["In zwei Minuten: Beschreiben Sie Ihr Vorhaben, wir melden uns telefonisch und leiten die Anfrage an einen passenden Baubetrieb weiter."]} />
      <div className="bk-wrap" style={{ maxWidth: 820, padding: "36px 20px 60px" }}><LeadForm /></div>
    </>
  ),
});
