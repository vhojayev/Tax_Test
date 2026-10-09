import type { Suggestion } from "./match.js";

function setNative(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  // React/Vue track value via the prototype setter; assigning el.value directly is ignored.
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
}

const fire = (el: Element, types: string[]) => types.forEach((t) => el.dispatchEvent(new Event(t, { bubbles: true })));

/** Fill one suggestion. Returns false (and leaves the field untouched) if nothing fit. */
export function fillOne(s: Suggestion): boolean {
  const el = s.field.el;
  if (!s.values.length) return false;
  if (el instanceof HTMLSelectElement) {
    const wanted = s.values.map((v) => v.toLowerCase());
    const opt = Array.from(el.options).find((o) => wanted.includes(o.text.trim().toLowerCase()) || wanted.includes(o.value.toLowerCase()));
    if (!opt) return false;
    el.value = opt.value;
    fire(el, ["input", "change"]);
    return true;
  }
  setNative(el, s.values[0]);
  fire(el, ["input", "change", "blur"]);
  return true;
}

/** Fill every green suggestion; yellow/red are left for the user to click. */
export function fillGreen(all: Suggestion[]): number {
  return all.filter((s) => s.tier === "green" && fillOne(s)).length;
}
