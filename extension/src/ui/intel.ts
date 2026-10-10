import type { IntelView } from "../jobs/types.js";

export const INTEL_CSS = `
.intel{display:grid;gap:8px}
.intel .sum{margin:0;font-size:12px}
.intel .meta{color:var(--muted);font-size:11px}
.intel .cols{display:grid;gap:8px}
.intel ul{margin:0;padding:0;list-style:none;display:grid;gap:4px}
.intel li{padding:5px 8px;border-radius:8px;background:var(--soft)}
.intel li.pro{border-left:3px solid var(--green)}
.intel li.con{border-left:3px solid var(--red)}
.intel h5{margin:0 0 4px;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.intel .note{color:var(--muted);font-size:10px}
.skel{height:12px;border-radius:6px;background:var(--soft);animation:p 1.2s infinite ease-in-out}
@keyframes p{50%{opacity:.4}}
`;

function el<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, cls = "", text = ""): HTMLElementTagNameMap[K] {
  const e = doc.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

/** Company briefing block, shared by the job panel and the hover card. */
export function renderIntel(doc: Document, view: IntelView): HTMLElement {
  const box = el(doc, "div", "intel");
  if (view.state === "loading") { box.append(el(doc, "div", "skel"), el(doc, "div", "skel"), el(doc, "div", "skel")); return box; }
  if (view.state === "error") { box.append(el(doc, "div", "alert red", view.message)); return box; }
  const i = view.intel;
  if (!i.known) {
    box.append(el(doc, "p", "sum", "No reliable information on this company."), el(doc, "p", "note", "The model doesn't recognise it, so it isn't guessing. Check Glassdoor or news before applying."));
    return box;
  }
  box.append(el(doc, "p", "sum", i.what_they_do));
  const meta = [i.size_hint, i.hq].filter(Boolean).join(" · ");
  if (meta) box.append(el(doc, "div", "meta", meta));
  if (i.reputation) box.append(el(doc, "p", "sum", i.reputation));
  const cols = el(doc, "div", "cols");
  const list = (title: string, rows: string[], cls: string) => {
    if (!rows.length) return;
    const d = el(doc, "div");
    d.append(el(doc, "h5", "", title));
    const ul = el(doc, "ul");
    for (const r of rows) ul.append(el(doc, "li", cls, r));
    d.append(ul);
    cols.append(d);
  };
  list("Pros", i.pros, "pro");
  list("Cons", i.cons, "con");
  box.append(cols);
  box.append(el(doc, "div", "note", `${i.web ? "From a live web search" : "From the AI's own knowledge, may be outdated"} · confidence ${i.confidence}`));
  return box;
}
