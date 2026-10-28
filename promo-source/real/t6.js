const { Rig, sleep } = require('./rig.js'); const { buildTabs } = require('./scene.js'); const { execSync } = require('child_process');
const S = process.env.SCRATCH || '/tmp/claude-0/-home-user-Tax-Test/4fedfeb2-8390-5988-9b25-31402f93cc2c/scratchpad';
const shot = n => execSync(`ffmpeg -loglevel error -y -f x11grab -draw_mouse 1 -video_size 1920x1080 -i ${process.env.DISPLAY} -frames:v 1 ${S}/${n}.png`);
(async () => {
  const rig = await new Rig().start(); const n = await buildTabs(rig); console.log('tabs', n);
  const view = await rig.ctx.newPage(); await view.goto(`chrome-extension://${rig.extId}/view.html?clean`); await sleep(2500); await view.bringToFront();
  await view.evaluate(() => { const h = document.querySelector('#hint'); if (h) h.hidden = true; const o = document.querySelector('#older'); if (o) o.hidden = true; const c = document.querySelector('#panelClose'); if (c) c.click(); document.querySelector('#fit').click(); }); await sleep(2500);
  shot('real_map');
  await rig.clickSel(view, '#siteBtn', 700); await sleep(700); shot('real_menu3');
  await rig.clickSel(view, '#siteMenu [data-a=groupTopic]', 600); await sleep(2500); shot('real_group3');
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
