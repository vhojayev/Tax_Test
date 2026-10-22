# Round 2 - Red Team (oracle-red-team)
Date: 2026-10-22 | Inputs: PROTOCOL, ledger, all five round-1 files. Four WebSearches (standard) to verify kill claims.

## 0. Verification results (new this round)
- AI premium for accountants: [FACT:https://www.cpapracticeadvisor.com/2026/03/25/ai-mentions-in-accountant-job-postings-rise-67/180275/] AI mentions in accountant postings rose 30% vs 18% YoY (Datarails), while lower-range accountant pay FELL $92k to $89k over the same year. [FACT:https://accountingtimes.com.au/profession/ai-wage-premium-yet-to-hit-australian-accountants] PwC found no AI wage premium for accountants in Australia (2023 data). [FACT: Robert Half via search summary] 87% of F&A leaders "offer higher pay for specialized skills incl. AI" - a survey of intent, not measured pay. The 20-30% and 15-62% figures are marketing/cross-occupation numbers ([FACT:https://www.mileseducation.com/blog/accounting/the-real-ai-salary-premium-for-accountants] is an education vendor). Search found no authoritative accountant-specific premium measurement. Verdict: demand for AI mentions is real; a priced premium for THIS user is unproven.
- QuickBooks MCP is already commodity: [FACT:https://numeric.io/blog/quickbooks-mcp] (vendor blog) and [FACT:https://www.accountingweekly.com/ai-integration/the-quickbooks-trick-most-accountants-havent-found-yet] say an Intuit QBO connector shipped May 2026 inside "Claude for Small Business" and a QuickBooks MCP in late 2025; many open-source servers exist (glama.ai, PyPI). Dates are from blogs; [INFERENCE] directionally reliable.
- AppFolio is already shipping native AI recs: [FACT:https://www.appfolio.com/features/accounting-and-reporting] automatic bank reconciliation via Plaid; [FACT:https://www.appfolio.com/blog/best-tools-for-managing-rental-property-operating-expenses-2026] AI-drafted entries/recs with staff approval. No independent accuracy data found.
- Moonlighting law: [FACT: search summary, workforce.com/mintz] most states impose a duty of loyalty; after-hours non-competing work is less likely a breach; invention-assignment clauses are litigated. No Florida-specific authority found (Fla. Stat. 542.335 not retrieved) [GAP]. Contract text is the only thing that matters.

## 1. Panel attack (do this first; it changes the scores)

**1a. Where the advisors agreed too easily**
- Everyone converged on #9/#6 as "best". The agreement is on the same unverified premise: that the user can legally sell property-accounting work to property managers while employed full time as a property accountant at Landmark. Four of five advisors flagged the contract as a risk, then ranked by assuming it clears. Domain-advisor gave #9 "5/5 fit" and in the same breath called it "possibly worst on monetization". Fit-5 on an idea whose revenue ceiling is ~$1.1-1.8k/mo base is a scoring artifact, not a finding. [INFERENCE]
- "Services beat software" is correct but trivial. It was never stated that services ARE the second job. Nobody priced the user's hours against the control (#11).
- All four non-skeptic advisors rated #11 (take the job) as the control, then no one ran the comparison honestly. Strategist's own math: a $12k raise = a $1k/mo side income at zero capacity cost. That single line makes #11 beat every other candidate on risk-adjusted terms, yet it sits at the bottom of the list as "the control." Under the Protocol, every idea "must beat" it. Almost none do. [INFERENCE from round-1-monetization-strategist]
- Nobody questioned the idea inventory. 6-10 are panel-generated, not user-originated (ledger section D). The user's real revealed preferences are Droplet (shipped to near-submission), SiteLens (123MB of data downloaded), invoices folder. We are ranking the panel's ideas over the user's own, with no evidence the user wants to run a bookkeeping business. [INFERENCE]

**1b. Weak sources**
- Rate benchmarks ($147/hr controller, $250-1,500/mo bookkeeping, $25-60/hr bookkeeper) come from gofractional, getuku, runfutureproof, beancount.io: all vendors/lead-gen. Not property-specific. Range spans 6x. [FACT: cited in round-1-domain-advisor, round-1-monetization-strategist; quality weak]
- Extension stats (konabayev, dev.to n=1 dev, microns.io, trustmrr - which the analyst themselves called inconsistent) are anecdotes.
- Construction software gaps cited from CrewCost (a competitor). SOC 2 costs from Scrut (a SOC 2 vendor). Yardi "$25K/interface" is a third-party estimate. QBO review via integrator blogs. [FACT: as cited in round-1-builder]
- AI-premium claim has no source in round 1 at all except an inference that the job search "tests" it. See section 0: the evidence is mixed.

**1c. Claims that are really guesses**
- Entire revenue tables: traffic, 8% close rate, 8% churn, "4-5 hrs per client with AI" - all [GUESS] by the strategist's own label, yet the table produces precise-looking numbers ($1,800 at M6) that the Chair will be tempted to quote. The 4-5 hrs/client/mo figure is the load-bearing number for #6 and has zero source. If real time is 8-10 hrs, 4 clients fills the budget and revenue halves per hour.
- "~3 clients by M6" requires a 0.6 clients/mo funnel (30 outreach x 8% meeting x 25% close). Cold B2B close rate of 25% from a stranger with no references is generous. [GUESS]
- "10 hrs/wk" itself is an assumption not given by the user as far as the files show. It is repeated by every advisor as fact. [GUESS]
- "Property accountant moat" - domain-advisor admitted it is 2 years deep. Then still rated #6 fit 4/5.
- The GTM says NARPM affiliates are "best-priced B2B room". It is priced from 2-3 chapters. A 5-minute slot to a room of property managers does not equal customers. [GUESS]
- Builder's "Landmark is a property accountant" conflict. The files say Landmark Cos. is the employer; nobody has established that Landmark is a property MANAGER, a developer, or a GC. Which of #6/#7/#9 conflicts depends on this. [GAP]

## 2. Is #9/#6 a business or a disguised second job?

Blunt answer: #9 is a second job. #6 is a second job with a marketing story, unless it turns into software, which nobody has shown a path to.

- Hours arithmetic: strategist's own cap is ~20 billable hrs/mo. At $75/hr base that is $1,500 gross, before E&O insurance, LLC, taxes (self-employment ~15.3% + income tax), API costs. Net maybe $900-1,100/mo for 43 hours/mo of effort: ~$21-25/hr net of all effort including sales. That is a lower hourly yield than the day job. [INFERENCE from round-1-monetization-strategist]
- Zero leverage: income stops when the user stops. No asset, no recurring revenue independent of labor. The user's goal ("monetize") plausibly means leverage. #6 as "productized service" gets better revenue per hour only if the AI cuts time; that is the unsourced 4-5 hrs claim.
- It competes with its own best alternative: those same 10 hrs/wk spent on interviewing/upskilling for a $95k+ role.
- Domain-advisor's own dissent: #6 may be "an internal tool that makes #9 more profitable". Agreed. That is a tool, not a product. [INFERENCE]
- Counter-argument (strongest): a service is the only thing on the list with a plausible first dollar in 30-60 days and it generates customer discovery for a later product. True, and Builder said it. But "customer discovery" only pays off if the user then builds the product; with 10 hrs/wk and clients eating all of them, there are no hours left to build. The service crowds out the product. [INFERENCE]
- Strategist's own probability: $5k/mo by M12 for #6 is ~5% [GUESS], and that case consumes every hour.
- What changes my mind: (a) a signed-off employment agreement that clearly permits it, (b) two paying pilots at >= $600/mo that take <= 5 hrs each measured, (c) clients who ask for the tool rather than the service (software pull).
- Competitive point: Proper ($20M+ raised, [FACT: housingwire per round-1-market-analyst]) and AppFolio native AI recs (section 0) are attacking exactly small-PM bookkeeping. Wrk sells managed AP at $250/mo, which sets the price ceiling a small PM thinks is normal. A $600/mo flat price is 2.4x that. [INFERENCE]

## 3. The employer-conflict blocker

- Round 1 treated it as a footnote (Builder "applies to 3,6,7,8,9", Strategist "read the agreement", GTM "could kill #9 outright"). It is gating, not a footnote. It is also cheap to resolve (read the offer letter/handbook/IP clause) and nobody has the document. [FACT: no document in evidence]
- Three separate exposures, not one: (1) moonlighting/outside-activity disclosure clause; (2) non-compete/non-solicit - if clients overlap with Landmark's managed owners or vendors; (3) invention/IP assignment - which can capture software built "related to employer's business" even off-hours. (3) hits #3, #6-software, #7, #8, not just services. SiteLens and Droplet are not related to Landmark's business on their face, so they are the LEAST conflicted ideas. The panel ranked the most conflicted ideas highest. [INFERENCE; legal state per search: duty of loyalty is general, invention assignment litigated, Florida specifics not found]
- Use of employer's knowledge, templates, chart of accounts, owner contacts: trade-secret exposure regardless of contract. The user's "property accountant domain moat" IS largely knowledge acquired at Landmark. [INFERENCE]
- Ironically the clean-room path is contracting with companies unrelated to Landmark's market - which also removes the "I know this market" selling point.
- Job-switch interplay: if the user takes a $95k role (#11), the conflict analysis resets. The panel should not ask the user to build a side business and look for a job simultaneously on an unread contract. [INFERENCE]
- What changes my mind: clause text. If silent on outside work and IP assignment is limited to work on employer time/resources, the blocker shrinks to the duty-of-loyalty / no-competing-with-employer rule and #9 is fine for non-competing clients.
- Cost to resolve: $0 (read it) to ~$300-500 (employment attorney review) [GUESS].

## 4. Is "AI + accounting premium" real?

- Real for demand: AI mentions in accountant postings +67% YoY [FACT: CPA Practice Advisor above].
- Not shown for wages: same dataset shows accountant lower-range pay down 3%; Australia no premium; Robert Half claim is leaders' stated intent. [FACT: section 0]
- Premium, if any, goes to what? [INFERENCE] Employers pay for someone who ships working automation in their stack (NetSuite, Yardi, Workday, Power BI), not for badges. The user has two Claude Academy badges (ledger E5), an empty repo, and an unpublished extension. The evidence of shipped AI-in-accounting work is currently zero. [FACT: ledger E1,E5,E7]
- Supply is rising fast: every accountant is now told to learn Claude/MCP; Intuit ships first-party connector for owners; the "accountant who uses Claude" is a 2024 differentiator becoming a 2027 baseline. [INFERENCE]
- The $95k target: the user wants >= $95k; Datarails puts accountant lower range at $89k. [FACT: above] A property/project accountant with SOX/FP&A/VBA in a good market could plausibly get $95k with no AI premium at all. The premium may be smaller than the delta between "current pay" (unknown, GAP) and market for an FP&A/SOX background. Most of the raise would come from role selection (FP&A, Schlumberger pedigree), not AI. [INFERENCE]
- What changes my mind: 3-5 live job postings in the user's target roles stating comp with AI-automation requirements vs comparable ones without; or recruiter feedback quoting a number.

## 5. Candidate-by-candidate attacks

Format: Cause of death #1 | Strongest counter | Evidence that changes my mind | What survives.

**#1 Droplet.** Death: monetizing it requires accounts/backend, contradicting the "no accounts, no analytics" policy that is its identity; Chrome rejects inconsistent disclosures and can ban the publisher. [FACT:developer.chrome.com user-data-faq per Builder] Plus free incumbents (OneTab 2M users). Counter: ship free, Pro as a local license key with no backend or user data (ExtensionPay-like), so privacy stays intact; costs $5. Change: 1,000+ installs in 60 days w/o spend. Survives: as a 2-week free-listing test and portfolio/learning artifact. Not as income: base M12 $225/mo [GUESS].

**#2 SiteLens.** Death: no moat plus unverified Zillow commercial rights. ZIP-level yield is a free-CSV exercise; buyers pay for deal-level underwriting (DealCheck $10-29, Mashvisor $50+); BP Pro bundles calculators. [FACT: round-1 market-analyst, GTM sources] Counter: niche newsletter / one-off $29 ZIP reports sidestep software and arguably sit inside "attribution" terms. Change: written Zillow OK + 100 email signups from 10 SEO pages in 45 days. Survives: as a free SEO/audience asset; the user already owns the data. Note it is also the least employer-conflicted idea.

**#3 Invoice processing.** Death: commodity (Ramp AP free, Bill.com, Dext) and you hold customers' financial docs. Counter: PM-specific coding rules (owner entities, CAM) are a gap incumbents ignore. Change: 3 of 10 prospects sign a $200/mo LOI after a free 50-invoice run. Survives only as a feature inside #6/#9. Distinct candidate: dead.

**#4 Tax_Test.** Death: nothing exists (empty repo), cannot be killed or scored; also unlicensed-advice liability. Counter: none; the user's real corporate tax background could seed a preparer-facing niche. Change: user states niche + buyer in one sentence. Survives: nothing. Remove from the table.

**#5 MCP skill.** Death: it is a skill, not a product; badges are not credentials; buyers hire developers. [FACT: ledger E5] Counter: it is the best career signal in the set and a way to win #11/#9. Change: one public, working finance MCP/Claude workflow the user built (not a tutorial). Survives as asset for #11. Do not try to sell it.

**#6 PM month-end AI.** Death: employer conflict plus incumbents (AppFolio native AI recs, Proper) plus the unsourced 4-5 hrs/client. Counter: small PMs on QuickBooks (not AppFolio) are underserved; Wrk shows they pay for AP help. Change: two paid pilots, measured hours, employment clause clear. Survives only as a service wrapper; software version: no evidence.

**#7 Construction job-cost / draw / lien-waiver.** Death: lien waivers are priced at $49/mo (LienDone, Waivr [FACT: Capterra per Strategist]), statutory forms create liability, and the user's construction depth is unproven (resume shows no GC role). Recruiter inbound is a hiring signal, not a client signal. Counter: draw package prep as a service at $400/mo for small developers. Change: 3 of 10 GC controllers describe a recurring painful manual draw process. Survives: weakly, as contract income (see 6c).

**#8 MCP connectors product.** Death: Intuit already ships its own QBO connector and MCP; open-source clones are free; Yardi/AppFolio gated. [FACT: section 0, Builder] Counter: hosted multi-client setup for accounting firms. Change: three firms pay for something Intuit's connector can't do. Survives: as open-source portfolio. Dead as a product; strategist's $8k high case is fantasy.

**#9 Fractional service.** See section 2. Death: the second-job problem plus employer contract. Counter: only item with plausible first dollar < 60 days and low cost. Change: clause cleared and net >$50/hr after all costs. Survives as a bridge, not as the answer.

**#10 Niche tax tooling.** Death: seasonal window (must ship by mid-December), no credential, funded competitors (Aiwyn $113M, Basis). Counter: $49 workbook templates carry no software liability. Change: 10 preparer interviews before Dec 1. Survives barely, as a template experiment. Low probability.

**#11 Take the $95k job.** Death: opportunity cost only; and it may not pay the premium the panel assumes. Counter (against my skepticism): it dominates every other option on risk and cash and removes the employer-conflict. Evidence it is wrong: none. Survives fully. It is the benchmark everything else loses to.

## 6. New adjacent ideas

**6a. Claude/MCP setup + training for small accounting firms.**
- Death #1: you are selling to a market Intuit and Anthropic are explicitly packaging for. [FACT: Intuit QBO connector in Claude for Small Business, May 2026, per accountingweekly - blog] The $1-3k setup fee decays toward zero as the connector turns into a toggle. Also a user with two badges and no shipped client work lacks references; buyers (CPA firms) are conservative about client-data exposure (IRC 7216, OPR Alert 2026-19 responsibility remains with practitioner [FACT: tx.cpa per Builder]).
- Counter: small firms genuinely lack an IT person; "dirty chart of accounts / duplicate vendors" problems mean value is cleanup plus workflow design, which is accountant work, not engineering. [FACT-weak: numeric.io blog]
- Change my mind: 3 discovery calls where a firm names a budget; or a paid first engagement at >= $1k.
- Survives: better than #8 because it sells accounting judgment. But the market analyst's "fastest cash" is [GUESS] and its WTP evidence is "indirect only" by their admission. It is also a second job (hours for money) with a decay curve.

**6b. PM month-end templates (Excel/VBA + Claude).**
- Death: low price ($49-99), no distribution, easily copied; Wrk $250/mo is the anchor for managed work, not templates. Market analyst's evidence rated "weak" by themselves.
- Counter: it is the only low-employer-conflict product aside from SiteLens... but templates derived from Landmark's workflow are the very thing an IP clause captures.
- Survives as a lead magnet for #9, not revenue.

**6c. Job-cost contracting.**
- Death: W-2/1099 contracting is a second job at best; the same Landmark conflict; and Indeed outreach is for FULL-TIME roles (ledger E6 says "Senior Cost Accountant" outreach), not contracts. [FACT: ledger E6]
- Counter: it is arguably the same effort as #11 but with higher hourly: contract rates for job-cost accountants are probably well above $75. [GUESS, no source]
- Change: three contract postings with rates. Survives as a better route to cash than #9 if the rate is real, because the client brings the work (no sales cost). But it fully fills hours.

## 7. What survives (honest concessions)
1. #11 survives untouched and should be the benchmark. The Strategist's math backs it.
2. #9/#6-as-service survives as a conditional bridge: only after the contract is read, and only as a measured 30-60-day experiment, never as the plan.
3. #5 survives as a career asset that feeds #11 (a shipped public finance-automation project beats a badge).
4. #1 and #2 survive as cheap, low-conflict, low-yield experiments. Droplet is near done. SiteLens data is in hand. Neither is income, but they test the user's actual distribution ability for ~$5-20.
5. 6a survives marginally ahead of #8. Everything else (#3, #4, #7 as product, #8, #10) I consider dead or unscoreable.

## 8. Suggested kill/priority checks (cheap and dated)
- By Oct 29: read Landmark employment docs; Y/N on outside work and IP. If blocked, #6/#7/#9/6a/6b/6c all die.
- By Nov 5: pull 5 live postings for target roles; record comp and AI requirement.
- By Nov 15: list Droplet free; email Zillow for written commercial-use terms.
- Do not run 30 outreach DMs until the first check clears.

## Dissent / what I'm unsure of
- I verified little about the legal text of the user's contract; if it is permissive, I overweighted the blocker.
- Search results were summaries; the Datarails, Intuit-date and AppFolio-AI claims are second-hand blogs and press. The AI-premium conclusion is "unproven", not "false".
- I assumed $95k means the user's current pay is below it; current pay is unknown, so the #11 advantage could be smaller than computed.
- I may be unfair to #9: for someone whose goal is simply an extra $1-1.5k/mo and a customer-discovery lab, it is rational. My attack assumes the goal is leverage.
