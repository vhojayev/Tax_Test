const { Rig, sleep } = require('./rig.js'); const { buildTabs } = require('./scene.js');
(async () => {
  const rig = await new Rig().start({ W: 2560, H: 1440, scale: 4 / 3 }); await buildTabs(rig);
  const v = await rig.ctx.newPage(); await v.goto(`chrome-extension://${rig.extId}/view.html`); await sleep(2000);
  console.log(await v.evaluate(() => JSON.stringify({ ls: Object.fromEntries(Object.entries(localStorage)), welcome: !document.querySelector('#welcome').hidden, panel: !document.querySelector('#panel').hidden })));
  console.log('id', rig.extId, 'pages', rig.ctx.pages().map(p => p.url()).filter(u => u.startsWith('chrome')).join(','));
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
