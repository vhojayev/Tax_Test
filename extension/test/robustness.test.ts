// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderChip, CHIP_ATTR } from "../src/ui/chip.js";
import { linkedin } from "../src/jobs/linkedin.js";

describe("robustness", () => {
  it("renderChip replaces an inert chip host (no shadow root) instead of crashing", () => {
    document.body.innerHTML = `<div id="card"><span ${CHIP_ATTR}="1"></span></div>`;
    const card = document.getElementById("card") as HTMLElement;
    expect(() => renderChip(document, card, { score: 80, ai: true, employer: { type: "direct", reasons: [] } })).not.toThrow();
    const hosts = card.querySelectorAll(`[${CHIP_ATTR}]`);
    expect(hosts).toHaveLength(1);
    expect((hosts[0] as HTMLElement).shadowRoot).not.toBeNull();
  });

  it("linkedin: description falls back to the whole section if the text-box marker is missing/empty", () => {
    document.body.innerHTML = readFileSync(resolve(process.cwd(), "test/fixtures/linkedin.html"), "utf8")
      .replace('data-testid="expandable-text-box"', 'data-x="y"');
    const d = linkedin.detail(document, new URL("https://www.linkedin.com/jobs/search-results/"))!;
    expect(d.description).toContain("Experience with NetSuite or SAP");
    expect(d.description).not.toContain("About the job");
  });
});
