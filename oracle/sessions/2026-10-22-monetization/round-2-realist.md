# Round 2 — Realist (2026-10-22)
Role: check Strategist + GTM numbers against base rates. Blunt. Labels: [FACT:url] / [INFERENCE] / [GUESS]. M12 = Oct 2027, monthly gross run-rate, before tax and fees.

## 0. Evidence quality (read first)
Base-rate data for this domain is poor. Everything below is blogs, vendor posts and forum threads, not studies. Where I give a number without a link it is a [GUESS] informed by those sources.
- Extensions: of 112 revenue-verified extensions in one vendor tracker, 57.1% earn $0 and 6.3% clear $1k/mo. Small, self-selected sample. [FACT:https://bigideasdb.com/how-to-monetize-a-chrome-extension]
- Extensions: 70.4% of extensions have <=100 users; 2.63% exceed 10k users. [FACT:https://konabayev.com/blog/extension-monetization-statistics-2026/] (Round-1 Market Analyst cited the same.)
- Extension conversion: 0.8% across five extensions in one dev's report; 0.5-2% realistic. [FACT:https://dev.to/_350df62777eb55e1/real-numbers-freemium-chrome-extension-monetization-after-6-months-5hga] (via Strategist, not re-verified by me).
- Extension price: median subscription $4.99/mo, mean $8.35/mo. [FACT:https://bigideasdb.com/how-to-monetize-a-chrome-extension] (DebugBear figure as relayed; secondary.) A $15 lifetime anchor is above the category.
- Indie SaaS: ~28% of a MicroConf sample were below $1k MRR and 65% had 1-10 customers (these are people who already run a SaaS, i.e. survivors, so this flatters you). Part-time founders grew ~30% slower than full-time. [FACT: secondary summary at https://microconf.com/latest/2021-state-of-independent-saas-survey and https://blog.mean.ceo/?p=11175, could not confirm the original]
- Time to $10k MRR median 12-18 months from first customer, bootstrapped, secondary citation of TrustMRR. [FACT:https://blog.mean.ceo/?p=11175] That is full-time-ish founders, from first customer.
- No survey found for "share of side projects that reach $1k MRR". I found none; my numbers are [GUESS]. Survival of side projects: most stop within 3 months [GUESS].
- Churn: consumer SaaS 5-8%/mo, SMB 3-7%/mo, B2B 3-5%/mo; monthly billing churns 2-3x annual; month-1 churn is far steeper than steady state. [FACT:https://churnkey.co/blog/whats-a-normal-churn-rate-in-saas/ ; https://pmtoolkit.ai/benchmarks/churn-rate-benchmarks ; https://userjot.com/blog/saas-churn-rate-benchmarks] The Strategist's 8% is at the top of the range, fine for consumer, and I'd use 6-7% for SiteLens only if there are annual plans. Churn is not the main error; traffic is.
- Contract rates: remote job-cost / project accountant contracts seen at $50-70/hr (3+ month contract), $60-85/hr (about 5 hrs/wk construction bookkeeping), $36-60/hr (25 hrs/wk, contract-to-hire), $35-40/hr (40 hrs/mo construction draw accountant). [FACT:https://www.upwork.com/freelance-jobs/apply/hour-Construction-Bookkeeping-Consultant_~022069160982540948969/ ; https://jobs.vaco.com/job/16072/construction_draw_accountant_remote_ny/en ; https://cordiaresources.catsone.com/careers/50183-Cordia-Resources/jobs/16381876-Senior-Accountant-Accounting-Manager] Tiny sample of postings. Median real-world 1099 rate for this founder: ~$55 [GUESS].
- Upwork: no hard hire-rate data. Forum evidence: new accounts with no reviews often send dozens of proposals before the first hire; 31K of 45K profiles in one category had zero earnings. [FACT:https://community.upwork.com/t5/Freelancers/How-many-proposals-til-your-first-job/m-p/1220568/highlight/true] (anecdote)
- Freelance/services close rate: cold outreach to meeting 1-3% reply-to-meeting, meeting-to-paid 20-30% for a small service. [GUESS] The Strategist's 8% meeting rate on cold outreach and 25% close is the optimistic end of cold; it is realistic only for warm referrals (GTM itself said 5-15% warm, 1-3% cold, then Strategist used 8% blended on cold).

## 1. Hours: the 10 hr/wk assumption is wrong
Strategist uses ~10 hr/wk = 43 hr/mo and 20 billable hrs. Reality for a full-time property accountant (month-end close, quarter/year-end, burnout, life): 
- Sustained available: **4-7 hr/wk = 17-30 hr/mo; base 22** [GUESS]. Month-end/close weeks drop to ~0. Roughly 1 in 3 weeks is lost entirely [GUESS].
- Side projects fade: most stall once the novelty ends [INFERENCE; no hard survival stat found].
- Services: billable share of the 22 hours is ~50-60% (rest is sales, admin, scoping, onboarding) = **~12 billable hr/mo** [GUESS]. Strategist's 20 billable is about 1.7x too high. GTM's "5-8 hrs/wk per client" for #9 (Builder) vs Strategist's 4-5 hr/client/mo for #6 conflict by 5x; onboarding messy property books is front-loaded, so Strategist's 4-5 hr/mo/client is steady-state only [INFERENCE].
- Hard ceiling at 22 hrs/mo: hourly work at $75 = $1,650 if every hour were billable. $5k/mo by M12 needs >$225/hr or software. So $5k/mo is effectively off the table for every candidate while employed full time.

## 2. Corrections to Round-1 numbers (what I'm replacing and why)
| Item | Round-1 | Realist | Why |
|---|---|---|---|
| Available hrs | 43/mo | 17-30/mo | above |
| Billable hrs | 20 | ~12 (range 5-18) | admin and sales overhead |
| Cold-outreach funnel | 30 outreach -> 8% meeting -> 25% close = 0.6 clients/mo | ~0.05-0.2 clients/mo cold; 0.3-0.5 warm | 1-3% cold reply-to-meeting [GUESS]; outreach also eats the hours |
| Droplet installs M12 | 1,500 base / 8,000 high per month | 200 base / 1,500 high per month | 70% of extensions <=100 users [FACT above]; no distribution plan; not even submitted |
| Droplet price | $15 lifetime | $5-8 one-time or $2-4/mo | category median $4.99/mo [FACT above]; GTM saw $5-7 one-time |
| SiteLens visitors M12 | 2,500/mo at 1% -> 120 payers | 300-800 visitors/mo at 0.5% | no audience, BP Pro already bundles tools [GTM FACT], Zillow ToS unresolved; Zillow data is free to anyone [Market Analyst] |
| MCP connectors | 2,000 visitors M12 | ~100 | Intuit ships its own QBO MCP; free open-source alternatives [FACT:https://www.codewords.ai/blog/quickbooks-mcp via Market Analyst] |
| Services clients M12 (#6) | 5 base | 1-2 base | funnel + capacity |
| Client churn (services) | not modelled | 2-3%/mo, ~25% lost per year [GUESS] | small-business bookkeeping |
| Time to first dollar | ~M2 for #6 | M3-M5 for #6; M2-M4 for #9 | sales cycle 1-3 months [GTM] plus onboarding |
| Job-switch delta | +$10k base, $0 low | see section 5 | current salary unknown [GAP] |

## 3. Realistic M12 monthly revenue (low / base / high) and probabilities
"P" = my probability that M12 run-rate gross reaches the threshold, starting now, including the chance the founder stalls or the employer clause blocks it. All P are [GUESS] anchored on the base rates above. Strategist's own P(5k) guesses (#6 5%, #2 5%, #8 3%) are too high.

| # | Candidate | M12 low | M12 base | M12 high | P(>=$1k/mo) | P(>=$5k/mo) |
|---|---|---|---|---|---|---|
| 1 | Droplet | $0 | $25 | $350 | 2% | <0.5% |
| 2 | SiteLens | $0 | $190 | $900 | 4% | <0.5% |
| 3 | Invoice SaaS | $0 | $0-80 | $400 | 2% | <0.5% |
| 4 | Tax_Test | no data | - | - | n/a | n/a |
| 5 | MCP consulting (as hours) | $0 | $300 | $1,650 | 10% | <1% |
| 6 | AI property AP/month-end service | $0 | $800 | $2,800 | 22% | 1% |
| 7 | Job-cost / draw / lien-waiver service | $0 | $300 | $1,500 | 8% | <0.5% |
| 8 | MCP connectors product | $0 | $0-50 | $300 | 2% | <0.5% |
| 9 | Fractional accounting, hourly | $0 | $700 | $1,800 | 22% | <1% |
| 10 | Tax templates | $0 | $100 (off season) | $800 | 2% | <0.5% |
| 12 | **Paid job-cost/controller contract work** (new, bridge) | $0 | $1,400 | $2,800 | 40% | 2% |
| 11 | Take a >=$95k job | see section 5 | | | | |

Notes on the numbers:
- #6 vs #9: same client pool, same hours. #6 base $800 = ~1.5 clients at ~$550 [GUESS discount from $600]; #9 base = 10 billable hr x $70. They are not additive. Only one of them can use the 12 billable hours.
- Services rows assume the employer allows it. P(employer clause is no obstacle) ~65% [GUESS; unread contract, flagged by 3 Round-1 agents]. I included that haircut. If the clause blocks, #5/#6/#7/#9/#12 go to ~0 and the only legal path is #1/#2/#10/#11.
- #12 is the highest-P side option because rate ($50-70/hr) and demand (inbound recruiters, E6) are observed, not modelled. Landing a part-time (10-15 hrs/wk) contract specifically is harder than landing a full-time one: most listings are full-time or 25+ hrs/wk [INFERENCE from posting sample]. At ~6 hr/wk x 4.3 x $55 = ~$1,400.
- Software rows: the Strategist's base cases are my high cases or above. The 1% visitor-to-paid number is fine for a product with intent traffic; the visitors figure is what fails.
- Chance at least one side project hits >= $1k/mo by M12: ~35% (services dominate, correlated through hours and the employer clause). Chance of >= $5k/mo from anything while employed: ~2%.

## 4. Expected hours per $ earned (year-1 cumulative; build + sales + delivery)
Unconditional on success. Hours are total invested over 12 months at the realistic 22 hr/mo ceiling or less. $ = expected gross cumulative revenue (base case x P(runs at all)). All [GUESS]; the ordering matters more than the decimals.

| # | Hours invested (yr 1) | Expected gross $ (yr 1) | Hours per $ | Effective $/hr |
|---|---|---|---|---|
| 1 Droplet | ~80 | ~$150 | 0.53 | $2 |
| 2 SiteLens | ~120 | ~$700 | 0.17 | $6 |
| 3 Invoice SaaS | ~120 | ~$300 | 0.40 | $2.5 |
| 5 MCP consulting | ~180 | ~$1,800 | 0.10 | $10 |
| 6 AP service | ~280 | ~$4,000 | 0.07 | $14 (steady state ~$60) |
| 7 Job-cost service | ~280 | ~$1,800 | 0.16 | $6 |
| 8 MCP connectors | ~150 | ~$150 | 1.0 | $1 |
| 9 Fractional hourly | ~240 | ~$4,200 | 0.057 | $17 (steady ~$45) |
| 10 Tax templates | ~70 | ~$600 | 0.12 | $9 |
| 12 Job-cost/controller contract | ~200 incl. 20 hr search | ~$11,000 | 0.018 | $55 |
| 11 Switch to >=$95k job | ~60-80 search/interview | $6-9k expected (section 5) | 0.01 | $100+ |

Software loses on hours/$ because year 1 is nearly all cost. Its only case is year 3+, which requires surviving, which the base rates say you mostly won't (57% earn $0 [FACT above]).

## 5. Opportunity cost: the >= $95k job and straight contract work
Current salary is unknown [GAP]. Property accountants in this market earn roughly $70-90k [GUESS], so the delta to $95k is $5-25k/yr; Strategist's $10k base is plausible. I am treating it that way.
- P(offer >= $95k within 12 months) ~60-65% [GUESS]: recruiter inbound exists [FACT: ledger E6]; relocation-willing widens it; but a "Senior Job Cost" title requires construction cost experience the resume lacks [FACT: ledger E4].
- Expected value of switching: P 0.62 x delta (base $10k) = **~$6k/yr = $500/mo expected**, with a P(delta >= $12k/yr, i.e. equal to $1k/mo) of ~35%. Costs ~60-80 hrs once. No ongoing hours.
- Tax: salary delta is taxed ~22-30% marginal; side income adds 15.3% SE tax on top, ~35-40% marginal [INFERENCE; standard US rates]. $1k/mo side gross is about $600-650 kept.
- Comparison at M12 expected gross: job switch ~$500/mo (0 hours/month ongoing) vs best service side option (#6/#9) ~$700-800/mo base (22 hrs/mo ongoing, 22% to reach $1k) vs #12 contract ~$1,400 base (26 hrs/mo ongoing, 40% to reach $1k). A side venture beats the job switch only in #12 and the high cases of #6/#9, and costs ~25 hours a month of your life plus employer-conflict risk.
- The two are not exclusive. A new job's moonlighting/IP terms may differ [Builder]. Best structure by expectation: take the >= $95k offer if it comes, and run #12/#9 hourly only if the new contract allows it.
- Services vs product: a contract at $55/hr beats every software candidate on expected $, on time-to-first-dollar (weeks), and on variance. Software only wins if hours/$ improves after year 2, an outcome with P(survive) of single digits.
- The ONLY thing a venture buys that a raise doesn't: learning and optionality. That has a price (hours), and nobody has priced the learning.

## 6. Verdict from the numbers (not the final verdict; Judge decides)
1. $5k/mo by M12 is not a realistic goal while employed full time. P ~2% for any path. Drop it from the framing.
2. $1k/mo by M12 is realistic only for paid services (#12 ~40%, #6/#9 ~22%). Software is 2-4%.
3. Droplet, SiteLens, MCP connectors, Invoice SaaS: treat as learning, not income. Do Droplet only if the store listing takes a weekend; its kill test (GTM: <1,000 installs and <5 paid in 60 days) is correct and I expect it to trigger.
4. The #11 job switch has the best risk-adjusted $ per hour by a wide margin. Don't do ventures instead of it; do them only as cheap tests alongside it.
5. Employer-conflict check on the Landmark agreement is a prerequisite for every services row. Cost: 1 hour. It moves the P of #12/#6/#9 by about 35 points.

## Kill-criteria I'd attach (dated)
- #12/#9/#6: 25 targeted applications/messages by Nov 30 2026; zero paid hours by Jan 31 2027 -> stop services and only pursue the job.
- Droplet: not live in the store by Nov 15 2026, or <1,000 installs by Jan 31 2027 -> stop.
- SiteLens: Zillow ToS unclear by Nov 15 -> stop. Otherwise <100 signups in 45 days -> stop.

## Dissent / what I'm unsure of
- Every probability above is [GUESS]. The extension and MicroConf sources are secondary and self-selected; the true base rate for a part-time, no-audience accountant is probably worse than my software numbers, but the services rates could be better than mine if his warm network is strong (the Strategist/GTM never tested it).
- Current salary is unknown, so the job-switch delta could be $0 or $30k; this swings section 5 completely.
- I may be too harsh on #6: a PM-specific productized close at ~$600 with AI leverage has a real margin story. I found no data on property-management bookkeeping rates or retention, only generic bookkeeper pricing.
- The 22 hr/mo figure is my guess about this person; if he truly has 10 hr/wk, the services numbers rise ~1.5-2x and P(>=$1k) for #6/#9 goes to ~35%.
