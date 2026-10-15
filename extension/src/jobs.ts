import { pickAdapter } from "./jobs/index.js";
import { JobsController, type Env } from "./jobs/controller.js";
import type { Msg, Prefs, Reply } from "./jobs/types.js";
import type { Profile } from "./profile.js";

const w = window as unknown as { __jobfillJobs?: boolean };
const log = (...a: unknown[]) => console.debug("[JobFill]", ...a);

/** After the extension is reloaded/updated, scripts already running in open tabs lose their connection and go quiet. */
function orphaned(e: unknown) {
  return /Extension context invalidated|context invalidated/i.test(String((e as Error)?.message ?? e));
}
function showRefreshNotice() {
  if (document.getElementById("jobfill-refresh")) return;
  const host = document.createElement("div");
  host.id = "jobfill-refresh";
  const root = host.attachShadow({ mode: "open" });
  const bar = document.createElement("div");
  bar.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#111827;color:#fff;padding:10px 14px;border-radius:12px;" +
    "font:13px ui-sans-serif,system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.3)";
  bar.textContent = "JobFill was updated. Refresh this page to turn it back on. ";
  const b = document.createElement("button");
  b.textContent = "Refresh";
  b.style.cssText = "margin-left:8px;padding:3px 10px;border-radius:8px;border:0;background:#6366f1;color:#fff;font:600 12px inherit;cursor:pointer";
  b.addEventListener("click", () => location.reload());
  bar.append(b);
  root.append(bar);
  document.body.appendChild(host);
}

const env: Env = {
  ask: async <T,>(msg: Msg) => {
    try { return (await chrome.runtime.sendMessage(msg)) as Reply<T>; }
    catch (e) { if (orphaned(e)) { showRefreshNotice(); return { ok: false, error: "JobFill was updated: refresh the page." } as Reply<T>; } throw e; }
  },
  load: async () => {
    const s = await chrome.storage.local.get(["profile", "prefs", "settings", "jobsEnabled"]);
    return { profile: s.profile as Profile | undefined, prefs: s.prefs as Partial<Prefs> | undefined, hasKey: !!(s.settings as { apiKey?: string } | undefined)?.apiKey };
  },
};

// Pages are single-page apps: the URL changes without a reload, so re-check the adapter each time.
if (!w.__jobfillJobs && window.top === window) {
  w.__jobfillJobs = true;
  let ctl: JobsController | undefined;
  let startError = "";

  const boot = async () => {
    try {
      const { jobsEnabled } = await chrome.storage.local.get("jobsEnabled");
      const adapter = pickAdapter(new URL(location.href));
      ctl?.stop();
      ctl = undefined;
      startError = "";
      if (!adapter || jobsEnabled === false) { log("idle:", !adapter ? "not a supported job page" : "turned off in popup", location.pathname); return; }
      ctl = new JobsController(document, () => new URL(location.href), adapter, env);
      await ctl.start();
      log(`running on ${adapter.name}`, ctl.status());
    } catch (e) {
      if (orphaned(e)) { showRefreshNotice(); return; }
      startError = String((e as Error)?.message ?? e);
      console.error("[JobFill] failed to start", e);
    }
  };
  void boot();

  let href = location.href;
  setInterval(() => { // SPA navigation (e.g. LinkedIn feed -> jobs) doesn't reload the page
    try {
      if (location.href === href) return;
      const was = !!pickAdapter(new URL(href)), now = !!pickAdapter(new URL(location.href));
      href = location.href;
      if (was !== now) void boot();
    } catch (e) { if (orphaned(e)) showRefreshNotice(); }
  }, 1000);

  // The popup asks this to show whether JobFill is active on the current tab.
  chrome.runtime.onMessage.addListener((msg: { type?: string }, _s, reply) => {
    if (msg?.type !== "jobs:status") return false;
    const adapter = pickAdapter(new URL(location.href));
    reply({ running: !!ctl, supported: !!adapter, site: adapter?.name, error: startError || undefined, ...(ctl ? ctl.status() : {}) });
    return false;
  });

  chrome.storage.onChanged.addListener((ch) => {
    try {
      if (ch.jobsEnabled) void boot();
      else if (ch.profile || ch.prefs || ch.settings) void ctl?.refresh();
    } catch (e) { if (orphaned(e)) showRefreshNotice(); }
  });
}
