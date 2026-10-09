import type { Adapter, JobCard } from "./types.js";
import { attr, blockText, clean, hash, pick } from "./dom.js";

// Selectors are best-effort from Indeed's layout and WILL drift; use the popup's snapshot button to fix.
export const indeed: Adapter = {
  name: "indeed",
  matches: (u) => /(^|\.)indeed\./.test(u.hostname),
  cards(doc) {
    const nodes = Array.from(doc.querySelectorAll<HTMLElement>("div.job_seen_beacon, li div.cardOutline, [data-testid='slider_item']"));
    const seen = new Set<HTMLElement>();
    const out: JobCard[] = [];
    for (const el of nodes) {
      const card = (el.closest("li") as HTMLElement | null) ?? el;
      if (seen.has(card)) continue;
      seen.add(card);
      const title = pick(card, ["h2.jobTitle span[title]", "h2.jobTitle a span", "h2.jobTitle", "a.jcs-JobTitle"]);
      if (!title) continue;
      const jk = attr(card, ["a[data-jk]", "[data-jk]"], "data-jk");
      const company = pick(card, ["[data-testid='company-name']", ".companyName"]);
      out.push({
        id: jk || hash(title + company), el: card, title, company,
        location: pick(card, ["[data-testid='text-location']", ".companyLocation"]),
        snippet: pick(card, [".job-snippet", "[class*='underShelfFooter'] ul", "ul"]),
        sponsored: !!card.querySelector(".sponsoredJob, [data-testid='sponsored-label']") || /^sponsored$/i.test(pick(card, [".sponsoredGray", ".new"])),
      });
    }
    return out;
  },
  detail(doc, url) {
    const desc = doc.querySelector("#jobDescriptionText");
    if (!desc) return null;
    const title = pick(doc, [".jobsearch-JobInfoHeader-title", "h1[data-testid='jobsearch-JobInfoHeader-title']", "h1"]).replace(/\s*-\s*job post$/i, "");
    return {
      id: url.searchParams.get("vjk") ?? url.searchParams.get("jk") ?? undefined,
      title,
      company: pick(doc, ["[data-testid='inlineHeader-companyName']", "[data-company-name='true']", ".jobsearch-CompanyInfoContainer a"]),
      location: pick(doc, ["[data-testid='inlineHeader-companyLocation']", "[data-testid='job-location']"]),
      description: blockText(desc),
      url: url.href,
    };
  },
};
