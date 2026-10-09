import type { Adapter, JobCard } from "./types.js";
import { attr, blockText, clean, hash, pick } from "./dom.js";

// Best-effort selectors (LinkedIn changes class names often); snapshot button helps repair them.
export const linkedin: Adapter = {
  name: "linkedin",
  matches: (u) => /(^|\.)linkedin\.com$/.test(u.hostname) && u.pathname.startsWith("/jobs"),
  cards(doc) {
    const all = Array.from(doc.querySelectorAll<HTMLElement>("li[data-occludable-job-id], div.job-card-container[data-job-id], li.scaffold-layout__list-item"));
    // The same listing can match at several nesting levels; keep only the outermost.
    const nodes = all.filter((n) => !all.some((o) => o !== n && o.contains(n)));
    const out: JobCard[] = [];
    const seen = new Set<string>();
    for (const el of nodes) {
      const title = pick(el, [".job-card-list__title--link strong", ".job-card-list__title--link", ".job-card-list__title", "a[href*='/jobs/view/']"]);
      if (!title) continue;
      const id = el.getAttribute("data-occludable-job-id") || el.getAttribute("data-job-id") || attr(el, ["[data-job-id]"], "data-job-id");
      const company = pick(el, [".artdeco-entity-lockup__subtitle span", ".job-card-container__primary-description", ".artdeco-entity-lockup__subtitle"]);
      const key = id || hash(title + company);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        id: key, el, title: title.replace(/\s*with verification$/i, ""), company,
        location: pick(el, [".job-card-container__metadata-wrapper li", ".job-card-container__metadata-item", ".artdeco-entity-lockup__caption"]),
        snippet: pick(el, [".job-card-container__footer-wrapper", ".job-card-list__insight"]),
        sponsored: /\bpromoted\b/i.test(el.textContent ?? ""),
      });
    }
    return out;
  },
  detail(doc, url) {
    const desc = doc.querySelector(".jobs-description__content, #job-details, .jobs-box__html-content, .jobs-description");
    if (!desc) return null;
    return {
      id: url.searchParams.get("currentJobId") ?? url.pathname.match(/\/jobs\/view\/(\d+)/)?.[1],
      title: pick(doc, [".job-details-jobs-unified-top-card__job-title h1", ".jobs-unified-top-card__job-title", "h1"]),
      company: pick(doc, [".job-details-jobs-unified-top-card__company-name", ".jobs-unified-top-card__company-name", ".artdeco-entity-lockup__subtitle"]),
      location: pick(doc, [".job-details-jobs-unified-top-card__primary-description-container .tvm__text", ".jobs-unified-top-card__bullet"]),
      description: blockText(desc),
      poster: clean(doc.querySelector(".hirer-card__hirer-information .jobs-poster__name, .hirer-card__hirer-information a")?.textContent) || undefined,
      url: url.href,
    };
  },
};
