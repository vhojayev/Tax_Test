import { describe, expect, it, vi } from "vitest";
import { parseResume, type ParseClient } from "../src/parse-resume.js";
import { ResumeSchema } from "../src/schema.js";

const fake = (resp: object) =>
  ({ messages: { parse: vi.fn().mockResolvedValue(resp) } }) as unknown as ParseClient;

describe("ResumeSchema", () => {
  it("accepts a sparse resume", () => {
    expect(ResumeSchema.safeParse({ basics: { name: "Jane" } }).success).toBe(true);
  });
  it("rejects wrong types", () => {
    expect(ResumeSchema.safeParse({ basics: { name: 5 } }).success).toBe(false);
  });
});

describe("parseResume", () => {
  const input = { kind: "text", text: "Jane Doe" } as const;

  it("returns parsed output and sends the resume text", async () => {
    const client = fake({ stop_reason: "end_turn", parsed_output: { basics: { name: "Jane Doe" } } });
    const r = await parseResume(input, { client });
    expect(r.basics.name).toBe("Jane Doe");
    const args = (client.messages.parse as any).mock.calls[0][0];
    expect(JSON.stringify(args.messages)).toContain("Jane Doe");
  });

  it("sends PDFs as base64 document blocks", async () => {
    const client = fake({ stop_reason: "end_turn", parsed_output: { basics: {} } });
    await parseResume({ kind: "pdf", data: Buffer.from("%PDF-1.4") }, { client });
    const args = (client.messages.parse as any).mock.calls[0][0];
    expect(args.messages[0].content[0].source.media_type).toBe("application/pdf");
  });

  it("throws on refusal, truncation and unparsable output", async () => {
    await expect(parseResume(input, { client: fake({ stop_reason: "refusal", stop_details: { category: "cyber" } }) })).rejects.toThrow(/refused/);
    await expect(parseResume(input, { client: fake({ stop_reason: "max_tokens", parsed_output: null }) })).rejects.toThrow(/truncated/);
    await expect(parseResume(input, { client: fake({ stop_reason: "end_turn", parsed_output: null }) })).rejects.toThrow(/schema/);
  });
});
