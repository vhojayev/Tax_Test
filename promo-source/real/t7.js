const { Rig, sleep } = require('./rig.js'); const { buildTabs } = require('./scene.js');
(async () => {
  const rig = await new Rig().start(); await buildTabs(rig);
  const view = await rig.ctx.newPage(); await view.goto(`chrome-extension://${rig.extId}/view.html?clean`); await sleep(1500);
  await view.evaluate(() => { localStorage.setItem('droplet.simple', '0'); localStorage.setItem('droplet.tipsDone', '1'); localStorage.setItem('droplet.panel', '0'); }); await view.reload(); await sleep(3000); await view.bringToFront();
  await view.evaluate(() => { const o = document.querySelector('#older'); if (o) o.hidden = true; document.querySelector('#fit').click(); }); await sleep(2000);
  const cap = rig.startRaw('t7'); await sleep(500);
  // busy: pointer sweeps over strip + map animations + group action
  await rig.glide(60, 20, 600); await rig.glide(1700, 20, 1800, (t) => t); await rig.glide(960, 600, 800);
  await rig.clickSel(view, '#siteBtn', 600); await sleep(500); await rig.clickSel(view, '#siteMenu [data-a=groupTopic]', 500); await sleep(2500);
  await cap.stop(); console.log(JSON.stringify(Rig.analyze(cap.out)));
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
