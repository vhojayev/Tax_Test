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
