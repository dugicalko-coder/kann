import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { adminLeads, adminLogin, adminLogout, adminSetStatus, adminStatus } from "@/lib/api/admin.functions";
import { fmtDate } from "@/lib/site";
import type { Lead } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  loader: () => adminStatus(),
  head: () => ({ meta: [{ title: "Anfragen | Baukurier" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPage,
});

const STATUS = ["neu", "in Arbeit", "weitergeleitet", "erledigt"] as const;

function AdminPage() {
  const status = Route.useLoaderData();
  const router = useRouter();
  if (!status.configured)
    return <section className="bk-wrap" style={{ padding: "70px 20px" }}><h1 className="bk-h" style={{ fontSize: 36 }}>Verwaltung</h1><p>Der Zugang ist noch nicht eingerichtet. Lege in den Website-Einstellungen das Secret ADMIN_PASSWORD an und veröffentliche die Seite neu.</p></section>;
  if (!status.loggedIn) return <Login onDone={() => router.invalidate()} />;
  return <Leads onLogout={async () => { await adminLogout(); router.invalidate(); }} />;
}

function Login({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  return (
    <section className="bk-wrap" style={{ padding: "70px 20px", maxWidth: 480 }}>
      <h1 className="bk-h" style={{ fontSize: 36 }}>Anmelden</h1>
      <form onSubmit={async (e) => { e.preventDefault(); const r = await adminLogin({ data: { password: pw } }); if (r.ok) onDone(); else setErr(true); }}>
        <label className="bk-field">Passwort<input className="bk-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required /></label>
        <button className="bk-send" style={{ marginTop: 14 }}>Anmelden</button>
        {err ? <p role="alert">Passwort falsch.</p> : null}
      </form>
    </section>
  );
}

function Leads({ onLogout }: { onLogout: () => void }) {
  const [rows, setRows] = useState<Lead[]>([]);
  const load = () => adminLeads().then(setRows);
  useEffect(() => { void load(); }, []);
  return (
    <section className="bk-wrap bk-admin" style={{ padding: "30px 20px 60px" }}>
      <div className="bk-sec-h"><h1 className="bk-h" style={{ fontSize: 34, margin: 0 }}>Anfragen ({rows.length})</h1><button className="bk-chip" onClick={onLogout}>Abmelden</button></div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Datum</th><th>Projekt</th><th>Land</th><th>Umsetzung</th><th>Name</th><th>Telefon</th><th>E-Mail</th><th>Nachricht</th><th>Seite</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td>{fmtDate(`${l.created_at.replace(" ", "T")}Z`)}</td><td>{l.project}</td><td>{l.bundesland}</td><td>{l.timeline}</td><td>{l.name}</td>
                <td><a href={`tel:${l.phone}`}>{l.phone}</a></td><td>{l.email}</td><td>{l.message}</td><td>{l.page}</td>
                <td><select className="bk-input" value={l.status} onChange={async (e) => { await adminSetStatus({ data: { id: l.id, status: e.target.value as (typeof STATUS)[number] } }); void load(); }}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
