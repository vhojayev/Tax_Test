# Verdict (DRAFT, pre-attack) - Which 1-2 projects to push to monetization?
Judge: oracle-judge | Date: 2026-10-22 | Status: awaiting oracle-verdict-skeptic

Labels: [FACT:source] / [INFERENCE] / [GUESS]. Sources are the session files (ledger.md, round-1-*.md, round-2-*.md); most underlying FACTs are second-hand vendor blogs and search summaries, so treat [FACT] here as "sourced, weak" not "verified". All scores below are my judgment [INFERENCE].

## 0. Headline (blunt)
- The best moves are NOT a startup. [INFERENCE] No software candidate has demand evidence, a distribution channel, or enough hours behind it. Realist: software P(>=$1k/mo by M12) is 2-4%; 57% of tracked extensions earn $0. [FACT:round-2-realist.md citing bigideasdb.com]
- The two picks are: (1) a better-paid full-time job (#11), and (2) a gated, time-boxed paid part-time contract/fractional engagement (#12, with #9 as the same-hours fallback channel). Neither is a scalable business; #2 is explicitly a second job. [INFERENCE]
- $5k/mo from anything while employed full time: ~2%. Drop it from the framing. [GUESS:round-2-realist.md; I concur on the hours arithmetic: $5k in ~22 hrs/mo needs >$225/hr]

## 1. Score sheet (PROTOCOL weights: Demand x3, WTP x3, Fit x2, Time-to-$ x2, Build x1, Distribution x2, Defensibility x1, Legal-inverse x1; max 75)
Legal column: 5 = low risk. Employer-clause exposure is scored as legal risk. All scores [INFERENCE].

| Rank | # | Candidate | Dem x3 | WTP x3 | Fit x2 | T$ x2 | Bld x1 | Dist x2 | Def x1 | Leg x1 | Total /75 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 11 | Take >=$95k role (baseline) | 5 | 4 | 5 | 3 | 5 | 4 | 1 | 5 | **62** |
| 2 | 12 | Paid job-cost/controller contract (Realist, new) | 4 | 4 | 4 | 4 | 5 | 4 | 1 | 2 | **56** |
| 3 | 9 | Fractional property/project accounting (hourly) | 4 | 3 | 4 | 4 | 5 | 4 | 1 | 2 | **53** |
| 4 | 6 | AI month-end/AP service for small PMs | 4 | 3 | 4 | 3 | 3 | 3 | 2 | 2 | **48** |
| 5 | 5 | MCP/agent skill (as career asset) | 2 | 2 | 3 | 3 | 4 | 2 | 1 | 5 | **38** |
| 6 | 1 | Droplet (tab extension) | 3 | 2 | 1 | 2 | 4 | 3 | 1 | 4 | **36** |
| 7 | 3 | Invoice processing SaaS | 3 | 2 | 3 | 2 | 3 | 2 | 1 | 2 | **35** |
| 7 | 7 | Construction job-cost/draw/lien-waiver | 3 | 2 | 3 | 2 | 3 | 2 | 1 | 2 | **35** |
| 9 | 2 | SiteLens (ZIP yield screener) | 3 | 2 | 2 | 2 | 4 | 2 | 1 | 2 | **34** |
| 10 | 10 | Niche tax tooling/templates | 2 | 2 | 2 | 2 | 4 | 2 | 1 | 3 | **32** |
| 11 | 8 | MCP connectors as product | 2 | 1 | 3 | 1 | 2 | 1 | 1 | 2 | **24** |
| 12 | 4 | Tax_Test (empty repo) | 1 | 1 | 2 | 1 | 1 | 1 | 1 | 1 | **17** |

Score rationale for the contested cells:
- #11 Demand 5: recruiter inbound exists. [FACT:ledger E6] WTP 4, not 5: the Red Team shows no measured AI wage premium for accountants (lower-range pay fell $92k to $89k while AI mentions rose). [FACT:round-2-red-team.md citing cpapracticeadvisor.com, accountingtimes.com.au] Current salary is unknown, so the delta could be $0. [GAP]
- #12 Demand/WTP 4: observed contract postings at $50-70/hr, $60-85/hr for ~5 hrs/wk, $35-40/hr for a 40 hr/mo draw accountant. [FACT:round-2-realist.md citing upwork.com, vaco.com listings] Small posting sample. Fit 4, not 5: the resume shows no GC cost-accounting role. [FACT:ledger E4] Legal 2: same Landmark exposure as #9.
- #9 Fit cut from the Domain Advisor's 5 to 4: Red Team is right that "5/5 fit" on an idea with a ~$1.1-1.8k/mo ceiling is a scoring artifact, and the "moat" is 2 years of property depth, much of it learned at the current employer. [FACT:round-1-domain-advisor.md; round-2-red-team.md s1a, s3] WTP 3: rates are vendor-sourced and span 6x. [FACT:round-2-red-team.md s1b]
- #6 over #9 on Defensibility (2 vs 1) only because outcome-priced work captures AI leverage; but Build 3 and Dist 3 reflect Yardi/AppFolio gating and the unsourced 4-5 hrs/client/mo. [FACT:round-1-builder.md; round-2-red-team.md s2]
- #5 Legal 5 but WTP 2: buyers hire developers over an accountant with two badges. [FACT:ledger E5; INFERENCE]
- #1 and #2 are the least employer-conflicted ideas. [INFERENCE:round-2-red-team.md s3] That helps Legal (4 for Droplet) but not revenue; Droplet monetization contradicts its own no-accounts policy. [FACT:round-1-builder.md citing developer.chrome.com user-data-faq]
- #4 scored for completeness only; the repo is empty. [FACT:ledger E7]

Sensitivity [INFERENCE]: if the employer clause forbids outside work, #12/#9/#6/#7 are not "low-scored", they are off the table (illegal or breach-risky), and the ranking becomes #11 > #5 > #1 > #3 > #2 > #10 > #8. Scores near each other (#1/#3/#7/#2: 34-36) are within scoring noise; do not read an order into them.

## 2. Picks

### Pick A: Take the >=$95k role (#11). Not a startup, and the highest scorer.
- Realist expected value: P(offer >=$95k in 12 months) ~60-65%; expected delta ~$6k/yr (~$500/mo) at ~60-80 one-time hours and zero ongoing hours. [GUESS:round-2-realist.md s5]
- Strategist's own arithmetic: a ~$12k raise equals a $1k/mo side income at no capacity cost and no conflict risk. [FACT:round-1-monetization-strategist.md #11] Red Team agrees it "dominates every other option on risk and cash". [FACT:round-2-red-team.md s5 #11]
- Caveat I will not hide: "AI + accounting premium" is unproven. Most of any raise probably comes from role selection (FP&A, SOX, Schlumberger pedigree), not AI. [INFERENCE:round-2-red-team.md s4] Also the Round-1 Domain Advisor framed the job search as the zero-cost test of that premium; I keep that use. [FACT:round-1-domain-advisor.md #11]
- It also resets the employer-conflict analysis for Pick B. [INFERENCE]

### Pick B: Paid part-time job-cost/controller contract or fractional engagement (#12; #9 as same-slot fallback), gated and time-boxed
- Why it ranks above #6: the client brings the work, so sales cost is lower; rate evidence is observed not modelled. [INFERENCE; FACT:round-2-realist.md s3]
- #9 and #12 are NOT additive. They use the same ~12 billable hrs/mo. #6 is a repackaging of #9, not a separate project. [FACT:round-2-realist.md s3 notes]
- **Red Team point (#9/#6 is a second job): conceded.** #9 is hours-for-money with no leverage; #6 is a second job with a marketing story unless software pull appears, and nobody showed a path to software. [FACT:round-2-red-team.md s2] Red Team's net-yield math (~$21-25/hr net of all effort at 43 hrs/mo) assumed the Strategist's hours; under the Realist's hours it is similar or worse for #9/#6 once sales time is counted. [INFERENCE] Pick B is picked anyway because the goal is "extra cash plus customer discovery", not leverage, and it is the only candidate with a first dollar plausible in 30-90 days. I am recommending a second job, labelled as one. If the user wants leverage, this pick does not deliver it. [INFERENCE]
- **Realist hours correction (4-7 hr/wk, base ~22 hr/mo, ~12 billable): accepted as the planning base.** The 10 hr/wk figure was repeated by every Round-1 advisor but the user never stated it in the files. [FACT:round-2-red-team.md s1c; GUESS:round-2-realist.md s1] Effect: Strategist's 20 billable hrs is ~1.7x too high; #6 base clients drop from 5 to 1-2. [FACT:round-2-realist.md s2] Caveat: the 22 hr/mo is the Realist's guess about the user; if the user truly has 10 hr/wk, services numbers rise ~1.5-2x. [GUESS:round-2-realist.md dissent] The user's actual hours decide this (see section 6).
- Service crowds out product: with ~12 billable hrs, nothing is left to build the software that #6 would need. [INFERENCE:round-2-red-team.md s2] So I do not pick #6 as a product path.

## 3. Realistic income range (gross, M12 = Oct 2027, assuming the employer clause is clear unless stated)
| Path | Low | Base | High | P(>=$1k/mo) |
|---|---|---|---|---|
| Pick A: job delta | $0 | ~$500/mo expected (~$830/mo if +$10k) | ~$1,670/mo (+$20k) | ~35% of reaching $1k/mo equivalent |
| Pick B: #12 contract | $0 | ~$1,400/mo (~6 hr/wk x 4.3 x $55) | ~$2,800 | ~40% [GUESS] |
| Pick B fallback: #9 hourly | $0 | ~$700 | ~$1,800 | ~22% [GUESS] |
| Software (#1, #2, #8, #3) | $0 | $0-225 | $300-900 | 2-4% |

Source: [GUESS:round-2-realist.md s3, s5]; the Realist's P values are guesses anchored on weak base rates. Side income nets ~60-65% after SE tax and income tax (about 35-40% marginal). [INFERENCE:round-2-realist.md s5] Combined realistic outcome for A + B: roughly $0 to $30k/yr extra gross, median in the $8-15k/yr range. [GUESS] Chance at least one side project reaches $1k/mo by M12: ~35%. [GUESS:round-2-realist.md]. The #12 base assumes a 10-15 hr/wk part-time contract is findable; most postings are full-time or 25+ hrs/wk, so the base may be optimistic. [INFERENCE:round-2-realist.md s3 note]

## 4. Why the others lost
- #6 AI month-end service: second job in a nicer wrapper; incumbents (AppFolio native AI recs, Proper $20M+ raised, Wrk $250/mo managed AP) set price ceilings and compete; load-bearing 4-5 hrs/client/mo is unsourced; most employer-conflicted via IP clause. [FACT:round-2-red-team.md s0, s2; round-1-market-analyst.md]
- #5 MCP skill: a skill, not a product. Kept as the career asset that feeds Pick A: ship one public, working finance automation (not a tutorial). Do not sell it. [INFERENCE:round-2-red-team.md #5]
- #1 Droplet: monetization needs accounts/backend, contradicting "no accounts" policy; free incumbents (OneTab 2M users); base M12 revenue $25-225/mo; not even submitted (privacy policy still has an email placeholder). [FACT:round-1-market-analyst.md; ledger E1; round-2-realist.md]
- #3 Invoice SaaS: commodity (Ramp AP free, Bill.com, Dext); holds customer financial docs (SOC 2 questions). Survives only as a feature inside services. [FACT:round-1-market-analyst.md; INFERENCE]
- #7 Construction/lien-waiver: lien-waiver tools sell at $49/mo; Florida statutory forms create liability; resume shows no GC role; recruiter interest is a hiring signal, not a client signal. [FACT:round-1-monetization-strategist.md citing capterra; ledger E4, E6; Fla. Stat. 713.20 is FACT-weak, unverified]
- #2 SiteLens: Zillow commercial rights unverified; free CSVs; buyers pay for deal-level underwriting; BiggerPockets Pro bundles calculators; no audience. [FACT:round-1-gtm-operator.md; round-1-market-analyst.md]
- #10 Tax templates: seasonal (must ship mid-Dec), no credential, funded competitors; liability. [FACT:round-1-market-analyst.md #10]
- #8 MCP connectors: Intuit ships its own QBO MCP/connector; free open-source clones; Yardi/AppFolio gated. Dead as product, fine as portfolio. [FACT:round-2-red-team.md s0; round-1-market-analyst.md]
- #4 Tax_Test: nothing exists. Remove from table until the user states niche and buyer in one sentence. [FACT:ledger E7]
- Red Team's adjacents: 6a (Claude/MCP setup for small accounting firms) edges #8 on accounting judgment but is a second job with a decaying fee as Intuit packages it; 6b (templates) is a lead magnet at best; 6c (job-cost contracting) is Pick B. Not scored separately. [INFERENCE:round-2-red-team.md s6]

## 5. Gating checks (must happen BEFORE any outreach)
1. **Employer contract (Landmark Cos.)**: read offer letter/handbook/any signed agreement for (a) outside-work/moonlighting disclosure, (b) non-compete/non-solicit (client or vendor overlap), (c) invention/IP assignment scope. Cost: $0 to read; ~$300-500 for an employment attorney [GUESS]. It moves P(#12/#9) by ~35 points [GUESS:round-2-realist.md] and, if blocking, kills #6/#7/#9/#12. Florida-specific authority was not retrieved; the contract text is what matters. [FACT:round-2-red-team.md s0, s3]
2. **What Landmark actually is** (manager, developer, GC?). Unestablished; it determines which client pools are conflicted. [GAP:round-2-red-team.md s1c]
3. **Do not use** Landmark templates, charts of accounts, owner/vendor contacts or data. Trade-secret exposure applies regardless of contract. [INFERENCE:round-2-red-team.md s3] Prefer clients outside Landmark's market.
4. **Credential lines**: no "CPA" title, no attest/review/audit; no tax-return prep for pay without a PTIN; confirm user holds no CPA/EA (inferred from resume only). [FACT:round-1-domain-advisor.md citing flsenate.gov Ch. 473 per search summary; INFERENCE on user status]
5. **Engagement basics**: engagement letter, E&O/cyber insurance consideration, handle client data in the client's systems (lower security burden than SaaS). [INFERENCE:round-1-builder.md #9]
6. **If job switch happens first**: re-read the new employer's moonlighting/IP terms. [FACT:round-1-builder.md #11 note; INFERENCE]
7. **Only if reviving an idea** (not part of the 30-day plan): Zillow written commercial-use terms for SiteLens (the page returned 403 to the Builder; terms unread) [FACT:round-1-builder.md]; current Chrome payments/disclosure policy for Droplet [FACT:round-1-builder.md].

## 6. 30-day test plan (2026-10-22 to 2026-11-21) with dated kill-criteria
Hours budget: plan at 4-7 hr/wk (about 18-30 hrs over the 30 days), not 10. [FACT:round-2-realist.md s1; GUESS]

| Date | Action | Gate/Kill |
|---|---|---|
| By Oct 29 | Read Landmark agreement; record Y/N/ambiguous on outside work, non-solicit, IP. Record what Landmark's business is. | **Hard gate.** If outside work is prohibited or IP clause reaches the work: Pick B is dead; run Pick A only. If ambiguous: pay ~$300-500 for attorney read or ask for written consent before any outreach. |
| By Nov 5 | Pull 5 live postings in target roles (FP&A, SOX, project/job-cost); log comp and whether AI is required. Update resume with a single shipped, public finance-automation artifact if one can be made in the hours (feeds Pick A; no revenue goal). | Pick A premium test. If none of the 5 states a range at or above the user's target after the user supplies current salary, the "AI premium" assumption is dead; keep the job search on role selection. |
| By Nov 8 | Pick A: 10 applications/recruiter replies sent (reply to existing Indeed outreach counts). | |
| By Nov 12 (only if gate cleared) | Pick B: list 15 targeted prospects/postings (contract boards, ex-colleagues outside Landmark's market, NARPM-type chapters). Warm first, not cold. | |
| By Nov 21 | Pick B: 15 targeted contacts/applications sent; at least 2 conversations in which a buyer names a rate or scope. Pick A: at least 2 screening conversations, at least 1 with a stated range. | **Day-30 checkpoint.** Pick B: 0 conversations in 15 contacts means stop outreach and reassess channel. Pick A: 0 screens from 10 applications means the resume/targeting needs rework, not that the path is dead. |

Full kill-criteria per pick (dated):
- **Pick A (#11):** kill the "AI-premium" belief if no offer or stated range is at least current salary + $10k by 2027-02-28; zero first-round interviews from 15 applications by 2026-12-15 means change targeting/roles; stop spending hours on it only after an accepted offer. [GUESS:thresholds are mine; direction from round-2-realist.md]
- **Pick B (#12/#9):** (1) gate fail on 2026-10-29 = dead; (2) 25 targeted contacts/applications by 2026-11-30 and zero paid hours by 2027-01-31 = stop services and pursue only the job. [FACT:round-2-realist.md kill-criteria; adopted]; (3) if the first paying engagement yields under ~$50/hr effective after scoping/admin time, or flat-fee work needs more than ~8 hrs/client/mo against the Strategist's 4-5 assumption, reprice or stop (2027-02-28 review). [GUESS]
- **Parked, not picked:** Droplet only if a store listing takes a weekend; kill if not live by 2026-11-15 or under 1,000 installs and 5 paid by 2027-01-31. [FACT:round-2-realist.md; round-1-gtm-operator.md kill test] SiteLens: dead by 2026-11-15 if Zillow terms unclear in writing; else under 100 signups in 45 days. Both low-conflict, but I recommend spending no hours on them until Picks A/B are moving. [INFERENCE]

## 7. What depends on the user's unknowns
| Unknown | Decision it controls |
|---|---|
| Current salary | If at or above ~$90k, Pick A's delta shrinks to ~$0-5k and Pick B becomes relatively more important; if $70-80k, Pick A dominates. Realist's base assumes $70-90k [GUESS]; Red Team notes this could shrink the #11 edge. [FACT:round-2-red-team.md dissent] |
| Real weekly hours | 4-7 hr/wk: Pick B is a hobby-scale $700-1,400/mo ceiling; 10 hr/wk: services numbers rise ~1.5-2x and P(>=$1k) for #9/#6 goes to ~35%. [GUESS:round-2-realist.md] Below ~4 hr/wk: do Pick A only. |
| Employer clause (and what Landmark is) | Binary for Pick B. Clear = Pick B proceeds; blocked = A only, plus low-conflict experiments (#1, #5 public project). |
| Goal: extra cash vs leverage | If leverage, none of the ranked candidates qualifies; the honest answer is "reduce job dependence is not achievable at 4-10 hr/wk". [INFERENCE] |
| CPA/EA/PTIN status | Limits any tax-adjacent work; none is picked. |
| Chat export (conversations.json) | The idea inventory was reconstructed from Drive/Gmail/Indeed artifacts only, not chats. [FACT:ledger gaps] Panel-generated ideas (#6-#10) outrank the user's own (Droplet, SiteLens, invoices) with no evidence the user wants a bookkeeping business. [FACT:round-2-red-team.md s1a] If the export reveals a user-originated idea with real traction or an existing audience/customer, re-run scoring: only an idea with prior evidence of paying demand can beat Pick B on Demand x3 / WTP x3. Do not assume it will. |

## 8. Unresolved dissent (preserved, not averaged)
1. **Domain Advisor vs Red Team on #9/#6**: Advisor gave #9 fit 5/5 as "strongest moat" and #6 as possibly a tool for #9 not a product; Red Team calls #9 a second job and the moat 2 years deep. I sided with the Red Team on fit (cut to 4) but still picked it as a bridge. Unresolved: whether #6 is ever a product. [FACT:round-1-domain-advisor.md; round-2-red-team.md]
2. **Realist vs Strategist on hours and funnels**: 22 hr/mo and ~12 billable vs 43 and 20; cold close 25%/8% vs 1-3% reply-to-meeting. I used the Realist's, but both are guesses until the user states hours. [FACT:round-2-realist.md s2]
3. **Red Team vs Realist on #12**: Realist gives P(>=$1k/mo)=40% from a small sample of postings, mostly full-time; Red Team notes Indeed outreach is for full-time roles and that contract rates above $75 are unsourced. Part-time 10-15 hr/wk contracts may be rarer than assumed. Unresolved. [FACT:round-2-red-team.md s6c; round-2-realist.md s3]
4. **Is the AI premium real?** Realist and Strategist assume a salary delta; Red Team found demand for AI mentions but no measured pay premium. Pick A is robust only if the raise comes from role selection. [FACT:round-2-red-team.md s4]
5. **Services vs the user's revealed preferences**: Red Team notes the user built toward Droplet/SiteLens/invoices, not bookkeeping; the panel's picks may not match what the user wants to do. Not resolved without the chat export. [FACT:round-2-red-team.md s1a]
6. **Employer-conflict probability**: Realist uses 65% clear [GUESS]; no one has read the contract. [FACT:round-2-realist.md s3]

## 9. Dissent / what I'm unsure of
- Weakest assumption in this verdict: that #11 scores highest on Demand 5 / WTP 4 without knowing current pay; if current pay is already near $95k, the baseline's edge collapses and Pick A is just "keep the job". [INFERENCE]
- The scoring is my judgment on weak, second-hand sources; swings of 1 point on WTP (x3) reorder #12/#9/#6. The top-4 order is stable against single-point changes, the bottom order is not. [INFERENCE]
- I treated #11 as a "pick" even though the user asked for projects to monetize; if the user rejects a job move, Pick B plus a parked Droplet/SiteLens test is what remains, and the expected income is modest. [INFERENCE]
- Every probability in section 3 is a [GUESS] from the Realist; no source gives base rates for a part-time, no-audience accountant.
- I did not independently verify any web claim; I rely on agents' cited sources.
