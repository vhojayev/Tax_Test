// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { scanFields, suggest, fillGreen, type Profile, type Suggestion } from "../src/index.js";

// Fake person: the real profile stays out of the repo.
const profile: Profile = {
  basics: { name: "Jane Q Doe", email: "jane@example.com", phone: "(555) 010-0000", location: { city: "Springfield", region: "IL", countryCode: "US" } },
  work: [{ name: "Old Co", position: "Analyst", endDate: "2020-01" }, { name: "Acme Inc", position: "Accountant", startDate: "2022-01" }],
};

let by: Record<string, Suggestion>;
beforeEach(() => {
  document.body.innerHTML = readFileSync(resolve(process.cwd(), "test/form.html"), "utf8");
  by = Object.fromEntries(suggest(scanFields(document), profile).map((s) => [s.field.id || s.field.name, s]));
});

describe("scanFields", () => {
  it("skips hidden, file and button inputs", () => {
    expect(scanFields(document)).toHaveLength(11);
  });
  it("finds labels via for=, wrapping label", () => {
    expect(by["fn"].field.label).toBe("First Name");
    expect(by["org"].field.label).toBe("Current company");
  });
});

describe("suggest", () => {
  it("splits the name and matches contact fields as green", () => {
    expect([by["fn"].values[0], by["ln"].values[0]]).toEqual(["Jane", "Q Doe"]);
    for (const k of ["fn", "ln", "em", "ph", "ci", "co", "org"]) expect(by[k].tier).toBe("green");
  });
  it("uses the current job (no endDate), not the first listed", () => {
    expect(by["org"].values[0]).toBe("Acme Inc");
  });
  it("is red when the profile lacks the value (LinkedIn)", () => {
    expect(by["li"]).toMatchObject({ key: "linkedin", tier: "red" });
  });
  it("never greens sensitive fields, even with no saved answer", () => {
    expect(by["wa"]).toMatchObject({ sensitive: true, tier: "red" });
    expect(by["sal"]).toMatchObject({ sensitive: true, tier: "red" });
  });
  it("offers a saved sensitive answer only as yellow", () => {
    const s = suggest(scanFields(document), { ...profile, extras: { work_authorization: "Yes" } });
    expect(s.find((x) => x.field.id === "wa")).toMatchObject({ tier: "yellow", values: ["Yes"] });
  });
  it("leaves free-text questions unrecognised", () => {
    expect(by["why"]).toMatchObject({ key: null, tier: "red" });
  });
});

describe("fillGreen", () => {
  it("fills only green fields, picks select options by alias, and fires input events", () => {
    const seen: string[] = [];
    document.getElementById("fn")!.addEventListener("input", (e) => seen.push((e.target as HTMLInputElement).value));
    const n = fillGreen(Object.values(by));
    expect(n).toBe(7);
    expect((document.getElementById("fn") as HTMLInputElement).value).toBe("Jane");
    expect((document.getElementById("co") as HTMLSelectElement).value).toBe("usa");
    expect(seen).toEqual(["Jane"]);
    expect((document.getElementById("sal") as HTMLInputElement).value).toBe("");
    expect((document.getElementById("wa") as HTMLSelectElement).value).toBe("Select");
  });
});
