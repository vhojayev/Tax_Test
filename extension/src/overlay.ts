import { fillOne, type Suggestion } from "./index.js";
import { THEME } from "./ui/theme.js";

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
    badge.style.cssText = `all:initial;font:600 11px/1.4 ui-sans-serif,system-ui,sans-serif;color:#fff;background:${color};` +
      "border-radius:999px;padding:2px 9px;margin-left:6px;cursor:pointer;vertical-align:middle;box-shadow:0 1px 2px rgba(15,23,42,.25)";
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

const PANEL_CSS = `
.bar{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;align-items:center;gap:12px;padding:10px 12px 10px 14px;
  background:var(--bg);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow)}
.brand{display:flex;align-items:center;gap:8px;font-weight:700}
.logo{width:20px;height:20px;border-radius:6px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:grid;place-items:center;color:#fff;font-size:11px}
.stat{display:flex;gap:6px}
.go{padding:6px 12px;border-radius:9px;background:var(--accent);color:#fff;font-weight:600}
.go[disabled]{opacity:.6;cursor:default}
.x{color:var(--muted);font-size:16px;padding:2px 6px;border-radius:6px}.x:hover{background:var(--soft)}
`;

/** Floating fill bar so the user can fill without opening the popup. Shadow DOM keeps site CSS out. */
export function showPanel(c: { green: number; yellow: number; red: number }, onFill: () => number, doc: Document = document) {
  clearPanel(doc);
  const host = doc.createElement("div");
  host.id = PANEL;
  host.setAttribute(ATTR, "panel");
  const root = host.attachShadow({ mode: "open" });
  const style = doc.createElement("style");
  style.textContent = THEME + PANEL_CSS;
  const bar = doc.createElement("div");
  bar.className = "wrap bar";
  const brand = doc.createElement("div");
  brand.className = "brand";
  const logo = doc.createElement("span");
  logo.className = "logo";
  logo.textContent = "J";
  brand.append(logo, doc.createTextNode("JobFill"));
  const stat = doc.createElement("div");
  stat.className = "stat";
  for (const [cls, n, word] of [["green", c.green, "ready"], ["amber", c.yellow, "confirm"], ["red", c.red, "empty"]] as const) {
    const p = doc.createElement("span");
    p.className = `pill ${cls}`;
    p.textContent = `${n} ${word}`;
    stat.append(p);
  }
  const go = doc.createElement("button");
  go.type = "button";
  go.className = "go";
  go.textContent = "Autofill";
  go.addEventListener("click", () => { const n = onFill(); go.textContent = `Filled ${n}`; go.disabled = true; });
  const x = doc.createElement("button");
  x.type = "button";
  x.className = "x";
  x.textContent = "×";
  x.title = "Dismiss";
  x.addEventListener("click", () => host.remove());
  bar.append(brand, stat, go, x);
  root.append(style, bar);
  doc.body.appendChild(host);
}
