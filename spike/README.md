# Phase 1 spike: resume → JSON Resume

Sends a resume (PDF or text) to Claude and returns schema-validated
[JSON Resume](https://jsonresume.org) data.

```
cd spike && npm install
export ANTHROPIC_API_KEY=...        # never commit this
npm run parse -- resume.pdf out.json
npm test && npm run typecheck
```

- Model defaults to `claude-opus-5-5`; override with `RESUME_MODEL=claude-sonnet-5-5` etc.
- PDFs go to Claude directly as a document block (handles layout/columns), so no PDF.js step yet.
- Output is constrained with a Zod schema (`src/schema.ts`); refusals, truncation and schema misses throw.

## Spike questions still to answer (needs a real key)
1. Accuracy on ~20 varied resumes (use `d4rk3r/resumes-raw-pdf` on HF + your own).
2. Cost/latency per parse for Opus 5.5 vs Sonnet 5.5 vs Haiku 5.5.
3. Does the schema need extension fields (work authorization, salary, links) for form filling?
