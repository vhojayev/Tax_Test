import type { Employer, Prefs } from "./types.js";

// Aggregators re-post listings scraped from elsewhere; the real employer is often hidden.
const AGGREGATORS = [
  "ziprecruiter", "jooble", "talent.com", "adzuna", "jobrapido", "lensa", "jobilize", "learn4good", "recruit.net",
  "simplyhired", "careerjet", "jora", "neuvoo", "whatjobs", "jobsora", "trovit", "bebee", "jobtome", "jobera",
  "snagajob", "jobrapido", "joblift", "jobleads", "jobgether", "workopolis", "grabjobs", "ladders", "salary.com", "tealhq",
];
// Plain job boards: not flagged, but shown as the source.
const BOARDS = ["linkedin", "indeed", "glassdoor", "monster", "careerbuilder", "dice", "google", "handshake", "wellfound", "builtin"];

const RECRUITERS = [
  "robert half", "randstad", "adecco", "manpowergroup", "manpower", "kelly services", "kforce", "insight global", "teksystems",
  "aerotek", "apex systems", "hays", "experis", "jobot", "cybercoders", "accountemps", "beacon hill", "volt", "allegis",
  "judge group", "motion recruitment", "collabera", "diversant", "yoh", "creative circle", "the staffing", "talentburst",
  "ettain", "kelly", "spherion", "express employment", "labor finders", "oakridge staffing", "lucas group", "michael page",
  "page personnel", "reed", "harnham", "dexian", "pyramid consulting", "actalent", "ascendo", "mondo", "vaco", "ntt data staffing",
];
const NAME_RE = /\b(staffing|recruit(?:ing|ment|ers?)|headhunt\w*|executive search|search (?:group|partners|firm)|manpower|personnel|workforce solutions|talent (?:solutions|acquisition|partners|group|network))\b/i;
const DESC_SIGNALS: [RegExp, string][] = [
  [/\b(our|a|an) (?:direct )?client\b|\bon behalf of (?:our|a|one of our) clients?\b|\bclient of ours\b/i, 'says "our client"'],
  [/\bw-?2 only\b|\bc2c\b|\bcorp[- ]to[- ]corp\b|\b1099\b/i, "contract terms (W2/C2C/1099)"],
  [/\bcontract[- ]to[- ]hire\b|\btemp(?:-| )to(?:-| )hire\b/i, "contract-to-hire"],
  [/\bour recruiter\b|\bsubmit your (?:resume|cv) to\b/i, "recruiter submission wording"],
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9.& ]+/g, " ").replace(/\s+/g, " ").trim();
const lines = (s: string) => s.split(/\n|,/).map(norm).filter(Boolean);
const hit = (name: string, list: string[]) => list.find((x) => name === x || name.includes(x));

export const isBoard = (via?: string) => !!via && BOARDS.some((b) => norm(via).includes(b));

export interface EmployerInput { company: string; via?: string; title?: string; text?: string; sponsored?: boolean }

export function classifyEmployer(inp: EmployerInput, prefs?: Pick<Prefs, "flagRecruiters" | "flagAggregators">): Employer {
  const company = norm(inp.company);
  const via = norm(inp.via ?? "");
  const reasons: string[] = [];

  const aggList = [...AGGREGATORS, ...lines(prefs?.flagAggregators ?? "")];
  const recList = [...RECRUITERS, ...lines(prefs?.flagRecruiters ?? "")];

  const aggVia = via && hit(via, aggList);
  const aggName = company && hit(company, aggList);
  if (aggVia) reasons.push(`posted via aggregator ${inp.via}`);
  if (aggName) reasons.push(`"${inp.company}" is a job aggregator`);
  if (reasons.length) return { type: "aggregator", reasons };

  const recName = company && (hit(company, recList) || (NAME_RE.test(inp.company) ? "name" : undefined));
  if (recName) reasons.push(recName === "name" ? `"${inp.company}" looks like a staffing/recruiting firm` : `"${inp.company}" is a known staffing agency`);
  const signals = inp.text ? DESC_SIGNALS.filter(([re]) => re.test(inp.text!)).map(([, label]) => label) : [];
  if (recName) return { type: "recruiter", reasons: [...reasons, ...signals] };
  if (signals.length >= 2) return { type: "recruiter", reasons: signals.map((s) => `description: ${s}`) };
  if (signals.length === 1) return { type: "unclear", reasons: [`description: ${signals[0]} — may be a recruiter`] };
  if (!company) return { type: "unclear", reasons: ["employer name not shown"] };
  return { type: "direct", reasons: [] };
}
