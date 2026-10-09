// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startAuto } from "../src/auto.js";
import type { Profile } from "../src/index.js";

const profile: Profile = { basics: { name: "Jane Doe", email: "jane@example.com", phone: "1" } };
const panel = () => document.getElementById("jobfill-panel");
const panelBtn = () => panel()!.shadowRoot!.querySelector("button.go") as HTMLButtonElement;
const badges = () => document.querySelectorAll('[data-jobfill="badge"]').length;
let stop: () => void;

beforeEach(() => vi.useFakeTimers());
afterEach(() => { stop?.(); vi.useRealTimers(); document.body.innerHTML = ""; });

describe("startAuto", () => {
  it("highlights and shows the panel on an application form without any click", () => {
    document.body.innerHTML = readFileSync(resolve(process.cwd(), "test/form.html"), "utf8");
    stop = startAuto(profile);
    expect(badges()).toBe(11);
    expect(panel()!.shadowRoot!.textContent).toContain("Autofill");
  });
  it("stays silent on a login form and a newsletter signup", () => {
    document.body.innerHTML = '<label>Email<input type="email"></label><label>Password<input type="password"></label>';
    stop = startAuto(profile);
    expect(panel()).toBeNull();
    expect(badges()).toBe(0);
    stop();
    document.body.innerHTML = '<label>Name<input name="name"></label><label>Email<input type="email"></label>';
    stop = startAuto(profile);
    expect(panel()).toBeNull();
  });
  it("picks up a form that appears later (SPA step) and does not loop on its own badges", async () => {
    document.body.innerHTML = "<div id='root'></div>";
    stop = startAuto(profile);
    expect(panel()).toBeNull();
    document.getElementById("root")!.innerHTML = readFileSync(resolve(process.cwd(), "test/form.html"), "utf8");
    await vi.advanceTimersByTimeAsync(700);
    expect(badges()).toBe(11);
    await vi.advanceTimersByTimeAsync(5000); // our badges must not retrigger redraws
    expect(badges()).toBe(11);
  });
  it("panel button fills green fields only", () => {
    document.body.innerHTML = readFileSync(resolve(process.cwd(), "test/form.html"), "utf8");
    stop = startAuto(profile);
    panelBtn().click();
    expect((document.getElementById("em") as HTMLInputElement).value).toBe("jane@example.com");
    expect((document.getElementById("sal") as HTMLInputElement).value).toBe("");
  });
  it("stop() removes everything", () => {
    document.body.innerHTML = readFileSync(resolve(process.cwd(), "test/form.html"), "utf8");
    startAuto(profile)();
    expect(panel()).toBeNull();
    expect(badges()).toBe(0);
  });
});
