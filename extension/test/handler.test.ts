import { describe, expect, it, vi } from "vitest";
import { handle, type Store } from "../src/jobs/handler.js";
import type { LlmClient } from "../src/jobs/llm.js";

const mem = (init: Record<string, any>): Store & { data: Record<string, any> } => {
  const data = { ...init };
  return { data, get: async (k) => Object.fromEntries(k.map((x) => [x, data[x]])), set: async (v) => void Object.assign(data, v) };
};
const profile = { basics: { name: "Jane", email: "j@x.com" }, work: [{ name: "Acme", position: "Accountant" }] };
const fake = (parsed: unknown, extra: object = {}) => {
  const parse = vi.fn().mockResolvedValue({ stop_reason: "end_turn", parsed_output: parsed, ...extra });
  return { client: { messages: { parse } } as unknown as LlmClient, parse };
};
const cards = [{ id: "a", title: "AP Specialist", company: "X", location: "Remote", snippet: "invoices" }, { id: "b", title: "Welder", company: "Y", location: "TX", snippet: "" }];

describe("handler", () => {
  it("asks for a key / profile first", async () => {
    expect(await handle({ type: "ai:cards", cards }, mem({ profile }))).toMatchObject({ ok: false, error: expect.stringContaining("API key") });
    expect(await handle({ type: "ai:cards", cards }, mem({ settings: { apiKey: "k" } }))).toMatchObject({ ok: false, error: expect.stringContaining("profile") });
  });

  it("scores cards with the list model, drops unknown ids, clamps, and never sends contact details", async () => {
    const { client, parse } = fake({ results: [{ id: "a", score: 130, reason: "good" }, { id: "zzz", score: 50, reason: "?" }, { id: "b", score: 5, reason: "no" }] });
    const store = mem({ settings: { apiKey: "k" }, profile });
    const r = await handle({ type: "ai:cards", cards }, store, () => client);
    expect(r).toMatchObject({ ok: true, model: "claude-haiku-5-5" });
    expect((r as any).data).toEqual([{ id: "a", score: 100, reason: "good" }, { id: "b", score: 5, reason: "no" }]);
    const sent = JSON.stringify(parse.mock.calls[0][0].messages);
    expect(sent).not.toContain("j@x.com");
    expect(sent).not.toContain("Jane");
    expect(sent).toContain("Accountant");
  });

  it("serves repeat cards from cache without another API call", async () => {
    const { client, parse } = fake({ results: [{ id: "a", score: 80, reason: "r" }, { id: "b", score: 20, reason: "r" }] });
    const store = mem({ settings: { apiKey: "k" }, profile });
    await handle({ type: "ai:cards", cards }, store, () => client);
    const again = await handle({ type: "ai:cards", cards }, store, () => client);
    expect(parse).toHaveBeenCalledTimes(1);
    expect(again).toMatchObject({ ok: true, cached: true });
  });

  it("deep-scores with the deep model and caches", async () => {
    const deep = { score: 82, verdict: "strong", summary: "s", strengths: [{ point: "AP", evidence: "5y AP" }], gaps: [], deal_breakers: [], red_flags: [], employer_type: "recruiter", employer_reason: "our client" };
    const { client, parse } = fake(deep);
    const store = mem({ settings: { apiKey: "k" }, profile });
    const msg = { type: "ai:deep" as const, detail: { title: "AP", company: "Y", location: "", description: "d", url: "u" } };
    const r = await handle(msg, store, () => client);
    expect(r).toMatchObject({ ok: true, model: "claude-opus-5-5", data: { score: 82, employer_type: "recruiter" } });
    await handle(msg, store, () => client);
    expect(parse).toHaveBeenCalledTimes(1);
  });

  it("maps API failures to readable messages", async () => {
    const parse = vi.fn().mockRejectedValue(Object.assign(new Error("x"), { status: 401 }));
    const r = await handle({ type: "ai:cards", cards }, mem({ settings: { apiKey: "k" }, profile }), () => ({ messages: { parse } }) as unknown as LlmClient);
    expect(r).toMatchObject({ ok: false, error: expect.stringContaining("401") });
  });

  it("reports refusals and truncation", async () => {
    const { client } = fake(null, { stop_reason: "refusal", stop_details: { category: "cyber" } });
    const r = await handle({ type: "ai:cards", cards }, mem({ settings: { apiKey: "k" }, profile }), () => client);
    expect(r).toMatchObject({ ok: false, error: expect.stringContaining("declined") });
  });
});
