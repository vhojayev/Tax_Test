import type { Adapter, JobCard } from "./types.js";
import { blockText, clean, hash, pick } from "./dom.js";

// Google Jobs uses obfuscated classes that rotate; these are the ones last seen. Expect to repair.
const CARD = "li.iFjolb, div.iFjolb, [data-ved] li[jsname][role='treeitem'], li[role='treeitem']";

export const google: Adapter = {
  name: "google-jobs",
  matches: (u) => /(^|\.)google\.[a-z.]+$/.test(u.hostname) && u.pathname === "/search" && /jobs/.test(u.search + u.hash),
  cards(doc) {
    const out: JobCard[] = [];
    for (const el of Array.from(doc.querySelectorAll<HTMLElement>(CARD))) {
      const title = pick(el, [".BjJfJf", "[role='heading']", "h2", "h3"]);
      if (!title) continue;
      const company = pick(el, [".vNEEBe", ".nJlQNd"]);
      const meta = Array.from(el.querySelectorAll(".Qk80Jf")).map((n) => clean(n.textContent));
      const via = meta.find((m) => /^via\s/i.test(m))?.replace(/^via\s+/i, "");
      out.push({
        id: hash(title + company + (meta[0] ?? "")), el, title, company,
        location: meta.find((m) => !/^via\s/i.test(m)) ?? "",
        snippet: pick(el, [".YgLbBe", ".HBvzbc"]),
        via,
      });
    }
    return out;
  },
  detail(doc, url) {
    const desc = doc.querySelector(".HBvzbc, [jsname='Gdbofe'], .YgLbBe");
    if (!desc) return null;
    const title = pick(doc, [".KLsYvd", ".sH3zFd", "h2"]);
    const company = pick(doc, [".nDpwKe", ".wHYlTd"]);
    const via = Array.from(doc.querySelectorAll(".pMhGee, .Qk80Jf")).map((n) => clean(n.textContent)).find((t) => /^via\s/i.test(t))?.replace(/^via\s+/i, "");
    return { id: hash(title + company), title, company, location: pick(doc, [".Qk80Jf"]), description: blockText(desc), via, url: url.href };
  },
};
