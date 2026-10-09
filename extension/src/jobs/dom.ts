export const clean = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

/** Text of the first selector (in order) that matches and has text. */
export function pick(root: ParentNode, selectors: string[]): string {
  for (const sel of selectors) {
    const t = clean(root.querySelector(sel)?.textContent);
    if (t) return t;
  }
  return "";
}

export function attr(root: ParentNode, selectors: string[], name: string): string {
  for (const sel of selectors) {
    const v = root.querySelector(sel)?.getAttribute(name);
    if (v) return v;
  }
  return "";
}

/** Stable short id from text, for sites that expose no job id. */
export function hash(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

/** Description text with paragraph/list breaks kept, so the model sees structure. */
export function blockText(el: Element | null): string {
  if (!el) return "";
  const out: string[] = [];
  const walk = (n: Node) => {
    if (n.nodeType === 3) { out.push(n.textContent ?? ""); return; }
    if (!(n instanceof Element)) return;
    const tag = n.tagName;
    if (tag === "SCRIPT" || tag === "STYLE") return;
    const block = /^(P|DIV|LI|UL|OL|BR|H[1-6]|TR|SECTION)$/.test(tag);
    if (tag === "LI") out.push("\n- ");
    else if (block) out.push("\n");
    n.childNodes.forEach(walk);
    if (block) out.push("\n");
  };
  walk(el);
  return out.join("").replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}
