import { fillOne, type Suggestion } from "./index.js";

const COLORS = { green: "#16a34a", yellow: "#d97706", red: "#dc2626" } as const;
const ATTR = "data-jobfill";

export function clearOverlay(root: ParentNode = document) {
  root.querySelectorAll(`[${ATTR}="badge"]`).forEach((n) => n.remove());
  root.querySelectorAll<HTMLElement>(`[${ATTR}="field"]`).forEach((el) => {
    el.style.outline = "";
    el.removeAttribute(ATTR);
    el.removeAttribute("title");
  });
}

/** Outline every field and attach a small badge showing the suggestion. Text only, no innerHTML. */
export function showSuggestions(all: Suggestion[], root: ParentNode = document) {
  clearOverlay(root);
  for (const s of all) {
    const el = s.field.el;
    const color = COLORS[s.tier];
    el.setAttribute(ATTR, "field");
    el.style.outline = `2px solid ${color}`;
    el.title = `JobFill: ${s.reason}`;

    const badge = el.ownerDocument.createElement("button");
    badge.type = "button"; // never submit the form
    badge.setAttribute(ATTR, "badge");
    badge.style.cssText = `all:initial;font:11px system-ui,sans-serif;color:#fff;background:${color};` +
      "border-radius:3px;padding:1px 5px;margin-left:4px;cursor:pointer;vertical-align:middle";
    const preview = s.values[0] ? ` ${s.values[0].slice(0, 28)}` : "";
    badge.textContent =
      s.tier === "green" ? `✓${preview}` : s.tier === "yellow" ? `? confirm:${preview}` : s.sensitive ? "no saved answer" : "no answer";
    if (s.values.length) {
      badge.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (fillOne(s)) { badge.style.opacity = "0.5"; badge.textContent = "filled"; }
      });
    }
    el.insertAdjacentElement("afterend", badge);
  }
}

const PANEL = "jobfill-panel";

export function clearPanel(doc: Document = document) {
  doc.getElementById(PANEL)?.remove();
}

/** Small fixed panel so the user can fill without opening the popup. */
export function showPanel(c: { green: number; yellow: number; red: number }, onFill: () => number, doc: Document = document) {
  clearPanel(doc);
  const p = doc.createElement("div");
  p.id = PANEL;
  p.setAttribute(ATTR, "panel");
  p.style.cssText = "all:initial;position:fixed;right:12px;bottom:12px;z-index:2147483647;background:#111827;color:#fff;" +
    "font:12px system-ui,sans-serif;padding:8px 10px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;gap:8px;align-items:center";
  const t = doc.createElement("span");
  t.textContent = `JobFill  ${c.green} green · ${c.yellow} confirm · ${c.red} empty`;
  const b = doc.createElement("button");
  b.type = "button";
  b.textContent = "Autofill green";
  b.style.cssText = "all:initial;font:12px system-ui,sans-serif;background:#16a34a;color:#fff;padding:3px 8px;border-radius:4px;cursor:pointer";
  b.addEventListener("click", () => { const n = onFill(); b.textContent = `Filled ${n}`; });
  const x = doc.createElement("button");
  x.type = "button";
  x.textContent = "×";
  x.style.cssText = "all:initial;font:14px system-ui,sans-serif;color:#9ca3af;cursor:pointer";
  x.addEventListener("click", () => p.remove());
  p.append(t, b, x);
  doc.body.appendChild(p);
}
