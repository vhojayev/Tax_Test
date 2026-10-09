import type { Adapter, JobCard, JobDetail } from "./types.js";
import { blockText, clean, hash } from "./dom.js";

/*
 * Google Jobs (observed layout): every result is  div[data-share-url]  holding
 *   - a header  div[role=button]  with exactly three <div>s: title, company, "City • via Source"
 *   - stat chips (span[aria-label^="Posted"], "Employment Type ...")
 *   - <template id=<data-preview-id>>  with the FULL posting: highlights, responsibilities and the list of
 *     "Apply on X" / "Apply directly on Y" links. Reading the template means no click is needed to score a result.
 * The selected job is shown as  [role=group][aria-label^="Job details for"]  (not yet verified from a real snapshot).
 */
interface Parsed { description: string; applyOptions: string[] }

function parseDetailNode(root: ParentNode): Parsed {
  const copy = (root as Element | DocumentFragment).cloneNode(true) as Element | DocumentFragment;
  copy.querySelectorAll("script,style,svg,button").forEach((n) => n.remove());
  const applyOptions = Array.from(copy.querySelectorAll("a"))
    .map((a) => clean(a.textContent))
    .filter((t) => /^apply (directly )?on\s/i.test(t));
  const text = blockText(copy);
  const at = text.search(/job highlights/i);
  return { description: (at >= 0 ? text.slice(at) : text).slice(0, 12000), applyOptions };
}

function header(card: Element): Element | undefined {
  return Array.from(card.querySelectorAll('div[role="button"]')).find((b) => {
    const kids = Array.from(b.children).filter((c) => c.tagName === "DIV");
    return kids.length === 3 && kids.every((k) => clean(k.textContent));
  });
}

export const google: Adapter = {
  name: "google-jobs",
  matches: (u) => /(^|\.)google\.[a-z.]+$/.test(u.hostname) && u.pathname === "/search",
  cards(doc) {
    const out: JobCard[] = [];
    for (const el of Array.from(doc.querySelectorAll<HTMLElement>("div[data-share-url]"))) {
      const h = header(el);
      if (!h) continue;
      const [title, company, meta] = Array.from(h.children).filter((c) => c.tagName === "DIV").map((c) => clean(c.textContent));
      // "City • via Source": tolerate any separator (or a mangled one) by splitting on the word "via".
      const viaAt = meta.search(/\bvia\s/i);
      const via = viaAt >= 0 ? meta.slice(viaAt).replace(/^via\s+/i, "").trim() : undefined;
      const location = (viaAt >= 0 ? meta.slice(0, viaAt) : meta).replace(/\s*â€¢\s*$/, "").replace(/[^\p{L}\p{N})\]]+$/u, "").trim();
      const previewId = el.querySelector("[data-preview-id]")?.getAttribute("data-preview-id") ?? "";
      const tpl = previewId ? (doc.getElementById(previewId) as HTMLTemplateElement | null) : null;
      const parsed = tpl?.content ? parseDetailNode(tpl.content) : undefined;
      const chips = Array.from(el.querySelectorAll("[aria-label]")).map((n) => clean(n.getAttribute("aria-label"))).filter((l) => /^(Posted|Employment Type)/.test(l));
      out.push({
        id: previewId || hash(title + company + location), el, title, company, location,
        via,
        snippet: [chips.join(", "), parsed?.description.slice(0, 500)].filter(Boolean).join(" · "),
        applyOptions: parsed?.applyOptions,
      });
    }
    return out;
  },
  detail(doc, url): JobDetail | null {
    const pane = doc.querySelector('[role="group"][aria-label^="Job details for"]');
    if (!pane) return null;
    const title = clean(pane.getAttribute("data-title")) || clean(pane.getAttribute("aria-label")).replace(/^Job details for\s*/i, "");
    const meta = Array.from(pane.querySelectorAll("div,span")).map((n) => clean(n.textContent)).find((t) => / · /.test(t) && /via /i.test(t) && t.length < 160) ?? "";
    const [company, location, via] = meta.split(" · ");
    const parsed = parseDetailNode(pane);
    return { id: hash(title + company), title, company: company ?? "", location: location ?? "", via: via?.replace(/^via\s+/i, ""), description: parsed.description, applyOptions: parsed.applyOptions, url: url.href };
  },
};
