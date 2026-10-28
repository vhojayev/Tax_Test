const { Rig, sleep } = require('./rig.js');
(async () => {
  const rig = await new Rig().start();
  const view = await rig.ctx.newPage(); await view.goto(`chrome-extension://${rig.extId}/view.html?clean`); await sleep(2500); await view.bringToFront();
  await view.evaluate(() => { window.__ev = []; for (const t of ['pointerdown', 'pointerup', 'click', 'mousedown']) addEventListener(t, e => window.__ev.push(t + '@' + Math.round(e.clientX) + ',' + Math.round(e.clientY) + ':' + (e.target.id || e.target.tagName)), true); });
  const st = async l => console.log(l, await view.evaluate(() => [document.querySelector('#siteMenu').hidden, window.__ev.slice(-6).join(' ')]));
  const b = await rig.scr(view, '#siteBtn'); console.log('target', b.x, b.y);
  await rig.glide(b.x, b.y, 500); await sleep(300); await rig.click(); await sleep(500); await st('click1');
  await rig.glide(b.x + 3, b.y + 2, 100); await rig.click(); await sleep(500); await st('click2');
  const l = await rig.scr(view, '#lookBtn'); await rig.glide(l.x, l.y, 500); await rig.click(); await sleep(600); console.log('look open', await view.evaluate(() => !document.querySelector('#look').hidden));
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
