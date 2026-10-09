import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { Profile } from "../profile.js";
import type { CardResult, DeepResult, JobDetail, Prefs } from "./types.js";

export type LlmClient = Pick<Anthropic, "messages">;
export const makeClient = (apiKey: string): LlmClient => new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

const CardsSchema = z.object({ results: z.array(z.object({ id: z.string(), score: z.number(), reason: z.string() })) });
const DeepSchema = z.object({
  score: z.number(),
  verdict: z.enum(["strong", "good", "stretch", "weak"]),
  summary: z.string(),
  strengths: z.array(z.object({ point: z.string(), evidence: z.string() })),
  gaps: z.array(z.string()),
  deal_breakers: z.array(z.string()),
  red_flags: z.array(z.string()),
  employer_type: z.enum(["direct", "recruiter", "aggregator", "unclear"]),
  employer_reason: z.string(),
});

/** What the model may see about the user. No name, email or phone: scoring doesn't need them. */
export function matchingProfile(p: Profile & { skills?: unknown; languages?: unknown }) {
  return {
    headline: p.basics?.label, summary: p.basics?.summary,
    location: [p.basics?.location?.city, p.basics?.location?.region, p.basics?.location?.countryCode].filter(Boolean).join(", "),
    work: (p.work as { name?: string; position?: string; startDate?: string; endDate?: string; highlights?: string[] }[] | undefined)?.map((w) => ({
      company: w.name, position: w.position, from: w.startDate, to: w.endDate ?? "present", highlights: w.highlights,
    })),
    education: p.education, skills: p.skills, languages: p.languages,
    answers: p.extras, // e.g. work authorization, if the user saved it
  };
}

const prefsText = (x: Prefs) =>
  [x.targetTitles && `Target roles: ${x.targetTitles}`, x.locations && `Locations: ${x.locations}`, x.remoteOnly && "Remote only",
   x.minSalary && `Minimum salary: ${x.minSalary}`, x.dealBreakers && `Deal-breakers:\n${x.dealBreakers}`].filter(Boolean).join("\n") || "none stated";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(Number.isFinite(n) ? n : 0)));

export async function scoreCards(
  client: LlmClient, model: string, profile: Profile, prefs: Prefs,
  cards: { id: string; title: string; company: string; location: string; snippet: string; via?: string }[],
): Promise<CardResult[]> {
  const res = await client.messages.parse({
    model, max_tokens: 4000,
    system: "You rate how well job listings fit a candidate, from the listing card only (title, company, location, snippet). " +
      "Score 0-100: 80+ strong fit, 55-79 possible, below 55 weak. Judge role, seniority, skills and stated preferences. " +
      "Return exactly one result per listing id, with a reason of at most 12 words. Do not invent details missing from the card.",
    messages: [{ role: "user", content: `Candidate:\n${JSON.stringify(matchingProfile(profile))}\n\nPreferences:\n${prefsText(prefs)}\n\nListings:\n${JSON.stringify(cards)}` }],
    output_config: { effort: "low", format: zodOutputFormat(CardsSchema) },
  });
  guard(res);
  const ids = new Set(cards.map((c) => c.id));
  return res.parsed_output!.results.filter((r) => ids.has(r.id)).map((r) => ({ id: r.id, score: clamp(r.score), reason: r.reason }));
}

export async function scoreDeep(
  client: LlmClient, model: string, profile: Profile, prefs: Prefs, job: Omit<JobDetail, "id"> & { id?: string },
): Promise<DeepResult> {
  const res = await client.messages.parse({
    model, max_tokens: 6000,
    system: "You assess how well a candidate fits one job posting, using only the candidate profile and the posting text. " +
      "Score 0-100 (80+ strong, 60-79 good, 40-59 stretch, below 40 weak) and set verdict accordingly. " +
      "Each strength must name concrete evidence from the profile. Gaps are posting requirements the profile does not evidence. " +
      "Put hard requirements the candidate lacks (work authorization, clearance, licence, location, minimum years) in deal_breakers. " +
      "red_flags: vague duties, unrealistic stacks, pay/commission-only, repost or scam signals. " +
      "employer_type: 'recruiter' if a staffing/recruiting firm or the text speaks of 'our client'; 'aggregator' if it is a repost from an aggregator " +
      "and the real employer is not identifiable; 'direct' if the hiring company posts it; 'unclear' otherwise. Give employer_reason. " +
      "Never invent facts about the candidate.",
    messages: [{ role: "user", content: `Candidate:\n${JSON.stringify(matchingProfile(profile))}\n\nPreferences:\n${prefsText(prefs)}\n\n` +
      `Posting:\nTitle: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\n${job.via ? `Shown via: ${job.via}\n` : ""}${job.poster ? `Posted by: ${job.poster}\n` : ""}\n${job.description.slice(0, 15000)}` }],
    output_config: { effort: "medium", format: zodOutputFormat(DeepSchema) },
  });
  guard(res);
  const d = res.parsed_output!;
  return { ...d, score: clamp(d.score) };
}

function guard(res: { stop_reason: string | null; stop_details?: { category?: string | null } | null; parsed_output?: unknown }) {
  if (res.stop_reason === "refusal") throw new Error(`Model declined (${res.stop_details?.category ?? "policy"})`);
  if (res.stop_reason === "max_tokens") throw new Error("Model output was cut off");
  if (!res.parsed_output) throw new Error("Model output did not match the expected format");
}
