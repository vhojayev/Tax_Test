import type { FieldInfo } from "./fields.js";
import { candidates, type Profile } from "./profile.js";

export type Tier = "green" | "yellow" | "red";
export interface Suggestion {
  field: FieldInfo;
  key: string | null;     // canonical key, null if we could not classify the field
  values: string[];       // candidate values, preferred first
  confidence: number;
  tier: Tier;
  reason: string;
  sensitive: boolean;
}

// Fields we never fill silently. With a stored extras value they become a yellow
// suggestion the user must click; without one they stay red.
const SENSITIVE: [string, RegExp][] = [
  ["work_authorization", /authori[sz]ed to work|work authori[sz]ation|legally (authori[sz]ed|eligible)|eligible to work/],
  ["sponsorship", /sponsorship|require.*visa|visa/],
  ["salary_expectation", /salary|compensation|pay expectation/],
  ["gender", /\bgender\b|\bsex\b/],
  ["race", /\brace\b|ethnic/],
  ["veteran", /veteran/],
  ["disability", /disabilit/],
  ["criminal_record", /criminal|felony|convicted/],
  ["date_of_birth", /date of birth|birth\s*date|\bdob\b/],
  ["government_id", /social security|\bssn\b|passport|national id/],
];

// Ordered: first/last name before the generic "name"; specific before general.
const RULES: [string, RegExp][] = [
  ["first_name", /first\s*name|given\s*name|\bfname\b|forename/],
  ["last_name", /last\s*name|family\s*name|surname|\blname\b/],
  ["email", /e-?mail/],
  ["phone", /phone|mobile|\btel\b|telephone/],
  ["linkedin", /linked\s*in/],
  ["website", /website|portfolio|personal (site|url)|\burl\b/],
  ["postal_code", /zip|postal/],
  ["city", /\bcity\b|town/],
  ["region", /\bstate\b|province|region/],
  ["country", /\bcountry\b/],
  ["current_company", /current (company|employer)|\bemployer\b|\bcompany\b|organi[sz]ation/],
  ["current_title", /current (title|position|role)|job title|\btitle\b|\bposition\b/],
  ["school", /school|university|college|institution/],
  ["degree", /\bdegree\b|education level/],
  ["full_name", /^(full |legal |your )?name$|\bfull name\b|\blegal name\b/],
];

const AUTOCOMPLETE: Record<string, string> = {
  "given-name": "first_name", "family-name": "last_name", name: "full_name", email: "email",
  tel: "phone", "address-level2": "city", "address-level1": "region", "postal-code": "postal_code",
  "country-name": "country", country: "country", organization: "current_company",
  "organization-title": "current_title", url: "website",
};

const norm = (s: string) => s.toLowerCase().replace(/[_\-.[\]]+/g, " ").replace(/\s+/g, " ").trim();

function classify(f: FieldInfo): { key: string; score: number; reason: string } | null {
  const ac = AUTOCOMPLETE[f.autocomplete.split(" ").pop() ?? ""];
  if (ac) return { key: ac, score: 0.95, reason: `autocomplete="${f.autocomplete}"` };
  if (f.type === "email") return { key: "email", score: 0.9, reason: "input type=email" };
  if (f.type === "tel") return { key: "phone", score: 0.9, reason: "input type=tel" };
  const label = norm(f.label);
  const weak = norm(`${f.name} ${f.id} ${f.placeholder}`);
  for (const [key, re] of RULES) if (label && re.test(label)) return { key, score: 0.85, reason: `label "${f.label}"` };
  for (const [key, re] of RULES) if (weak && re.test(weak)) return { key, score: 0.65, reason: `name/id/placeholder "${f.name || f.id || f.placeholder}"` };
  return null;
}

function sensitiveKey(f: FieldInfo): string | null {
  const text = norm(`${f.label} ${f.name} ${f.id} ${f.placeholder}`);
  for (const [key, re] of SENSITIVE) if (re.test(text)) return key;
  return null;
}

export function suggest(fields: FieldInfo[], profile: Profile): Suggestion[] {
  const have = candidates(profile);
  return fields.map((field): Suggestion => {
    const sens = sensitiveKey(field);
    if (sens) {
      const values = have.get(sens) ?? [];
      return values.length
        ? { field, key: sens, values, confidence: 0.6, tier: "yellow", sensitive: true, reason: "sensitive field: confirm before filling" }
        : { field, key: sens, values: [], confidence: 0, tier: "red", sensitive: true, reason: "sensitive field: no saved answer" };
    }
    const c = classify(field);
    if (!c) return { field, key: null, values: [], confidence: 0, tier: "red", sensitive: false, reason: "unrecognised field" };
    const values = have.get(c.key) ?? [];
    if (!values.length) return { field, key: c.key, values: [], confidence: 0, tier: "red", sensitive: false, reason: `no "${c.key}" in profile` };
    const tier: Tier = c.score >= 0.8 ? "green" : "yellow";
    return { field, key: c.key, values, confidence: c.score, tier, sensitive: false, reason: c.reason };
  });
}
