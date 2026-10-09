import type { Profile } from "../profile.js";
import type { JobCard, Prefs } from "./types.js";

const STOP = new Set("a an and the of for to in at on with or & - senior sr jr junior lead i ii iii iv remote hybrid full time part".split(" "));
const tokens = (s: string) => s.toLowerCase().split(/[^a-z0-9+#]+/).filter((t) => t.length > 1 && !STOP.has(t));
const split = (s: string) => s.split(/\n|,|;/).map((x) => x.trim()).filter(Boolean);

export function profileTerms(p: Profile, prefs: Prefs) {
  const titles = [...split(prefs.targetTitles), ...(p.work ?? []).map((w) => w.position ?? "")].filter(Boolean);
  const skills = ((p as { skills?: { name?: string; keywords?: string[] }[] }).skills ?? []).flatMap((s) => [s.name ?? "", ...(s.keywords ?? [])]).filter(Boolean);
  return { titleTokens: new Set(titles.flatMap(tokens)), skillPhrases: skills.map((s) => s.toLowerCase()) };
}

/** Free, instant 0-100 estimate from the card alone. The AI score replaces it when available. */
export function quickScore(card: Pick<JobCard, "title" | "location" | "snippet">, p: Profile, prefs: Prefs): { score: number; reason: string } {
  const { titleTokens, skillPhrases } = profileTerms(p, prefs);
  const text = `${card.title} ${card.snippet}`.toLowerCase();

  for (const d of split(prefs.dealBreakers)) {
    const key = d.toLowerCase();
    if (key.length > 2 && text.includes(key)) return { score: 10, reason: `matches your deal-breaker "${d}"` };
  }

  const t = tokens(card.title);
  const titleHit = t.length ? t.filter((x) => titleTokens.has(x)).length / t.length : 0;
  const skillHits = skillPhrases.filter((s) => s.length > 2 && text.includes(s)).length;
  let loc = 0.6;
  const where = `${card.location} ${card.title}`.toLowerCase();
  if (prefs.remoteOnly) loc = /remote/.test(where) ? 1 : 0;
  else if (split(prefs.locations).length) loc = split(prefs.locations).some((l) => where.includes(l.toLowerCase())) || /remote/.test(where) ? 1 : 0.3;

  const score = Math.round(100 * (0.55 * Math.min(1, titleHit * 1.4) + 0.3 * Math.min(1, skillHits / 3) + 0.15 * loc));
  const bits = [titleHit > 0 ? "title overlap" : "title unlike yours", skillHits ? `${skillHits} skill match${skillHits > 1 ? "es" : ""}` : "no skill words"];
  return { score, reason: bits.join(", ") };
}

export const tierOf = (score: number) => (score >= 75 ? "strong" : score >= 55 ? "possible" : "weak") as "strong" | "possible" | "weak";
