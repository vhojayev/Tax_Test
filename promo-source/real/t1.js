const { Rig, sleep } = require('./rig.js'); const { buildTabs } = require('./scene.js'); const { execSync } = require('child_process');
(async () => {
  const rig = await new Rig().start(); console.log('ext', rig.extId);
  const n = await buildTabs(rig); console.log('tabs', n);
  const pages = rig.ctx.pages(); await pages[0].bringToFront(); await sleep(1500);
  execSync(`ffmpeg -loglevel error -y -f x11grab -video_size 1920x1080 -i ${process.env.DISPLAY} -frames:v 1 ${process.env.SCRATCH || '/tmp/claude-0/-home-user-Tax-Test/4fedfeb2-8390-5988-9b25-31402f93cc2c/scratchpad'}/real1.png`);
  await rig.stop();
})().catch(e => { console.error(e); process.exit(1); });
