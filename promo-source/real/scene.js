const { SITES, sleep } = require('./rig.js');
// Build a crowded, disorganised real tab strip with real opener lineage for a few families.
async function prepExtension(rig) {
  const w = await rig.ctx.newPage(); await w.goto(`chrome-extension://${rig.extId}/view.html#welcome`); await sleep(1200);
  await w.evaluate(() => { for (const [k, v] of Object.entries({ 'droplet.simple': '0', 'droplet.simpleTold': '1', 'droplet.tipsDone': '1', 'droplet.panel': '0', 'droplet.groupBy': 'family', 'droplet.welcomed': '1' })) localStorage.setItem(k, v); });
  const ok = w.locator('#wOk'); if (await ok.isVisible()) await ok.click(); await sleep(300); await w.close();
  await rig.sw.evaluate(() => chrome.storage.session.set({ olderHidden: true }));
}
async function buildTabs(rig, { shuffleSeed = 11 } = {}) {
  { const blank = await rig.ctx.newPage(); for (const p of rig.ctx.pages()) if (p !== blank && p.url().includes('view.html')) await p.close().catch(() => {}); }   // stale first-run tab restored by Chrome
  await prepExtension(rig);
  for (const pgx of rig.ctx.pages()) if (pgx.url().includes('view.html') || pgx.url() === 'about:blank') { if (rig.ctx.pages().length > 1) await pgx.close().catch(() => {}); }
  const keep = rig.ctx.pages().find(p => p.url() === 'about:blank') || rig.ctx.pages()[0];
  for (const topic of ['trip', 'bread', 'car', 'code']) {
    const { pages, tree } = SITES[topic]; const opened = [];
    for (let i = 0; i < pages.length; i++) {
      const [h, p, t] = pages[i];
      if (tree[i] < 0) { const pg = (topic === 'trip' && keep.url() === 'about:blank') ? keep : await rig.ctx.newPage(); await pg.goto(`http://${h}${p}`, { waitUntil: 'domcontentloaded' }); opened[i] = pg; }
      else opened[i] = await rig.openLink(opened[tree[i]], t);
    }
  }
  for (const [hh, pp] of SITES.misc.pages) await rig.open(hh, pp);
  for (const [hh, pp] of [SITES.trip.pages[3], SITES.bread.pages[1], SITES.code.pages[2]]) await rig.open(hh, pp);   // pages opened twice by accident
  return rig.shuffleTabs(shuffleSeed);
}
module.exports = { buildTabs, prepExtension };
