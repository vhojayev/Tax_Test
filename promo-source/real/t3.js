const { Rig, sleep } = require('./rig.js'); const { buildTabs } = require('./scene.js'); const { execSync } = require('child_process');
const S = process.env.SCRATCH || '/tmp/claude-0/-home-user-Tax-Test/4fedfeb2-8390-5988-9b25-31402f93cc2c/scratchpad';
const shot = n => execSync(`ffmpeg -loglevel error -y -f x11grab -draw_mouse 1 -video_size 1920x1080 -i ${process.env.DISPLAY} -frames:v 1 ${S}/${n}.png`);
(async () => {
  const rig = await new Rig().start(); await buildTabs(rig);
  await rig.ctx.pages()[0].bringToFront(); await sleep(600);
  // open the map through the real popup
  await rig.glide(1770, 63, 600); await rig.click(); await sleep(900); await rig.glide(1724, 110, 500); await rig.click(); await sleep(2500);
  const view = rig.ctx.pages().find(p => p.url().includes('view.html')); console.log('view', !!view);
  await view.bringToFront(); await sleep(500);
  await rig.clickSel(view, '#siteBtn', 700); await sleep(900); shot('real_menu');
  console.log(await view.evaluate(() => [...document.querySelectorAll('#siteMenu [data-a]')].map(e => e.dataset.a + ':' + e.textContent.trim().slice(0, 40))));
  await rig.clickSel(view, '#siteMenu [data-a=groupTopic]', 500); await sleep(2500); shot('real_group_topic');
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
