import { describe, expect, it } from "vitest";
import { classifyEmployer } from "../src/jobs/employer.js";
import { quickScore, tierOf } from "../src/jobs/quick.js";
import { DEFAULT_PREFS } from "../src/jobs/types.js";

describe("classifyEmployer", () => {
  it("flags known staffing agencies and name patterns", () => {
    expect(classifyEmployer({ company: "Robert Half" }).type).toBe("recruiter");
    expect(classifyEmployer({ company: "Acme Staffing Solutions" }).type).toBe("recruiter");
    expect(classifyEmployer({ company: "Apex Systems" }).type).toBe("recruiter");
  });
  it("flags aggregators by company or 'via' source, but not plain boards", () => {
    expect(classifyEmployer({ company: "Acme", via: "ZipRecruiter" })).toMatchObject({ type: "aggregator" });
    expect(classifyEmployer({ company: "Jooble" }).type).toBe("aggregator");
    expect(classifyEmployer({ company: "Acme", via: "LinkedIn" }).type).toBe("direct");
  });
  it("uses description wording: two signals = recruiter, one = unclear", () => {
    const two = classifyEmployer({ company: "Globex", text: "Our client is hiring. W2 only, contract-to-hire." });
    expect(two.type).toBe("recruiter");
    expect(classifyEmployer({ company: "Globex", text: "We are a direct client of ours? no. contract-to-hire" }).type).not.toBe("direct");
    expect(classifyEmployer({ company: "Globex", text: "Great benefits." }).type).toBe("direct");
  });
  it("honours the user's own lists", () => {
    const prefs = { flagRecruiters: "Initech Talent\nBlue Sky", flagAggregators: "JobsRUs" };
    expect(classifyEmployer({ company: "Blue Sky Inc" }, prefs).type).toBe("recruiter");
    expect(classifyEmployer({ company: "Acme", via: "JobsRUs" }, prefs).type).toBe("aggregator");
  });
  it("Google apply options: only boards/aggregators and no direct link => aggregator; a direct link => not", () => {
    const only = ["Apply on Lensa", "Apply on Jobrapido", "Apply on LinkedIn"];
    expect(classifyEmployer({ company: "Pied Piper", via: "LinkedIn", applyOptions: only }).type).toBe("aggregator");
    expect(classifyEmployer({ company: "Hooli", via: "LinkedIn", applyOptions: [...only, "Apply directly on Hooli Careers"] }).type).toBe("direct");
    expect(classifyEmployer({ company: "Hooli", via: "LinkedIn", applyOptions: ["Apply on LinkedIn", "Apply on Hooli Careers"] }).type).toBe("direct");
  });
  it("is unclear when no employer is shown", () => {
    expect(classifyEmployer({ company: "" }).type).toBe("unclear");
  });
});

describe("quickScore", () => {
  const profile = { work: [{ position: "Accounts Payable" }], skills: [{ name: "Accounting", keywords: ["NetSuite", "invoice coding"] }] } as any;
  it("ranks a close title above an unrelated one", () => {
    const good = quickScore({ title: "Accounts Payable Specialist", location: "Remote", snippet: "NetSuite, invoice coding" }, profile, DEFAULT_PREFS);
    const bad = quickScore({ title: "Forklift Operator", location: "Dallas", snippet: "warehouse" }, profile, DEFAULT_PREFS);
    expect(good.score).toBeGreaterThan(70);
    expect(bad.score).toBeLessThan(25);
    expect(tierOf(good.score)).toBe("strong");
  });
  it("caps a deal-breaker and respects remote-only", () => {
    const p = { ...DEFAULT_PREFS, dealBreakers: "security clearance", remoteOnly: true };
    expect(quickScore({ title: "Accounts Payable", location: "Remote", snippet: "Requires security clearance" }, profile, p).score).toBe(10);
    const onsite = quickScore({ title: "Accounts Payable", location: "Austin, TX", snippet: "" }, profile, p);
    const remote = quickScore({ title: "Accounts Payable", location: "Remote", snippet: "" }, profile, p);
    expect(remote.score).toBeGreaterThan(onsite.score);
  });
});
