import { THEME } from "./theme.js";
import type { Employer } from "../jobs/types.js";
import { tierOf } from "../jobs/quick.js";

export const CHIP_ATTR = "data-jobfill-chip";

export interface ChipState {
  score: number;
  ai: boolean;                  // true once the AI score replaced the quick estimate
  reason?: string;
  employer: Employer;
  via?: string;
  sponsored?: boolean;
  pending?: boolean;            // AI request in flight
}

const TIER_CLASS = { strong: "green", possible: "amber", weak: "" } as const;
const TIER_WORD = { strong: "Strong", possible: "Possible", weak: "Weak" } as const;

function pill(doc: Document, cls: string, text: string, title?: string) {
  const s = doc.createElement("span");
  s.className = `pill ${cls}`;
  if (title) s.title = title;
  s.textContent = text;
  return s;
}

/** Compact status row pinned to the bottom-right of a listing card. */
export function renderChip(doc: Document, card: HTMLElement, st: ChipState) {
  let host = card.querySelector<HTMLElement>(`[${CHIP_ATTR}]`);
  if (!host) {
    host = doc.createElement("div");
    host.setAttribute(CHIP_ATTR, "1");
    host.style.cssText = "position:absolute;right:10px;bottom:8px;z-index:6;pointer-events:none;";
    if (getComputedStyle(card).position === "static") card.style.position = "relative";
    host.attachShadow({ mode: "open" });
    card.appendChild(host);
  }
  const root = host.shadowRoot!;
  root.replaceChildren();
  const style = doc.createElement("style");
  style.textContent = THEME;
  const wrap = doc.createElement("div");
  wrap.className = "wrap row";
  wrap.style.cssText = "justify-content:flex-end";

  const tier = tierOf(st.score);
  const score = pill(doc, TIER_CLASS[tier], "", `${st.ai ? "AI score" : "Quick estimate"}${st.reason ? `: ${st.reason}` : ""}`);
  const dot = doc.createElement("i");
  dot.className = "dot";
  score.append(dot, doc.createTextNode(`${st.score} ${TIER_WORD[tier]}${st.ai ? "" : st.pending ? " · scoring…" : " · est."}`));
  wrap.append(score);

  const e = st.employer;
  if (e.type === "recruiter") wrap.append(pill(doc, "red", "RECRUITER", e.reasons.join("; ")));
  else if (e.type === "aggregator") wrap.append(pill(doc, "violet", st.via ? `AGGREGATOR · via ${st.via}` : "AGGREGATOR", e.reasons.join("; ")));
  else if (e.type === "unclear" && e.reasons.length) wrap.append(pill(doc, "amber", "Employer unclear", e.reasons.join("; ")));
  if (st.sponsored) wrap.append(pill(doc, "", "Sponsored"));

  root.append(style, wrap);
}

export function clearChip(card: HTMLElement) {
  card.querySelector(`[${CHIP_ATTR}]`)?.remove();
}
