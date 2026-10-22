# Oracle chat-extraction prompt

Paste the block below into **a Claude chat or Project** that has history you want mined (run it once per Project / per big chat; it works best inside a Project that has many conversations). Paste Claude's answer back into the Oracle session.

---
You are feeding an advisory panel called Oracle. Review everything available to you in this conversation/project (and, if you have it, search past chats). Do NOT flatter or speculate. For every distinct **idea, product, project, or business concept** I discussed, output one row:

| # | Name | One-line description | Status (idea / prototype / built / shipped / abandoned) | Evidence (quote or paraphrase + roughly when) | Who would pay (if discussed) | Tech/tools involved | Blockers I mentioned | Money spent / time invested (if stated) |

Then add:
1. **Recurring themes** I keep coming back to (max 5), with how often.
2. **Things I started and dropped**, and the reason I gave.
3. **Skills/constraints I revealed** (job, hours available, budget, tools, fears).
4. **Gaps**: anything you can't see because it's outside this conversation/project.

Rules: mark anything inferred as `(inferred)`. Don't invent ideas I didn't discuss. Redact API keys, passwords, account numbers, and other people's personal info.
---
