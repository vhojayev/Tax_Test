/** Injected into the page by the popup (must stay self-contained: no imports, no outside references).
 *  Produces a trimmed copy of the DOM so selectors can be repaired without sending whole pages. */
export function snapshotPage(): string {
  const keep = ["class", "id", "role", "aria-label", "data-testid", "href"];
  const clone = document.documentElement.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("script,style,svg,img,link,meta,noscript,iframe,picture,video,canvas").forEach((n) => n.remove());
  const walk = (el: Element) => {
    for (const a of Array.from(el.attributes)) {
      if (!(keep.includes(a.name) || a.name.startsWith("data-"))) el.removeAttribute(a.name);
      else el.setAttribute(a.name, a.name === "href" ? a.value.split("?")[0].slice(0, 60) : a.value.slice(0, 80));
    }
    for (const n of Array.from(el.childNodes)) {
      if (n.nodeType === 3) n.textContent = (n.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
      else if (n.nodeType === 1) walk(n as Element);
      else n.remove();
    }
  };
  walk(clone);
  return `<!-- ${location.hostname}${location.pathname} -->\n` + clone.outerHTML.slice(0, 900000);
}
