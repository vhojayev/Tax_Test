export interface JobCard {
  id: string;
  el: HTMLElement;
  title: string;
  company: string;
  location: string;
  snippet: string;
  via?: string;        // source board/aggregator shown on the card ("via ZipRecruiter")
  applyOptions?: string[]; // Google Jobs: "Apply on X" / "Apply directly on Y" choices
  sponsored?: boolean;
}

export interface JobDetail {
  id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  poster?: string;     // hiring-team member / recruiter shown on the page
  via?: string;
  applyOptions?: string[];
  url: string;
}

export interface Adapter {
  name: string;
  matches(url: URL): boolean;
  cards(doc: Document): JobCard[];
  detail(doc: Document, url: URL): JobDetail | null;
}

export interface Prefs {
  targetTitles: string;    // comma/newline separated
  locations: string;
  remoteOnly: boolean;
  minSalary: string;
  dealBreakers: string;    // one per line
  flagRecruiters: string;  // extra names, one per line
  flagAggregators: string;
  aiListings: boolean;
  dimWeak: boolean;
  hideRecruiters: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  targetTitles: "", locations: "", remoteOnly: false, minSalary: "", dealBreakers: "",
  flagRecruiters: "", flagAggregators: "", aiListings: true, dimWeak: true, hideRecruiters: false,
};

export interface Settings { apiKey: string; deepModel: string; listModel: string; intelModel: string; intelWeb: boolean }
export const DEFAULT_SETTINGS: Settings = { apiKey: "", deepModel: "claude-opus-5-5", listModel: "claude-haiku-5-5", intelModel: "claude-sonnet-5-5", intelWeb: false };

/** Quick read on the hiring company. From the model's own knowledge unless web search is on, so it can be stale or thin. */
export interface CompanyIntel {
  known: boolean;                       // false: the model doesn't recognise the company and says so rather than guessing
  confidence: "high" | "medium" | "low";
  what_they_do: string;
  size_hint: string;
  hq: string;
  pros: string[];
  cons: string[];
  reputation: string;
  web?: boolean;                        // true when web search was used
}
export type IntelView = { state: "loading" } | { state: "error"; message: string } | { state: "ok"; intel: CompanyIntel; model?: string };

export type EmployerType = "direct" | "recruiter" | "aggregator" | "unclear";
export interface Employer { type: EmployerType; reasons: string[] }

export interface CardResult { id: string; score: number; reason: string }
export interface DeepResult {
  score: number;
  verdict: "strong" | "good" | "stretch" | "weak";
  summary: string;
  strengths: { point: string; evidence: string }[];
  gaps: string[];
  deal_breakers: string[];
  red_flags: string[];
  employer_type: EmployerType;
  employer_reason: string;
}

/** Fast first read of an open job: lets the panel show a score within seconds while the detailed analysis is still running. */
export interface Headline {
  score: number;
  verdict: "strong" | "good" | "stretch" | "weak";
  summary: string;
  employer_type: EmployerType;
  employer_reason: string;
}

export type Msg =
  | { type: "ai:cards"; cards: { id: string; title: string; company: string; location: string; snippet: string; via?: string; applyOptions?: string[] }[] }
  | { type: "ai:deep"; detail: Omit<JobDetail, "id"> & { id?: string }; fresh?: boolean }
  | { type: "ai:headline"; detail: Omit<JobDetail, "id"> & { id?: string }; fresh?: boolean }
  | { type: "ai:company"; company: string; hint?: { title?: string; location?: string; via?: string }; fresh?: boolean };
export type Reply<T> = { ok: true; data: T; cached?: boolean; model?: string } | { ok: false; error: string };
