#!/usr/bin/env python3
"""Digest a claude.ai data export (conversations.json, optional projects.json) for Oracle intake.

Usage: python3 parse_export.py <export_dir_or_conversations.json> [-o out_dir]
Writes out_dir/digest.md (one entry per conversation) and out_dir/stats.json.
Secrets (API keys, emails, long digit runs) are redacted before anything is written.
Runs locally; nothing is uploaded.
"""
import argparse, json, re, sys
from collections import Counter
from pathlib import Path

REDACT = [
    (re.compile(r"sk-[A-Za-z0-9_\-]{16,}"), "[KEY]"),
    (re.compile(r"(ghp|gho|xox[bap]|AKIA)[A-Za-z0-9_\-]{10,}"), "[KEY]"),
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"), "[EMAIL]"),
    (re.compile(r"\b\d{9,}\b"), "[NUM]"),
]
TOPICS = {
    "software/extension": r"chrome extension|manifest|web store|react|typescript|api|saas|app\b",
    "real estate": r"zillow|zhvi|zori|rent|cap rate|property|zip code|mortgage|airbnb",
    "accounting/tax": r"invoice|ledger|gaap|tax|1099|bookkeep|reconcil|quickbooks|accrual|audit",
    "agents/MCP/AI": r"\bmcp\b|agent|claude|llm|prompt|rag|embedding|subagent",
    "money/business": r"monetiz|pricing|revenue|customer|startup|\bmrr\b|stripe|freelanc|consult",
    "data/automation": r"scrape|csv|pipeline|automation|python|vba|excel|script",
}

def clean(t):
    for rx, rep in REDACT:
        t = rx.sub(rep, t)
    return re.sub(r"\s+", " ", t).strip()

def msg_text(m):
    if m.get("text"):
        return m["text"]
    return " ".join(c.get("text", "") for c in m.get("content", []) if isinstance(c, dict))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("-o", default="oracle/intake")
    ap.add_argument("--chars", type=int, default=600, help="chars kept per key message")
    a = ap.parse_args()
    p = Path(a.src)
    conv_path = p if p.is_file() else p / "conversations.json"
    convs = json.loads(conv_path.read_text(encoding="utf-8"))
    out = Path(a.o); out.mkdir(parents=True, exist_ok=True)
    rows, tally = [], Counter()
    for c in sorted(convs, key=lambda c: c.get("created_at", "")):
        msgs = c.get("chat_messages", [])
        human = [clean(msg_text(m)) for m in msgs if m.get("sender") == "human"]
        asst = [clean(msg_text(m)) for m in msgs if m.get("sender") == "assistant"]
        blob = " ".join(human + asst).lower()
        topics = [t for t, rx in TOPICS.items() if len(re.findall(rx, blob)) >= 3]
        tally.update(topics)
        rows.append(
            f"## {clean(c.get('name') or '(untitled)')}\n"
            f"- date: {c.get('created_at','')[:10]} · turns: {len(msgs)} · topics: {', '.join(topics) or '-'}\n"
            f"- user opened with: {(human[0] if human else '')[:a.chars]}\n"
            f"- user last said: {(human[-1] if human else '')[:a.chars]}\n"
            f"- assistant last said: {(asst[-1] if asst else '')[:a.chars]}\n"
        )
    (out / "digest.md").write_text(f"# Chat export digest ({len(convs)} conversations)\n\n" + "\n".join(rows), encoding="utf-8")
    (out / "stats.json").write_text(json.dumps({"conversations": len(convs), "topics": tally}, indent=2), encoding="utf-8")
    print(f"{len(convs)} conversations -> {out/'digest.md'}")
    projects = (p if p.is_dir() else p.parent) / "projects.json"
    if projects.exists():
        pj = json.loads(projects.read_text(encoding="utf-8"))
        lines = [f"- {clean(x.get('name',''))}: {clean(x.get('description') or x.get('prompt_template') or '')[:300]}" for x in pj]
        (out / "projects.md").write_text("# Projects\n" + "\n".join(lines), encoding="utf-8")
        print(f"{len(pj)} projects -> {out/'projects.md'}")

if __name__ == "__main__":
    main()
