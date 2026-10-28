// Records every shot of scenario.md as its own mp4 in v2/shots/, plus markers json.
const { launch, sleep, startRec, V2, S, mouse, ease, fs } = require('./common.js');
const ONLY = (process.argv[2] || '').split(',').filter(Boolean);
const OUT = V2 + '/shots'; fs.mkdirSync(OUT, { recursive: true });
const VIEW = 'http://localhost:8766/view.html?clean';
const MARK = 'http://localhost:8766/assets/mark.png';
const markers = {};

(async () => {
  const { b, ctx } = await launch();
  const p = await ctx.newPage(); p.on('pageerror', e => console.log('PAGEERR', e.message));
  const M = mouse(p);
  const want = n => !ONLY.length || ONLY.includes(n);

  // ----- helpers -----
  const ev = (fn, ...a) => p.evaluate(fn, ...a);
  const bubbles = () => ev(() => [...document.querySelectorAll('.drop')].map(e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, l: e.getAttribute('aria-label') || '' }; }).filter(o => o.w > 0));
  const bub = async (needle, nth = 'big') => { const all = (await bubbles()).filter(o => o.l.toLowerCase().includes(needle.toLowerCase())); if (!all.length) throw new Error('no bubble ' + needle); all.sort((a, c) => c.w - a.w); return nth === 'big' ? all[0] : all[nth]; };
  const rec = async (name, fn, { lead = 700, tail = 600 } = {}) => {
    if (!want(name)) return;
    const mk = {}; const f = `${OUT}/${name}.mp4`; const r = startRec(f); await sleep(lead);
    const t0 = Date.now(); const mark = k => { mk[k] = (Date.now() - t0) / 1000 + lead / 1000; };
    try { await fn(mark); } catch (e) { console.log('SHOT FAIL', name, e.message); }
    await sleep(tail); await r.stop(); markers[name] = { ...mk, total: (Date.now() - t0) / 1000 + (lead + tail) / 1000 };
    console.log('rec', name, JSON.stringify(markers[name]));
  };
  const zoomPct = () => ev(() => parseInt(document.querySelector('#zlevel').textContent, 10) || 100);
  const emptySpot = () => ev(() => { for (const [x, y] of [[1500, 600], [1600, 420], [300, 600], [1500, 800], [1700, 300], [260, 420]]) { const e = document.elementFromPoint(x, y); if (e && !e.closest('.drop,.label,.tlabel,#dock,header,#panel,#peek,#tip,#selbar')) return [x, y]; } return [1500, 600]; });
  // pan so (tx,ty) lands at screen centre (drag on empty stage), then wheel-zoom at centre until pct reached
  const camTo = async (tx, ty, pct, { panMs = 800, zoomStep = 70 } = {}) => {
    const [ex, ey] = await emptySpot(); await M.glide(ex, ey, 450, ease.io); await p.mouse.down();
    const dx = 960 - tx, dy = 500 - ty; await M.glide(ex + dx, ey + dy, panMs, ease.io); await p.mouse.up(); await sleep(150);
    await M.glide(960, 500, 300, ease.io);
    for (let i = 0; i < 22 && (await zoomPct()) < pct; i++) { await p.mouse.wheel(0, -90); await sleep(zoomStep); }
    await sleep(500);
  };
  const clusterCenter = async re => { const a = (await bubbles()).filter(o => re.test(o.l)); return { x: a.reduce((s, o) => s + o.x, 0) / a.length, y: a.reduce((s, o) => s + o.y, 0) / a.length, n: a.length }; };
  const TRIP = /tokyo|shinjuku|capsule|cherry|skyfare|wayfarer|stayfinder/i;
  const loadMap = async (cover = false) => { await p.goto(VIEW + (cover ? '&cover=1' : '')); await sleep(cover ? 200 : 3000); };
  const fitMap = async () => { await ev(() => document.querySelector('#fit').click()); await sleep(1800); };

  // ===== S1 hook =====
  if (want('s1')) {
    await p.goto('file://' + V2 + '/strip.html'); await sleep(700);
    await rec('s1', async mark => {
      await ev(() => { FX.cursor(true); });
      await ev(() => { window.__tk = FX.ticker({ from: 12, to: 47, ms: 2400, x: 90, y: 330, size: 280, label: 'tabs' }); HOOK.climb(12, 47, 2400); });
      await sleep(350); await ev(() => FX.caption('47 tabs. Which one was it?', { bottom: 90 }));
      // hunting: scrub along strip, pause, flick back, jitter, click
      const R = async i => { const rs = await ev(() => HOOK.rects()); return rs[Math.min(i, rs.length - 1)]; };
      await M.glide(1850, 70, 1); let r = await R(40); await M.glide(r.x, r.y, 900, ease.io);
      r = await R(9); await M.glide(r.x + 6, r.y, 650, ease.io); await sleep(100);
      for (let i = 0; i < 2; i++) { r = await R(9); await M.glide(r.x + 30, r.y + 14, 130, ease.sine); await M.glide(r.x - 26, r.y - 8, 130, ease.sine); }
      r = await R(3); await M.glide(r.x, r.y, 380, ease.io); await M.click(); await ev(() => HOOK.activate(3)); mark('wrong1'); await sleep(240);
      r = await R(26); await M.glide(r.x, r.y, 360, ease.io); await M.click(); await ev(() => HOOK.activate(26)); mark('wrong2'); await sleep(220);
      await ev(() => FX.flash(220, 1)); mark('flash'); await sleep(160);
    }, { tail: 150 });
  }

  // ===== S2 turn =====
  if (want('s2') || want('s3') || want('s4') || want('s5') || want('s6') || want('s7') || want('s8') || want('s9') || want('s10') || want('s11')) {
    await p.goto('about:blank'); await sleep(300);
  }
  await rec('s2', async mark => {
    await p.goto(VIEW + '&cover=1'); await sleep(250);
    await ev(() => { window.uncover(800); });
    await ev(() => { window.__tk = FX.ticker({ from: 47, to: 47, ms: 10, x: 90, y: 190, size: 240, label: 'tabs' }); });
    await sleep(500); await ev(() => FX.bloom({ x: 960, y: 430, size: 1100 })); await ev(() => FX.caption('Or see them as a map.')); mark('cap');
    await sleep(900);
    await ev(async () => { const tk = window.__tk; const r = document.querySelector('#count').getBoundingClientRect(); setTimeout(() => { tk.num.textContent = '34'; tk.num.style.color = '#fff'; }, 380); await FX.flyTo(tk, { left: r.left, top: r.top, width: r.width, height: r.height }, 700); tk.remove(); });
    mark('fly'); await sleep(700);
  }, { lead: 500, tail: 400 });
  // normal map from here
  if (!ONLY.length || ONLY.some(n => /^s([3-9]|1[01])$/.test(n))) { await loadMap(); await fitMap(); }

  // ===== S3 bloom =====
  await rec('s3', async mark => {
    await ev(() => FX.cursor(true));
    await sleep(500);
    const cc = await clusterCenter(TRIP); console.log('trip centre', JSON.stringify(cc));
    await camTo(cc.x, cc.y + 20, 215, { panMs: 900, zoomStep: 60 }); mark('zoomed');
    await ev(() => FX.caption('Every tab remembers its parent.'));
    const h1 = await bub('tokyo trip');
    await M.glide(h1.x, h1.y, 700, ease.io); await sleep(750); mark('hover');
    await ev(([x, y]) => FX.ring(x, y, { r: 50, count: 2 }), [h1.x, h1.y]);
    const h4 = await bub('tokyo hotels under'), c7 = await bub('shinjuku hotel reviews');
    await ev(([x, y]) => FX.scrim({ x, y, r0: 110, r1: 700, ms: 1300, hold: 2200 }), [h1.x, h1.y]);
    await ev(pts => FX.path(pts, { ms: 1500, hold: 1800 }), [{ x: h1.x, y: h1.y }, { x: h4.x, y: h4.y }, { x: c7.x, y: c7.y }]);
    await M.pathTo([[h4.x, h4.y], [c7.x, c7.y]], 1500, ease.io); mark('path');
    await ev(([a, c]) => { FX.badge('opened', a.x + 50, a.y - 80, 1100); FX.badge('opened', c.x + 50, c.y - 80, 1100); }, [h4, c7]);
    await sleep(800); await ev(() => FX.caption('Automatic tab tree.')); mark('auto'); await sleep(1500);
  }, { tail: 500 });

  // ===== S4 pull =====
  await rec('s4', async mark => {
    const h4 = await bub('tokyo hotels under');
    await M.glide(h4.x, h4.y, 600, ease.io); await sleep(250);
    await ev(() => FX.caption('Pull one. The family follows.'));
    await p.mouse.down(); await ev(([x, y]) => FX.ring(x, y, { r: 50, count: 1, dur: 700 }), [h4.x, h4.y]); await sleep(120);
    await M.glide(h4.x - 40, h4.y + 8, 260, ease.out);             // anticipation
    await M.glide(h4.x + 430, h4.y + 130, 950, ease.sine); mark('stretch'); await sleep(260);
    await M.glide(h4.x + 120, h4.y - 40, 800, ease.io); await sleep(160);
    await p.mouse.up(); mark('release'); await sleep(1300);
  }, { tail: 500 });

  // ===== S5 keyboard walk =====
  await rec('s5', async mark => {
    const c7 = await bub('shinjuku hotel reviews');
    await M.glide(c7.x, c7.y, 600, ease.io); await M.click(); await sleep(520); await p.keyboard.press('Escape'); await sleep(200);
    await ev(() => FX.caption('Walk back to where you started.'));
    const kc = await ev(() => { window.__kc = FX.keycaps(['↑', '↑', '↓', '→', 'Shift F']); return true; });
    const ringFocus = () => ev(() => { const k = document.querySelector('.kfocus'); if (k) { const r = k.getBoundingClientRect(); FX.ring(r.x + r.width / 2, r.y + r.height / 2, { r: 44, count: 1, dur: 700 }); } });
    for (const [i, key] of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowRight'].entries()) { await sleep(560); await p.keyboard.press(key); await ev(i => window.__kc.press(i), i); await sleep(120); await ringFocus(); }
    await sleep(560); await p.keyboard.press('Shift+F'); await ev(() => window.__kc.press(4)); mark('relatives'); await sleep(1300);
    await p.keyboard.press('Escape'); await sleep(500); await ev(() => window.__kc.close());
  }, { tail: 300 });

  // ===== S6 search + list =====
  await rec('s6', async mark => {
    await p.keyboard.press('Escape'); await sleep(200);
    await ev(() => FX.caption('Type a word. It lights up.'));
    await sleep(300); await p.keyboard.press('/'); await sleep(250); await p.keyboard.type('hotel', { delay: 100 }); await sleep(450); mark('typed');
    const m = (await bubbles()).filter(o => /hotel/i.test(o.l)); await ev(pts => FX.sweepRings(pts, { stagger: 90, r: 34 }), m.map(o => ({ x: o.x, y: o.y })));
    const sb = await ev(() => { const r = document.querySelector('#search').getBoundingClientRect(); return { x: r.x, y: r.y }; });
    await ev(([x, y, n]) => FX.badge(n + ' matches', x + 40, y - 70, 1500), [sb.x, sb.y, m.length]);
    await sleep(1400); await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); await p.keyboard.press('Escape'); await sleep(350);
    await M.glide(...await ev(() => { const r = document.querySelector('#listBtn').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }), 700, ease.io); await M.click(); await sleep(700); mark('list');
    const row = await ev(() => { const r = [...document.querySelectorAll('#panelBody .p-tab')].find(e => /flour/i.test(e.textContent)); if (!r) return null; const b = r.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; });
    if (row) { await M.glide(row[0], row[1], 700, ease.io); await sleep(300); await M.click(); mark('fly'); await sleep(1600); }
    await M.glide(...await ev(() => { const r = document.querySelector('#panelClose').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }), 500, ease.io); await M.click(); await sleep(600);
  }, { tail: 300 });

  // ===== S7 cleanup + undo =====
  await rec('s7', async mark => {
    await p.keyboard.press('Escape'); await sleep(150); await fitMap(); await sleep(300);
    await ev(() => FX.caption('Close duplicates. Undo anytime.'));
    const badges = await ev(() => [...document.querySelectorAll('.drop .b.dup, .b.dup')].map(e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }).filter(o => o.x > 0));
    const first = badges[0] || (await bub('tokyo hotels under'));
    await M.glide(first.x, first.y, 800, ease.io); await sleep(300);
    await ev(pts => pts.forEach(o => FX.ring(o.x, o.y, { r: 26, count: 2, dur: 800 })), badges);
    await sleep(900);
    const chip = await ev(() => { const r = document.querySelector('#chips .chip.dup').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await M.glide(chip[0], chip[1], 850, ease.io); await sleep(400);
    await ev(() => { window.__od = FX.odometer({ x: 70, y: 110, from: 34, to: 31, size: 130, ms: 800 }); });
    await M.click(); mark('close'); await ev(() => window.__od.roll(true)); await sleep(1900); mark('toast');
    const undo = await ev(() => { const r = document.querySelector('#toast button').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await M.glide(undo[0], undo[1], 600, ease.io); await sleep(250); await M.click(); mark('undo');
    await ev(() => { window.__od.roll(false); window.__od.setColor('#8ae8bd'); }); await sleep(500);
    await ev(() => FX.stamp('Nothing lost.', { x: 960, y: 470 })); await sleep(1500); await ev(() => window.__od.close());
  }, { tail: 400 });

  // ===== S8 sites view =====
  await rec('s8', async mark => {
    await ev(() => FX.caption('Or group by site.'));
    const seg = await ev(() => { const r = document.querySelector('#modeSeg [data-g=sites]').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await M.glide(seg[0], seg[1], 700, ease.io); await sleep(200); await M.click(); mark('click'); await ev(() => FX.tag('By site', { x: 56, y: 960, ms: 1100 })); await sleep(1500);
    const bb = await bub('date handling in javascript');
    await M.glide(bb.x, bb.y, 700, ease.io); await sleep(200); await p.mouse.down(); await sleep(100);
    await M.glide(bb.x - 330, bb.y - 60, 1200, ease.sine); mark('stretch'); await sleep(500); await p.mouse.up(); await sleep(900);
  }, { tail: 300 });

  // ===== S9 lasso + align =====
  if (want('s9')) { // set-up off camera: back to Families, whole map
    await ev(() => FX.cursor(false)); await ev(() => document.querySelector('#modeSeg [data-g=family]').click()); await sleep(1500); await fitMap(); await ev(() => FX.cursor(true));
  }
  await rec('s9', async mark => {
    await ev(() => FX.caption('Select. Align. Done.'));
    const all = await bubbles(); const trip = all.filter(o => TRIP.test(o.l));
    const minx = Math.min(...trip.map(o => o.x)) - 50, miny = Math.min(...trip.map(o => o.y)) - 50, maxx = Math.max(...trip.map(o => o.x)) + 50, maxy = Math.max(...trip.map(o => o.y)) + 60;
    await p.keyboard.down('Control'); await M.glide(minx, miny, 800, ease.io); await p.mouse.down(); await M.glide(maxx, maxy, 800, ease.io); mark('lasso');
    await sleep(350); await p.mouse.up(); await p.keyboard.up('Control'); await sleep(900);
    const cl = await ev(() => { const r = document.querySelector('#selclear').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await M.glide(cl[0], cl[1], 550, ease.io); await sleep(150); await M.click(); await sleep(500);
    const ab = await ev(() => { const r = document.querySelector('#alignBtn').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await M.glide(ab[0], ab[1], 650, ease.io); await M.click(); await sleep(400);
    const al = await ev(() => { const r = document.querySelector('#alignMenu [data-a=left]').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await M.glide(al[0], al[1], 300, ease.io); await M.click(); mark('align'); await sleep(2200);
    await ev(() => FX.caption(''));
    const fb = await ev(() => { const r = document.querySelector('#fit').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await M.glide(fb[0], fb[1], 600, ease.io); await M.click(); mark('fit'); await sleep(1900);
  }, { tail: 300 });

  // ===== S10 look montage =====
  if (want('s10')) { // off camera: tidy, clear selection, preload the four pictures so switches are instant
    await ev(() => FX.cursor(false)); await p.keyboard.press('Escape'); await sleep(300);
    await ev(() => document.querySelector('#lookBtn').click()); await sleep(900);
    for (const n of ['aurora', 'deep', 'ember', 'nebula', 'horizon']) { await ev(n => { const t = [...document.querySelectorAll('#lookGrid .lk-tile')].find(e => (e.getAttribute('title') || e.getAttribute('aria-label') || e.textContent || '').toLowerCase().includes(n)); t && t.click(); }, n); await sleep(1500); }
    await ev(() => document.querySelector('#lookX').click()); await sleep(600); await ev(() => FX.cursor(true));
  }
  await rec('s10', async mark => {
    await ev(() => FX.caption('Make it yours.'));
    const lb = await ev(() => { const r = document.querySelector('#lookBtn').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await M.glide(lb[0], lb[1], 600, ease.io); await M.click(); await sleep(700);
    const tiles = await ev(() => [...document.querySelectorAll('#lookGrid .lk-tile')].map(e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, n: (e.getAttribute('title') || e.getAttribute('aria-label') || e.textContent || '').trim() }; }));
    console.log('tiles', tiles.map(t => t.n).join(','));
    for (const want of ['aurora', 'deep', 'ember', 'nebula']) { const t = tiles.find(o => o.n.toLowerCase().includes(want)) || tiles[0]; await M.glide(t.x, t.y, 170, ease.out); await M.click(); await ev(n => setTimeout(() => FX.tag(n, { x: 56, y: 960, ms: 700 }), 380), t.n.replace(/^.*?([A-Z][a-z ]+)$/, '$1')); mark(want); await sleep(640); }
    await sleep(300); await ev(() => document.querySelector('#lookX').click());
  }, { tail: 200 });

  // ===== S11 privacy + end card =====
  await rec('s11', async mark => {
    await ev(() => FX.caption(''));
    await ev(async mark => { window.__ec = FX.endcard({ markUrl: mark }); }, MARK); mark('card'); await sleep(5200);
  }, { tail: 300 });

  fs.writeFileSync(OUT + '/markers.' + (ONLY.join('_') || 'all') + '.json', JSON.stringify(markers, null, 1));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
