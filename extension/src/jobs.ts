import { pickAdapter } from "./jobs/index.js";
import { JobsController, type Env } from "./jobs/controller.js";
import type { Msg, Prefs, Reply } from "./jobs/types.js";
import type { Profile } from "./profile.js";

const w = window as unknown as { __jobfillJobs?: boolean };

const env: Env = {
  ask: <T,>(msg: Msg) => chrome.runtime.sendMessage(msg) as Promise<Reply<T>>,
  load: async () => {
    const s = await chrome.storage.local.get(["profile", "prefs", "settings", "jobsEnabled"]);
    return { profile: s.profile as Profile | undefined, prefs: s.prefs as Partial<Prefs> | undefined, hasKey: !!(s.settings as { apiKey?: string } | undefined)?.apiKey };
  },
};

// Pages are single-page apps: the URL changes without a reload, so re-check the adapter each time.
if (!w.__jobfillJobs && window.top === window) {
  w.__jobfillJobs = true;
  let ctl: JobsController | undefined;
  const boot = async () => {
    const { jobsEnabled } = await chrome.storage.local.get("jobsEnabled");
    const adapter = pickAdapter(new URL(location.href));
    ctl?.stop();
    ctl = undefined;
    if (!adapter || jobsEnabled === false) return;
    ctl = new JobsController(document, () => new URL(location.href), adapter, env);
    await ctl.start();
  };
  void boot();
  let href = location.href;
  setInterval(() => { // SPA navigation (e.g. LinkedIn feed -> jobs) doesn't reload the page
    if (location.href === href) return;
    const was = !!pickAdapter(new URL(href)), now = !!pickAdapter(new URL(location.href));
    href = location.href;
    if (was !== now) void boot();
  }, 1000);
  chrome.storage.onChanged.addListener((ch) => {
    if (ch.jobsEnabled) void boot();
    else if (ch.profile || ch.prefs || ch.settings) void ctl?.refresh();
  });
}
