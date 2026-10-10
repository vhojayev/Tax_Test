import type { Profile } from "./profile.js";
import { DEFAULT_PREFS, DEFAULT_SETTINGS, type Prefs, type Settings } from "./jobs/types.js";
import { snapshotPage } from "./snapshot.js";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const store = chrome.storage.local;

let toastTimer: ReturnType<typeof setTimeout> | undefined;
function toast(t: string) {
  const el = $("toast");
  el.textContent = t;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 4000);
}

// ---- tabs
document.querySelectorAll<HTMLButtonElement>(".tab").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("on", x === b));
    document.querySelectorAll("main section").forEach((s) => ((s as HTMLElement).hidden = s.id !== b.dataset.tab));
  }));

// ---- preferences (auto-saved). Keys live in storage: prefs.* plus the flags jobsEnabled / autoScan.
const FLAGS = new Set(["jobsEnabled", "autoScan"]);
const fields = Array.from(document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-pref]"));

async function loadPrefs() {
  const s = await store.get(["prefs", "jobsEnabled", "autoScan"]);
  const prefs: Prefs = { ...DEFAULT_PREFS, ...(s.prefs ?? {}) };
  for (const f of fields) {
    const k = f.dataset.pref!;
    const v = FLAGS.has(k) ? s[k] !== false : (prefs as unknown as Record<string, unknown>)[k];
    if (f instanceof HTMLInputElement && f.type === "checkbox") f.checked = !!v;
    else f.value = String(v ?? "");
  }
}
let saveTimer: ReturnType<typeof setTimeout> | undefined;
fields.forEach((f) => f.addEventListener("input", () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const cur = { ...DEFAULT_PREFS, ...((await store.get("prefs")).prefs ?? {}) } as Record<string, unknown>;
    const flags: Record<string, boolean> = {};
    for (const x of fields) {
      const k = x.dataset.pref!;
      const v = x instanceof HTMLInputElement && x.type === "checkbox" ? x.checked : x.value;
      if (FLAGS.has(k)) flags[k] = v as boolean; else cur[k] = v;
    }
    await store.set({ prefs: cur, ...flags });
  }, 300);
}));

// ---- settings: key + models
async function loadSettings() {
  const s: Settings = { ...DEFAULT_SETTINGS, ...((await store.get("settings")).settings ?? {}) };
  $<HTMLInputElement>("key").value = s.apiKey;
  $<HTMLSelectElement>("deepModel").value = s.deepModel;
  $<HTMLSelectElement>("listModel").value = s.listModel;
  $<HTMLInputElement>("intelWeb").checked = s.intelWeb;
}
const readSettings = (): Settings => ({
  apiKey: $<HTMLInputElement>("key").value.trim(),
  deepModel: $<HTMLSelectElement>("deepModel").value,
  listModel: $<HTMLSelectElement>("listModel").value,
  intelWeb: $<HTMLInputElement>("intelWeb").checked,
});
$("reveal").addEventListener("click", () => {
  const k = $<HTMLInputElement>("key");
  k.type = k.type === "password" ? "text" : "password";
  $("reveal").textContent = k.type === "password" ? "Show" : "Hide";
});
$("save-key").addEventListener("click", async () => { await store.set({ settings: readSettings() }); toast("Saved."); status(); });
$("test-key").addEventListener("click", async () => {
  const s = readSettings();
  if (!s.apiKey) return toast("Paste your API key first.");
  await store.set({ settings: s });
  toast("Testing…");
  const r = await chrome.runtime.sendMessage({ type: "ai:ping", settings: s });
  toast(r?.ok ? "Key works for both models." : r?.error ?? "Test failed.");
});

// ---- profile
async function status() {
  const s = await store.get(["settings", "profile"]);
  const key = !!(s.settings as Settings | undefined)?.apiKey, prof = s.profile as Profile | undefined;
  const set = (id: string, ok: boolean, text: string) => { const e = $(id); e.className = `pill ${ok ? "ok" : "no"}`; e.textContent = text; };
  set("s-key", key, key ? "Key ✓" : "No key");
  set("s-prof", !!prof, prof ? "Profile ✓" : "No profile");
  $("profile").textContent = prof?.basics?.name ? `Loaded: ${prof.basics.name}` : "No profile loaded.";
}
$("import").addEventListener("click", () => $<HTMLInputElement>("file").click());
$<HTMLInputElement>("file").addEventListener("change", async (e) => {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  try {
    const p = JSON.parse(await f.text());
    if (typeof p !== "object" || !p?.basics) throw new Error("not a JSON Resume (missing basics)");
    await store.set({ profile: p });
    toast("Profile imported.");
    status();
  } catch (err) { toast(`Import failed: ${(err as Error).message}`); }
});

// ---- autofill (manual scan / fill / per-site enable)
async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No active tab");
  return tab;
}
/** Inject into every frame (ATS forms are often in iframes), then message each frame. */
async function send(msg: object): Promise<any[]> {
  const tabId = (await activeTab()).id!;
  await chrome.scripting.executeScript({ target: { tabId, allFrames: true }, files: ["content.js"] });
  const frames = (await chrome.webNavigation?.getAllFrames?.({ tabId })) ?? [{ frameId: 0 }];
  const out: any[] = [];
  for (const f of frames) { try { out.push(await chrome.tabs.sendMessage(tabId, msg, { frameId: f.frameId })); } catch { /* no listener in this frame */ } }
  return out.filter(Boolean);
}
const sum = (rs: any[], k: string) => rs.reduce((a, r) => a + (r[k] ?? 0), 0);

$("scan").addEventListener("click", async () => {
  const profile = (await store.get("profile")).profile;
  if (!profile) return toast("Import a profile first (Setup tab).");
  try {
    const rs = await send({ type: "scan", profile });
    toast(`${sum(rs, "total")} fields: ${sum(rs, "green")} ready, ${sum(rs, "yellow")} to confirm, ${sum(rs, "red")} empty.`);
  } catch (err) { toast(`Can't run on this page: ${(err as Error).message}`); }
});
$("fill-btn").addEventListener("click", async () => {
  try { toast(`Filled ${sum(await send({ type: "fill" }), "filled")} fields.`); }
  catch (err) { toast(`Can't run on this page: ${(err as Error).message}`); }
});
$("site").addEventListener("click", async () => {
  try {
    const url = new URL((await activeTab()).url ?? "");
    if (!/^https?:$/.test(url.protocol)) return toast("Can't enable on this page.");
    const pattern = `${url.origin}/*`;
    if (!(await chrome.permissions.request({ origins: [pattern] }))) return toast("Permission not granted.");
    const id = `jobfill-${url.origin}`;
    if (!(await chrome.scripting.getRegisteredContentScripts({ ids: [id] })).length)
      await chrome.scripting.registerContentScripts([{ id, matches: [pattern], js: ["content.js"], allFrames: true, runAt: "document_idle", persistAcrossSessions: true }]);
    toast(`Enabled on ${url.host}. Reload the page.`);
  } catch (err) { toast(`Failed: ${(err as Error).message}`); }
});

// ---- troubleshooting snapshot
$("snap").addEventListener("click", async () => {
  try {
    const tab = await activeTab();
    const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id! }, func: snapshotPage });
    const blob = new Blob([String(res.result ?? "")], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `jobfill-snapshot-${new URL(tab.url!).hostname}.html`;
    a.click();
    toast("Snapshot downloaded.");
  } catch (err) { toast(`Snapshot failed: ${(err as Error).message}`); }
});

void Promise.all([loadPrefs(), loadSettings(), status()]);
