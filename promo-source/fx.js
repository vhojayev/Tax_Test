/* TabMapper promo overlay kit (browser side). Injected with addInitScript; all pure DOM + WAAPI. */
(() => {
  if (window.FX) return;
  const EASE = { out: 'cubic-bezier(.16,1,.3,1)', io: 'cubic-bezier(.65,0,.35,1)', back: 'cubic-bezier(.2,1.5,.4,1)', lin: 'linear' };
  const ACCENT = '#8ae8bd', WARM = '#ff8a4c';
  const FONT = 'Inter, "Segoe UI", system-ui, -apple-system, Roboto, sans-serif';
  let root, curEl, capEl, capTimer;
  const el = (tag, css, parent, txt) => { const e = document.createElement(tag); if (css) Object.assign(e.style, css); if (txt != null) e.textContent = txt; (parent || root).appendChild(e); return e; };
  const svgNS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs, parent) => { const e = document.createElementNS(svgNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); (parent || root).appendChild(e); return e; };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function init() {
    if (root) return;
    root = document.createElement('div'); root.id = 'fx';
    Object.assign(root.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: 2147483647, fontFamily: FONT, overflow: 'hidden' });
    document.documentElement.appendChild(root);
    // fake cursor (follows the real mouse events Playwright dispatches)
    curEl = el('div', { position: 'absolute', left: '0', top: '0', width: '34px', height: '34px', transform: 'translate(1650px,820px)', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.45))', display: 'none' });
    curEl.innerHTML = '<svg viewBox="0 0 24 24" width="34" height="34" style="transition:transform .09s"><path d="M4 2l14 9-6 1.5L9 19z" fill="#fff" stroke="#10131c" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    addEventListener('mousemove', e => { curEl.style.display = FX.cursorOn ? 'block' : 'none'; curEl.style.transform = `translate(${e.clientX - 5}px,${e.clientY - 3}px)`; }, true);
    addEventListener('mousedown', e => { curEl.firstChild.style.transform = 'scale(.78)'; FX.ripple(e.clientX, e.clientY); }, true);
    addEventListener('mouseup', () => { curEl.firstChild.style.transform = ''; }, true);
  }
  const ready = () => { if (!root) init(); return root; };

  const FX = window.FX = {
    cursorOn: false, ACCENT, WARM, EASE, wait,
    cursor(on) { ready(); this.cursorOn = on; curEl.style.display = on ? 'block' : 'none'; },
    cursorAt(x, y) { ready(); curEl.style.transform = `translate(${x - 5}px,${y - 3}px)`; },
    ripple(x, y, color = '#fff') {
      ready(); const r = el('div', { position: 'absolute', left: x - 8 + 'px', top: y - 8 + 'px', width: '16px', height: '16px', borderRadius: '50%', border: `3px solid ${color}`, opacity: 0 });
      r.animate([{ transform: 'scale(.6)', opacity: .9 }, { transform: 'scale(4.2)', opacity: 0 }], { duration: 560, easing: EASE.out }).onfinish = () => r.remove();
    },
    caption(text, opts = {}) {
      ready(); clearTimeout(capTimer);
      const old = capEl;
      if (old) { old.animate([{ opacity: 1, transform: old.dataset.t }, { opacity: 0, transform: old.dataset.t + ' translateY(10px)' }], { duration: 160, fill: 'forwards' }).onfinish = () => old.remove(); capEl = null; }
      if (!text) return;
      const size = opts.size || 54, bottom = opts.bottom != null ? opts.bottom : 128;
      const c = el('div', { position: 'absolute', left: '50%', bottom: bottom + 'px', padding: '14px 36px 16px', borderRadius: '999px', background: 'rgba(8,12,24,.64)', backdropFilter: 'blur(16px)', webkitBackdropFilter: 'blur(16px)', color: '#fff', font: `700 ${size}px/1.12 ${FONT}`, letterSpacing: '-.5px', whiteSpace: 'nowrap', boxShadow: '0 12px 44px rgba(0,0,0,.42)', border: '1px solid rgba(255,255,255,.14)', opacity: 0 });
      c.textContent = text; c.dataset.t = 'translateX(-50%)'; capEl = c;
      c.animate([{ opacity: 0, transform: 'translateX(-50%) translateY(18px) scale(.9)' }, { opacity: 1, transform: 'translateX(-50%) translateY(0) scale(1)' }], { duration: 260, easing: EASE.back, fill: 'forwards' });
      if (opts.ms) capTimer = setTimeout(() => FX.caption(''), opts.ms);
      return c;
    },
    flash(ms = 260, peak = 1) {
      ready(); const f = el('div', { position: 'absolute', inset: '0', background: '#fff', opacity: 0 });
      f.animate([{ opacity: 0 }, { opacity: peak, offset: .18 }, { opacity: 0 }], { duration: ms, easing: 'ease-out' }).onfinish = () => f.remove();
    },
    fadeIn(ms = 500, color = '#fff') { ready(); const f = el('div', { position: 'absolute', inset: '0', background: color, opacity: 1 }); f.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'ease-out' }).onfinish = () => f.remove(); },
    fadeOut(ms = 400, color = '#000') { ready(); const f = el('div', { position: 'absolute', inset: '0', background: color, opacity: 0 }); f.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms, fill: 'forwards' }); return f; },
    ring(x, y, { r = 34, color = ACCENT, dur = 900, count = 2, width = 3 } = {}) {
      ready();
      for (let i = 0; i < count; i++) {
        const d = el('div', { position: 'absolute', left: x - r + 'px', top: y - r + 'px', width: r * 2 + 'px', height: r * 2 + 'px', borderRadius: '50%', border: `${width}px solid ${color}`, opacity: 0, boxShadow: `0 0 18px ${color}` });
        d.animate([{ transform: 'scale(1.9)', opacity: 0 }, { transform: 'scale(1.15)', opacity: 1, offset: .35 }, { transform: 'scale(1)', opacity: 0 }], { duration: dur, delay: i * (dur * .45), easing: EASE.out }).onfinish = () => d.remove();
      }
    },
    sweepRings(points, { color = ACCENT, stagger = 90, r = 30, dur = 800 } = {}) { points.forEach((p, i) => setTimeout(() => FX.ring(p.x, p.y, { r: p.r || r, color, dur, count: 1 }), i * stagger)); },
    ticker({ from = 0, to = 47, ms = 2400, x = 70, y = 70, size = 200, label = 'tabs', warmAt = .6, ease = t => 1 - Math.pow(1 - t, 3) } = {}) {
      ready();
      const wrap = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', display: 'flex', alignItems: 'baseline', gap: '22px', transformOrigin: '0 0', textShadow: '0 6px 40px rgba(0,0,0,.55)' });
      const num = el('span', { font: `800 ${size}px/1 ${FONT}`, fontVariantNumeric: 'tabular-nums', letterSpacing: '-6px', color: '#fff' }, wrap, String(from));
      const lab = el('span', { font: `600 ${Math.round(size * .3)}px/1 ${FONT}`, color: 'rgba(255,255,255,.85)' }, wrap, label);
      const t0 = performance.now(); let raf;
      const tick = now => { const t = Math.min(1, (now - t0) / ms), v = Math.round(from + (to - from) * ease(t)); num.textContent = v;
        const w = Math.max(0, (t - warmAt) / (1 - warmAt)); num.style.color = `rgb(255,${Math.round(255 - w * 135)},${Math.round(255 - w * 170)})`;
        if (t < 1) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
      wrap.stop = () => cancelAnimationFrame(raf); wrap.num = num; return wrap;
    },
    flyTo(node, rect, ms = 650) {
      const b = node.getBoundingClientRect(); const sx = rect.width / b.width, sy = rect.height / b.height, s = Math.min(sx, sy);
      const dx = rect.left + rect.width / 2 - (b.left + b.width / 2), dy = rect.top + rect.height / 2 - (b.top + b.height / 2);
      node.style.transformOrigin = 'center center';
      return node.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: .9, offset: .85 }, { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0 }], { duration: ms, easing: EASE.io, fill: 'forwards' }).finished;
    },
    odometer({ x, y, from, to, ms = 700, size = 120, label = 'tabs', color = '#fff' }) {
      ready(); const wrap = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', display: 'flex', alignItems: 'baseline', gap: '14px', textShadow: '0 6px 36px rgba(0,0,0,.55)', opacity: 0 });
      const win = el('div', { height: size + 'px', overflow: 'hidden', font: `800 ${size}px/${size}px ${FONT}`, fontVariantNumeric: 'tabular-nums', color, letterSpacing: '-4px' }, wrap);
      const col = el('div', { display: 'block' }, win); const a = el('div', {}, col, String(from)), b = el('div', {}, col, String(to));
      el('span', { font: `600 ${Math.round(size * .32)}px/1 ${FONT}`, color: 'rgba(255,255,255,.85)' }, wrap, label);
      wrap.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 220, fill: 'forwards', easing: EASE.out });
      const roll = (down) => col.animate(down ? [{ transform: 'translateY(0)' }, { transform: `translateY(-${size}px)` }] : [{ transform: `translateY(-${size}px)` }, { transform: 'translateY(0)' }], { duration: ms, easing: EASE.io, fill: 'forwards' }).finished;
      wrap.roll = roll; wrap.swap = (nf, nt) => { a.textContent = nf; b.textContent = nt; }; wrap.close = () => wrap.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).finished.then(() => wrap.remove()); wrap.setColor = c => { win.style.color = c; };
      return wrap;
    },
    stamp(text, { x = 960, y = 540, color = ACCENT, size = 96, ms = 1100, rot = -4 } = {}) {
      ready(); const s = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', transform: `translate(-50%,-50%) rotate(${rot}deg)`, padding: '10px 36px', border: `6px solid ${color}`, borderRadius: '18px', color, font: `800 ${size}px/1.1 ${FONT}`, background: 'rgba(8,12,24,.5)', backdropFilter: 'blur(8px)', opacity: 0 });
      s.textContent = text;
      s.animate([{ opacity: 0, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(1.8)` }, { opacity: 1, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(1)`, offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: ms, easing: EASE.out }).onfinish = () => s.remove();
    },
    badge(text, x, y, ms = 1400, color = ACCENT) {
      ready(); const b = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', padding: '8px 18px', borderRadius: '999px', background: color, color: '#06130d', font: `700 30px/1 ${FONT}`, boxShadow: '0 8px 30px rgba(0,0,0,.4)', opacity: 0 }, null, text);
      b.animate([{ opacity: 0, transform: 'scale(.4) translateY(10px)' }, { opacity: 1, transform: 'scale(1)', offset: .15 }, { opacity: 1, offset: .85 }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: ms, easing: EASE.back }).onfinish = () => b.remove();
    },
    tag(text, { x = 56, y = 960, ms = 700 } = {}) {
      ready(); const t = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', color: '#fff', font: `700 44px/1 ${FONT}`, textShadow: '0 4px 24px rgba(0,0,0,.6)', opacity: 0 }, null, text);
      t.animate([{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'none', offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: ms }).onfinish = () => t.remove();
    },
    keycaps(keys, { x = 1780, y = 960 } = {}) {
      ready(); const row = el('div', { position: 'absolute', right: '56px', bottom: '70px', display: 'flex', gap: '12px', flexDirection: 'row-reverse' });
      const caps = keys.map(k => { const c = el('div', { minWidth: '74px', height: '74px', padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', background: 'rgba(255,255,255,.14)', border: '2px solid rgba(255,255,255,.4)', color: '#fff', font: `700 34px/1 ${FONT}`, backdropFilter: 'blur(10px)', boxShadow: '0 6px 0 rgba(0,0,0,.35)', opacity: 0 }, row, k); return c; }).reverse().reverse();
      row.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'forwards' });
      caps.forEach(c => c.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 220, fill: 'forwards', easing: EASE.out }));
      return { press(i) { const c = caps[caps.length - 1 - i] || caps[i]; const cc = caps[i]; cc.animate([{ transform: 'translateY(0)', background: 'rgba(255,255,255,.14)' }, { transform: 'translateY(5px) scale(.94)', background: ACCENT, color: '#06130d', offset: .3 }, { transform: 'translateY(0)', background: 'rgba(138,232,189,.35)' }], { duration: 360, fill: 'forwards' }); }, close() { row.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).finished.then(() => row.remove()); } };
    },
    path(points, { color = ACCENT, width = 7, ms = 1400, hold = 1200, dash = true } = {}) {
      ready(); const svg = sv('svg', { width: innerWidth, height: innerHeight, style: 'position:absolute;left:0;top:0;overflow:visible' });
      const d = points.map((p, i) => (i ? 'L' : 'M') + p.x + ' ' + p.y).join(' ');
      const glow = sv('path', { d, fill: 'none', stroke: color, 'stroke-width': width * 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .25, filter: 'blur(4px)' }, svg);
      const line = sv('path', { d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
      const len = line.getTotalLength(); for (const p of [line, glow]) { p.style.strokeDasharray = len; p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: ms, easing: EASE.io, fill: 'forwards' }); }
      points.forEach((p, i) => { const dot = sv('circle', { cx: p.x, cy: p.y, r: 0, fill: color }, svg); dot.animate([{ r: 0 }, { r: 15 }], { duration: 300, delay: ms * (i / Math.max(1, points.length - 1)) * .9, fill: 'forwards', easing: EASE.back }); });
      const kill = () => svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished.then(() => svg.remove());
      if (hold) setTimeout(kill, ms + hold); return { svg, kill };
    },
    scrim({ x, y, r0 = 80, r1 = 560, ms = 1400, dim = .62, hold = 1500 }) {
      ready(); const s = el('div', { position: 'absolute', inset: '0', opacity: 0 }); const t0 = performance.now(); let alive = true;
      const draw = now => { if (!alive) return; const t = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - t, 3), r = r0 + (r1 - r0) * e;
        s.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(4,8,18,0) ${r}px, rgba(4,8,18,${dim}) ${r + 260}px)`; s.style.opacity = Math.min(1, t * 6); requestAnimationFrame(draw); };
      requestAnimationFrame(draw); const kill = () => { s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }).finished.then(() => { alive = false; s.remove(); }); };
      if (hold) setTimeout(kill, ms + hold); return { kill };
    },
    bloom({ x, y, color = 'rgba(138,232,189,.55)', ms = 1300, size = 900 }) {
      ready(); const b = el('div', { position: 'absolute', left: x - size / 2 + 'px', top: y - size / 2 + 'px', width: size + 'px', height: size + 'px', borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 68%)`, opacity: 0 });
      b.animate([{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)', offset: .35 }, { opacity: 0, transform: 'scale(1.5)' }], { duration: ms, easing: EASE.out }).onfinish = () => b.remove();
    },
    vignette(on = true) { ready(); let v = document.getElementById('fx-vig'); if (!on) { if (v) v.remove(); return; } if (!v) { v = el('div', { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(0,0,0,.42) 100%)' }); v.id = 'fx-vig'; } },
    iconSvg(kind, color = ACCENT) {
      const paths = { person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/><path d="M3 3l18 18"/>', shield: '<path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5z"/><path d="M8.5 12l2.6 2.6L16 9.5"/>', laptop: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 20h20"/>' };
      return `<svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[kind]}</svg>`;
    },
    async endcard({ markUrl, bg = 'blur', privacy = true, tagline = 'See how your tabs connect.', cta = 'On the Chrome Web Store' }) {
      ready();
      const card = el('div', { position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: innerWidth < 1300 ? '24px' : '30px', background: 'radial-gradient(ellipse at 50% 42%, rgba(18,36,62,.86), rgba(5,9,20,.95))', backdropFilter: 'blur(18px)', webkitBackdropFilter: 'blur(18px)', opacity: 0 });
      card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, fill: 'forwards' });
      if (privacy) {
        const vert = innerWidth < 1300; const rows = el('div', { display: 'flex', flexDirection: vert ? 'column' : 'row', gap: vert ? '22px' : '34px' }, card);
        const items = [['person', 'No account'], ['shield', 'No ads. No tracking.'], ['laptop', 'Stays on your computer']];
        items.forEach(([k, t], i) => { const c = el('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', width: vert ? '760px' : '420px', padding: vert ? '30px 20px' : '38px 20px', borderRadius: '28px', background: 'rgba(138,232,189,.08)', border: '1.5px solid rgba(138,232,189,.35)', opacity: 0 }, rows);
          c.innerHTML = FX.iconSvg(k); el('div', { color: '#fff', font: `700 40px/1.15 ${FONT}`, textAlign: 'center' }, c, t);
          c.animate([{ opacity: 0, transform: 'translateX(-60px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 200 + i * 130, easing: EASE.out, fill: 'forwards' }); });
        await wait(1700);
        rows.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.94)' }], { duration: 380, fill: 'forwards' }); await wait(380); rows.remove();
      }
      // orbiting bubbles converge into the logo
      const stage = el('div', { position: 'relative', width: '300px', height: '300px' }, card);
      const hues = ['#8ae8bd', '#6fb7ff', '#ff8a4c', '#c58bff', '#ffd36a', '#ff7aa8'];
      const orbit = el('div', { position: 'absolute', inset: '0' }, stage);
      hues.forEach((h, i) => { const a = i / hues.length * Math.PI * 2, R = 260; const b = el('div', { position: 'absolute', left: 150 - 22 + 'px', top: 150 - 22 + 'px', width: '44px', height: '44px', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${h} 55%, rgba(0,0,0,.35))`, boxShadow: `0 0 30px ${h}` }, orbit);
        b.animate([{ transform: `translate(${Math.cos(a) * R}px,${Math.sin(a) * R}px) scale(1.1)`, opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'translate(0,0) scale(.2)', opacity: 0 }], { duration: 1150, delay: i * 40, easing: EASE.io, fill: 'forwards' }); });
      orbit.animate([{ transform: 'rotate(-140deg)' }, { transform: 'rotate(0deg)' }], { duration: 1200, easing: EASE.io });
      const logo = el('img', { position: 'absolute', left: '50px', top: '50px', width: '200px', height: '200px', borderRadius: '46px', boxShadow: '0 0 90px rgba(138,232,189,.45)', opacity: 0 }, stage); logo.src = markUrl;
      logo.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 650, delay: 900, easing: EASE.back, fill: 'forwards' });
      const name = el('div', { font: `800 104px/1 ${FONT}`, color: '#fff', letterSpacing: '-3px', opacity: 0 }, card, 'TabMapper');
      name.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 1200, easing: EASE.out, fill: 'forwards' });
      const tag = el('div', { font: `500 46px/1.2 ${FONT}`, color: 'rgba(255,255,255,.88)', opacity: 0 }, card, tagline);
      tag.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 520, delay: 1450, fill: 'forwards' });
      const btn = el('div', { marginTop: '14px', padding: '20px 56px', borderRadius: '20px', background: ACCENT, color: '#06130d', font: `800 42px/1 ${FONT}`, opacity: 0, boxShadow: '0 12px 50px rgba(138,232,189,.35)' }, card, 'Add to Chrome');
      btn.animate([{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 480, delay: 1700, easing: EASE.back, fill: 'forwards' });
      el('div', { font: `500 30px/1 ${FONT}`, color: 'rgba(255,255,255,.62)', opacity: 1 }, card, cta);
      return card;
    },
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
