# JobFill extension (phase 2)

Highlights job-application fields (green = confident, yellow = confirm, red = no answer) and fills
them from a local JSON Resume profile. Never submits; sensitive questions (visa, salary, EEO...) are
never filled without a click.

```
npm install && npm run build      # outputs dist/
npm test && npm run typecheck
```

Install: chrome://extensions → Developer mode → Load unpacked → pick `dist/`.
Use: click the icon → Import profile JSON → open an application page → Scan & highlight → Autofill green
(or click a badge to fill one field).

Layout: `src/profile.ts` (profile → canonical values), `fields.ts` (scan), `match.ts` (rules + tiers),
`fill.ts` (framework-safe fill), `overlay.ts` (badges), `content.ts`/`popup.ts` (extension glue).
Not yet verified inside a real extension install (only jsdom tests + built content script in Chromium).
