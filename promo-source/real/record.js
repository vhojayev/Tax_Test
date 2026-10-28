// Records the real-browser scenes (real Chrome, real mouse/keyboard) to /dev/shm raw captures + event logs.
// usage: xvfb-run -s "-screen 0 2560x1440x24" node record.js [scene,scene...]
const { Rig, sleep, ease, SCR } = require('./rig.js'); const { buildTabs } = require('./scene.js');
const fs = require('fs'), path = require('path'); const { execSync } = require('child_process');
const OUT = SCR + '/real_out'; fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv[2] || '').split(',').filter(Boolean); const want = n => !ONLY.length || ONLY.includes(n);
const K = 4 / 3, TAB0 = 56, PITCH = 39.04, STRIP_Y = 20;               // tab-strip geometry in css px (46 tabs)

(async () => {
  const rig = await new Rig().start({ W: 2560, H: 1440, scale: K });
  await buildTabs(rig);
  const content = rig.ctx.pages().filter(p => p.url().startsWith('http'));
  let view = null;
  const css = (x, y) => [x * K, y * K];
  const tabXY = i => css(TAB0 + i * PITCH, STRIP_Y);

  const scene = async (name, fn, { lead = 600, tail = 500 } = {}) => {
    if (!want(name)) return;
    rig.ev = []; rig.trk = []; const cap = rig.startRaw(name); await sleep(lead + 300);
    rig.log('start'); try { await fn(); } catch (e) { console.log('SCENE FAIL', name, e.message); }
    await sleep(tail); rig.log('end'); await cap.stop();
    const st = Rig.analyze(cap.out); fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify({ stats: st, events: rig.ev, scale: K, track: rig.trk }, null, 0));
    execSync(`ffmpeg -loglevel error -y -i ${cap.out} -vf "setpts=PTS-STARTPTS,fps=30" -c:v libx264 -preset veryfast -crf 14 -pix_fmt yuv420p -movflags +faststart ${OUT}/${name}.mp4`); fs.unlinkSync(cap.out);
    console.log(name, JSON.stringify(st), 'events', rig.ev.length);
  };
  const openView = async () => {
    if (view) return view;
    const had = new Set(rig.ctx.pages());
    await rig.cmd('kd Alt_L'); await rig.cmd('kd Shift_L'); await rig.cmd('k d'); await rig.cmd('ku Shift_L'); await rig.cmd('ku Alt_L');
    for (let i = 0; i < 40 && !rig.ctx.pages().some(p => !had.has(p) && p.url().includes('view.html')); i++) await sleep(150);
    view = rig.ctx.pages().find(p => p.url().includes('view.html')); await sleep(600); return view;
  };
  const arrange = async (item, label) => {
    const b = await rig.scr(view, '#siteBtn'); rig.log('menu-btn', { x: b.x / K, y: b.y / K });
    await rig.glide(b.x, b.y, 650); await sleep(180); await rig.click(); rig.log('menu-open'); await sleep(750);
    const m = await rig.scr(view, `#siteMenu [data-a=${item}]`); rig.log('menu-item', { label, x: m.x / K, y: m.y / K, w: m.w / K, h: m.h / K });
    await rig.glide(m.x, m.y, 600); await sleep(350); await rig.click(); rig.log('menu-click', { label });
  };
  const undo = async () => {
    for (let i = 0; i < 20 && !(await view.evaluate(() => { const t = document.querySelector('#toast'); return t && !t.hidden && t.querySelector('button'); })); i++) await sleep(100);
    const u = await rig.scr(view, '#toast button'); if (!u) return; rig.log('undo-btn', { x: u.x / K, y: u.y / K });
    await rig.glide(u.x, u.y, 550); await sleep(250); await rig.click(); rig.log('undo-click');
  };

  // ---------- 1. hook: the strip of slivers ----------
  await content[0].bringToFront(); await sleep(500);
  await scene('hook', async () => {
    await rig.move(...css(1800, 400)); await rig.glide(...tabXY(1), 800, ease.io); rig.log('scrub-start');
    await rig.glide(...tabXY(16), 1700, ease.lin); await sleep(650); rig.log('hover', { idx: 16 });
    await rig.glide(...tabXY(9), 450); await sleep(150); await rig.click(); rig.log('tab-click', { idx: 9 }); await sleep(450);
    await rig.glide(...tabXY(33), 520); await sleep(120); await rig.click(); rig.log('tab-click', { idx: 33 }); await sleep(420);
    await rig.glide(...tabXY(4), 420); await rig.click(); rig.log('tab-click', { idx: 4 }); await sleep(380);
    await rig.glide(...tabXY(27), 420); await rig.click(); rig.log('tab-click', { idx: 27 }); await sleep(900);
  });

  // ---------- 2. quick find through the toolbar popup ----------
  // the toolbar popup is not exposed as a page, so measure the same popup.html off-screen and add its anchor (css 1410,80)
  let pf = null, prow = null;
  if (want('find')) {
    const tmp = await rig.ctx.newPage(); await tmp.goto(`chrome-extension://${rig.extId}/popup.html`); await sleep(900);
    await tmp.evaluate(() => { const i = document.querySelector('#find'); i.value = 'sourdough'; i.dispatchEvent(new Event('input', { bubbles: true })); }); await sleep(500);
    const g = await tmp.evaluate(() => { const rows = [...document.querySelectorAll('.p-tab')]; const i = Math.max(0, rows.findIndex(e => /flour/i.test(e.textContent))); const r = rows[i].getBoundingClientRect(); const f = document.querySelector('#find').getBoundingClientRect(); return { text: rows[i].textContent.trim().slice(0, 50), row: [r.x + r.width / 2, r.y + r.height / 2, r.width, r.height], find: [f.x + f.width / 2, f.y + f.height / 2, f.width, f.height], n: rows.length }; });
    await tmp.close(); await content[0].bringToFront(); await sleep(400);
    pf = g.find; prow = g.row; console.log('popup geom', JSON.stringify(g));
  }
  await scene('find', async () => {
    const OX = 1410, OY = 80; rig.log('icon', { x: 1770, y: 63 });
    await rig.glide(...css(1500, 300), 500); await rig.glide(...css(1770, 63), 700); await sleep(220); await rig.click(); rig.log('popup-open'); await sleep(1000);
    rig.log('popup-find', { x: OX + pf[0], y: OY + pf[1], w: pf[2], h: pf[3] });
    await rig.type('sourdough', 105); rig.log('typed', { text: 'sourdough' }); await sleep(1300);
    rig.log('popup-row', { x: OX + prow[0], y: OY + prow[1], w: prow[2], h: prow[3] });
    await rig.glide(...css(OX + prow[0], OY + prow[1]), 650); await sleep(450); await rig.click(); rig.log('row-click'); await sleep(1600);
  });

  // ---------- 3. open the map (real shortcut) ----------
  await scene('open', async () => {
    rig.log('shortcut', { keys: ['Alt', 'Shift', 'D'] }); await openView();
    await view.evaluate(() => document.querySelector('#fit').click()); await sleep(2800); rig.log('map-ready');
  });
  if (!view) await openView();
  await view.bringToFront(); await view.evaluate(() => { const o = document.querySelector('#older'); if (o) o.style.display = 'none'; const h = document.querySelector('#hint'); if (h) h.style.display = 'none'; });

  // ---------- 4. group by topic ----------
  await scene('topic', async () => {
    await sleep(500); await arrange('groupTopic', 'Group by topic'); await sleep(2600); rig.log('grouped');
    await undo(); await sleep(1400); rig.log('ungrouped');
  });

  // ---------- 5. group each site, then bring same sites together ----------
  await scene('site', async () => {
    await sleep(400); await arrange('groupSite', 'Group each site'); await sleep(2600); rig.log('grouped');
    await undo(); await sleep(1100);
    await arrange('sort', 'Bring same sites together'); await sleep(2600); rig.log('sorted');
    await undo(); await sleep(1200);
  });

  // ---------- 6. duplicates ----------
  await scene('dupes', async () => {
    await sleep(500); const c = await rig.scr(view, '#chips .chip.dup'); rig.log('chip', { x: c.x / K, y: c.y / K, w: c.w / K, h: c.h / K });
    await rig.glide(c.x, c.y, 800); await sleep(400); await rig.click(); rig.log('dedupe-click'); await sleep(2300);
    await undo(); await sleep(1500);
  });

  // ---------- 7. the bubble map: hover, drag a family, search, look ----------
  const bubble = async (needle) => { const g = await view.evaluate(n => { const a = [...document.querySelectorAll('.drop')].map(e => { const r = e.getBoundingClientRect(); return { x: window.screenX + r.x + r.width / 2, y: window.screenY + (window.outerHeight - window.innerHeight) + r.y + r.height / 2, w: r.width, l: (e.getAttribute('aria-label') || '').toLowerCase() }; }).filter(o => o.w > 0 && o.l.includes(n.toLowerCase())).sort((a, b) => b.w - a.w); return a[0] || null; }, needle); if (!g) throw new Error('no bubble ' + needle); return g; };
  await scene('mapplay', async () => {
    await view.evaluate(() => { const c = document.querySelector('#panelClose'); if (c && !document.querySelector('#panel').hidden) c.click(); document.querySelector('#fit').click(); }); await sleep(1800);
    { const hb = await bubble('tokyo trip'); await rig.glide(...css(hb.x, hb.y), 700); await sleep(250); for (let i = 0; i < 3; i++) { await rig.wheel(1); await sleep(220); } rig.log('zoomed'); await sleep(1400); }
    const h = await bubble('tokyo hotels under'); rig.log('hub', { x: h.x, y: h.y, w: h.w });
    await rig.glide(...css(h.x, h.y), 900); await sleep(900); rig.log('hover');
    await rig.down(); rig.log('grab'); await sleep(120);
    await rig.glide(...css(h.x - 40, h.y + 20), 250, ease.out); await rig.glide(...css(h.x - 330, h.y + 260), 1000, ease.sine); rig.log('stretch'); await sleep(250);
    await rig.glide(...css(h.x - 110, h.y + 90), 700); await sleep(120); await rig.up(); rig.log('release'); await sleep(1500);
    await rig.glide(...css(960, 800), 600); await sleep(200);
    await rig.key('slash'); await sleep(250); await rig.type('tokyo', 120); rig.log('search-typed'); await sleep(1800);
    await rig.key('Escape'); await sleep(350); await rig.key('Escape'); await sleep(700);
    const lb = await rig.scr(view, '#lookBtn'); await rig.glide(lb.x, lb.y, 800); await sleep(200); await rig.click(); rig.log('look-open'); await sleep(900);
    for (const w of ['aurora', 'ember', 'nebula']) {
      const t = await view.evaluate(n => { const e = [...document.querySelectorAll('#lookGrid .lk-tile')].find(x => (x.getAttribute('title') || x.getAttribute('aria-label') || x.textContent || '').toLowerCase().includes(n)); if (!e) return null; const r = e.getBoundingClientRect(); return { x: window.screenX + r.x + r.width / 2, y: window.screenY + (window.outerHeight - window.innerHeight) + r.y + r.height / 2 }; }, w);
      if (t) { await rig.glide(t.x * K, t.y * K, 420); await sleep(120); await rig.click(); rig.log('look', { w }); await sleep(1250); }
    }
    await rig.clickSel(view, '#lookX', 500); await sleep(800);
  });

  fs.writeFileSync(OUT + '/tabs.json', JSON.stringify(await rig.tabInfo(), null, 1));
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
