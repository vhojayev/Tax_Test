import type { Profile } from "./profile.js";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const status = (t: string) => ($("status").textContent = t);

async function loadProfile(): Promise<Profile | null> {
  const { profile } = await chrome.storage.local.get("profile");
  return (profile as Profile) ?? null;
}
async function renderProfile() {
  const p = await loadProfile();
  $("profile").textContent = p?.basics?.name ? `Profile: ${p.basics.name}` : "No profile loaded.";
}

async function activeTabId(): Promise<number> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No active tab");
  return tab.id;
}

/** Inject into every frame (ATS forms are often in iframes), then message each frame. */
async function send(msg: object): Promise<any[]> {
  const tabId = await activeTabId();
  await chrome.scripting.executeScript({ target: { tabId, allFrames: true }, files: ["content.js"] });
  const frames = (await chrome.webNavigation?.getAllFrames?.({ tabId })) ?? [{ frameId: 0 }];
  const out: any[] = [];
  for (const f of frames) {
    try { out.push(await chrome.tabs.sendMessage(tabId, msg, { frameId: f.frameId })); } catch { /* frame without listener */ }
  }
  return out.filter(Boolean);
}
const sum = (rs: any[], k: string) => rs.reduce((a, r) => a + (r[k] ?? 0), 0);

$("import").addEventListener("click", () => $<HTMLInputElement>("file").click());
$<HTMLInputElement>("file").addEventListener("change", async (e) => {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  try {
    const p = JSON.parse(await f.text());
    if (typeof p !== "object" || !p?.basics) throw new Error("not a JSON Resume (missing basics)");
    await chrome.storage.local.set({ profile: p });
    status("Profile imported.");
    async function renderAuto() {
  const { autoScan } = await chrome.storage.local.get("autoScan");
  $<HTMLInputElement>("auto").checked = autoScan !== false;
}
$<HTMLInputElement>("auto").addEventListener("change", (e) =>
  chrome.storage.local.set({ autoScan: (e.target as HTMLInputElement).checked }));

// Grant access to the current site only, then register the content script there permanently.
$("site").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab?.url ?? "");
    if (!/^https?:$/.test(url.protocol)) return status("Can't enable on this page.");
    const pattern = `${url.origin}/*`;
    if (!(await chrome.permissions.request({ origins: [pattern] }))) return status("Permission not granted.");
    const id = `jobfill-${url.origin}`;
    const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [id] });
    if (!existing.length)
      await chrome.scripting.registerContentScripts([{ id, matches: [pattern], js: ["content.js"], allFrames: true, runAt: "document_idle", persistAcrossSessions: true }]);
    status(`Enabled on ${url.host}. Reload the page.`);
  } catch (err) { status(`Failed: ${(err as Error).message}`); }
});

renderAuto();
renderProfile();
  } catch (err) { status(`Import failed: ${(err as Error).message}`); }
});

$("scan").addEventListener("click", async () => {
  const profile = await loadProfile();
  if (!profile) return status("Import a profile first.");
  try {
    const rs = await send({ type: "scan", profile });
    status(`${sum(rs, "total")} fields: ${sum(rs, "green")} green, ${sum(rs, "yellow")} yellow, ${sum(rs, "red")} red.`);
  } catch (err) { status(`Can't run on this page: ${(err as Error).message}`); }
});

$("fill").addEventListener("click", async () => {
  try { status(`Filled ${sum(await send({ type: "fill" }), "filled")} fields.`); }
  catch (err) { status(`Can't run on this page: ${(err as Error).message}`); }
});

async function renderAuto() {
  const { autoScan } = await chrome.storage.local.get("autoScan");
  $<HTMLInputElement>("auto").checked = autoScan !== false;
}
$<HTMLInputElement>("auto").addEventListener("change", (e) =>
  chrome.storage.local.set({ autoScan: (e.target as HTMLInputElement).checked }));

// Grant access to the current site only, then register the content script there permanently.
$("site").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab?.url ?? "");
    if (!/^https?:$/.test(url.protocol)) return status("Can't enable on this page.");
    const pattern = `${url.origin}/*`;
    if (!(await chrome.permissions.request({ origins: [pattern] }))) return status("Permission not granted.");
    const id = `jobfill-${url.origin}`;
    const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [id] });
    if (!existing.length)
      await chrome.scripting.registerContentScripts([{ id, matches: [pattern], js: ["content.js"], allFrames: true, runAt: "document_idle", persistAcrossSessions: true }]);
    status(`Enabled on ${url.host}. Reload the page.`);
  } catch (err) { status(`Failed: ${(err as Error).message}`); }
});

renderAuto();
renderProfile();
