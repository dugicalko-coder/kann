import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteFooter, SiteHeader } from "../components/site/site";
import { SITE, abs } from "../lib/site";


function NotFoundComponent() {
  return (
    <section className="bk-wrap" style={{ padding: "90px 20px" }}>
      <p className="bk-kicker">404</p>
      <h1 className="bk-h" style={{ fontSize: 46 }}>Diese Seite gibt es nicht.</h1>
      <p>Vielleicht wurde der Beitrag verschoben. Alle aktuellen Meldungen finden Sie auf der <a href="/news">Newsseite</a>.</p>
    </section>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="bk-wrap" style={{ padding: "90px 20px" }}>
      <h1 className="bk-h" style={{ fontSize: 40 }}>Diese Seite konnte nicht geladen werden.</h1>
      <button className="bk-send" style={{ marginTop: 20 }} onClick={() => { router.invalidate(); reset(); }}>Neu laden</button>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE.name}: ${SITE.claim}` },
      { name: "description", content: SITE.description },
      { name: "theme-color", content: SITE.themeColor },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: SITE.name },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: "de_AT" },
      { property: "og:image", content: abs("/assets/img/og.jpg") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,700..900&family=Source+Sans+3:wght@400;600;700&display=swap" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "alternate", type: "application/rss+xml", title: SITE.name, href: "/rss.xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de-AT" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
      </head>
      <body className="bk-body">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <a href="#inhalt" className="bk-hp" style={{ position: "absolute" }}>Zum Inhalt</a>
      <SiteHeader />
      <main id="inhalt">
        <Outlet />
      </main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
