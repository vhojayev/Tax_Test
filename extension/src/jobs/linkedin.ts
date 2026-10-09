import type { Adapter, JobCard, JobDetail } from "./types.js";
import { attr, blockText, clean, hash, pick } from "./dom.js";

/*
 * LinkedIn now ships scrambled class names, so the current layout is read through structure that does not change:
 *   card  = the role="button" ancestor of  <button aria-label="Dismiss <title> job">  (inside data-testid="lazy-column")
 *           its <p> children, in order: title, company, location, then benefits / "Posted ..." / "Easy Apply"
 *   panel = [data-sdui-screen*="JobDetails"], title link href /jobs/view/<id>/, #JobDetails_AboutTheJob_<id>
 * The previous class-based layout is kept as a fallback.
 */
const ps = (el: Element) => Array.from(el.querySelectorAll("p"));

/** A <p> often holds a visible span plus a screen-reader copy ("Posted 2 weeks ago" + "2 weeks ago"): keep the longer one. */
function rowText(p: Element): string {
  const spans = Array.from(p.children).filter((c) => c.tagName === "SPAN").map((c) => clean(c.textContent)).filter(Boolean);
  if (spans.length < 2) return clean(p.textContent);
  const kept: string[] = [];
  for (const t of spans) if (!kept.some((k) => k.includes(t))) kept.push(t);
  return kept.join(" ");
}

function sduiCards(doc: Document): JobCard[] {
  const out: JobCard[] = [];
  const seen = new Set<Element>();
  for (const btn of Array.from(doc.querySelectorAll<HTMLElement>('button[aria-label^="Dismiss "][aria-label$=" job"]'))) {
    const title = clean(btn.getAttribute("aria-label")!.slice("Dismiss ".length, -" job".length));
    const el = btn.closest<HTMLElement>('div[role="button"]');
    if (!title || !el || seen.has(el)) continue;
    seen.add(el);
    const rows = ps(el).map(rowText).filter(Boolean);
    const at = rows.findIndex((r) => r.startsWith(title));
    if (at < 0) continue;
    const company = rows[at + 1] ?? "";
    const location = rows[at + 2] ?? "";
    const rest = rows.slice(at + 3).filter((r) => r !== "·");
    out.push({
      id: hash(title + company), el, title, company, location,
      snippet: rest.join(" · "),
      sponsored: rest.some((r) => /^promoted$/i.test(r)),
    });
  }
  return out;
}

function legacyCards(doc: Document): JobCard[] {
  const all = Array.from(doc.querySelectorAll<HTMLElement>("li[data-occludable-job-id], div.job-card-container[data-job-id], li.scaffold-layout__list-item"));
  const nodes = all.filter((n) => !all.some((o) => o !== n && o.contains(n))); // outermost only
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
      id: hash(title + company), el, title: title.replace(/\s*with verification$/i, ""), company,
      location: pick(el, [".job-card-container__metadata-wrapper li", ".job-card-container__metadata-item", ".artdeco-entity-lockup__caption"]),
      snippet: pick(el, [".job-card-container__footer-wrapper", ".job-card-list__insight"]),
      sponsored: /\bpromoted\b/i.test(el.textContent ?? ""),
    });
  }
  return out;
}

function sduiDetail(doc: Document, url: URL): JobDetail | null {
  const root = doc.querySelector('[data-sdui-screen*="JobDetails"]');
  const about = root?.querySelector('[id^="JobDetails_AboutTheJob"]');
  if (!root || !about) return null;
  const box = about.querySelector('[data-testid="expandable-text-box"]') ?? about;
  const copy = box.cloneNode(true) as Element;
  copy.querySelectorAll("button").forEach((b) => b.remove()); // the "… more" toggle
  const titleLink = root.querySelector<HTMLAnchorElement>('a[href*="/jobs/view/"]');
  const company = Array.from(root.querySelectorAll('a[href*="/company/"]')).map((a) => clean(a.textContent)).find(Boolean) ?? "";
  const meta = ps(root).find((p) => /ago|applicant|clicked apply/i.test(p.textContent ?? "") && p.querySelector("span"));
  const poster = findPoster(root);
  return {
    id: titleLink?.getAttribute("href")?.match(/\/jobs\/view\/(\d+)/)?.[1] ?? about.id.match(/(\d+)$/)?.[1],
    title: clean(titleLink?.textContent), company,
    location: clean(meta?.querySelector("span")?.textContent),
    description: blockText(copy), poster, url: url.href,
  };
}

/** "Meet the hiring team": first profile link after that heading, if the section exists. */
function findPoster(root: Element): string | undefined {
  const heading = Array.from(root.querySelectorAll("h1,h2,h3,h4,p,span")).find((n) => /^meet the hiring team$/i.test(clean(n.textContent)));
  if (!heading) return undefined;
  let n: Element | null = heading;
  for (let i = 0; n && i < 6; i++, n = n.parentElement) {
    const a = n.querySelector<HTMLAnchorElement>('a[href*="/in/"]');
    if (a) return clean(a.textContent) || clean(a.getAttribute("aria-label")) || undefined;
  }
  return undefined;
}

function legacyDetail(doc: Document, url: URL): JobDetail | null {
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
}

export const linkedin: Adapter = {
  name: "linkedin",
  matches: (u) => /(^|\.)linkedin\.com$/.test(u.hostname) && u.pathname.startsWith("/jobs"),
  cards(doc) {
    const fresh = sduiCards(doc);
    return fresh.length ? fresh : legacyCards(doc);
  },
  detail(doc, url) {
    return sduiDetail(doc, url) ?? legacyDetail(doc, url);
  },
};
