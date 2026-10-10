import { THEME } from "./theme.js";
import { INTEL_CSS, renderIntel } from "./intel.js";
import type { IntelView } from "../jobs/types.js";

const ID = "jobfill-hovercard";
let hideTimer: ReturnType<typeof setTimeout> | undefined;

const CSS = `
.card{position:fixed;width:320px;max-height:60vh;overflow:auto;background:var(--bg);border:1px solid var(--line);border-radius:14px;
  box-shadow:var(--shadow);padding:12px 14px;z-index:2147483647}
h4{margin:0 0 8px;font-size:13px}
.alert{padding:8px 10px;border-radius:10px;font-weight:600}
`;

/** Floating company card anchored under (or above) the hovered name. Stays open while the pointer is on it. */
export function showHoverCard(doc: Document, anchor: Element, company: string, view: IntelView) {
  clearTimeout(hideTimer);
  let host = doc.getElementById(ID);
  if (!host) {
    host = doc.createElement("div");
    host.id = ID;
    host.attachShadow({ mode: "open" });
    host.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    host.addEventListener("mouseleave", () => hideHoverCard(doc, 150));
    doc.body.appendChild(host);
  }
  const root = host.shadowRoot!;
  root.replaceChildren();
  const style = doc.createElement("style");
  style.textContent = THEME + INTEL_CSS + CSS;
  const wrap = doc.createElement("div");
  wrap.className = "wrap";
  const card = doc.createElement("div");
  card.className = "card";
  const h = doc.createElement("h4");
  h.textContent = company;
  card.append(h, renderIntel(doc, view));
  wrap.append(card);
  root.append(style, wrap);

  const r = anchor.getBoundingClientRect();
  const vw = doc.documentElement.clientWidth, vh = doc.documentElement.clientHeight;
  card.style.left = `${Math.max(8, Math.min(r.left, vw - 336))}px`;
  if (r.bottom + 260 > vh && r.top > 260) { card.style.bottom = `${vh - r.top + 6}px`; } else { card.style.top = `${r.bottom + 6}px`; }
}

export function hideHoverCard(doc: Document, delay = 0) {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => doc.getElementById(ID)?.remove(), delay);
}
