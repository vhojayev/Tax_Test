import { scanFields, suggest, fillGreen, type Profile, type Suggestion } from "./index.js";
import { clearOverlay, showSuggestions, showPanel, clearPanel } from "./overlay.js";

/** Heuristic: an application form has several recognisable personal-info fields. Login, search and
 *  newsletter forms fall short (password/search fields are skipped or unrecognised, <3 matches). */
export function looksLikeApplication(all: Suggestion[]): boolean {
  const keys = new Set(all.map((s) => s.key).filter((k): k is string => !!k));
  const identity = keys.has("email") || keys.has("first_name") || keys.has("full_name");
  return keys.size >= 3 && identity;
}

const DEBOUNCE_MS = 600;

/** Scan now and keep rescanning when new fields appear (SPA steps, lazy-loaded forms).
 *  Returns a stop() function. Fill stays manual: only the panel/badge clicks fill. */
export function startAuto(profile: Profile, doc: Document = document): () => void {
  let last: Suggestion[] = [];
  let signature = "";
  let timer: ReturnType<typeof setTimeout> | undefined;
  let observer: MutationObserver | undefined;

  const run = () => {
    const fields = scanFields(doc);
    const sig = fields.map((f) => `${f.type}:${f.name}:${f.id}`).join("|");
    if (sig === signature) return; // same fields: don't redraw (also stops our own badges re-triggering us)
    signature = sig;
    observer?.disconnect(); // our DOM edits below must not wake the observer
    last = suggest(fields, profile);
    if (looksLikeApplication(last)) {
      showSuggestions(last, doc);
      const n = (t: string) => last.filter((s) => s.tier === t).length;
      showPanel({ green: n("green"), yellow: n("yellow"), red: n("red") }, () => fillGreen(last), doc);
    } else {
      clearOverlay(doc);
      clearPanel(doc);
    }
    observe();
  };
  const observe = () => observer?.observe(doc.body, { childList: true, subtree: true });
  const schedule = () => { clearTimeout(timer); timer = setTimeout(run, DEBOUNCE_MS); };

  observer = new MutationObserver((muts) => {
    // Ignore changes that are only our own badges/panel.
    const ours = (n: Node) => n instanceof Element && n.hasAttribute("data-jobfill");
    if (muts.every((m) => [...m.addedNodes, ...m.removedNodes].every(ours))) return;
    schedule();
  });
  run();
  observe();
  return () => { clearTimeout(timer); observer?.disconnect(); clearOverlay(doc); clearPanel(doc); };
}
