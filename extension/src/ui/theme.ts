/** Shared look for everything JobFill draws inside web pages (rendered in shadow roots, so site CSS can't leak in). */
export const THEME = `
:host{all:initial;
  --bg:#ffffff;--fg:#0f172a;--muted:#64748b;--line:#e2e8f0;--soft:#f1f5f9;--accent:#4f46e5;
  --green:#059669;--green-bg:#d1fae5;--amber:#b45309;--amber-bg:#fef3c7;--red:#dc2626;--red-bg:#fee2e2;--violet:#7c3aed;--violet-bg:#ede9fe;
  --shadow:0 8px 28px rgba(15,23,42,.16),0 1px 3px rgba(15,23,42,.12)}
@media (prefers-color-scheme:dark){:host{
  --bg:#0f172a;--fg:#f1f5f9;--muted:#94a3b8;--line:#1e293b;--soft:#1e293b;--accent:#818cf8;
  --green:#34d399;--green-bg:#064e3b;--amber:#fbbf24;--amber-bg:#451a03;--red:#f87171;--red-bg:#450a0a;--violet:#a78bfa;--violet-bg:#2e1065;
  --shadow:0 8px 28px rgba(0,0,0,.5),0 1px 3px rgba(0,0,0,.4)}}
*{box-sizing:border-box}
.wrap{font:12px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fg)}
button{font:inherit;color:inherit;cursor:pointer;border:0;background:none}
.pill{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:999px;font-weight:600;font-size:11px;
  background:var(--bg);color:var(--fg);border:1px solid var(--line);box-shadow:0 1px 2px rgba(15,23,42,.1);white-space:nowrap}
.dot{width:7px;height:7px;border-radius:50%;background:currentColor}
.green{color:var(--green);background:var(--green-bg);border-color:transparent}
.amber{color:var(--amber);background:var(--amber-bg);border-color:transparent}
.red{color:var(--red);background:var(--red-bg);border-color:transparent}
.violet{color:var(--violet);background:var(--violet-bg);border-color:transparent}
.muted{color:var(--muted)}
.row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
`;
