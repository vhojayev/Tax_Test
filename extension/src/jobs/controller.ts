import type { Profile } from "../profile.js";
import type { Adapter, CardResult, DeepResult, JobCard, Msg, Prefs, Reply } from "./types.js";
import { DEFAULT_PREFS } from "./types.js";
import { classifyEmployer } from "./employer.js";
import { quickScore, tierOf } from "./quick.js";
import { clearChip, renderChip } from "../ui/chip.js";
import { clearJobPanel, renderJobPanel } from "../ui/jobpanel.js";
import { hash } from "./dom.js";

export interface Env {
  ask<T>(msg: Msg): Promise<Reply<T>>;
  load(): Promise<{ profile?: Profile; prefs?: Partial<Prefs>; hasKey: boolean }>;
}

const BATCH = 20;
const TICK_MS = 400;

interface CardState { quick: { score: number; reason: string }; ai?: CardResult; pending?: boolean }

/** Watches a job-board page: marks every listing card, scores them, and keeps the detail panel in sync. */
export class JobsController {
  private profile?: Profile;
  private prefs: Prefs = DEFAULT_PREFS;
  private hasKey = false;
  private cards = new Map<string, CardState>();
  private failed = new Set<string>();        // card ids whose batch failed: don't retry in a loop
  private detailSig = "";
  private obs?: MutationObserver;
  private timer?: ReturnType<typeof setTimeout>;
  private styled = new WeakMap<HTMLElement, { shadow: string; radius: string; display: string }>();
  private listError = "";

  constructor(private doc: Document, private url: () => URL, private adapter: Adapter, private env: Env) {}

  async start() {
    await this.reload();
    this.obs = new MutationObserver((muts) => {
      const ours = (n: Node) => n instanceof Element && (n.hasAttribute("data-jobfill-chip") || n.id === "jobfill-job-panel");
      if (muts.every((m) => [...m.addedNodes, ...m.removedNodes].every(ours))) return;
      this.schedule();
    });
    this.obs.observe(this.doc.body, { childList: true, subtree: true });
    await this.tick();
  }

  stop() {
    clearTimeout(this.timer);
    this.obs?.disconnect();
    for (const c of this.adapter.cards(this.doc)) { clearChip(c.el); this.unstyle(c.el); }
    clearJobPanel(this.doc);
  }

  /** Call after profile / prefs / key change. */
  async reload() {
    const s = await this.env.load();
    this.profile = s.profile;
    this.prefs = { ...DEFAULT_PREFS, ...(s.prefs ?? {}) };
    this.hasKey = s.hasKey;
    this.cards.clear();
    this.failed.clear();
    this.detailSig = "";
    this.listError = "";
  }
  async refresh() { await this.reload(); await this.tick(); }

  private schedule() { clearTimeout(this.timer); this.timer = setTimeout(() => void this.tick(), TICK_MS); }

  async tick() {
    if (!this.profile) { this.paintSetup("Import your profile JSON from the JobFill popup to start scoring."); return; }
    this.obs?.disconnect(); // our own DOM edits must not retrigger us
    try {
      const found = this.adapter.cards(this.doc);
      for (const c of found) this.ensure(c);
      this.paintAll(found);
      if (this.prefs.aiListings && this.hasKey) void this.scoreBatch(found);
      await this.syncDetail();
    } finally {
      this.obs?.observe(this.doc.body, { childList: true, subtree: true });
    }
  }

  private ensure(c: JobCard) {
    if (!this.cards.has(c.id)) this.cards.set(c.id, { quick: quickScore(c, this.profile!, this.prefs) });
  }

  private paintAll(found: JobCard[]) {
    for (const c of found) {
      const st = this.cards.get(c.id)!;
      const score = st.ai?.score ?? st.quick.score;
      const employer = classifyEmployer({ company: c.company, via: c.via, title: c.title, text: c.snippet, sponsored: c.sponsored }, this.prefs);
      renderChip(this.doc, c.el, {
        score, ai: !!st.ai, reason: st.ai?.reason ?? st.quick.reason, employer, via: c.via, sponsored: c.sponsored,
        pending: !!st.pending,
      });
      this.style(c.el, tierOf(score), employer.type);
    }
  }

  /** Light up the listing itself: glow for strong, ring for possible, dim for weak, edge colour for recruiter/aggregator.
   *  Dimming applies to the card's content only: the chip (and its RECRUITER/AGGREGATOR tags) stays at full strength. */
  private style(el: HTMLElement, tier: "strong" | "possible" | "weak", emp: string) {
    if (!this.styled.has(el)) this.styled.set(el, { shadow: el.style.boxShadow, radius: el.style.borderRadius, display: el.style.display });
    const edge = emp === "recruiter" ? "inset 5px 0 0 #dc2626" : emp === "aggregator" ? "inset 5px 0 0 #7c3aed" : "";
    const glow = tier === "strong" ? "0 0 0 2px #10b981, 0 0 18px rgba(16,185,129,.45)" : tier === "possible" ? "0 0 0 2px #f59e0b" : "";
    el.style.boxShadow = [glow, edge].filter(Boolean).join(", ");
    el.style.borderRadius = glow ? "10px" : this.styled.get(el)!.radius;
    const dim = tier === "weak" && this.prefs.dimWeak;
    for (const child of Array.from(el.children) as HTMLElement[]) {
      if (child.hasAttribute("data-jobfill-chip")) continue;
      child.style.opacity = dim ? "0.45" : "";
    }
    const hide = this.prefs.hideRecruiters && (emp === "recruiter" || emp === "aggregator");
    el.style.display = hide ? "none" : this.styled.get(el)!.display;
  }

  private unstyle(el: HTMLElement) {
    const o = this.styled.get(el);
    if (!o) return;
    el.style.boxShadow = o.shadow; el.style.borderRadius = o.radius; el.style.display = o.display;
    for (const child of Array.from(el.children) as HTMLElement[]) child.style.opacity = "";
  }

  private async scoreBatch(found: JobCard[]) {
    const todo = found.filter((c) => { const s = this.cards.get(c.id)!; return !s.ai && !s.pending && !this.failed.has(c.id); }).slice(0, BATCH);
    if (!todo.length) return;
    todo.forEach((c) => (this.cards.get(c.id)!.pending = true));
    this.paintAll(found);
    const r = await this.env.ask<CardResult[]>({
      type: "ai:cards",
      cards: todo.map((c) => ({ id: c.id, title: c.title, company: c.company, location: c.location, snippet: c.snippet.slice(0, 400), via: c.via })),
    });
    for (const c of todo) this.cards.get(c.id)!.pending = false;
    if (r.ok) {
      for (const res of r.data) { const s = this.cards.get(res.id); if (s) s.ai = res; }
      this.listError = "";
    } else {
      todo.forEach((c) => this.failed.add(c.id));
      this.listError = r.error;
    }
    this.obs?.disconnect();
    this.paintAll(this.adapter.cards(this.doc));
    this.obs?.observe(this.doc.body, { childList: true, subtree: true });
    if (!r.ok) this.paintSetup(r.error);
  }

  private paintSetup(message: string) {
    if (!this.adapter.detail(this.doc, this.url()) && !this.listError && this.profile) return;
    renderJobPanel(this.doc, { kind: "setup", message });
  }

  private async syncDetail(force = false) {
    const d = this.adapter.detail(this.doc, this.url());
    if (!d || d.description.length < 120) return;
    const sig = hash(d.title + d.company + d.description.slice(0, 200));
    if (sig === this.detailSig && !force) return;
    this.detailSig = sig;
    const employer = classifyEmployer({ company: d.company, via: d.via, title: d.title, text: d.description }, this.prefs);
    if (!this.hasKey) {
      renderJobPanel(this.doc, { kind: "setup", message: "Add your Anthropic API key in the JobFill popup to score this job." });
      return;
    }
    renderJobPanel(this.doc, { kind: "loading", title: d.title, company: d.company, employer });
    const retry = () => { void this.rescore(); };
    const r = await this.env.ask<DeepResult>({ type: "ai:deep", detail: d, fresh: force });
    if (this.detailSig !== sig) return; // user moved to another job meanwhile
    renderJobPanel(this.doc, r.ok
      ? { kind: "result", title: d.title, company: d.company, poster: d.poster, via: d.via, result: r.data, employer, model: r.model, cached: r.cached, onRetry: retry }
      : { kind: "error", title: d.title, message: r.error, onRetry: retry });
    // A deep result is better than the card estimate for this listing: reflect it on the card too.
    if (r.ok && d.id) { const s = this.cards.get(d.id); if (s) { s.ai = { id: d.id, score: r.data.score, reason: r.data.summary }; this.tick(); } }
  }

  private async rescore() { this.detailSig = ""; await this.syncDetail(true); }
}
