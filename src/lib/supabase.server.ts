// Leads liegen in Supabase (Projekt presseinfo, Schema baukurier). Zugriff nur ueber RPC-Funktionen.
const URL = process.env.SUPABASE_URL ?? "https://aiffgjcxhbilxifeqcvm.supabase.co";
const KEY = process.env.SUPABASE_ANON_KEY ?? "";

export async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Supabase ${fn}: ${res.status} ${await res.text()}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
