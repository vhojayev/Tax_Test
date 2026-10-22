# Round 1 — Market Analyst (2026-10-22)
Method: ~10 WebSearch (standard) + 3 WebFetch. Many results were vendor blogs/aggregators; weak sources flagged. Demand score = evidence of demand (1-5), not my opinion of the founder's odds.

## 1. Droplet (tab manager) — Demand evidence: 3/5 (demand real, payment weak)
- OneTab: 2,000,000 users, 3.8 stars, 14.6K ratings; free. [FACT:https://chromewebstore.google.com/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall] Proves volume demand, but the leader gives it away.
- Workona: freemium, Pro ~$7-8/mo ($96/yr), free tier capped at 5 workspaces (source is a rival's blog); G2 4.8/5 across 73 reviews. [FACT:https://supasidebar.com/blog/workona-alternative-tab-workspace-2026] [FACT:https://www.alternativeto.net/software/workona/about/] Funded ~$6M total, last raise 2019. [FACT:https://www.cbinsights.com/company/workona] Raised money, then no round since 2019: [INFERENCE] a modest business, not a venture-scale winner.
- Toby: freemium, Productivity/Team tiers; no user/revenue data found (Dealroom paywalled). [FACT:https://app.dealroom.co/companies/toby]
- Indie pricing clusters $3-9/mo. [FACT:https://trustmrr.com/startup/uncluttr?metric=mrr] listing claims $200k MRR with 1 active subscription, internally inconsistent; ignore. A tiny productivity extension sold for $2,200 with $400/yr revenue and 15 customers. [FACT:https://www.microns.io/startup-listings/productivity-chrome-extension]
- Freemium conversion 2-5% (vendor-blog benchmark, unverified); "10k+ users yields $2-10k/mo" is anecdotal. [FACT:https://konabayev.com/blog/extension-monetization-statistics-2026/] Only 2.63% of extensions exceed 10k users, 70.4% have <=100. Same source.
- [INFERENCE] Droplet is local-only/no-accounts by design (policy). That is a privacy selling point but kills sync/team features, which are what Workona/Toby charge for. Paid path is thin: a one-time or small Pro tier.
- [INFERENCE] Crowded and proven-free. Realistic outcome: tens to low hundreds of $/mo after months of distribution work. [GUESS] 10k users x 2-3% x $4 = ~$800-1,200/mo; reaching 10k users is the hard part.

## 2. SiteLens (ZIP rent-to-price) — Demand evidence: 3/5 (investors pay, but for deal-level, not ZIP-level)
- Mashvisor: $49.99 / $74.99 / $99.99 per month (annual billing) investor plans. [FACT:https://www.mashvisor.com/pricing]
- DealCheck: ~$10 Plus / $20 Pro per month annual, $14/$29 monthly; free tier. [FACT:https://www.crowdfundedwealth.com/reviews/dealcheck-review]
- Rentometer: free tier; Pro $29.99/mo; API custom. [FACT:https://www.bnbcalc.com/reviews/rentometer-review-2026]
- Not verified (searches failed): Roofstock, BiggerPockets, Zillow/Redfin native tools. Gap.
- [INFERENCE] Price ladder $10-100/mo shows investors pay, but buyers pay for property-level underwriting (address, comps, financing), not a ZIP index screen. Zillow's own ZHVI/ZORI data is free to download and visualise; a ZIP-level yield map is easily replicated and Zillow data license terms for commercial resale are unchecked (compliance flag).
- [GUESS] Best-case niche: a cheap newsletter/screener at $10-20/mo. Needs an audience (BiggerPockets-type) first.

## 3. Invoice processing (#3) / 6. AI AP + month-end for small property managers — Demand evidence: 4/5 for the category, 2/5 for a solo entrant
- Incumbents/pricing: Ramp free AP, Plus $15/user/mo [FACT:https://ramp.com/blog/accounts-payable/best-accounts-payable-automation-software] (vendor-biased); BILL Essentials ~$49/user/mo; Stampli quote-only; AvidXchange quote-only targeting real estate/construction; Wrk (managed AP for PMs) $1,000 build + $250/mo. [FACT:https://www.wrk.com/blog/8-best-accounts-payable-automation-software-for-property-management]
- Property-management accounting-as-a-service already exists: Proper (integrates AppFolio, Buildium, Entrata, MRI, NetSuite, Yardi), $4.8M seed, $9M Series A (2021, QED), Series B 2024. [FACT:https://housingwire.com/articles/proper-raises-4-8-million-to-become-the-uber-of-property-accounting] Shows demand AND a funded competitor.
- Well-funded horizontal AI accounting: Rillet $100M at $1B, 600+ customers (Aug 2026) [FACT:https://cpatrendlines.com/2026/08/24/rillets-raise-100-million-bets-on-fewer-accountants/]; Basis $1.15B valuation, serves accounting firms [FACT:https://news.bgov.com/financial-accounting/ai-for-accounting-startup-basis-hits-1-15-billion-valuation]. Digits targets QuickBooks/Xero SMBs (same Rillet source set). Pilot, Numeric: no data found.
- [INFERENCE] Small PM firms already have BILL/QuickBooks or Wrk-style services; a generic "invoice OCR/coding" tool is commoditised (Ramp gives AP free). The only gap is PM-specific coding (owner entities, trust accounts, CAM) plus AppFolio/Yardi integration, which Proper owns at the top end.
- Rooled, Vic.ai: not researched (time). Gap.

## 7. Construction job-cost / draw / lien-waiver automation — Demand evidence: 3/5
- Billd: material financing for subs, Procore partnership since 2020; no pricing found. [FACT:https://www.contractormag.com/technology/article/21132878/billd-announces-partnership-with-procore] Procore, AvidXchange are incumbents. No lien-waiver tool pricing retrieved. Gap.
- [FACT:Indeed recruiter outreach in ledger E6] Job-cost accountants are in demand as hires. [INFERENCE] Pain is real, but small-GC buyers already live in QuickBooks Contractor/Foundation/Procore; sales cycles are relationship-based.

## 8. MCP connectors for accounting systems — Demand evidence: 2/5 as a paid product
- Intuit has shipped its own QuickBooks MCP server; open-source and vendor alternatives (MintMCP, Meridian/Pilot hosted, Codewords community server covering 42 QBO operations, Truto). [FACT:https://meridian.pilot.com/blog/quickbooks-mcp-server] [FACT:https://www.codewords.ai/blog/quickbooks-mcp]
- [INFERENCE] Connectors are commoditising to free in months. Nobody is shown paying for a bare connector. AppFolio Realm-X / Yardi: nothing found (gap), likely closed ecosystems that kill third-party access.

## 9. Productized fractional property/project accounting — Demand evidence: 4/5
- Wrk charges $250/mo managed AP; Proper raised $20M+ selling exactly this. [FACT: links above] [FACT:ledger E6] recruiter inbound for cost accountants.
- [INFERENCE] Demand is the strongest of the set, cash-first, and the founder has the credential-equivalent skill. Constraint: capacity (hours), employer conflict (current Landmark Cos. job; check moonlighting/non-compete), no scale. Not a software business.

## 10. Niche tax tooling — Demand evidence: 2/5 (not researched deeply; Basis/Aiwyn ($113M, KKR) funded for tax prep; unlicensed-advice liability). [FACT:https://news.bgov.com/financial-accounting/ai-for-accounting-startup-basis-hits-1-15-billion-valuation] Crowded by well-funded players.

## 4/5/11
- #4 Tax_Test: empty repo; no evidence. Score 1/5.
- #5 MCP skill: skill, not a product; value is as a differentiator for #9. Score n/a.
- #11 Job at $95k+: recruiter demand exists (E6). Control.

## New adjacent opportunities
1. **Setup/consulting for accountants adopting Claude/MCP** (QBO MCP, bank-rec workflows): [FACT: Intuit survey cited by Meridian, accountants lose ~5 hrs/wk re-entering data] and Intuit's MCP aimed at tax preparers. [INFERENCE] Small firms lack engineers; sell $1-3k setup or training. Evidence of willingness to pay: indirect only. [GUESS] fastest cash among software-adjacent options.
2. **PM-specific month-end close checklist/recon templates (Excel/VBA + Claude)** sold to small PMs, a cheap info product. [INFERENCE] from Wrk's $250/mo price point showing small PMs pay for AP help. Weak evidence.
3. **Construction job-cost accountant contracting** (E6 inbound) as bridge cash; not a product.

## Evidence gaps
Zillow/Redfin/Roofstock/BiggerPockets tools; Rooled/Vic.ai/Pilot/Numeric pricing; Workona/Toby user counts; Droplet's own store status; Zillow data commercial licence; search-trend data (no tool).

## Dissent / what I'm unsure of
Source quality is mostly vendor blogs. I may be underrating Droplet if a distinctive visual "tab map" differentiator exists that I didn't evaluate (no screenshots/product seen). Scores rate market evidence, not founder odds.
