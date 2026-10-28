const { Rig, sleep } = require('./rig.js'); const { buildTabs } = require('./scene.js'); const { execSync } = require('child_process');
const S = process.env.SCRATCH || '/tmp/claude-0/-home-user-Tax-Test/4fedfeb2-8390-5988-9b25-31402f93cc2c/scratchpad';
const shot = n => execSync(`ffmpeg -loglevel error -y -f x11grab -draw_mouse 1 -video_size 1920x1080 -i ${process.env.DISPLAY} -frames:v 1 ${S}/${n}.png`);
(async () => {
  const rig = await new Rig().start(); const t0 = Date.now();
  await buildTabs(rig); console.log('build s', (Date.now() - t0) / 1000);
  const pages = rig.ctx.pages(); await pages[0].bringToFront(); await sleep(800);
  // click the extension icon (real click) -> popup
  await rig.glide(1770, 63, 700); await sleep(200); await rig.click(); await sleep(1200); shot('real_popup');
  await rig.type('sourdough', 90); await sleep(900); shot('real_popup2');
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
