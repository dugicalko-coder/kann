import { createFileRoute } from "@tanstack/react-router";

import { Card, PageHead } from "@/components/site/site";
import { getList } from "@/lib/api/content.functions";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/news")({
  loader: () => getList({ data: { limit: 100 } }),
  head: () => pageHead({ title: "Bau News Österreich: Alle aktuellen Meldungen", description: "Alle aktuellen Baunews aus Österreich: Förderungen, Insolvenzen, Bauwirtschaft, Bauprojekte und Normen, chronologisch.", path: "/news" }),
  component: () => {
    const items = Route.useLoaderData();
    return (
      <>
        <PageHead title="Alle Baunews" intro={["Alle Beiträge von Baukurier, neueste zuerst."]} />
        <div className="bk-wrap"><section className="bk-sec" style={{ borderTop: 0 }}><div className="bk-grid">{items.map((a) => <Card key={a.slug} a={a} />)}</div></section></div>
      </>
    );
  },
});
