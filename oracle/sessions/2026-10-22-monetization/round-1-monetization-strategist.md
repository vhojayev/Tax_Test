# Round 1 — Monetization Strategist
Date: 2026-10-22 · Role: simplest model, price, bottom-up revenue per candidate. Checked by oracle-realist.

## Constraints used (the person, not the idea)
- ~10 hrs/wk = ~43 hrs/mo total. Services: assume at most ~20 billable hrs/mo (rest is sales, admin, learning). [INFERENCE]
- Capital: near zero. Claude API credits ran out Oct 16 [FACT: ledger E5]. Any AI-in-the-loop product needs a credit top-up of ~$20-50/mo at pilot scale. [GUESS]
- Month 3 = Jan 2027, M6 = Apr 2027, M12 = Oct 2027. Month 1 = Nov 2026. All models assume work starts now and revenue figures are monthly run-rate in that month, gross, before tax/fees.
- Full-time employer is Landmark Cos. (property accountant) [FACT: ledger E4]. Any outside accounting/property work for property managers may breach an outside-work or conflict clause. [INFERENCE] Read the employment agreement before #6, #7, #9.
- No CPA/EA license appears on the resume (CFA L1 only) [FACT: ledger E4]. Tax advice to the public is therefore off the table. [INFERENCE]
- Founder is an accountant, not a distribution person. Every software model below is gated by traffic I have no evidence he can get. [INFERENCE]

## Comparable pricing found (WebSearch, standard)
- Tab managers: OneTab free; Toby Pro ~$4.50-6/mo; Workona Pro ~$8/mo; free tiers are capped (60 tabs Toby, 5 workspaces Workona). Sources vary and several are from a competitor's blog. [FACT: https://supasidebar.com/blog/toby-vs-onetab-vs-supasidebar] (weak source)
- Chrome extension freemium conversion: one dev reports 0.8% across five extensions, 0.5-2% realistic; guides claiming 2-5% trace to generic freemium data. [FACT: https://dev.to/_350df62777eb55e1/real-numbers-freemium-chrome-extension-monetization-after-6-months-5hga]
- RE investor tools: DealCheck Plus $10-14/mo, Pro $20-29/mo, free tier exists; Mashvisor Lite ~$18-23/mo, Standard ~$50-70/mo. [FACT: https://www.crowdfundedwealth.com/reviews/dealcheck-review] [FACT: https://airbtics.com/mashvisor-review-still-useful-in-2023/]
- Zillow Research CSVs: free for public use with required attribution; commercial-use status NOT confirmed, and ToS bars scraping. [FACT: https://www.zillow.com/research/data/] Must read ToS before charging. [GAP]
- AP/invoice: Bill.com ~$38-89/user/mo; Docparser $32-133/mo; Tipalti $99/mo base. Automation only pays off above ~40-150+ invoices/mo (vendor claim). [FACT: https://fitsmallbusiness.com/accounting/best-invoice-automation-software/] [FACT: https://www.corpay.com/resources/blog/ap-automation-software-for-small-business]
- Freelance bookkeeping: $25-60/hr bookkeeper, $60-100+ CPA, $85-120 senior specialist; flat monthly packages commonly $300-700; one Upwork controller with real estate experience at $75/hr. [FACT: https://www.runfutureproof.com/blog/how-much-does-a-bookkeeper-cost] [FACT: https://beancount.io/blog/2026/10/05/how-much-does-a-bookkeeper-cost-2026-pricing-guide] No property-specific per-unit bookkeeping rate was found. [GAP]
- Lien waiver software: LienDone $49/mo flat, Waivr from $49/mo (Enterprise $199). [FACT: https://www.capterra.com/p/10045597/liendone/] [FACT: https://www.capterra.com/p/10044019/Waivr/]
- MCP freelance: $50-150/hr typical, ~$110 modal on a mentoring marketplace (inflated, consultancy-style). [FACT: https://mentorcruise.com/experts/mcp/] [FACT: https://www.upwork.com/hire/mcp-server-developers/]

## Method
Software: stock(n) = stock(n-1) x (1 - churn) + new(n), new = visitors x visitor-to-paid. Churn 8%/mo [GUESS]. Revenue = stock x price.
Services: revenue = clients (or billable hrs) x price, capped by hours.
All growth inputs are [GUESS] unless cited. They are the weakest part; treat the spread low-to-high as the honest answer.

---

## 1. Droplet (Chrome tab-map extension)
- **Model:** Freemium extension, one-time Pro unlock via ExtensionPay/Stripe. One-time because the category anchors at free (OneTab) and $5-8/mo sub fatigue is real. [INFERENCE]
- **Price:** $15 lifetime Pro (alt: $3/mo). Free tier must stay useful.
- **Arithmetic:** revenue/mo = new installs/mo x paid conversion x $15. Conversion 0.5/1/2% [FACT: dev.to above; base is its 0.8%].
  - M3: low 100 x 0.5% x 15 = $8 | base 400 x 1% x 15 = $60 | high 1,500 x 2% x 15 = $450
  - M6: low 150 x 0.5% x 15 = $11 | base 800 x 1% x 15 = $120 | high 4,000 x 2% x 15 = $1,200
  - M12: low 200 x 0.5% x 15 = $15 | base 1,500 x 1% x 15 = $225 | high 8,000 x 2% x 15 = $2,400
- To net $1k/mo at base conversion you need 6,700 new installs/mo. Install volumes are [GUESS]; the store is crowded and no distribution plan exists.
- Not recurring; there is no MRR to compound. Policy still has a placeholder email [FACT: ledger E1], so it has not shipped.

## 2. SiteLens (ZIP-level rent/price screener)
- **Model:** SaaS, freemium. Free: top-N ZIPs per metro. Paid: full ZIP screener, yield ranking, export, saved searches. Static site + monthly CSV refresh, so near-zero hosting cost and no API credits.
- **Price:** $19/mo (or $149/yr). Sits at DealCheck Plus / Mashvisor Lite level. [FACT: sources above]
- **Gate:** confirm Zillow ToS permits a paid derivative product. [GAP] If not, the data moat is nil (any investor can open the same CSV in Excel) and the product is dead.
- **Inputs (base):** visitors M3 500, M6 1,200, M12 2,500 -> visitor-to-paid 1% -> new paid 5, 12, 25/mo [GUESS]. Stock with 8% churn: M3 ~9, M6 ~34, M12 ~120.
  - Base MRR: 9 x 19 = $171 | 34 x 19 = $646 | 120 x 19 = $2,280
  - Low (visitors /3, conv 0.5% => 1/6 of base new): stock 1.5 / 6 / 20 -> $29 | $108 | $380
  - High (visitors x2, conv 2% => 4x base new): stock 36 / 136 / 480 -> $684 | $2,584 | $9,120
- Base reaches $1k MRR around M8 (stock ~59 x 19 = $1,121). Needs ~1,800+ monthly visitors by then; zero evidence of a channel. [GUESS]

## 3. Invoice processing (Processed/Unprocessed pipeline)
- **Model:** Small-business SaaS or per-invoice pricing. Crowded (Bill.com, Dext, Docparser). The only defensible version is a done-with-you service for a niche (property managers / GCs), which collapses into #6/#7.
- **Price:** $79/mo for up to ~300 invoices. API cost ~$0.02/invoice => ~$6/mo per customer. [GUESS] Gross margin fine; problem is selling, not cost.
- **Inputs:** outbound 30/mo x 8% meeting x 25% close = 0.6 customers/mo, delayed by sales cycle. Customers (net of churn): base 1 / 3 / 8; low 0 / 1 / 2; high 2 / 8 / 20.
  - Base: 1 x 79 = $79 | 3 x 79 = $237 | 8 x 79 = $632
  - Low: $0 | $79 | $158. High: $158 | $632 | $1,580.
- Only the high case reaches $1k (about M10). Weak. Break-even volume threshold (~40-150 invoices/mo) means micro-businesses won't pay. [FACT: corpay link above, vendor-biased]

## 4. "Tax_Test" (unknown tax tool)
- Repo is empty [FACT: ledger E7]. There is nothing to price. **No model.** If it exists as a concept, it is subsumed by #10. Do not count it as a candidate until the user says what it is.

## 5. MCP / agent skills (the learning thread)
- **Model:** Skill, not product. Monetize as hourly consulting/build-for-hire (MCP connectors, Claude workflows for finance teams). Courses/content are slower and need audience.
- **Price:** $60 / $90 / $120 per hr (low/base/high). Market $50-150, modal ~$110 but I discount for no portfolio. [FACT: mentorcruise/upwork above]
- **Billable hrs/mo:** low 0 / 4 / 8; base 5 / 15 / 20; high 10 / 20 / 25.
  - Base: 5 x 90 = $450 | 15 x 90 = $1,350 | 20 x 90 = $1,800
  - Low: $0 | 4 x 60 = $240 | 8 x 60 = $480
  - High: 10 x 120 = $1,200 | 20 x 120 = $2,400 | 25 x 120 = $3,000
- Buyers are mostly dev teams who will pick developers over an accountant with two Academy badges [FACT: ledger E5]. [INFERENCE] Credible only in the finance-user niche (an accountant who builds, selling to accountants).

## 6. AI-assisted month-end / AP coding / reconciliation for small property managers
- **Model:** Productized monthly service with AI doing the grunt work. Books only; no handling of client or trust money (state RE licensing and trust-account rules). [INFERENCE]
- **Price:** $600/mo flat for up to ~75 units (base), $450 low, $750 high; plus $500 one-time onboarding/cleanup (not in MRR). Anchored to $300-700 flat bookkeeping packages. [FACT: beancount link above] Property premium is [GUESS].
- **Effort:** ~4-5 hrs/client/mo with AI. 4 clients ~ 20 hrs = full capacity.
- **Clients:** low 0 / 1 / 2; base 1 / 3 / 5; high 2 / 5 / 7. Base pipeline check: 30 outreach/mo x 8% meeting x 25% close = 0.6 clients/mo; with a 1-2 month lag, 1 by M3, ~3 by M6 is consistent.
  - Base: 1 x 600 = $600 | 3 x 600 = $1,800 | 5 x 600 = $3,000 (25 hrs; exceeds 20-hr cap, so M12 base is optimistic)
  - Low: $0 | 1 x 450 = $450 | 2 x 450 = $900
  - High: 2 x 750 = $1,500 | 5 x 750 = $3,750 | 7 x 750 = $5,250 (~30 hrs/mo, the founder's entire budget)
- API/tool cost ~$20-40/client/mo. [GUESS]

## 7. Construction job-cost / draw package / lien-waiver automation
- **Model:** Software here is a trap: lien waiver tools sell at $49/mo flat. [FACT: capterra links] At $49, $1k needs 21 customers and $5k needs 103. So sell the service: draw-package + waiver tracking for small GCs/developers.
- **Price:** $400/mo retainer (base), $300 low, $500 high. [GUESS] ($250/draw is the alternative.)
- **Clients:** low 0 / 1 / 2; base 0 / 2 / 4; high 2 / 4 / 6.
  - Base: $0 | 2 x 400 = $800 | 4 x 400 = $1,600
  - Low: $0 | 300 | 600. High: 2 x 500 = $1,000 | 4 x 500 = $2,000 | 6 x 500 = $3,000.
- Fit unproven: resume shows property/project accounting and oilfield, no stated GC cost-accounting [FACT: ledger E4]; recruiters pulling toward job-cost roles is a job signal, not a client signal. [INFERENCE] Longer cold-start than #6 (new vertical).

## 8. MCP connectors for accounting systems (QuickBooks, AppFolio, Yardi, Sage) as a product
- **Model:** Paid connector (hosted MCP server) for accountants using Claude. Needs vendor API approvals (Intuit production app review etc.), security posture, hosting, and credits. [INFERENCE]
- **Price:** $29/mo per user.
- **Inputs (base):** visitors M3 300, M6 800, M12 2,000, conv 1% => new 3 / 8 / 20; stock ~5 / 23 / 96.
  - Base: 5 x 29 = $145 | 23 x 29 = $667 | 96 x 29 = $2,784
  - Low (half visitors, 0.3%): stock ~1 / 3 / 14 -> $29 | $100 | $400
  - High (1.5x visitors, 2%): stock ~16 / 68 / 288 -> $464 | $1,972 | $8,352
- Platform risk: vendors and Anthropic ship their own connectors, making the product free. [INFERENCE] Hosted financial data = compliance and liability burden for a part-time solo with no capital. Highest variance, worst time-to-first-dollar of the software ideas (approvals alone ~1-3 months). [GUESS]

## 9. AI-leveraged fractional property/project accounting (hourly/retainer)
- **Model:** Plain freelance service via Upwork/network. Fastest path to first dollar because there is nothing to build.
- **Price:** $60 low / $75 base / $90 high per hr. $75 matches an Upwork controller with real estate experience; ceiling $85-120 for senior specialists. [FACT: runfutureproof / beancount above]
- **Billable hrs/mo:** low 0 / 5 / 10; base 8 / 15 / 20; high 15 / 20 / 25.
  - Base: 8 x 75 = $600 | 15 x 75 = $1,125 | 20 x 75 = $1,500
  - Low: $0 | 5 x 60 = $300 | 10 x 60 = $600
  - High: 15 x 90 = $1,350 | 20 x 90 = $1,800 | 25 x 90 = $2,250
- Hard cap: hourly work cannot reach $5k in 43 hrs unless the rate is >$115/hr billed for every hour. Difference from #6 is only packaging: #6 prices the outcome and captures AI leverage; #9 sells hours.

## 10. Niche tax tooling (templates/calculators for CPAs and investors)
- **Model:** Templates/workbooks (depreciation schedules, cost-seg estimator, 1031 tracker) on Gumroad/Etsy-style storefront, sold to CPAs/preparers/investors. Not advice; no software liability. No licensing path for consumer-facing advice.
- **Price:** $49 one-time per template; bundle $99.
- **Units/mo:** low 0 / 1 / 3; base 3 / 8 / 15; high 10 / 30 / 60.
  - Base: 3 x 49 = $147 | 8 x 49 = $392 | 15 x 49 = $735
  - Low: $0 | $49 | $147. High: 10 x 49 = $490 | 30 x 49 = $1,470 | 60 x 49 = $2,940.
- Seasonality: M3-M6 = Jan-Apr 2027 tax season, the only window this segment buys. Must ship by mid-December. After April, demand likely drops ~50%+ until Q4. [INFERENCE] M12 (Oct) is off-peak, so a single-month M12 figure may overstate; units shown are annualized average.
- Reach $1k only in the high case during season.

## 11. Stay employed / take the $95k+ role (control)
- **Model:** No venture. The "revenue" is the salary delta. Current pay is unknown [GAP]; user wants >= $95k [FACT: ledger E4]; recruiter inbound exists [FACT: ledger E6].
- **Arithmetic (all [GUESS], gross):** delta/yr / 12. Low $0 (no move); base +$10k/yr = $833/mo from ~M6 (offer plus notice); high +$20k/yr = $1,667/mo from ~M4.
  - Base: $0 | $833 | $833. High: $0 | $1,667 | $1,667. Low: $0 | $0 | $0.
- Compared with the ventures above: a $12k+ raise matches a $1k/mo side income at no capacity cost, no conflict risk, and with a probability higher than any software outcome. Also requires zero credit top-up.

---

## Summary table (MRR, $; low / base / high)
| # | Model @ price | M3 | M6 | M12 |
|---|---|---|---|---|
| 1 Droplet | $15 lifetime | 8/60/450 | 11/120/1,200 | 15/225/2,400 |
| 2 SiteLens | $19/mo SaaS | 29/171/684 | 108/646/2,584 | 380/2,280/9,120 |
| 3 Invoice | $79/mo | 0/79/158 | 79/237/632 | 158/632/1,580 |
| 4 Tax_Test | no data | - | - | - |
| 5 MCP consulting | $60-120/hr | 0/450/1,200 | 240/1,350/2,400 | 480/1,800/3,000 |
| 6 Prop. AP service | $450-750/mo | 0/600/1,500 | 450/1,800/3,750 | 900/3,000/5,250 |
| 7 Job-cost service | $300-500/mo | 0/0/1,000 | 300/800/2,000 | 600/1,600/3,000 |
| 8 MCP connectors | $29/mo | 29/145/464 | 100/667/1,972 | 400/2,784/8,352 |
| 9 Fractional acctg | $60-90/hr | 0/600/1,350 | 300/1,125/1,800 | 600/1,500/2,250 |
| 10 Tax templates | $49 | 0/147/490 | 49/392/1,470 | 147/735/2,940 |
| 11 Job switch | salary delta | 0/0/0 | 0/833/1,667 | 0/833/1,667 |

## Fastest to $1k/mo (base case)
1. **#6** (~M4-5: two clients at $600 = $1,200; first dollar ~M2). Highest revenue per hour spent because price is per outcome.
2. **#9** (~M6: 13+ billable hrs x $75). Fastest first dollar (weeks) but slope capped by hours.
3. **#5** (~M6, same mechanics as #9, harder sale).
4. **#11** if current pay is >= $12k below target (~M5-6).
5. **#2** (~M8), **#8** (~M9-10), #7 (~M10-12 base).
Never reaching $1k in base: #1, #3, #10 (outside tax season).

## Fastest to $5k/mo
- No candidate reaches $5k in the base case by M12. 10 hrs/wk is the binding constraint: hourly work needs >$115/hr billed on 43 hrs; fixed-price services top out near 7 clients x $750.
- Only high-case paths: **#6** ($5,250 at M12, consumes every hour), **#2** ($9,120) and **#8** ($8,352), the last two requiring 2-4x base traffic and conversion that I have no evidence for. My probability of $5k/mo by M12: #6 ~5%, #2 ~5%, #8 ~3%, all others <2%. [GUESS]
- Honest reading: $5k/mo is a leverage problem, not a pricing problem. It needs either more hours (quit/reduce job) or software with proven distribution. Neither exists today.

## Cash cost to test
- #6/#9: $0-50 (credits, LLC optional). #2: ~$0-20/yr domain. #1: Chrome dev fee (~$5 one-time) [INFERENCE]. #8: hosting + approvals, $100-300 + weeks. #3: credits. All fit the capital limit.

## Dissent / what I'm unsure of
- Every growth input (traffic, conversion, close rate, churn) is [GUESS]; sources only validate prices and the 0.5-2% extension conversion band.
- I rank services above software on speed, but services trade the founder's hours 1:1 and may be blocked by employer conflict; if the employment agreement forbids it, #6/#7/#9 drop to zero and the ranking flips toward #2/#10/#11.
- The Zillow commercial-use question can kill #2 outright.
- Candidate list reconstructed from artifacts only [FACT: ledger gaps]; the real idea inventory may be missing items.
- I did not model founder-fit or compliance scoring; Judge's job.
