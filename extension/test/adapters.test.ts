// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { indeed } from "../src/jobs/indeed.js";
import { linkedin } from "../src/jobs/linkedin.js";
import { google } from "../src/jobs/google.js";
import { pickAdapter } from "../src/jobs/index.js";

const load = (n: string) => { document.body.innerHTML = readFileSync(resolve(process.cwd(), `test/fixtures/${n}.html`), "utf8"); };

// NOTE: fixtures mirror the selectors the adapters assume; they cannot prove the live sites still match.
describe("adapters (against assumed markup)", () => {
  it("indeed: cards and detail", () => {
    load("indeed");
    const cards = indeed.cards(document);
    expect(cards.map((c) => [c.id, c.title, c.company, c.location])).toEqual([
      ["jk1", "Accounts Payable Specialist", "Globex Corp", "Remote"],
      ["jk2", "Forklift Operator", "Apex Systems", "Dallas, TX"],
      ["jk3", "AP Clerk", "Jooble", "Miami, FL"],
    ]);
    expect(cards[2].sponsored).toBe(true);
    const d = indeed.detail(document, new URL("https://www.indeed.com/jobs?q=ap&vjk=jk1"))!;
    expect(d).toMatchObject({ id: "jk1", title: "Accounts Payable Specialist", company: "Globex Corp" });
    expect(d.description).toContain("- Process invoices");
  });
  it("linkedin: cards, poster and detail", () => {
    load("linkedin");
    const cards = linkedin.cards(document);
    expect(cards.map((c) => [c.id, c.title, c.company])).toEqual([["111", "Accounts Payable Analyst", "Initech"], ["222", "Warehouse Associate", "Randstad USA"]]);
    expect(cards[0].sponsored).toBe(true);
    const d = linkedin.detail(document, new URL("https://www.linkedin.com/jobs/search/?currentJobId=111"))!;
    expect(d).toMatchObject({ id: "111", company: "Initech", poster: "Pat Lee" });
  });
  it("google: reads 'via' source separately from location", () => {
    load("google");
    const [a, b] = google.cards(document);
    expect(a).toMatchObject({ title: "Accounts Payable Specialist", company: "Hooli", location: "Remote", via: "ZipRecruiter" });
    expect(b.via).toBe("LinkedIn");
  });
  it("routes by URL", () => {
    expect(pickAdapter(new URL("https://www.indeed.com/jobs?q=x"))?.name).toBe("indeed");
    expect(pickAdapter(new URL("https://ca.indeed.com/viewjob?jk=1"))?.name).toBe("indeed");
    expect(pickAdapter(new URL("https://www.linkedin.com/jobs/search/"))?.name).toBe("linkedin");
    expect(pickAdapter(new URL("https://www.linkedin.com/feed/"))).toBeUndefined();
    expect(pickAdapter(new URL("https://www.google.com/search?q=ap+jobs&ibp=htl;jobs"))?.name).toBe("google-jobs");
    expect(pickAdapter(new URL("https://www.google.com/search?q=cats"))).toBeUndefined();
  });
});
