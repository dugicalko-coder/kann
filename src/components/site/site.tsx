import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";

import { submitLead } from "@/lib/api/lead.functions";
import { BUNDESLAENDER, CATEGORIES, COMPANIES, GROUPS, LEAD_PROJECTS, LEAD_TIMELINES, SITE, categoryBySlug, fmtDate } from "@/lib/site";
import type { ArticleCard } from "@/lib/types";

export const articleHref = (slug: string) => `/${slug}`;

function Logo() {
  return (
    <Link to="/" className="bk-logo" aria-label="Baukurier Startseite">
      <span className="bk-logo-mark" aria-hidden="true" />
      <span className="bk-logo-word">BAUKURIER</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="bk-top">
        <div className="bk-wrap">
          <span>{SITE.claim}</span>
          <span className="bk-hide-sm">Bauen, sanieren, abreißen in ganz Österreich</span>
        </div>
      </div>
      <header className="bk-header">
        <div className="bk-wrap bk-header-in" style={{ position: "relative" }}>
          <Logo />
          <nav className={`bk-nav${open ? " is-open" : ""}`} aria-label="Hauptnavigation" onClick={(e) => (e.target as HTMLElement).tagName === "A" && setOpen(false)}>
            {GROUPS.map((g) => (
              <div key={g} className="bk-nav-group">
                <a className="bk-nav-btn" href={`/${CATEGORIES.find((c) => c.group === g)?.slug}`}>{g}</a>
                <div className="bk-drop">
                  {CATEGORIES.filter((c) => c.group === g).map((c) => (
                    <a key={c.slug} href={`/${c.slug}`}>{c.label}</a>
                  ))}
                </div>
              </div>
            ))}
            <Link className="bk-nav-btn" to="/news">Alle News</Link>
          </nav>
          <Link to="/anfrage" className="bk-cta-head">Projekt anfragen</Link>
          <button type="button" className="bk-burger" aria-expanded={open} aria-label="Menü" onClick={() => setOpen((v) => !v)}>Menü</button>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="bk-footer">
      <div className="bk-wrap bk-footer-grid">
        <div>
          <Logo />
          <p style={{ color: "var(--bk-muted)" }}>Nachrichten und Ratgeber für alle, die in Österreich bauen, sanieren oder abreißen.</p>
          <p style={{ color: "var(--bk-muted)" }}>{SITE.publisher}<br />{SITE.address}<br />Telefon: <a href={`tel:${SITE.phoneIntl}`}>{SITE.phone}</a></p>
        </div>
        <div>
          <h2 className="bk-h">Top-Themen</h2>
          <ul className="bk-foot-links">
            {CATEGORIES.map((c) => (
              <li key={c.slug}><a href={`/${c.slug}`}>{c.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="bk-h">Bundesländer</h2>
          <ul className="bk-foot-links is-one">
            {BUNDESLAENDER.map((b) => (
              <li key={b.slug}><Link to="/bundesland/$slug" params={{ slug: b.slug }}>Bauen in {b.name}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bk-marquee" aria-label="Unsere Firmen">
        <div className="bk-marquee-track">
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <a key={i} href={c.url} rel="noopener" aria-hidden={i >= COMPANIES.length} tabIndex={i >= COMPANIES.length ? -1 : undefined}>{c.name}</a>
          ))}
        </div>
      </div>
      <a className="bk-sticky-cta" href="/anfrage">Bauprojekt kostenlos anfragen</a>
      <div className="bk-wrap bk-legal">
        <span>© {new Date().getFullYear()} {SITE.name}, ein Medium von {SITE.publisher}</span>
        <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <Link to="/redaktion">Redaktion</Link>
          <Link to="/kontakt">Kontakt</Link>
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
          <a href="/rss.xml">RSS</a>
        </span>
      </div>
    </footer>
  );
}

export function Kicker({ slug }: { slug: string }) {
  const c = categoryBySlug(slug);
  if (!c) return <span className="bk-kicker">Bau</span>;
  return <a className="bk-kicker" href={`/${c.slug}`}>{c.label}</a>;
}

/** Jedes Bild traegt sichtbar den KI-Hinweis. */
export function AiImg({ src, alt, width, height, priority }: { src: string; alt: string; width: number; height: number; priority?: boolean }) {
  return (
    <span className="bk-img">
      <img src={src} alt={alt} width={width} height={height} {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })} />
      <span className="bk-ai">KI-Bild</span>
    </span>
  );
}

export function Card({ a }: { a: ArticleCard }) {
  return (
    <div>
      <a className="bk-card" href={articleHref(a.slug)}>
        {a.image ? <AiImg src={a.image} alt={a.image_alt ?? a.title} width={600} height={400} /> : null}
        <h3 className="bk-h">{a.title}</h3>
        <p>{a.teaser}</p>
      </a>
      <p className="bk-meta" style={{ margin: "6px 0 0" }}><Kicker slug={a.category} /> · {fmtDate(a.published_at)}</p>
    </div>
  );
}

export function Row({ a }: { a: ArticleCard }) {
  return (
    <a className="bk-row" href={articleHref(a.slug)}>
      {a.image ? <AiImg src={a.image} alt={a.image_alt ?? a.title} width={130} height={88} /> : <span />}
      <span>
        <h3 className="bk-h">{a.title}</h3>
        <span className="bk-meta">{fmtDate(a.published_at)}</span>
      </span>
    </a>
  );
}

export function Faq({ items, title = "Häufige Fragen" }: { items: [string, string][]; title?: string }) {
  return (
    <section className="bk-faq" style={{ marginTop: 30 }}>
      <h2 className="bk-h" style={{ fontSize: 29, marginBottom: 6 }}>{title}</h2>
      {items.map(([q, a]) => (
        <details key={q} open>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </section>
  );
}

export const faqSchema = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function PageHead({ title, intro, crumb, children }: { title: string; intro?: string[]; crumb?: { label: string; href: string }[]; children?: ReactNode }) {
  return (
    <section className="bk-pagehead">
            <div className="bk-wrap">
        {crumb ? (
          <p className="bk-crumb" style={{ margin: 0 }}>
            <a href="/">Start</a>
            {crumb.map((c) => <span key={c.href}> / <a href={c.href}>{c.label}</a></span>)}
          </p>
        ) : null}
        <h1 className="bk-h">{title}</h1>
        {intro?.map((p) => <p key={p}>{p}</p>)}
        {children}
      </div>
    </section>
  );
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>);
    else {
      const ext = m[3].startsWith("http");
      out.push(<a key={m.index} href={m[3]} {...(ext ? { rel: "noopener", target: "_blank" } : {})}>{m[2]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (l: string) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

export function ArticleBody({ body, format }: { body: string; format: string }) {
  if (format === "html") {
    const html = body.replace(/<img\b[^>]*>/g, (m) => `<span class="bk-img">${m}<span class="bk-ai">KI-Bild</span></span>`);
    return <div className="bk-prose" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return (
    <div className="bk-prose">
      {body.split(/\n\s*\n/).map((b, i) => {
        const t = b.trim();
        if (t.startsWith("### ")) return <h3 key={i}>{t.slice(4)}</h3>;
        if (t.startsWith("## ")) return <h2 key={i}>{t.slice(3)}</h2>;
        const lines = t.split("\n");
        if (lines.length > 1 && lines.every((l) => l.trim().startsWith("|"))) {
          const [head, , ...rows] = lines;
          return (
            <div className="bk-table" key={i}>
              <table>
                <thead><tr>{cells(head).map((c, j) => <th key={j}>{inline(c)}</th>)}</tr></thead>
                <tbody>{rows.map((r, j) => <tr key={j}>{cells(r).map((c, k) => <td key={k}>{inline(c)}</td>)}</tr>)}</tbody>
              </table>
            </div>
          );
        }
        if (lines.every((l) => l.trim().startsWith("- "))) return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.trim().slice(2))}</li>)}</ul>;
        if (lines.every((l) => /^\d+\.\s/.test(l.trim()))) return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.trim().replace(/^\d+\.\s/, ""))}</li>)}</ol>;
        return <p key={i}>{inline(t.replace(/\n/g, " "))}</p>;
      })}
    </div>
  );
}

export function LeadForm({ title = "Ihr Bauprojekt kostenlos anfragen", intro = "Haus bauen, sanieren oder abreißen: Beschreiben Sie Ihr Vorhaben, wir leiten es an einen passenden Baubetrieb weiter." }: { title?: string; intro?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "");
    setState("busy");
    try {
      const res = await submitLead({
        data: {
          project: v("project"), bundesland: v("bundesland"), timeline: v("timeline"), name: v("name"), phone: v("phone"),
          email: v("email"), message: v("message"), page: path.slice(0, 200), website: v("website"), consent: f.get("consent") === "on",
        } as never,
      });
      setState(res.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
  }

  if (state === "ok")
    return (
      <div className="bk-form" id="anfrage" role="status">
        <h2 className="bk-h">Danke, Ihre Anfrage ist da.</h2>
        <div className="bk-ok">Wir melden uns telefonisch bei Ihnen, um die Details zu klären.</div>
      </div>
    );

  return (
    <form className="bk-form" id="anfrage" onSubmit={send}>
      <h2 className="bk-h">{title}</h2>
      <p>{intro}</p>
      <div className="bk-fields">
        <label className="bk-field">Was planen Sie?
          <select className="bk-input" name="project" required defaultValue="">
            <option value="" disabled>Bitte wählen</option>
            {LEAD_PROJECTS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="bk-field">Bundesland
          <select className="bk-input" name="bundesland" required defaultValue="">
            <option value="" disabled>Bitte wählen</option>
            {BUNDESLAENDER.map((b) => <option key={b.slug}>{b.name}</option>)}
          </select>
        </label>
        <label className="bk-field">Umsetzung
          <select className="bk-input" name="timeline" required defaultValue="">
            <option value="" disabled>Bitte wählen</option>
            {LEAD_TIMELINES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="bk-field">Name
          <input className="bk-input" name="name" required minLength={2} maxLength={120} autoComplete="name" />
        </label>
        <label className="bk-field">Telefon
          <input className="bk-input" name="phone" type="tel" required minLength={6} maxLength={40} pattern="[+0-9 ()/\-]+" autoComplete="tel" />
        </label>
        <label className="bk-field">E-Mail (optional)
          <input className="bk-input" name="email" type="email" maxLength={160} autoComplete="email" />
        </label>
        <label className="bk-field is-wide">Ihr Projekt in ein paar Worten (optional)
          <textarea className="bk-input" name="message" rows={3} maxLength={2000} />
        </label>
      </div>
      <label className="bk-hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="bk-check">
        <input type="checkbox" name="consent" required />
        <span>Ich stimme zu, dass meine Angaben zur Bearbeitung gespeichert und an einen passenden Baubetrieb weitergegeben werden. Details in der <a href="/datenschutz">Datenschutzerklärung</a>.</span>
      </label>
      <button className="bk-send" type="submit" disabled={state === "busy"}>{state === "busy" ? "Wird gesendet" : "Anfrage kostenlos senden"}</button>
      {state === "err" ? <p className="bk-note" role="alert">Das hat nicht geklappt. Bitte prüfen Sie Ihre Angaben oder rufen Sie uns an: {SITE.phone}.</p> : null}
      <p className="bk-note">Baukurier ist ein Medium von {SITE.publisher} und vermittelt Anfragen an Baubetriebe, auch aus der eigenen Firmengruppe. Die Anfrage ist kostenlos und unverbindlich.</p>
    </form>
  );
}
