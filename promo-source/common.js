const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const S = '/tmp/claude-0/-home-user-Tax-Test/4fedfeb2-8390-5988-9b25-31402f93cc2c/scratchpad';
const V2 = S + '/v2';
const tabs = require(V2 + '/tabs.js');
const FXSRC = fs.readFileSync(V2 + '/fx.js', 'utf8');
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function launch(W = 1920, H = 1080) {
  const b = await chromium.launch({ headless: false, args: ['--window-position=0,0', `--window-size=${W},${H + 88}`, '--no-sandbox', '--disable-infobars', '--hide-scrollbars', '--force-device-scale-factor=1'] });
  const ctx = await b.newContext({ viewport: null });
  await ctx.addInitScript(FXSRC);
  await ctx.addInitScript(() => { if (location.search.includes('cover=1')) { const add = () => { const c = document.createElement('div'); c.id = 'cover'; Object.assign(c.style, { position: 'fixed', inset: '0', background: '#fff', zIndex: 2147483646 }); document.documentElement.appendChild(c); window.uncover = (ms = 700) => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'ease-out', fill: 'forwards' }).finished.then(() => c.remove()); }; if (document.documentElement) add(); else { const o = new MutationObserver(() => { if (document.documentElement) { o.disconnect(); add(); } }); o.observe(document, { childList: true }); } } });
  await ctx.addInitScript(t => { window.DROPLET_DEMO_TABS = t; try { localStorage.setItem('droplet.simple', '0'); localStorage.setItem('droplet.tipsDone', '1'); localStorage.setItem('droplet.panel', '0'); localStorage.setItem('droplet.groupBy', 'family'); } catch (e) {} }, tabs);
  return { b, ctx };
}
function startRec(file, W = 1920, H = 1080) {
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'x11grab', '-draw_mouse', '0', '-framerate', '30', '-video_size', `${W}x${H}`, '-i', process.env.DISPLAY + '+0,88', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '14', '-pix_fmt', 'yuv420p', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  return { stop: () => new Promise(r => { ff.on('close', r); ff.stdin.write('q'); }) };
}
// eased mouse glide
const ease = { io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out: t => 1 - Math.pow(1 - t, 3), sine: t => -(Math.cos(Math.PI * t) - 1) / 2 };
function mouse(page) {
  let mx = 1700, my = 860;
  const glide = async (x, y, ms = 600, e = ease.io) => { const x0 = mx, y0 = my, t0 = Date.now(); for (;;) { const t = Math.min(1, (Date.now() - t0) / ms), k = e(t); await page.mouse.move(x0 + (x - x0) * k, y0 + (y - y0) * k); if (t >= 1) break; await sleep(8); } mx = x; my = y; };
  const pathTo = async (pts, ms, e = ease.io) => { const each = ms / pts.length; for (const [x, y] of pts) await glide(x, y, each, e); };
  return { glide, pathTo, get pos() { return [mx, my]; }, set(x, y) { mx = x; my = y; },
    click: async (opts = {}) => { await page.mouse.down(); await sleep(opts.hold || 90); await page.mouse.up(); } };
}
module.exports = { chromium, spawn, fs, path, S, V2, tabs, sleep, launch, startRec, mouse, ease };
