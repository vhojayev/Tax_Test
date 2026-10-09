// Loose JSON Resume shape + an `extras` bag for answers the resume never states
// (work authorization, salary, links...). Extras are what the learning loop writes to.
export interface Profile {
  basics?: {
    name?: string; email?: string; phone?: string; url?: string; label?: string; summary?: string;
    location?: { city?: string; region?: string; countryCode?: string; postalCode?: string };
    profiles?: { network?: string; url?: string }[];
  };
  work?: { name?: string; position?: string; startDate?: string; endDate?: string }[];
  education?: { institution?: string; studyType?: string; area?: string }[];
  extras?: Record<string, string>;
}

export interface Candidate { key: string; values: string[] }

const COUNTRIES: Record<string, string[]> = {
  US: ["United States", "United States of America", "USA", "US"],
};

/** Canonical key -> acceptable string values (first is preferred; selects try the rest). */
export function candidates(p: Profile): Map<string, string[]> {
  const m = new Map<string, string[]>();
  const put = (k: string, ...v: (string | undefined)[]) => {
    const vals = v.filter((x): x is string => !!x && x.trim() !== "");
    if (vals.length) m.set(k, vals);
  };
  const b = p.basics ?? {};
  const parts = (b.name ?? "").trim().split(/\s+/).filter(Boolean);
  put("full_name", b.name);
  put("first_name", parts[0]);
  put("last_name", parts.length > 1 ? parts.slice(1).join(" ") : undefined);
  put("email", b.email);
  put("phone", b.phone);
  put("city", b.location?.city);
  put("region", b.location?.region);
  put("postal_code", b.location?.postalCode);
  const cc = b.location?.countryCode;
  if (cc) put("country", ...(COUNTRIES[cc] ?? [cc]));
  put("website", b.url);
  const li = b.profiles?.find((x) => /linkedin/i.test(x.network ?? ""))?.url;
  put("linkedin", li);
  // "current" job = one with no endDate, else the first listed.
  const cur = p.work?.find((w) => !w.endDate) ?? p.work?.[0];
  put("current_company", cur?.name);
  put("current_title", cur?.position);
  const edu = p.education?.[0];
  put("school", edu?.institution);
  put("degree", edu?.studyType);
  // Extras override/extend (e.g. work_authorization, salary_expectation, notice_period).
  for (const [k, v] of Object.entries(p.extras ?? {})) put(k, v);
  return m;
}
