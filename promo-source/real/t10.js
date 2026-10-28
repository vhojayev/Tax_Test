const { Rig, sleep } = require('./rig.js'); const { buildTabs } = require('./scene.js');
(async () => {
  const rig = await new Rig().start({ W: 2560, H: 1440, scale: 4 / 3 }); await buildTabs(rig);
  await rig.ctx.pages()[0].bringToFront(); await sleep(500);
  await rig.cmd('kd Alt_L'); await rig.cmd('kd Shift_L'); await rig.cmd('k d'); await rig.cmd('ku Shift_L'); await rig.cmd('ku Alt_L');
  for (let i = 0; i < 40 && !rig.ctx.pages().some(p => p.url().includes('view.html')); i++) await sleep(150);
  const v = rig.ctx.pages().find(p => p.url().includes('view.html')); await sleep(1500);
  console.log(v.url(), await v.evaluate(() => JSON.stringify({ ls: Object.keys(localStorage), w: localStorage.getItem('droplet.welcomed'), p: localStorage.getItem('droplet.panel'), welcome: !document.querySelector('#welcome').hidden, panel: !document.querySelector('#panel').hidden, inner: innerWidth })));
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
