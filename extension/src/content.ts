import { scanFields, suggest, fillGreen, type Profile, type Suggestion } from "./index.js";
import { showSuggestions } from "./overlay.js";

type Msg = { type: "scan"; profile: Profile } | { type: "fill" };
const w = window as unknown as { __jobfill?: boolean };

// The popup may inject this file more than once (and into every frame); register one listener.
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
}
