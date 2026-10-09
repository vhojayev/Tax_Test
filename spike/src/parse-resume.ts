import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { ResumeSchema, type Resume } from "./schema.js";

export const DEFAULT_MODEL = "claude-opus-5-5";

const SYSTEM = `You convert resumes into structured JSON Resume data.
- Copy facts exactly as written. Never invent employers, dates, degrees, skills or contact details.
- Leave a field out when the resume does not state it.
- Keep dates in the resume's own precision (YYYY, YYYY-MM or YYYY-MM-DD). Omit endDate for a current role.
- Put bullet points under "highlights", one string per bullet.`;

export type ResumeInput =
  | { kind: "pdf"; data: Buffer }
  | { kind: "text"; text: string };

// Only the slice of the SDK we use, so tests can pass a fake.
export type ParseClient = Pick<Anthropic, "messages">;

export async function parseResume(
  input: ResumeInput,
  opts: { client?: ParseClient; model?: string } = {},
): Promise<Resume> {
  const client = opts.client ?? new Anthropic();

  const doc: Anthropic.ContentBlockParam =
    input.kind === "pdf"
      ? {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: input.data.toString("base64"),
          },
        }
      : { type: "text", text: input.text };

  const response = await client.messages.parse({
    model: opts.model ?? DEFAULT_MODEL,
    max_tokens: 16000,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: [doc, { type: "text", text: "Extract this resume as JSON Resume." }],
      },
    ],
    output_config: { effort: "low", format: zodOutputFormat(ResumeSchema) },
  });

  if (response.stop_reason === "refusal") {
    throw new Error(`Model refused: ${response.stop_details?.category ?? "unknown"}`);
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("Resume output was truncated (max_tokens)");
  }
  if (!response.parsed_output) {
    throw new Error("Model output did not match the resume schema");
  }
  return response.parsed_output;
}
