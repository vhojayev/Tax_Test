// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { scanFields, suggest, type Profile } from "../src/index.js";
import { clearOverlay, showSuggestions } from "../src/overlay.js";

const profile: Profile = { basics: { name: "Jane Doe", email: "jane@example.com" }, extras: { work_authorization: "Yes" } };
const badges = () => Array.from(document.querySelectorAll<HTMLButtonElement>('[data-jobfill="badge"]'));

beforeEach(() => {
  document.body.innerHTML = readFileSync(resolve(process.cwd(), "test/form.html"), "utf8");
  showSuggestions(suggest(scanFields(document), profile));
});

describe("overlay", () => {
  it("adds one badge per field and colours outlines by tier", () => {
    expect(badges()).toHaveLength(11);
    expect((document.getElementById("fn") as HTMLElement).style.outline).toContain("#16a34a");
    expect((document.getElementById("wa") as HTMLElement).style.outline).toContain("#d97706"); // saved but sensitive
    expect((document.getElementById("li") as HTMLElement).style.outline).toContain("#dc2626");
  });
  it("badges are non-submitting buttons", () => {
    expect(badges().every((b) => b.type === "button")).toBe(true);
  });
  it("clicking a yellow badge fills just that field", () => {
    const wa = document.getElementById("wa") as HTMLSelectElement;
    (wa.nextElementSibling as HTMLButtonElement).click();
    expect(wa.value).toBe("Yes");
    expect((document.getElementById("fn") as HTMLInputElement).value).toBe("");
  });
  it("rescan replaces badges instead of stacking them", () => {
    showSuggestions(suggest(scanFields(document), profile));
    expect(badges()).toHaveLength(11);
  });
  it("clearOverlay removes badges and outlines", () => {
    clearOverlay();
    expect(badges()).toHaveLength(0);
    expect((document.getElementById("fn") as HTMLElement).style.outline).toBe("");
  });
});
