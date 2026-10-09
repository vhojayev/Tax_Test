export interface JobCard {
  id: string;
  el: HTMLElement;
  title: string;
  company: string;
  location: string;
  snippet: string;
  via?: string;        // source board/aggregator shown on the card ("via ZipRecruiter")
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

export interface Settings { apiKey: string; deepModel: string; listModel: string }
export const DEFAULT_SETTINGS: Settings = { apiKey: "", deepModel: "claude-opus-5-5", listModel: "claude-haiku-5-5" };

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

export type Msg =
  | { type: "ai:cards"; cards: { id: string; title: string; company: string; location: string; snippet: string; via?: string }[] }
  | { type: "ai:deep"; detail: Omit<JobDetail, "id"> & { id?: string }; fresh?: boolean };
export type Reply<T> = { ok: true; data: T; cached?: boolean; model?: string } | { ok: false; error: string };
