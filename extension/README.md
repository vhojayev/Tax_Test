# JobFill extension

Chrome MV3 extension (TypeScript, esbuild). Two jobs:

1. **Job boards (Indeed, LinkedIn jobs, Google Jobs):** lights up each listing by match strength, tags
   RECRUITER / AGGREGATOR outright, and scores the open job against your profile with Claude
   (full description, evidence-based strengths/gaps/deal-breakers).
2. **Application forms (Greenhouse, Lever, Workday, Ashby...):** highlights fields green/amber/red and fills
   from your JSON Resume profile. Never submits; sensitive questions need a click.

```
npm install && npm run build      # -> dist/ (load unpacked in chrome://extensions)
npm test && npm run typecheck
```

Setup (popup, Setup tab): paste your Anthropic API key, import profile JSON. The key stays in
`chrome.storage.local` and is only used by the service worker (`src/background.ts`). Name/email/phone are
never sent for scoring (`matchingProfile` in `src/jobs/llm.ts`).

Layout
- `src/jobs/` adapters per site (`indeed.ts`, `linkedin.ts`, `google.ts`), `employer.ts` (recruiter/aggregator
  detection), `quick.ts` (free estimate), `llm.ts` (Claude calls), `handler.ts` (cache + errors),
  `controller.ts` (page orchestration)
- `src/ui/` shadow-DOM chip + detail panel; `src/overlay.ts` + `src/auto.ts` autofill UI
- `src/snapshot.ts` "Download page snapshot" for repairing selectors

Known limits: site selectors are best-effort and drift (use the snapshot button); verified end-to-end in
headless Chromium against fixture pages with a faked Anthropic API, not against the live sites or the real API.
