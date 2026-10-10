import { THEME } from "./theme.js";
import { INTEL_CSS, renderIntel } from "./intel.js";
import type { DeepResult, Employer, IntelView } from "../jobs/types.js";

export type PanelState =
  | { kind: "setup"; message: string }
  | { kind: "loading"; title: string; company: string; employer: Employer }
  | { kind: "error"; title: string; message: string; onRetry: () => void }
  | { kind: "result"; title: string; company: string; poster?: string; via?: string; result: DeepResult; employer: Employer; model?: string; cached?: boolean; ms?: number; intel?: IntelView; onRetry: () => void };

const ID = "jobfill-job-panel";
let collapsed = false;

const PANEL_CSS = `
.card{position:fixed;right:16px;bottom:16px;width:340px;max-height:72vh;overflow:auto;background:var(--bg);border:1px solid var(--line);
  border-radius:16px;box-shadow:var(--shadow);z-index:2147483647}
.head{display:flex;gap:12px;align-items:center;padding:14px 14px 10px;position:sticky;top:0;background:var(--bg);z-index:1}
.ring{--p:0;--c:var(--muted);width:52px;height:52px;border-radius:50%;flex:none;display:grid;place-items:center;
  background:conic-gradient(var(--c) calc(var(--p)*1%),var(--soft) 0)}
.ring b{width:42px;height:42px;border-radius:50%;background:var(--bg);display:grid;place-items:center;font-size:16px;font-weight:700}
.t{min-width:0;flex:1}.t h4{margin:0;font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.t p{margin:1px 0 0;color:var(--muted);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.x{color:var(--muted);font-size:16px;padding:4px 6px;border-radius:6px}.x:hover{background:var(--soft)}
.body{padding:0 14px 14px;display:grid;gap:12px}
.sum{margin:0;font-size:12px}
.sec h5{margin:0 0 5px;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.sec ul{margin:0;padding:0;list-style:none;display:grid;gap:5px}
.sec li{padding:6px 8px;border-radius:8px;background:var(--soft)}
.sec li small{display:block;color:var(--muted);margin-top:1px}
.alert{padding:8px 10px;border-radius:10px;font-weight:600}
.alert small{display:block;font-weight:400;margin-top:2px}
.foot{display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:10px}
.btn{padding:5px 10px;border-radius:8px;background:var(--accent);color:#fff;font-weight:600}
.skel{height:12px;border-radius:6px;background:var(--soft);animation:p 1.2s infinite ease-in-out}
@keyframes p{50%{opacity:.4}}
.mini{position:fixed;right:16px;bottom:16px;z-index:2147483647}
`;

function el<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, cls = "", text = ""): HTMLElementTagNameMap[K] {
  const e = doc.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function host(doc: Document) {
  let h = doc.getElementById(ID);
  if (!h) {
    h = doc.createElement("div");
    h.id = ID;
    h.attachShadow({ mode: "open" });
    doc.body.appendChild(h);
  }
  return h.shadowRoot!;
}

export function clearJobPanel(doc: Document) { doc.getElementById(ID)?.remove(); }

const scoreColor = (n: number) => (n >= 75 ? "var(--green)" : n >= 55 ? "var(--amber)" : "var(--red)");

export function renderJobPanel(doc: Document, st: PanelState) {
  const root = host(doc);
  root.replaceChildren();
  const style = el(doc, "style");
  style.textContent = THEME + INTEL_CSS + PANEL_CSS;
  const wrap = el(doc, "div", "wrap");
  root.append(style, wrap);

  if (collapsed) {
    const b = el(doc, "button", "pill mini", "JobFill ▴");
    b.addEventListener("click", () => { collapsed = false; renderJobPanel(doc, st); });
    wrap.append(b);
    return;
  }

  const card = el(doc, "div", "card");
  wrap.append(card);
  const head = el(doc, "div", "head");
  const ring = el(doc, "div", "ring");
  const num = el(doc, "b", "", "–");
  ring.append(num);
  const t = el(doc, "div", "t");
  const x = el(doc, "button", "x", "–");
  x.title = "Minimise";
  x.addEventListener("click", () => { collapsed = true; renderJobPanel(doc, st); });
  head.append(ring, t, x);
  const body = el(doc, "div", "body");
  card.append(head, body);

  const badge = (e: Employer, via?: string) => {
    const row = el(doc, "div", "row");
    if (e.type === "recruiter") row.append(pillOf(doc, "red", "RECRUITER"));
    else if (e.type === "aggregator") row.append(pillOf(doc, "violet", via ? `AGGREGATOR · via ${via}` : "AGGREGATOR"));
    else if (e.type === "direct") row.append(pillOf(doc, "green", "Direct employer"));
    else row.append(pillOf(doc, "amber", "Employer unclear"));
    return row;
  };

  if (st.kind === "setup") {
    t.append(el(doc, "h4", "", "JobFill"), el(doc, "p", "", "Set up to score jobs"));
    body.append(el(doc, "p", "sum", st.message));
    return;
  }
  if (st.kind === "loading") {
    t.append(el(doc, "h4", "", st.title), el(doc, "p", "", st.company));
    body.append(badge(st.employer), el(doc, "div", "skel"), el(doc, "div", "skel"), el(doc, "div", "skel"));
    return;
  }
  if (st.kind === "error") {
    t.append(el(doc, "h4", "", st.title), el(doc, "p", "", "Couldn't score this job"));
    const a = el(doc, "div", "alert red", st.message);
    const retry = el(doc, "button", "btn", "Try again");
    retry.addEventListener("click", st.onRetry);
    body.append(a, retry);
    return;
  }

  const r = st.result;
  ring.style.setProperty("--p", String(r.score));
  ring.style.setProperty("--c", scoreColor(r.score));
  num.textContent = String(r.score);
  t.append(el(doc, "h4", "", st.title), el(doc, "p", "", [st.company, st.poster && `posted by ${st.poster}`].filter(Boolean).join(" · ")));

  // Employer type first: the user wants recruiters/aggregators called out outright.
  const type = r.employer_type !== "unclear" ? r.employer_type : st.employer.type;
  const eff: Employer = { type, reasons: st.employer.reasons };
  body.append(badge(eff, st.via));
  if (type === "recruiter" || type === "aggregator") {
    const a = el(doc, "div", `alert ${type === "recruiter" ? "red" : "violet"}`, type === "recruiter" ? "Posted by a recruiter / staffing firm" : "Aggregator listing: real employer may be hidden");
    a.append(el(doc, "small", "", [r.employer_reason, ...st.employer.reasons].filter(Boolean).join(" · ")));
    body.append(a);
  }
  body.append(el(doc, "p", "sum", r.summary));

  if (st.intel) {
    const sec = el(doc, "div", "sec");
    sec.append(el(doc, "h5", "", `About ${st.company}`), renderIntel(doc, st.intel));
    body.append(sec);
  }

  const list = (title: string, rows: { main: string; sub?: string }[], cls = "") => {
    if (!rows.length) return;
    const sec = el(doc, "div", "sec");
    sec.append(el(doc, "h5", "", title));
    const ul = el(doc, "ul");
    for (const row of rows) {
      const li = el(doc, "li", cls, row.main);
      if (row.sub) li.append(el(doc, "small", "", row.sub));
      ul.append(li);
    }
    sec.append(ul);
    body.append(sec);
  };
  if (r.deal_breakers.length) {
    const a = el(doc, "div", "alert red", "Deal-breakers");
    for (const d of r.deal_breakers) a.append(el(doc, "small", "", `• ${d}`));
    body.append(a);
  }
  list("Why you match", r.strengths.map((s) => ({ main: s.point, sub: s.evidence })));
  list("Gaps", r.gaps.map((g) => ({ main: g })));
  list("Watch out", r.red_flags.map((g) => ({ main: g })));

  const foot = el(doc, "div", "foot");
  foot.append(el(doc, "span", "", `${st.cached ? "cached · " : ""}${st.model ?? ""}${st.ms && !st.cached ? ` · ${(st.ms / 1000).toFixed(1)}s` : ""}`));
  const again = el(doc, "button", "x", "↻ re-score");
  again.addEventListener("click", st.onRetry);
  foot.append(again);
  body.append(foot);
}

function pillOf(doc: Document, cls: string, text: string) {
  const s = doc.createElement("span");
  s.className = `pill ${cls}`;
  s.textContent = text;
  return s;
}
