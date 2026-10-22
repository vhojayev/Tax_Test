# Audit (oracle-auditor), 2026-10-22. Target: verdict.md + process.

## 1. Question answered or swapped? PARTIAL PASS
- Evidence: verdict.md demotes the job move to "baseline, not a pick" (fixes the Judge's #1 swap) and picks two monetization options. [FACT:verdict.md Picks]
- Still drifted: user asked to "gather ideas from all prior Claude interactions, classify, assess." Verdict.md has no classification and does not state, in "The hard truth", that chats were never read. The gap appears only as gate Q4 and the last dissent bullet. [FACT:ledger.md Evidence GAPS]
- Hard truth #1 says "No software idea you have built or sketched has demand evidence." The panel saw only Drive/Gmail/Indeed artifacts, so "you have sketched" overclaims; it should read "ideas visible in your Drive/Gmail."
- "Potential" (user's word): Skeptic noted no guidance on what would make Droplet/SiteLens worth finishing. Not addressed.
- Fix: put the chat gap in line 1 of the hard truth; link or inline the classification (ledger A-D); reword #1.

## 2. Skeptic kills carried faithfully? PARTIAL PASS (numbers mostly match)
Matched to sources: 2-4% software, ~2% for $5k/mo, P1 $700-1,400 and 22-40%, 65% clear-contract (folded in), Judge scores 56/53/48/62/38/36/35/34/32/24/17, Droplet kill dates. [FACT:round-2-realist.md table; verdict-draft.md s1]
Mismatches:
- "thousands of certified QuickBooks consultants" vs source: "Anthropic partner network with 10,000+ certified consultants," vendor-sponsored, unverified. Wrong network and number. [FACT:verdict-attack.md s2]
- "$89-825" mixes currencies: BC CPA ~$89-99 (CAD, presumably) and ICAEW GBP 825 + VAT. No URLs in verdict.md.
- Realist's P(>=$1k) already includes the 65% contract haircut. Verdict presents P1 as "gated" plus those P values, so the reader cannot tell whether the haircut is double-counted. [FACT:round-2-realist.md line 41]
- P1 uses #12's 40% for the merged option. The Realist noted part-time 10-15 hr/wk contracts are rarer than full-time. That caveat (Red Team vs Realist dissent #3 in the draft) was dropped from the final dissent list.
- Dropped from the draft: attorney read ($300-500) for an ambiguous clause; "all P are guesses" is kept. Draft dissent #4 (is the AI premium real) survives only as the Nov 5 test; #5 (user's revealed preference is products, not bookkeeping) is partly folded into the last bullet.
- Verdict-skeptic's "no leverage exists is overstated" is carried (hard truth #3). Untested newsletter/data-product options are not mentioned.
- Fix: correct the consultant claim; give currencies and URLs; state the haircut explicitly; restore dissent #3.

## 3. Unlabeled / unsourced claims? FAIL
- Hard truth #2 ("only thing with plausible first dollar in 30-90 days"), the "known bias" claim in gate Q4, and "second job" are unlabeled. By PROTOCOL rule 1 they are void until tagged [INFERENCE].
- New Chair numbers with no source or label: "widen outreach once to Dec 15"; P2 kill "zero pilots from 20 conversations by 2027-01-15"; "10 conversations"; "2 pre-orders." Tag [GUESS].
- Zero URLs in verdict.md. Ranked-table scores are Judge [INFERENCE] but untagged. The Judge's own warning that [FACT:agent-file] is "sourced, weak" is not carried over.
- P2's score of 49 is correctly tagged [GUESS], but it ranks above #6 (48), a 1-point gap inside noise. The verdict says as much only obliquely.
- Table skips rank 3 and 8.

## 4. Consensus too easy / user constraints? PARTIAL FAIL
- Process gap: no Round 3 (Chair rebuttal) file and no Judge-final file. The Chair itself revised the verdict, while PROTOCOL Round 4 says the Judge revises. No scribe or auditor-pass file other than this one. [FACT:ls of session dir]
- Consensus was not easy on substance (red team and realist were hard). But the Chair adopted the Verdict Skeptic's re-ranking (P2 insert, job unranked) wholesale, and its 49 score came from the skeptic's own guess, not an advocate rebutting it.
- User constraint, evidence gap: reported, but buried (see 1).
- User offer to run a parser: tools exist (oracle/tools/parse_export.py, chat_extract_prompt.md) but verdict.md says only "see oracle/tools." No command, no dated step in the 30-day plan, no statement that this is the single biggest lever on the whole ranking. A rescore trigger without a date is not a kill criterion (rule 5).
- Fix: add a dated step (e.g. export by Oct 25, run `python3 oracle/tools/parse_export.py <dir>`, rescore) and mention the extraction prompt.

## 5. Final summary overstates? PARTIAL FAIL
- "Hard truth #1" scope overclaim (above).
- "Realistic range $0-30k/yr" is a stacked guess; tagged only partially.
- "Buyers exist" for Project 2 rests on institutional course listings; the verdict's own caveat is present, which is good, but the heading still reads as demand evidence for an unknown seller.
- Gate Q1 says salary >= $90k "drops the job-move track as a money lever." Source: ">= ~$90k, delta shrinks to ~$0-5k," which is not "drop." Overstated.

## Required fixes (priority)
1. Chat gap to the top; reword #1.
2. Correct the QuickBooks consultant claim and the currency mix; add URLs.
3. Tag all Chair-added dates and thresholds [GUESS]; tag hard truths #2-#3.
4. Add a dated parser step.
5. Restore the Red Team vs Realist #12 dissent; state the haircut explicitly.
6. Admit Round 3/Judge-final were skipped.

Dissent / what I'm unsure of: I did not re-verify web claims, only agent-to-verdict fidelity. I did not read round-1 files line by line, so a mismatch there could remain.
