import { readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { parseResume, DEFAULT_MODEL, type ResumeInput } from "./parse-resume.js";

// usage: npm run parse -- <resume.pdf|.txt> [out.json]
const [file, out] = process.argv.slice(2);
if (!file) {
  console.error("usage: npm run parse -- <resume.pdf|resume.txt> [out.json]");
  process.exit(2);
}
// Claude Code cloud sessions reserve ANTHROPIC_API_KEY, so prefer RESUME_API_KEY.
const apiKey = process.env.RESUME_API_KEY ?? process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("Set RESUME_API_KEY (or ANTHROPIC_API_KEY); do not commit it.");
  process.exit(2);
}

const buf = await readFile(file);
const input: ResumeInput =
  extname(file).toLowerCase() === ".pdf"
    ? { kind: "pdf", data: buf }
    : { kind: "text", text: buf.toString("utf8") };

const model = process.env.RESUME_MODEL ?? DEFAULT_MODEL;
const t0 = Date.now();
const resume = await parseResume(input, { model, client: new Anthropic({ apiKey }) });
const json = JSON.stringify(resume, null, 2);
if (out) await writeFile(out, json + "\n");
else console.log(json);
console.error(`parsed with ${model} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
