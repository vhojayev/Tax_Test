# Round 1 — Domain Advisor (oracle-domain-advisor)
Date: 2026-10-22. Checked by: oracle-red-team.

## Founder profile (reality check)
- Property/project accountant at Landmark Companies since Oct 2024 (about 2 yrs). Before that, Schlumberger 2015-2024 as tax accountant, AR supervisor and FP&A. VBA, GAAP, SOX, CFA L1. [FACT: ledger E4, self-reported]
- Not a CPA, EA or attorney. [INFERENCE: the resume in E4 lists no such credential; ledger does not state it. CONFIRM WITH USER.]
- Full-time job, so nights and weekends only. Wants a job paying >= $95k. [FACT: user brief]
- Likely Florida-based. [INFERENCE]
- Real-estate accounting depth is about 2 years. The deep expertise (oilfield-services tax, AR, FP&A) is not in the target markets. [INFERENCE] The "property accountant moat" is thinner than it sounds. Two years makes you competent, not an authority other accountants defer to.
- Employer-conflict risk: building a product or service for property/construction clients while employed by a property company can breach IP-assignment, moonlighting or conflict-of-interest clauses. [INFERENCE] Read the Landmark employment agreement before anything else.

## Licensing / credential lines (verified)
- **Florida CPA title and attest.** Only licensed CPAs may use "CPA" or practice public accounting. Attest work (audit, review, SSAE) requires a license and a licensed firm. Non-CPAs may still prepare tax returns and prepare financial statements without expressing an opinion. [FACT: https://flsenate.gov/Laws/Statutes/2024/Chapter473/All, per search summary; verify current text] Bookkeeping and month-end close work appear to be outside the restriction. [INFERENCE: not stated explicitly in the sources]
- **Tax return prep.** A PTIN is required to prepare returns for pay. A PTIN does not grant representation rights. [FACT: https://www.cpapracticeadvisor.com/2018/01/22/how-to-choose-an-income-tax-preparer-which-tax-pros-can-represent-taxpayers-before-the-irs/28543/ (2018 source, check Pub 947 and Circular 230 for current rules)]
- **Circular 230 representation.** Only attorneys, CPAs and EAs have full representation rights before the IRS. Unenrolled preparers can represent only clients whose returns they prepared and signed, and only before examiners and customer service. Not before Appeals or Collection. Same source as above.
- **Tax advice as a software product.** Software that outputs tax positions for others raises preparer-penalty exposure, Circular 230 §10.34-type standards, and unauthorized-practice risk if it looks like advice. [INFERENCE] Calculators with disclaimers are common, but disclaimers do not remove liability when the output is wrong and relied on. [INFERENCE]
- **Securities and investment advice.** CFA L1 is not a license. Anything that recommends specific investments (SiteLens yield screening for investors included) risks looking like investment advice if it names buy/sell targets. [INFERENCE; no RIA analysis done]
- **Zillow data (SiteLens).** I could not retrieve Zillow's actual data terms. A secondary summary says research datasets are free for public use with attribution. Zillow's guidance points to a ZHVI user guide for citation. Website terms prohibit scraping. [FACT-weak: https://www.zillow.com/research/data/ , search summary only] Commercial redistribution or resale of the data is NOT confirmed as permitted. [GAP] Read the actual terms before building a paid product on it. Data is monthly and ZIP-level, so it is coarse and widely available (anyone can download it). [FACT: Zillow data page says updated monthly, per search summary]
- **Benchmarks for services.** Fractional controller rate average $147/hr (middle band $110-$170); bookkeeping $250-$1,500/month by transaction volume. [FACT: https://www.gofractional.com/insights/rates/controller ; https://getuku.com/articles/how-to-price-accounting-services/ , vendor sources, mixed quality] These are generic, not property- or construction-specific.
- Not researched this round (gap): what small property managers and GCs pay for accounting software (AppFolio, Buildium, Yardi Breeze, Sage 100 Contractor, Foundation, QuickBooks Contractor). I did not run a search for these prices. Treat any price from me as [GUESS]. Handing to market-analyst.

## Candidate ratings (founder-fit 1-5; 5 = best)

**1. Droplet (Chrome tab-map extension) — Fit 1/5.**
- Moat: none. Accounting expertise is irrelevant. Only the Claude/coding skill applies.
- Trap: the user's actual skills are not what wins in a crowded consumer-extension category (tab managers). [INFERENCE] Consumer utility with no distribution is a lottery.
- Licensing: none beyond privacy policy and store rules. Privacy policy still has a placeholder email. [FACT: ledger E1]

**2. SiteLens (ZIP-level rent/price screening) — Fit 2/5.**
- Moat: weak. The founder understands yield and NOI, but ZHVI/ZORI is free public data, ZIP-level and coarse. Investors need property-level underwriting. [INFERENCE]
- Trap: data redistribution terms unverified; "investor advice" drift; low willingness to pay for something derivable from a spreadsheet. [INFERENCE]
- Line: Zillow terms (above); not a licensed adviser, so frame as data/education.

**3. Invoice processing — Fit 3/5.**
- Moat: moderate. The founder knows AP workflows, coding, approvals and SOX-style controls, which is what buyers' controllers care about. VBA experience helps. [INFERENCE]
- Trap: AP automation is a crowded category (Bill.com, Ramp, Tipalti, AI-native entrants), and the buyers who need it are cost-sensitive. [INFERENCE] Invoice extraction is now commodity from LLMs.
- Line: handling client financial data means security expectations (SOC 2 questions from any serious buyer), but no license. [INFERENCE]

**4. "Tax_Test" (unknown tax tool) — Fit 2/5 as framed.**
- Moat: real tax background (Schlumberger tax accountant), but mostly corporate/international. Consumer or SMB tax is a different domain. [INFERENCE]
- Trap: highest liability density. Wrong output = penalties for a user. No CPA/EA to stand behind it. Repo is empty, so there is no work to build on. [FACT: ledger E7]
- Line: PTIN to prepare for pay; no representation; avoid outputting positions as advice. See licensing section.

**5. MCP / agent building as a skill — Fit 3/5 as income, 4/5 as career asset.**
- Moat: accounting + MCP is a rare pairing. Value is as a job-market differentiator (finance systems / FP&A automation roles at $95k+) more than as a standalone product. [INFERENCE]
- Trap: skills are not a product. Courses completed are badges, not proof. [FACT: ledger E5, badges only]
- Line: none.

**6. AI month-end/AP coding and reconciliation for small property managers — Fit 4/5.**
- Moat: real. Property accounting specifics (CAM recs, security deposit liabilities, owner distributions, trust accounting) are where generic tools fail, and the founder does this daily. [INFERENCE]
- Trap: sales cycle into small PMs, who are cost-sensitive and already on AppFolio/Buildium with built-in features; incumbents are adding AI. [INFERENCE] The founder's employer could be a conflict. Also, trust/escrow accounting for managed funds may carry Florida real-estate-license implications for the manager, not the software vendor. [GUESS; verify]
- Line: no CPA needed for software or non-attest bookkeeping. Data security expectations apply.

**7. Construction job-cost / draw / lien-waiver automation for small GCs and developers — Fit 3/5.**
- Moat: moderate. Project accounting is the founder's current title; draw packages and retainage are a known pain point, and recruiters are pitching job-cost roles (demand for the skill exists). [FACT: ledger E6 for recruiter outreach] But depth in construction specifically is unproven. [INFERENCE]
- Trap: lien-waiver forms are state-specific and legally prescribed. Florida has statutory waiver forms. Wrong form = legal exposure for users. [FACT-weak: I recall Fla. Stat. 713.20 statutory forms; not verified this round] Established players (Procore, Textura, Hh2, Foundation) own the mid-market. [INFERENCE]
- Line: not legal advice; use the statutory forms verbatim. Not a license issue for the accountant.

**8. MCP connectors for accounting systems (QuickBooks, AppFolio, Yardi, Sage) — Fit 3/5.**
- Moat: domain taste in what to expose (GL, AP aging, rent roll) is real; the integration is the hard part. [INFERENCE]
- Trap: platform dependency and API access gates (Yardi and Sage are closed to small developers; QuickBooks has an official ecosystem and is moving to its own AI/agent tooling). [INFERENCE] Low willingness to pay for a connector alone, and the ecosystem is crowded with free open-source MCP servers. [INFERENCE]
- Line: credential and token handling for client financial data is the real exposure.

**9. AI-leveraged fractional property/project accounting service — Fit 5/5 for fit, but see constraint.**
- Moat: strongest of the set. Sells the founder's actual skills to people who already pay. Rate benchmarks $110-$170/hr for controllers and $400-$1,500/month bookkeeping packages (sources above). [FACT-weak: vendor data]
- Trap: it is time-for-money on top of a full-time job, so capacity is maybe 5-10 hrs/week. At $60-$100/hr effective, that is a side income, not a path to replacing $95k. [INFERENCE] Employer moonlighting and conflict clauses (above) are the hard blocker. Client concentration in the same local property market as the employer is awkward.
- Line: do NOT use the CPA title or offer attest/audit/review. Prepare financial statements without opinion (allowed). Tax return prep needs a PTIN. Consider E&O insurance. [FACT per Florida statute summary above; E&O is INFERENCE]

**10. Niche tax tooling — Fit 2/5.**
- Moat: corporate-tax experience could support a very narrow niche (e.g., 1031/depreciation or cost-segregation estimators for small landlords) but 2 years of real-estate exposure and no CPA/EA undercut credibility. [INFERENCE]
- Trap: same as #4 plus the audience trusts credentials. Cost segregation, 1031, and passive-loss rules are already sold by credentialed firms. [INFERENCE]
- Line: no representation, no signing returns without PTIN, disclaimers insufficient. Output as "estimates for discussion with your CPA" at best.

**11. Stay employed, take the $95k+ job — Fit 5/5.**
- Moat: the skill mix (property/project accounting + SOX + FP&A + VBA + AI/MCP) is directly marketable, and recruiters are already calling. [FACT: ledger E6]
- Trap: none from the domain side; the cost is opportunity cost. The control option; every idea has to beat it. Note that the job search is also the best test of whether the "AI + accounting" positioning commands a premium, at zero build cost. [INFERENCE]

## Summary table
| # | Candidate | Fit | Domain moat | Biggest domain trap |
|---|---|---|---|---|
| 1 | Droplet | 1 | None | Skills irrelevant |
| 2 | SiteLens | 2 | Weak | Free data; Zillow terms unverified |
| 3 | Invoice processing | 3 | Moderate | Commodity category |
| 4 | Tax_Test | 2 | Weak-moderate | Liability, empty repo |
| 5 | MCP skill | 3/4 | Rare pairing | Not a product |
| 6 | PM close/AP AI | 4 | Real | Incumbents, small-buyer economics |
| 7 | Construction job-cost/draw | 3 | Moderate | Florida lien forms, incumbents |
| 8 | MCP connectors | 3 | Taste only | API gates, free competitors |
| 9 | Fractional service | 5 | Strongest | Capacity, moonlighting clause |
| 10 | Niche tax tool | 2 | Weak | Credential trust, liability |
| 11 | Stay employed | 5 | Strong | Opportunity cost |

## Where expertise is a real moat vs a trap (blunt)
- Real moat: property/project close and AP workflows, retainage and draw mechanics, SOX-style control design, knowing what a controller will actually accept. Pair with Claude/MCP only where it removes hours from that work.
- Trap: assuming "accountant who can code with AI" is rare enough to sell on its own. AI-accounting startups with funding are targeting exactly these workflows. [INFERENCE] Tax, because credentials gate trust and liability.
- Trap: the 2-year property depth. Buyers in this market want someone who has run a portfolio close, not someone who has done GL entries on one. [INFERENCE]

## Evidence gaps
- Zillow actual commercial terms not retrieved.
- Small PM / GC software and service spend not verified.
- Founder's CPA/EA/PTIN status and Landmark employment agreement unknown.
- Florida lien-waiver form requirement not verified this round.

## Dissent / what I'm unsure of
- I rate #9 highest on fit, but it may be the worst on "monetization" if the goal is scalable income; the market-analyst and realist should weigh that. Fit is not the same as payoff.
- Whether #6 is a product or just an internal tool that makes #9 more profitable is unresolved. I lean the latter.
- The Florida-based assumption is inference only.
