// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JobsController, type Env } from "../src/jobs/controller.js";
import { indeed } from "../src/jobs/indeed.js";
import { linkedin } from "../src/jobs/linkedin.js";
import type { Msg } from "../src/jobs/types.js";

const profile = { basics: { name: "J" }, work: [{ position: "Accounts Payable" }], skills: [{ name: "Accounting", keywords: ["NetSuite", "invoice coding"] }] };
const deep = { score: 88, verdict: "strong", summary: "Solid AP fit.", strengths: [{ point: "AP experience", evidence: "5y AP" }], gaps: ["No SAP"], deal_breakers: [], red_flags: [], employer_type: "recruiter", employer_reason: "says our client" };
const intelData = { known: true, confidence: "high", what_they_do: "Makes widgets.", size_hint: "~900 staff", hq: "Austin", pros: ["Strong benefits"], cons: ["Slow promotions"], reputation: "" };
const page = (n: string) => { document.body.innerHTML = readFileSync(resolve(process.cwd(), `test/fixtures/${n}.html`), "utf8"); };
const chip = (el: Element) => (el.querySelector("[data-jobfill-chip]") as HTMLElement).shadowRoot!.textContent ?? "";
const panelText = () => document.getElementById("jobfill-job-panel")?.shadowRoot?.textContent ?? "";

function env(over: Partial<{ hasKey: boolean; hasProfile: boolean; ask: Env["ask"] }> = {}): Env & { ask: ReturnType<typeof vi.fn> } {
  const ask = vi.fn(over.ask ?? (async (m: Msg) =>
    m.type === "ai:cards"
      ? { ok: true, data: m.cards.map((c) => ({ id: c.id, score: /payable|ap /i.test(c.title) ? 91 : 8, reason: "ai" })) }
      : m.type === "ai:company"
        ? { ok: true, data: intelData }
        : { ok: true, data: deep, model: "m" })) as Env["ask"] & ReturnType<typeof vi.fn>;
  return { ask: ask as any, load: async () => ({ profile: over.hasProfile === false ? undefined : (profile as any), prefs: {}, hasKey: over.hasKey ?? true }) } as any;
}
const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };

beforeEach(() => vi.useFakeTimers());
afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ""; });

describe("JobsController on Indeed-like page", () => {
  it("marks recruiter/aggregator cards outright and lights up strong ones", async () => {
    page("indeed");
    const e = env({ hasKey: false });                       // quick scores only, no API
    const c = new JobsController(document, () => new URL("https://www.indeed.com/jobs?vjk=jk1"), indeed, e);
    await c.start();
    const cards = indeed.cards(document);
    expect(chip(cards[1].el)).toContain("RECRUITER");       // Apex Systems
    expect(chip(cards[2].el)).toContain("AGGREGATOR");      // Jooble
    expect(chip(cards[0].el)).not.toMatch(/RECRUITER|AGGREGATOR/);
    expect(cards[0].el.style.boxShadow).toContain("#10b981"); // strong: green glow (quick estimate)
    expect(cards[1].el.style.boxShadow).toContain("#dc2626"); // recruiter: red edge
    const kids = Array.from(cards[1].el.children) as HTMLElement[];
    expect(kids.filter((k) => !k.hasAttribute("data-jobfill-chip")).every((k) => k.style.opacity === "0.45")).toBe(true); // weak: content dimmed
    expect((cards[1].el.querySelector("[data-jobfill-chip]") as HTMLElement).style.opacity).toBe("");                     // ...but the RECRUITER tag is not
    expect(e.ask).not.toHaveBeenCalled();
    c.stop();
  });

  it("replaces estimates with AI scores in one batched call, and shows the deep result for the open job", async () => {
    page("indeed");
    const e = env();
    const c = new JobsController(document, () => new URL("https://www.indeed.com/jobs?vjk=jk1"), indeed, e);
    await c.start();
    await flush();
    const cardCalls = e.ask.mock.calls.filter((a) => a[0].type === "ai:cards");
    expect(cardCalls).toHaveLength(1);
    expect(cardCalls[0][0].cards).toHaveLength(3);
    const [first, , third] = indeed.cards(document);
    expect(chip(first.el)).toContain("88");   // open job: card adopts the deeper full-description score
    expect(chip(third.el)).toContain("91");   // other cards: batch AI score
    expect(chip(first.el)).not.toContain("est.");
    expect(panelText()).toContain("Solid AP fit.");
    expect(panelText()).toContain("RECRUITER");              // description says staffing firm + AI agrees
    expect(panelText()).toContain("AP experience");
    c.stop();
  });

  it("fetches company intel for the open job and shows it in the panel", async () => {
    page("indeed");
    const e = env();
    const c = new JobsController(document, () => new URL("https://www.indeed.com/jobs?vjk=jk1"), indeed, e);
    await c.start(); await flush();
    expect(e.ask.mock.calls.filter((a) => a[0].type === "ai:company")).toHaveLength(1);
    expect(panelText()).toContain("Strong benefits");
    expect(panelText()).toContain("Slow promotions");
    c.stop();
  });

  it("shows a company hover card with pros and cons, requested once", async () => {
    page("indeed");
    const e = env();
    const c = new JobsController(document, () => new URL("https://www.indeed.com/jobs"), indeed, e);
    await c.start(); await flush();
    const name = document.querySelector("[data-jobfill-hover]") as HTMLElement;
    expect(name).toBeTruthy();
    name.dispatchEvent(new Event("mouseenter"));
    vi.advanceTimersByTime(400); await flush();
    const card = document.getElementById("jobfill-hovercard")?.shadowRoot?.textContent ?? "";
    expect(card).toContain("Strong benefits");
    name.dispatchEvent(new Event("mouseleave"));
    vi.advanceTimersByTime(300);
    expect(document.getElementById("jobfill-hovercard")).toBeNull();
    c.stop();
  });

  it("does not hammer the API when it fails, and tells the user why", async () => {
    page("indeed");
    const e = env({ ask: async () => ({ ok: false, error: "Anthropic rejected the API key (401)." }) });
    const c = new JobsController(document, () => new URL("https://www.indeed.com/jobs"), indeed, e);
    await c.start(); await flush();
    const before = e.ask.mock.calls.length;
    await c.tick(); await c.tick(); await flush();
    expect(e.ask.mock.calls.length).toBe(before);
    expect(panelText()).toContain("401");
    c.stop();
  });

  it("asks for a profile when none is imported", async () => {
    page("indeed");
    const c = new JobsController(document, () => new URL("https://www.indeed.com/jobs"), indeed, env({ hasProfile: false }));
    await c.start();
    expect(panelText()).toContain("Import your profile");
    c.stop();
  });

  it("stop() restores the page", async () => {
    page("indeed");
    const c = new JobsController(document, () => new URL("https://www.indeed.com/jobs"), indeed, env({ hasKey: false }));
    await c.start();
    c.stop();
    expect(document.querySelectorAll("[data-jobfill-chip]")).toHaveLength(0);
    expect(document.getElementById("jobfill-job-panel")).toBeNull();
    expect(indeed.cards(document)[0].el.style.boxShadow).toBe("");
  });

  it("hides recruiters when asked", async () => {
    page("indeed");
    const e = env({ hasKey: false });
    e.load = async () => ({ profile: profile as any, prefs: { hideRecruiters: true }, hasKey: false });
    const c = new JobsController(document, () => new URL("https://www.indeed.com/jobs"), indeed, e);
    await c.start();
    const cards = indeed.cards(document);
    expect(cards[1].el.style.display).toBe("none");
    expect(cards[2].el.style.display).toBe("none");
    expect(cards[0].el.style.display).not.toBe("none");
    c.stop();
  });
});

describe("JobsController on LinkedIn-like page", () => {
  it("flags the staffing company and shows who posted the job", async () => {
    page("linkedin");
    const c = new JobsController(document, () => new URL("https://www.linkedin.com/jobs/search/?currentJobId=111"), linkedin, env());
    await c.start(); await flush();
    expect(chip(linkedin.cards(document)[1].el)).toContain("RECRUITER"); // Randstad USA
    expect(panelText()).toContain("posted by Pat Lee");
    c.stop();
  });
});
