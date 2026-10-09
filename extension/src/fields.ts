export interface FieldInfo {
  el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  type: string;
  label: string;
  name: string;
  id: string;
  placeholder: string;
  autocomplete: string;
  options: string[];
}

const SKIP_TYPES = new Set(["hidden", "submit", "button", "reset", "image", "file", "password", "checkbox", "radio"]);

const clean = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").replace(/[*:]/g, "").trim();

function labelFor(el: Element): string {
  const doc = el.ownerDocument;
  const aria = clean(el.getAttribute("aria-label"));
  if (aria) return aria;
  const by = el.getAttribute("aria-labelledby");
  if (by) {
    const t = by.split(/\s+/).map((id) => clean(doc.getElementById(id)?.textContent)).filter(Boolean).join(" ");
    if (t) return t;
  }
  const id = el.getAttribute("id");
  if (id) {
    const l = Array.from(doc.querySelectorAll("label")).find((x) => x.htmlFor === id);
    if (l) return clean(l.textContent);
  }
  const wrap = el.closest("label");
  if (wrap) return clean(wrap.textContent);
  return "";
}

export function scanFields(root: ParentNode): FieldInfo[] {
  const out: FieldInfo[] = [];
  root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select").forEach((el) => {
    const type = el instanceof HTMLSelectElement ? "select" : el instanceof HTMLTextAreaElement ? "textarea" : (el.type || "text").toLowerCase();
    if (SKIP_TYPES.has(type) || el.disabled) return;
    out.push({
      el, type,
      label: labelFor(el),
      name: el.getAttribute("name") ?? "",
      id: el.getAttribute("id") ?? "",
      placeholder: el.getAttribute("placeholder") ?? "",
      autocomplete: (el.getAttribute("autocomplete") ?? "").toLowerCase(),
      options: el instanceof HTMLSelectElement ? Array.from(el.options).map((o) => clean(o.textContent)) : [],
    });
  });
  return out;
}
