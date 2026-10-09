import { readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import { parseResume, DEFAULT_MODEL, type ResumeInput } from "./parse-resume.js";

// usage: npm run parse -- <resume.pdf|.txt> [out.json]
const [file, out] = process.argv.slice(2);
if (!file) {
  console.error("usage: npm run parse -- <resume.pdf|resume.txt> [out.json]");
  process.exit(2);
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Set ANTHROPIC_API_KEY (export it in your shell; do not commit it).");
  process.exit(2);
}

const buf = await readFile(file);
const input: ResumeInput =
  extname(file).toLowerCase() === ".pdf"
    ? { kind: "pdf", data: buf }
    : { kind: "text", text: buf.toString("utf8") };

const model = process.env.RESUME_MODEL ?? DEFAULT_MODEL;
const t0 = Date.now();
const resume = await parseResume(input, { model });
const json = JSON.stringify(resume, null, 2);
if (out) await writeFile(out, json + "\n");
else console.log(json);
console.error(`parsed with ${model} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
