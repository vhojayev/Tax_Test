# Verdict attack (oracle-verdict-skeptic), 2026-10-22
Target: verdict-draft.md. Labels: [FACT:url] / [INFERENCE] / [GUESS].

## 1. Question swap (job switch as Pick A)
- User asked for projects to monetize. Pick A is a job change; it is not a project. The Judge admits this only in section 9, last-but-two bullet, after already ranking it #1 at 62/75. [FACT:verdict-draft.md s2, s9]
- Score inflation: Demand 5 and Fit 5 for #11 reuse "recruiter outreach exists" (one Indeed email subject line, [FACT:ledger E6]) as demand. That is demand for the user's labor, not for a monetizable asset. It cannot be compared on the same rubric as products. Founder-fit 5 is trivially true of "do my own job".
- WTP 4 on #11 while current salary is unknown and the Judge's own text says the delta may be $0. A WTP of 4 on an unknown delta is inflated; honest range is 2-4. [INFERENCE]
- Defensibility 1 for #11 but Distribution 4 and Time-to-$ 3 are scored as if it were a business. The 62 total beats everything mostly because Build 5, Legal 5, Demand 5 are free points for a non-project.
- Verdict: the verdict swaps the question. It should be reported as "baseline / control, not a pick", unranked, with the real ranking among actual monetization options. The protocol's own ledger calls #11 a "control option". [FACT:ledger idea 11] [INFERENCE]

## 2. Under-exploration of adjacent, leverage-based options
The panel did enumerate 5/8/10 but killed audience-based and productized-knowledge options in one line ("needs audience, 12+ months", GTM s1) and never scored them. Red Team 6a/6b were left "not scored separately". [FACT:verdict-draft.md s4 last bullet; round-1-gtm-operator.md line 3] The anchor was the user's artifacts plus the 10 hr/wk guess.

Quick web checks (standard search, weak evidence, vendor/listing level):
1. Accountant AI training is a paid category. BC CPA lists on-demand AI courses at about $89-99 each; ICAEW lists a 6-hr generative AI course at GBP 825 + VAT. [FACT:https://pd.bccpa.ca/pd-search/details/c6a715b_od/ca715od/] [FACT:https://events.icaew.com/pd/31977/2026-generative-ai-for-accountants-learn-it-u] Caveat: these are institutional providers with distribution; it shows buyers pay, not that an unknown creator can sell. Revenue data not found. [GAP]
2. Claude/MCP-to-QuickBooks implementation has live demand signals: multiple articles, a Luma event "Going Deeper with Claude for Accounting Firms", a podcast episode; sources say firms use AI "in a separate window" and flag dirty chart of accounts/governance as the consulting gap. [FACT:https://numeric.io/blog/quickbooks-mcp] [FACT:https://www.accountingweekly.com/ai-integration/the-quickbooks-trick-most-accountants-haven-t-found-yet] [FACT:https://luma.com/8wlezfqw] A vendor-sponsored article claims an Anthropic partner network with 10,000+ certified consultants, i.e. the supply side is already crowded and credentialed. [FACT:https://crox.io/insights/ai-for-accounting-firms, vendor-sponsored, unverified] Net: demand real, competition also real; pricing benchmarks not found. [GAP]
3. Spreadsheet/finance templates: $5-30 price band, one $5 Gumroad listing shows ~300 sales. [FACT:https://mohtakir.gumroad.com/l/TemplatesforEtsySellerexcel] That is ~$1.5k lifetime for one listing; ceiling is low, but it is the only candidate in the whole set that has zero hours-per-dollar coupling and no client data liability. Panel dismissed it as "lead magnet at best". [INFERENCE: under-scored; probably still Demand 3 / WTP 2, but Legal 4-5 and Build 4-5, ahead of #10 at 32]
4. Not tested for lack of time: paid newsletter, niche data product. Panel assumed zero audience; that is true today but the Realist notes the user's warm network was never tested. [FACT:round-2-realist.md line 107]

Conclusion: the panel's "no leverage exists" claim (verdict s7, goal row) is overstated. Training/templates/productized setup are leveraged-ish, low-conflict-with-employer (no client work), and untested rather than refuted. They need audience, which is a time problem the 22 hr/mo guess makes worse, but 10-15 hr over 30 days could produce a first listing. [INFERENCE]

## 3. Employer conflict is the dominant, unread variable
Pick B is gated on a contract nobody has read, P(clear)=65% is a [GUESS], and the Judge's own sensitivity says the ranking collapses to #11 > #5 > #1 ... if blocked. A ranking whose top-2 is contingent on a free, 1-hour read should not be issued before that read. Reorder: gate check is step zero, ahead of any scoring. [INFERENCE]

## 4. SINGLE weakest assumption
**That the user has 4-7 hr/wk and a current salary of $70-90k, i.e. the two numbers that set both picks' value, are both Realist guesses; the Judge flags them and then builds the income table (section 3) on them anyway.** Salary decides whether Pick A is worth anything; hours decide whether Pick B is. Neither appears in any file. [FACT:verdict-draft.md s7; round-2-realist.md s1]

Cheaper test: ask the user two questions now (current base salary; actual free hours/week for the next 8 weeks, and whether Landmark's agreement permits outside work). Cost: 2 minutes, $0, today. This is cheaper than the verdict's 30-day plan, and it should have been asked before ranking. If salary >= ~$90k, drop Pick A; if hours < 4, drop Pick B and list only the zero-client-work options (templates, public MCP project, a single paid AI-for-accountants workshop/listing).

## 5. Other issues
- Section 3 "median $8-15k/yr extra" is built from [GUESS] stacked on [GUESS]; presenting a median is false precision. Say "unknown, $0-30k".
- Total scores are weighted sums on 1-5 guesses, and the Judge admits ties within noise. Rank-ordering #6 vs #9 vs #12 by 3-5 points is not meaningful; #12 and #9 use the same hours and are one option.
- "[FACT]" tags in the verdict point to agent files, not primary sources. By PROTOCOL rule 1 these should be [INFERENCE] unless a URL is cited. The Judge discloses this, but the table still reads as evidence-backed.
- #5 (MCP skill) at 38 as "career asset" feeds Pick A, which means a non-monetization item supports a non-project pick. Circular.
- No Compliance-first treatment for Pick B on data handling beyond a bullet; adequate but thin. (Protocol rule 8.)
- User said "no bs hard truth and potential": the verdict gives truth but little on potential; it never says what would make the user's own ideas (Droplet/SiteLens/invoices) worth finishing.

## 6. Recommended rank changes
1. Unrank #11; label "baseline/control, not a project". Keep as parallel track.
2. Rank 1 among projects: gate-cleared #12/#9 contract (merge into one option), but conditional on the two-question check above.
3. Insert new entry, scored: AI-for-accountants workshop/guide + MCP-QuickBooks setup package (Red Team 6a merged with Market Analyst's $1-3k setup idea): est. Demand 3, WTP 3, Fit 4, T$ 3, Build 4, Dist 2, Def 1, Leg 4 => ~49/75 [GUESS]. Rank it #2-#3 project, ahead of #6. It is the only option with some leverage and an employer-conflict profile no worse than a public repo.
4. Move #10 templates up a little (Legal 4-5, Build 5): ~35 [GUESS], tied with #1/#3/#7, still not a pick; use as lead magnet for item 3.
5. Leave #1, #2, #3, #7, #8, #4 where they are.

## What I tried and failed to break
The core conclusion that no software candidate has demand evidence and the user shouldn't invest hours there holds against my searches; I found no evidence for Droplet/SiteLens/invoice SaaS demand. Pick B's rate band was not re-tested. [INFERENCE]

## Dissent / what I'm unsure of
- My three searches are standard-depth and mostly vendor or listing pages; they show buyers exist, not that this user can capture revenue. My ~49 score is a [GUESS], no better than the Judge's.
- I did not test newsletter or data-product demand at all.
- Possible I am wrong that the question was "swapped": the user said "even if remotely related", and the job is arguably the baseline against which projects are judged. I still think ranking it #1 is misleading.
