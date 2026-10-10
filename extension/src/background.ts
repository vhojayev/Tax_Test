import Anthropic from "@anthropic-ai/sdk";
import { handle, type Store } from "./jobs/handler.js";
import type { Msg, Settings } from "./jobs/types.js";

const store: Store = {
  get: (keys) => chrome.storage.local.get(keys),
  set: (v) => chrome.storage.local.set(v),
};

/** Cheap key check: looking up a model costs no tokens and proves both the key and the model id. */
async function ping(settings: Settings): Promise<{ ok: boolean; error?: string }> {
  const client = new Anthropic({ apiKey: settings.apiKey, dangerouslyAllowBrowser: true });
  try {
    for (const m of new Set([settings.deepModel, settings.listModel, settings.intelModel])) await client.models.retrieve(m);
    return { ok: true };
  } catch (e) {
    const err = e as { status?: number; message?: string };
    if (err.status === 401) return { ok: false, error: "Anthropic rejected the key (401)." };
    if (err.status === 404) return { ok: false, error: "That model isn't available to your key. Pick another." };
    return { ok: false, error: (err.message ?? "Test failed").slice(0, 160) };
  }
}

chrome.runtime.onMessage.addListener((msg: Msg | { type: "ai:ping"; settings: Settings }, _sender, send) => {
  if (msg?.type === "ai:ping") { void ping(msg.settings).then(send); return true; }
  if (msg?.type !== "ai:cards" && msg?.type !== "ai:deep" && msg?.type !== "ai:company" && msg?.type !== "ai:headline") return false;
  handle(msg, store).then(send);
  return true; // async reply
});
