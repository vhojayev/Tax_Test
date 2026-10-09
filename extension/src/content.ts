import { scanFields, suggest, fillGreen, type Profile, type Suggestion } from "./index.js";
import { showSuggestions } from "./overlay.js";
import { startAuto } from "./auto.js";

type Msg = { type: "scan"; profile: Profile } | { type: "fill" };
const w = window as unknown as { __jobfill?: boolean };

// May be injected more than once (declared content script + popup); set up only once per frame.
if (!w.__jobfill) {
  w.__jobfill = true;
  let last: Suggestion[] = [];

  chrome.runtime.onMessage.addListener((msg: Msg, _sender, reply) => {
    if (msg.type === "scan") {
      last = suggest(scanFields(document), msg.profile);
      showSuggestions(last);
      const count = (t: string) => last.filter((s) => s.tier === t).length;
      reply({ total: last.length, green: count("green"), yellow: count("yellow"), red: count("red") });
    } else if (msg.type === "fill") {
      reply({ filled: fillGreen(last) });
    }
    return false;
  });

  // Automatic mode: run on page load if enabled and a profile exists.
  let stop: (() => void) | undefined;
  const sync = async () => {
    const { profile, autoScan } = await chrome.storage.local.get(["profile", "autoScan"]);
    stop?.();
    stop = undefined;
    if (profile && autoScan !== false) stop = startAuto(profile as Profile);
  };
  sync();
  chrome.storage.onChanged.addListener(() => void sync()); // profile imported / toggle flipped
}
