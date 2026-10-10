import type { Profile } from "../profile.js";
import { hash } from "./dom.js";
import { companyIntel, makeClient, scoreCards, scoreDeep, type LlmClient } from "./llm.js";
import { DEFAULT_PREFS, DEFAULT_SETTINGS, type CardResult, type CompanyIntel, type DeepResult, type Msg, type Prefs, type Reply, type Settings } from "./types.js";

export interface Store { get(keys: string[]): Promise<Record<string, any>>; set(v: Record<string, any>): Promise<void> }

const CACHE_MAX = 400;

/** Runs in the service worker so the API key never enters a web page's context. */
export async function handle(msg: Msg, store: Store, clientFor: (key: string) => LlmClient = makeClient): Promise<Reply<CardResult[] | DeepResult | CompanyIntel>> {
  const s = await store.get(["settings", "profile", "prefs", "cache"]);
  const settings: Settings = { ...DEFAULT_SETTINGS, ...(s.settings ?? {}) };
  const prefs: Prefs = { ...DEFAULT_PREFS, ...(s.prefs ?? {}) };
  const profile: Profile | undefined = s.profile;
  if (!settings.apiKey) return { ok: false, error: "Add your Anthropic API key in JobFill settings." };
  if (msg.type === "ai:company") { // about the company, not the user: needs no profile
    try { return await intel(msg, settings, settings.intelModel, s.cache ?? {}, store, clientFor(settings.apiKey)); } catch (e) { return { ok: false, error: friendly(e) }; }
  }
  if (!profile) return { ok: false, error: "Import your profile JSON first." };

  const model = msg.type === "ai:cards" ? settings.listModel : settings.deepModel;
  const fingerprint = hash(JSON.stringify([profile, prefs, model]));
  const cache: Record<string, unknown> = s.cache ?? {};
  const client = clientFor(settings.apiKey);

  try {
    if (msg.type === "ai:cards") {
      // Cache per card so scrolling back and forth costs nothing.
      const key = (c: (typeof msg.cards)[number]) => `c:${fingerprint}:${hash(c.id + c.title + c.company)}`;
      const results: CardResult[] = [];
      const todo = msg.cards.filter((c) => {
        const hitv = cache[key(c)] as CardResult | undefined;
        if (hitv) { results.push({ ...hitv, id: c.id }); return false; }
        return true;
      });
      if (todo.length) {
        const fresh = await scoreCards(client, model, profile, prefs, todo);
        for (const r of fresh) {
          const c = todo.find((x) => x.id === r.id)!;
          cache[key(c)] = r;
          results.push(r);
        }
        await store.set({ cache: trim(cache) });
      }
      return { ok: true, data: results, cached: todo.length === 0, model };
    }
    const k = `d:${fingerprint}:${hash(msg.detail.title + msg.detail.company + msg.detail.description)}`;
    const hitv = msg.fresh ? undefined : (cache[k] as DeepResult | undefined);
    if (hitv) return { ok: true, data: hitv, cached: true, model };
    const data = await scoreDeep(client, model, profile, prefs, msg.detail);
    cache[k] = data;
    await store.set({ cache: trim(cache) });
    return { ok: true, data, model };
  } catch (e) {
    return { ok: false, error: friendly(e) };
  }
}

const normCo = (x: string) => x.toLowerCase().replace(/\s+/g, " ").trim();

/** A company briefing is about the company, not the user: cached by company name, no profile involved. */
async function intel(msg: Extract<Msg, { type: "ai:company" }>, settings: Settings, model: string, cache: Record<string, unknown>, store: Store, client: LlmClient): Promise<Reply<CompanyIntel>> {
  const k = `i:${model}:${settings.intelWeb ? "w" : "k"}:${normCo(msg.company)}`;
  const hitv = msg.fresh ? undefined : (cache[k] as CompanyIntel | undefined);
  if (hitv) return { ok: true, data: hitv, cached: true, model };
  const data = await companyIntel(client, model, msg.company, msg.hint, settings.intelWeb);
  cache[k] = data;
  await store.set({ cache: trim(cache) });
  return { ok: true, data, model };
}

function trim(c: Record<string, unknown>) {
  const keys = Object.keys(c);
  for (const k of keys.slice(0, Math.max(0, keys.length - CACHE_MAX))) delete c[k];
  return c;
}

function friendly(e: unknown): string {
  const err = e as { status?: number; message?: string };
  if (err.status === 401) return "Anthropic rejected the API key (401). Check it in settings.";
  if (err.status === 404) return "Model not found for your account. Pick another model in settings.";
  if (err.status === 429) return "Rate limited by Anthropic. Try again in a moment.";
  if (err.status === 400) return `Request rejected (400): ${err.message ?? ""}`.slice(0, 200);
  return (err.message ?? "Scoring failed").slice(0, 200);
}
