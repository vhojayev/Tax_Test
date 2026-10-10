import type { Profile } from "../profile.js";
import type { Adapter, CardResult, CompanyIntel, DeepResult, IntelView, JobCard, Msg, Prefs, Reply } from "./types.js";
import { DEFAULT_PREFS } from "./types.js";
import { classifyEmployer } from "./employer.js";
import { quickScore, tierOf } from "./quick.js";
import { clearChip, renderChip } from "../ui/chip.js";
import { clearJobPanel, renderJobPanel } from "../ui/jobpanel.js";
import { findLeaf, hash } from "./dom.js";
import { hideHoverCard, showHoverCard } from "../ui/hovercard.js";

export interface Env {
  ask<T>(msg: Msg): Promise<Reply<T>>;
  load(): Promise<{ profile?: Profile; prefs?: Partial<Prefs>; hasKey: boolean }>;
}

const norm = (x: string) => x.toLowerCase().replace(/\s+/g, " ").trim();
const BATCH = 20;
const TICK_MS = 400;

const HOVER_MS = 350;
type Hint = { title?: string; location?: string; via?: string };
type HoverCtx = Hint & { company: string };

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
  private intelCache = new Map<string, Promise<IntelView>>();   // per company, so hover and panel share one request
  private hoverCtx = new WeakMap<HTMLElement, HoverCtx>();
  private hoverTimer?: ReturnType<typeof setTimeout>;

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
    hideHoverCard(this.doc);
    clearTimeout(this.hoverTimer);
    for (const e of Array.from(this.doc.querySelectorAll("[data-jobfill-hover]"))) e.removeAttribute("data-jobfill-hover");
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
    this.intelCache.clear();
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
      const employer = classifyEmployer({ company: c.company, via: c.via, title: c.title, text: c.snippet, sponsored: c.sponsored, applyOptions: c.applyOptions }, this.prefs);
      renderChip(this.doc, c.el, {
        score, ai: !!st.ai, reason: st.ai?.reason ?? st.quick.reason, employer, via: c.via, sponsored: c.sponsored,
        pending: !!st.pending,
      });
      this.style(c.el, tierOf(score), employer.type);
      this.wireHover(c);
    }
  }

  /** Company briefing for a name: one request per company; failures are not cached. */
  private intel(company: string, hint: Hint): Promise<IntelView> {
    const k = norm(company);
    let p = this.intelCache.get(k);
    if (!p) {
      const t0 = Date.now();
      p = this.env.ask<CompanyIntel>({ type: "ai:company", company, hint: { title: hint.title, location: hint.location, via: hint.via } })
        .then((r): IntelView => (console.debug(`[JobFill] company info ${Date.now() - t0}ms`, r.ok ? r.model : r.error), r.ok ? { state: "ok", intel: r.data, model: r.model } : { state: "error", message: r.error }));
      this.intelCache.set(k, p);
      void p.then((v) => { if (v.state === "error") this.intelCache.delete(k); });
    }
    return p;
  }

  /** Hover the company name on a card for a quick pros/cons briefing. */
  private wireHover(c: JobCard) {
    if (!this.hasKey || !c.company) return;
    const target = findLeaf(c.el, c.company);
    if (!target) return;
    this.hoverCtx.set(target, { company: c.company, title: c.title, location: c.location, via: c.via });
    if (target.hasAttribute("data-jobfill-hover")) return;
    target.setAttribute("data-jobfill-hover", "1");
    target.style.cursor = "help";
    target.style.textDecoration = "underline dotted";
    target.addEventListener("mouseenter", () => {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = setTimeout(() => {
        const ctx = this.hoverCtx.get(target)!;
        showHoverCard(this.doc, target, ctx.company, { state: "loading" });
        void this.intel(ctx.company, ctx).then((v) => { if (this.doc.getElementById("jobfill-hovercard")) showHoverCard(this.doc, target, ctx.company, v); });
      }, HOVER_MS);
    });
    target.addEventListener("mouseleave", () => { clearTimeout(this.hoverTimer); hideHoverCard(this.doc, 200); });
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
    const t0 = Date.now();
    const r = await this.env.ask<CardResult[]>({
      type: "ai:cards",
      cards: todo.map((c) => ({ id: c.id, title: c.title, company: c.company, location: c.location, snippet: c.snippet.slice(0, 600), via: c.via, applyOptions: c.applyOptions })),
    });
    for (const c of todo) this.cards.get(c.id)!.pending = false;
    console.debug(`[JobFill] ${todo.length} cards scored in ${Date.now() - t0}ms`);
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
    // More unscored cards than one batch holds: keep going without waiting for a page change.
    else if (found.some((c) => { const st = this.cards.get(c.id); return st && !st.ai && !this.failed.has(c.id); })) this.schedule();
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
    const employer = classifyEmployer({ company: d.company, via: d.via, title: d.title, text: d.description, applyOptions: d.applyOptions }, this.prefs);
    if (!this.hasKey) {
      renderJobPanel(this.doc, { kind: "setup", message: "Add your Anthropic API key in the JobFill popup to score this job." });
      return;
    }
    renderJobPanel(this.doc, { kind: "loading", title: d.title, company: d.company, employer });
    const retry = () => { void this.rescore(); };
    const intelP = d.company ? this.intel(d.company, d) : undefined;   // starts now, in parallel with the deep score
    const t0 = Date.now();
    const r = await this.env.ask<DeepResult>({ type: "ai:deep", detail: d, fresh: force });
    const ms = Date.now() - t0;
    console.debug(`[JobFill] deep score ${ms}ms`, r.ok ? { model: r.model, cached: r.cached } : r.error);
    if (this.detailSig !== sig) return; // user moved to another job meanwhile
    const paint = (intel?: IntelView) => renderJobPanel(this.doc, r.ok
      ? { kind: "result", title: d.title, company: d.company, poster: d.poster, via: d.via, result: r.data, employer, model: r.model, cached: r.cached, ms, intel, onRetry: retry }
      : { kind: "error", title: d.title, message: r.error, onRetry: retry });
    paint(intelP ? { state: "loading" } : undefined);
    if (r.ok && intelP) void intelP.then((v) => { if (this.detailSig === sig) paint(v); });
    // A deep result is better than the card estimate for this listing: reflect it on the card too.
    if (r.ok) {
      const same = this.adapter.cards(this.doc).find((c) => norm(c.title) === norm(d.title) && norm(c.company) === norm(d.company));
      const st = same && this.cards.get(same.id);
      if (st) { st.ai = { id: same!.id, score: r.data.score, reason: r.data.summary }; void this.tick(); }
    }
  }

  private async rescore() { this.detailSig = ""; await this.syncDetail(true); }
}
