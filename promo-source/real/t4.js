const { Rig, sleep } = require('./rig.js'); const { buildTabs } = require('./scene.js'); const { execSync } = require('child_process');
const S = process.env.SCRATCH || '/tmp/claude-0/-home-user-Tax-Test/4fedfeb2-8390-5988-9b25-31402f93cc2c/scratchpad';
const shot = n => execSync(`ffmpeg -loglevel error -y -f x11grab -draw_mouse 1 -video_size 1920x1080 -i ${process.env.DISPLAY} -frames:v 1 ${S}/${n}.png`);
(async () => {
  const rig = await new Rig().start(); await buildTabs(rig);
  const view = await rig.ctx.newPage(); await view.goto(`chrome-extension://${rig.extId}/view.html?clean`); await sleep(2500);
  await view.bringToFront(); await view.evaluate(() => document.querySelector('#fit').click()); await sleep(1500);
  const b = await rig.scr(view, '#siteBtn'); console.log('btn', JSON.stringify(b));
  await rig.glide(b.x, b.y, 600); await sleep(300); await rig.click(); await sleep(900);
  console.log('menu', await view.evaluate(() => { const m = document.querySelector('#siteMenu'); const r = m.getBoundingClientRect(); return { hidden: m.hidden, r: [r.x, r.y, r.width, r.height], exp: document.querySelector('#siteBtn').getAttribute('aria-expanded') }; }));
  shot('real_menu2');
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
