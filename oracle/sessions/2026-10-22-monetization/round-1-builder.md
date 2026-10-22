# Round 1 — Builder (oracle-builder)
Date: 2026-10-22 · Assumption: 1 person, ~10 hrs/wk, Claude Code, day job. "Weeks" = calendar weeks to a *paid-capable* MVP, not first dollar. Ledger gaps apply: I never saw Droplet/SiteLens code, so their current state is [GUESS].

## Platform/legal facts verified (WebSearch standard, 2026-10-22)
- [FACT:https://developer.chrome.com/webstore/cws-payments-deprecation] Chrome Web Store payments are permanently shut; new paid items blocked 2020, existing stopped charging Feb 2021. Licensing API checks gone. Monetization = external processor (Stripe, Square, etc.) + your own license tracking.
- [INFERENCE] Practical route: free extension + paid tier unlocked by own account/license key (Stripe Checkout + a tiny backend, or a hosted helper). This adds a backend and account system to a product whose selling point (privacy policy, v1.6.1) is "local-only, no accounts, no analytics." Monetizing Droplet contradicts its own policy and requires rewriting it. [INFERENCE from ledger E1]
- [FACT:https://developer.chrome.com/docs/webstore/program-policies/user-data-faq] Any extension handling user data needs a privacy policy in the Dashboard, even if local-only; Limited Use disclosure; prominent in-UI consent for data collection; inconsistencies between policy, Dashboard disclosures, and behavior can suspend all of a publisher's items and ban the publisher.
- [FACT:https://developer.chrome.com/docs/webstore/review-process] Broad host permissions (`<all_urls>`, `https://*/*`) and lots/hard-to-review code slow review; new developers/new extensions get closer review. A tab manager that reads page previews likely needs `tabs`/host permissions. [INFERENCE]
- [FACT:https://developer.chrome.com/blog/cws-review-updates-2026] Aug 20 2026 Google post: submission volume surge has extended review times for many publishers (I saw only the intro; specifics unverified).
- [FACT:https://blog.chromium.org/2020/03/new-developer-dashboard-and.html] $5 one-time developer registration fee (2020 source; may have changed).
- [FACT:https://developer.chrome.com/blog/cws-policy-update-affiliate-ads-2025] Affiliate-link injection restricted to disclosed, user-triggered, direct-benefit cases. Ads/affiliate as a monetization path for a tab manager is mostly closed. [INFERENCE]
- [GUESS] Not verified: whether the Chrome store forbids external payment links inside the extension UI. Search returned nothing on it. Check current "Payments" policy before building paywall UI.
- Zillow: [FACT:zillow.com/research/data via search summary, page itself returned HTTP 403 to me] Zillow Research data is described as free to use with attribution; ZHVI User Guide covers citation. Search did NOT surface the actual license text on commercial use/redistribution. A compliance-tracker quote says the general Zillow Terms of Use bar displaying "other Zillow Companies' data" without written approval (not a legal determination). ZTRAX has separate restrictions on commercial-enterprise research. Status: **commercial redistribution rights are UNVERIFIED**. [GUESS] Showing derived yields with attribution is probably tolerated; reselling raw ZHVI/ZORI files or a data API is where it breaks. Email Zillow Research and get it in writing before charging.
- [FACT:https://developer.apideck.com/... / help.railz.ai (integrator guides, secondary)] QuickBooks Online production keys require a per-app assessment questionnaire (legal, technical, security), even for private apps connecting to live companies; dev keys do not work on live data. Pricing not found. [GUESS] Free to get keys, but expect weeks of back-and-forth.
- [FACT:https://www.yardi.com/?p=359162 and supergood.ai/api-report-card (secondary)] Yardi Standard Interface Partner: company ≥2 years old, ≥3 mutual Voyager clients, per-interface annual license fee, Data Exchange Agreement per interface, pilot client beta. Third-party estimate ~$25K per interface/yr + per-transaction; docs hidden until approved. A solo dev with zero clients cannot qualify. [INFERENCE] AppFolio/Sage access not researched [GAP].
- [FACT:https://www.tx.cpa/news/latest-news/news/article/2026/08/05/opr-guidance-on-use-of-ai-in-tax-practice-plus-some-practice-tips-for-your-firm] IRS OPR Alert 2026-19 (June 24 2026): responsibility for AI-assisted work stays with the human practitioner; §10.22 due diligence; §6694 preparer penalties; §6713/§7216 penalties for unauthorized use/disclosure of return info. [GAP] Nothing found on state UPL or liability for a direct-to-consumer tax-advice tool. [INFERENCE] Selling tools *to* credentialed preparers who stay responsible is far safer than selling advice to taxpayers. User holds no CPA/EA per resume (E4) [FACT: ledger E4 shows no license].
- [FACT:https://www.scrut.io/soc-2/cost-of-soc-2-audit and others, vendor blogs] SOC 2 first-year: Type 1 audit ~$5–25K; total first-year $30–110K+; tooling $8–30K/yr. Vendor-biased sources. [INFERENCE] Customers will ask for SOC 2 / security questionnaire before sending GL/AP data; a solo vendor at <$20K MRR cannot fund it, so you win only by *not holding their data* (local/BYO-key/customer-hosted) or selling to buyers who accept a questionnaire.

## Per-candidate

### 1. Droplet (Chrome tab-map extension)
- **Smallest MVP:** Submit existing v1.6.1 free to the store to get real usage data; paywall one feature (e.g., saved maps/sync) via Stripe + license key.
- **Weeks:** 1–3 to list free (mostly review wait + fixing the `[your email address]` placeholder); +4–6 to add paid tier with backend.
- **Cash:** $5 dev fee + ~$0–20/mo hosting + Stripe fees (2.9%+30c [GUESS]); domain ~$12.
- **Maintenance:** Medium-high. Chrome MV3/API changes, review friction on every update, support email, store-policy drift. Browser extensions break when Chrome changes. [INFERENCE]
- **Risks:** Paywall requires accounts → contradicts "no accounts" privacy promise → must update policy/Dashboard disclosures consistently or risk publisher ban (fact above). Review delays likely if broad permissions. No CWS payments, so DIY licensing. Crowded category (tab managers exist; user base unknown [GAP]). Ads/affiliates effectively off the table.
- **Builder verdict:** Cheapest to *launch*, weakest to *monetize*. Do it only as a 3-week side test.

### 2. SiteLens (ZIP-level rent/price yield screener)
- **Smallest MVP:** Static web app: pick state/metro, rank ZIPs by ZORI×12/ZHVI gross yield + trend; CSV export. Precompute JSON from the two Zillow files (123MB + 10MB, ledger E2); no backend beyond Stripe.
- **Weeks:** 3–5.
- **Cash:** ~$0–30/mo (static hosting, Stripe), domain ~$12. Data free.
- **Maintenance:** Low-medium: monthly Zillow refresh (manual download + script, ~1 hr/mo), since Zillow updates monthly [INFERENCE].
- **Risks:** Zillow commercial-use terms unverified (above). Gross yield ignores taxes/insurance/vacancy, so a "screening" disclaimer is needed; not investment advice but possible fair-housing/discrimination-use language in Zillow terms (search summary mentions a discriminatory-use prohibition, unverified). Zillow could change/withdraw data. Free alternatives exist and ZIP-level yield is a commodity [GUESS]. Low platform risk otherwise.
- **Builder verdict:** Easy build, thin moat; legal question is the gating item.

### 3. Invoice processing (AP automation)
- **Smallest MVP:** Single-purpose: upload PDF invoices, Claude extracts vendor/date/amount/GL suggestion into CSV matching QuickBooks/Yardi import format. No live API.
- **Weeks:** 4–6.
- **Cash:** Claude API per invoice ~$0.01–0.05 [GUESS]; hosting $20–50/mo; legal templates (ToS/DPA) $0–500. You already ran out of API credits (E5), so budget matters.
- **Maintenance:** Medium. Edge-case invoices, prompt drift, customer support, model price/behavior changes.
- **Risks:** Holds customers' financial docs → security questionnaires; SOC 2 asked by any mid-size buyer. Accuracy errors are your liability (limit via ToS, human-review UI). Crowded space (Bill.com, Dext, Ramp, etc. [GUESS: not researched, market analyst's job]). Direct QBO/Yardi API integration pushes into partner gating.

### 4. "Tax_Test" (unknown, empty repo)
- **Smallest MVP:** Undefined. Repo is blank [FACT: ledger E7]. Can't estimate; treat as candidate 10.
- **Weeks/cash/maintenance:** n/a until user defines it.
- **Risks:** See 10.

### 5. MCP / agent-building skill
- **Smallest MVP:** This is a skill, not a product. Monetizable forms: (a) a paid template/starter kit, (b) paid course/workshop, (c) consulting. Smallest: one open-source MCP server (e.g., for CSV/GL data) + a $49–99 "how to build finance MCPs" guide.
- **Weeks:** 2–4 for a guide/kit.
- **Cash:** ~$0–100.
- **Maintenance:** Medium; MCP spec and Claude tooling move fast, content goes stale in months [INFERENCE].
- **Risks:** Low legal. Claude Academy badges (E5) are not credentials of authority; audience of "finance people who want MCP" is unproven [GAP]. No platform gating.

### 6. AI month-end / AP coding & reconciliation for small property managers
- **Smallest MVP:** Concierge-first: user (a property accountant) runs it himself for 2–3 owners' exports (CSV bank + GL), producing reconciliation exceptions report. Software later.
- **Weeks:** 3 for a script-assisted concierge; 8–12 for self-serve with QBO connect.
- **Cash:** ~$50–150/mo (API, hosting); QBO sandbox free [GUESS].
- **Maintenance:** High once self-serve: every property mgmt system has different exports; Yardi/AppFolio exports vary by client config. [INFERENCE]
- **Risks:** Yardi API effectively closed to solo dev (≥3 Voyager clients, annual fee per interface; fact above) → must run on CSV exports/screenshots/user-run reports. QBO needs production assessment. Customer data security expectations; SOC 2 questions from any institutional owner. Day-job conflict: user works as property accountant at Landmark; using employer data or serving its competitors/clients could breach employment agreement/IP assignment [GAP: not seen, must read it]. This applies to 3, 6, 7, 8, 9 too.

### 7. Construction job-cost / draw package / lien-waiver automation (small GCs/developers)
- **Smallest MVP:** Template + automation that assembles a draw package (G702/G703 style, lien waiver tracker) from a spreadsheet of cost-to-date. Output PDF/XLSX.
- **Weeks:** 4–7.
- **Cash:** ~$50–100/mo; lien-waiver forms are state-specific, so budget a one-time attorney review ~$500–1,500 per state [GUESS].
- **Maintenance:** Medium; state lien-waiver statutes differ and change. [INFERENCE]
- **Risks:** Statutory lien-waiver forms (some states mandate exact wording) → using a wrong form can void a waiver; legal liability is real and ToS only partly shields. Sage/Procore/QBO integrations gated. Buyer base is small GCs who don't buy software easily [GUESS: GTM's call]. Mostly recruiters pull for this skill (E6) → demand for the skill ≠ demand for software [INFERENCE].

### 8. MCP connectors for accounting systems (QuickBooks, AppFolio, Yardi, Sage) as a product
- **Smallest MVP:** A QuickBooks Online read-only MCP server (OAuth, list accounts/transactions/vendors) published open-source + hosted paid version.
- **Weeks:** 5–8 including Intuit production-key assessment.
- **Cash:** ~$20–50/mo hosting; no Intuit fee found [GAP]; if hosting OAuth tokens, security spend rises.
- **Maintenance:** High: API versioning, OAuth refresh handling, Intuit compliance refreshes ("Intuit refreshes compliance criteria periodically", secondary source). Free QBO MCP servers already exist or will [INFERENCE; not verified here].
- **Risks:** Storing customers' accounting OAuth tokens = high-value target; breach is existential; SOC 2 expected by serious buyers. Yardi/AppFolio impossible solo (partner gating). Intuit itself/Anthropic ecosystem may ship first-party connectors, wiping out the niche [INFERENCE]. Best as an open-source portfolio piece, bad as standalone revenue.

### 9. AI-leveraged fractional property/project accounting service
- **Smallest MVP:** Offer month-end close + recs for 1–2 small owners/investors at flat monthly fee. No software; Claude Code as internal tooling.
- **Weeks:** 1–3 to land first client if outbound works [GUESS]; no build.
- **Cash:** ~$0–1,000 (LLC, bookkeeping E&O/cyber insurance, engagement letter template).
- **Maintenance:** Recurring labor: ~5–8 hrs/wk per client [GUESS]. It caps at ~1–2 clients at 10 hrs/wk and competes with the day job's hours.
- **Risks:** Moonlighting clause / conflict with Landmark (read employment agreement). Bookkeeping isn't licensed in most states, but calling it "CPA", issuing attest/assurance, or preparing returns for fee is regulated [INFERENCE; check state rules]. E&O insurance needed. Client data handled in your own tools = lower security burden than SaaS (you're the data processor under their control). Fastest path to cash and customer discovery of any option.

### 10. Niche tax tooling
- **Smallest MVP:** Preparer-facing workpaper helper (e.g., a calculator/checklist: depreciation schedules, cost-segregation inputs, K-1 tie-outs) sold to CPAs/EAs who retain responsibility. Don't ship taxpayer-facing "advice."
- **Weeks:** 3–6.
- **Cash:** ~$50/mo; attorney review of ToS ~$500–1,500 [GUESS]; if handling returns data, consider IRC §7216 consent mechanics.
- **Maintenance:** High: tax law updates annually; stale rules = wrong numbers = liability.
- **Risks:** Facts above: OPR Alert 2026-19 places responsibility on the practitioner; §6694/§7216 penalties exist. For a non-credentialed seller, giving individualized tax advice to consumers risks UPL/preparer-rules issues (not researched: [GAP]). User's tax background is Schlumberger corporate tax (E4), not individual/SMB practice [INFERENCE]. Incumbents: Intuit/Thomson Reuters/Wolters Kluwer own this space [GUESS]. "Tax_Test" intent unknown.

### 11. Baseline: take the $95k+ role
- **MVP:** n/a. **Weeks:** job search typically 2–4 months [GUESS]. **Cash:** $0. **Maintenance:** none beyond the job. **Risks:** low; opportunity cost is the side-project hours. Any venture must beat this. Note: taking a new job likely changes the moonlighting/IP picture for options 6–9; check the new offer's terms.

## Ranking by Builder-feasibility only (not the verdict)
Most shippable at 10 hrs/wk: 9 (no build) > 5 (guide) > 2 (static app) > 1 (free listing) > 3 > 7 > 10 > 6 self-serve > 8. Least shippable because of gating: 8 on Yardi/AppFolio, 6 with Yardi API.

## Hard blockers to resolve before building anything finance-related
1. Employment agreement (moonlighting, IP assignment) at Landmark [GAP].
2. Zillow written permission for commercial use (SiteLens).
3. Decide: no customer data stored (CSV in, CSV out, local/ephemeral processing) to sidestep SOC 2 expectations.

## Dissent / what I'm unsure of
- I did not read Zillow's actual license text (403) or Intuit's official docs (only integrator summaries). Both could be easier or harder than stated.
- Time estimates assume Claude Code does most coding; 10 hrs/wk is the binding constraint, and extension review delays are outside my control.
- I haven't seen Droplet/SiteLens code; "weeks to ship" could be shorter if they are nearly done.
- Demand/price questions belong to Market/GTM; a build that is easy may still earn $0.
