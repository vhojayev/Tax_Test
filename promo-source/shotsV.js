// Vertical 1080x1920 shots -> v2/shotsV/*.mp4
const { launch, sleep, startRec, V2, S, mouse, ease, fs } = require('./common.js');
const OUT = V2 + '/shotsV'; fs.mkdirSync(OUT, { recursive: true });
const VIEW = 'http://localhost:8766/view.html?clean', MARK = 'http://localhost:8766/assets/mark.png';
const W = 1080, H = 1920, CAP = { size: 62, bottom: 330 };
const markers = {};
(async () => {
  const { b, ctx } = await launch(W, H); const p = await ctx.newPage(); p.on('pageerror', e => console.log('PAGEERR', e.message));
  const M = mouse(p); M.set(960, 1500);
  const ev = (fn, ...a) => p.evaluate(fn, ...a);
  const bubbles = () => ev(() => [...document.querySelectorAll('.drop')].map(e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, l: e.getAttribute('aria-label') || '' }; }).filter(o => o.w > 0));
  const bub = async n => { const a = (await bubbles()).filter(o => o.l.toLowerCase().includes(n.toLowerCase())).sort((a, c) => c.w - a.w); if (!a.length) throw new Error('no bubble ' + n); return a[0]; };
  const cap = t => ev(([t, o]) => FX.caption(t, o), [t, CAP]);
  const center = sel => ev(s => { const r = document.querySelector(s).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel);
  const rec = async (name, fn, { lead = 700, tail = 500 } = {}) => {
    const mk = {}; const r = startRec(`${OUT}/${name}.mp4`, W, H); await sleep(lead); const t0 = Date.now(); const mark = k => { mk[k] = (Date.now() - t0) / 1000 + lead / 1000; };
    try { await fn(mark); } catch (e) { console.log('SHOT FAIL', name, e.message); }
    await sleep(tail); await r.stop(); markers[name] = { ...mk, total: (Date.now() - t0) / 1000 + (lead + tail) / 1000 }; console.log('rec', name, JSON.stringify(markers[name]));
  };

  // V1 hook
  await p.goto('file://' + V2 + '/strip.html'); await sleep(600);
  await rec('v1', async mark => {
    await ev(() => FX.cursor(true));
    await ev(([o]) => { FX.ticker({ from: 12, to: 47, ms: 1900, x: 60, y: 250, size: 300, label: 'tabs' }); HOOK.climb(12, 47, 1900); }, [CAP]);
    await sleep(250); await cap('47 tabs. Which one?');
    const R = async i => { const rs = await ev(() => HOOK.rects()); return rs[Math.min(i, rs.length - 1)]; };
    await M.glide(1050, 70, 1); let r = await R(40); await M.glide(r.x, r.y, 600, ease.io);
    r = await R(8); await M.glide(r.x, r.y, 450, ease.io);
    for (let i = 0; i < 2; i++) { r = await R(8); await M.glide(r.x + 22, r.y + 12, 110, ease.sine); await M.glide(r.x - 20, r.y - 6, 110, ease.sine); }
    r = await R(3); await M.glide(r.x, r.y, 280, ease.io); await M.click(); await ev(() => HOOK.activate(3)); mark('wrong1'); await sleep(160);
    r = await R(30); await M.glide(r.x, r.y, 280, ease.io); await M.click(); await ev(() => HOOK.activate(30)); mark('wrong2'); await sleep(160);
    await ev(() => FX.flash(240, 1)); mark('flash'); await sleep(160);
  }, { tail: 150 });

  // V2 reveal + bloom
  await p.goto('about:blank'); await sleep(300);
  await rec('v2', async mark => {
    await p.goto(VIEW + '&cover=1'); await sleep(2300); await ev(() => document.querySelector('#fit').click()); await sleep(1500);
    await ev(() => window.uncover(700)); mark('uncover'); await ev(() => FX.cursor(true));
    await cap('Every tab remembers its parent.');
    const h1 = await bub('tokyo trip'); await M.glide(h1.x, h1.y, 700, ease.io); await sleep(500); mark('hover');
    await ev(([x, y]) => FX.ring(x, y, { r: 44, count: 2 }), [h1.x, h1.y]);
    const h4 = await bub('tokyo hotels under'), c7 = await bub('shinjuku hotel reviews');
    await ev(([x, y]) => FX.scrim({ x, y, r0: 90, r1: 520, ms: 1100, hold: 1500 }), [h1.x, h1.y]);
    await ev(pts => FX.path(pts, { ms: 1300, hold: 1200 }), [{ x: h1.x, y: h1.y }, { x: h4.x, y: h4.y }, { x: c7.x, y: c7.y }]);
    await M.pathTo([[h4.x, h4.y], [c7.x, c7.y]], 1300, ease.io); mark('path');
    await ev(([a, c]) => { FX.badge('opened', a.x + 40, a.y - 70, 1000); FX.badge('opened', c.x + 40, c.y - 70, 1000); }, [h4, c7]);
    await sleep(900);
  }, { tail: 300 });

  // V3 drag
  await rec('v3', async mark => {
    await cap('Pull one. The family follows.');
    const h4 = await bub('tokyo hotels under'); await M.glide(h4.x, h4.y, 500, ease.io); await sleep(150);
    await p.mouse.down(); await ev(([x, y]) => FX.ring(x, y, { r: 46, count: 1, dur: 700 }), [h4.x, h4.y]); await sleep(100);
    await M.glide(h4.x + 30, h4.y - 24, 220, ease.out); await M.glide(h4.x - 320, h4.y + 330, 900, ease.sine); mark('stretch'); await sleep(220);
    await M.glide(h4.x - 120, h4.y + 120, 650, ease.io); await sleep(120); await p.mouse.up(); mark('release'); await sleep(1100);
  }, { tail: 300 });

  // V4 cleanup + undo (off-camera reset first)
  await ev(() => FX.cursor(false)); await ev(() => document.querySelector('#tidy').click()); await sleep(1800); await ev(() => document.querySelector('#fit').click()); await sleep(1500); await ev(() => FX.cursor(true));
  await rec('v4', async mark => {
    await cap('Close duplicates. Undo anytime.');
    const badges = await ev(() => [...document.querySelectorAll('.b.dup')].map(e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }).filter(o => o.x > 0 && o.y > 0));
    const first = badges[0] || await bub('tokyo hotels under'); await M.glide(first.x, first.y, 600, ease.io);
    await ev(pts => pts.forEach(o => FX.ring(o.x, o.y, { r: 26, count: 2, dur: 800 })), badges); await sleep(800);
    const chip = await center('#chips .chip.dup'); await M.glide(chip[0], chip[1], 650, ease.io); await sleep(250);
    await ev(() => { window.__od = FX.odometer({ x: 56, y: 120, from: 34, to: 31, size: 150, ms: 800 }); });
    await M.click(); mark('close'); await ev(() => window.__od.roll(true)); await sleep(1500); mark('toast');
    const u = await center('#toast button'); await M.glide(u[0], u[1], 500, ease.io); await sleep(200); await M.click(); mark('undo');
    await ev(() => { window.__od.roll(false); window.__od.setColor('#8ae8bd'); }); await sleep(400);
    await ev(() => FX.stamp('Nothing lost.', { x: 540, y: 800, size: 84 })); await sleep(1300); await ev(() => window.__od.close());
  }, { tail: 300 });

  // V5 look montage (preload off-camera)
  await ev(() => FX.cursor(false)); await ev(() => document.querySelector('#lookBtn').click()); await sleep(900);
  for (const n of ['aurora', 'ember', 'nebula', 'horizon']) { await ev(n => { const t = [...document.querySelectorAll('#lookGrid .lk-tile')].find(e => (e.getAttribute('title') || e.getAttribute('aria-label') || e.textContent || '').toLowerCase().includes(n)); t && t.click(); }, n); await sleep(1400); }
  await ev(() => document.querySelector('#lookX').click()); await sleep(600); await ev(() => FX.cursor(true));
  await rec('v5', async mark => {
    await cap('Make it yours.');
    const lb = await center('#lookBtn'); await M.glide(lb[0], lb[1], 500, ease.io); await M.click(); await sleep(650);
    const tiles = await ev(() => [...document.querySelectorAll('#lookGrid .lk-tile')].map(e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, n: (e.getAttribute('title') || e.getAttribute('aria-label') || e.textContent || '').trim() }; }));
    for (const w of ['aurora', 'ember', 'nebula']) { const t = tiles.find(o => o.n.toLowerCase().includes(w)) || tiles[0]; await M.glide(t.x, t.y, 160, ease.out); await M.click(); mark(w); await sleep(700); }
    await ev(() => document.querySelector('#lookX').click());
  }, { tail: 200 });

  // V6 end card
  await rec('v6', async mark => { await ev(() => FX.caption('')); await ev(m => { FX.endcard({ markUrl: m }); }, MARK); mark('card'); await sleep(4600); }, { tail: 300 });

  fs.writeFileSync(OUT + '/markers.json', JSON.stringify(markers, null, 1)); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
