// Real-Chrome capture rig: headed Chrome + extension under Xvfb, real X input (XTEST), raw low-CPU capture.
const { chromium } = require('playwright');
const { spawn, execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const HERE = __dirname;
const SCR = process.env.SCRATCH || '/tmp/claude-0/-home-user-Tax-Test/4fedfeb2-8390-5988-9b25-31402f93cc2c/scratchpad';
const EXT = SCR + '/ext_rec', PROFILE = SCR + '/profile_real';
const SITES = JSON.parse(fs.readFileSync(HERE + '/sites.json', 'utf8'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ease = { io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out: t => 1 - Math.pow(1 - t, 3), sine: t => -(Math.cos(Math.PI * t) - 1) / 2, lin: t => t };

class Rig {
  async start({ W = 1920, H = 1080, scale = 1 } = {}) {
    this.W = W; this.H = H; this.scale = scale;
    this.xin = spawn('python3', [HERE + '/xin.py'], { stdio: ['pipe', 'pipe', 'inherit'] });
    this.xinQ = []; let buf = ''; this.xin.stdout.on('data', d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { buf = buf.slice(i + 1); const r = this.xinQ.shift(); if (r) r(); } });
    this.mx = W - 80; this.my = H - 120; this.ev = []; this.cssOf = (x, y) => [x / this.scale, y / this.scale];
    const launch = async () => chromium.launchPersistentContext(PROFILE, {
      headless: false, viewport: null, ignoreDefaultArgs: ['--enable-automation'],
      args: ['--window-position=0,0', `--window-size=${Math.round(W / scale)},${Math.round(H / scale)}`, '--host-resolver-rules=MAP *.example 127.0.0.1', `--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`,
        '--no-first-run', '--no-default-browser-check', '--test-type', '--disable-infobars', `--force-device-scale-factor=${scale}`, '--password-store=basic', '--disable-session-crashed-bubble', '--disable-features=Translate,MediaRouter', '--disable-component-update', '--hide-crash-restore-bubble'],
    });
    let ctx = await launch();
    let sw = ctx.serviceWorkers()[0] || await ctx.waitForEvent('serviceworker');
    this.extId = sw.url().split('/')[2];
    // pin the extension to the toolbar (needs a restart to take effect)
    const prefP = PROFILE + '/Default/Preferences';
    await ctx.close(); await sleep(800);
    const pr = JSON.parse(fs.readFileSync(prefP, 'utf8')); pr.extensions = pr.extensions || {}; pr.extensions.pinned_extensions = [this.extId]; fs.writeFileSync(prefP, JSON.stringify(pr));
    this.ctx = await launch(); this.sw = this.ctx.serviceWorkers()[0] || await this.ctx.waitForEvent('serviceworker');
    await sleep(600);
    return this;
  }
  // ---- raw X input ----
  cmd(line) { return new Promise(r => { this.xinQ.push(r); this.xin.stdin.write(line + '\n'); }); }
  async move(x, y) { this.mx = x; this.my = y; (this.trk = this.trk || []).push([Date.now() / 1000, Math.round(x / this.scale * 10) / 10, Math.round(y / this.scale * 10) / 10]); await this.cmd(`m ${Math.round(x)} ${Math.round(y)}`); }
  log(n, d = {}) { this.ev.push({ n, t: Date.now() / 1000, ...d }); }
  async glideCss(x, y, ms, e) { return this.glide(x * this.scale, y * this.scale, ms, e); }
  async glide(x, y, ms = 600, e = ease.io) {
    const x0 = this.mx, y0 = this.my, t0 = Date.now();
    for (;;) { const t = Math.min(1, (Date.now() - t0) / ms), k = e(t); await this.move(x0 + (x - x0) * k, y0 + (y - y0) * k); if (t >= 1) break; await sleep(6); }
  }
  async path(pts, ms, e = ease.io) { const each = ms / pts.length; for (const [x, y] of pts) await this.glide(x, y, each, e); }
  async down() { this.log('down', { x: this.mx / this.scale, y: this.my / this.scale }); await this.cmd('d'); } async up() { this.log('up'); await this.cmd('u'); }
  async click(hold = 90) { await this.down(); await sleep(hold); await this.up(); }
  async clickAt(x, y, ms = 500) { await this.glide(x, y, ms); await sleep(120); await this.click(); }
  async key(k) { await this.cmd('k ' + k); }
  async type(text, delay = 90) { for (const ch of text) { await this.cmd('t ' + ch); await sleep(delay); } }
  async wheel(n) { await this.cmd('w ' + n); }
  // ---- geometry ----
  // geometry in PHYSICAL screen px (what X input needs); css = phys / scale (== the 1920x1080 layout space)
  async geom(page, sel) {
    return page.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect();
      const ox = window.screenX, oy = window.screenY + (window.outerHeight - window.innerHeight);
      return { x: ox + r.x + r.width / 2, y: oy + r.y + r.height / 2, w: r.width, h: r.height, left: ox + r.x, top: oy + r.y }; }, sel);
  }
  async scr(page, sel) { const g = await this.geom(page, sel); if (!g) return null; const k = this.scale; return { ...g, css: { ...g }, x: g.x * k, y: g.y * k, w: g.w * k, h: g.h * k, left: g.left * k, top: g.top * k }; }
  async clickSel(page, sel, ms = 500) { const p = await this.scr(page, sel); if (!p) throw new Error('no ' + sel); await this.clickAt(p.x, p.y, ms); return p; }
  // ---- tabs ----
  async open(host, p) { const pg = await this.ctx.newPage(); await pg.goto(`http://${host}${p}`, { waitUntil: 'domcontentloaded' }); return pg; }
  async openLink(from, text) { const [np] = await Promise.all([this.ctx.waitForEvent('page'), from.click(`a:has-text("${text}")`)]); await np.waitForLoadState('domcontentloaded'); return np; }
  async shuffleTabs(seed = 7) {
    return this.sw.evaluate(async seed => {
      let s = seed; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
      const tabs = await chrome.tabs.query({ currentWindow: true }); const ids = tabs.map(t => t.id);
      for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
      for (let i = 0; i < ids.length; i++) await chrome.tabs.move(ids[i], { index: i });
      return ids.length;
    }, seed);
  }
  async tabInfo() { return this.sw.evaluate(async () => (await chrome.tabs.query({})).map(t => ({ id: t.id, index: t.index, title: t.title, url: t.url, groupId: t.groupId, active: t.active }))); }
  // ---- capture ----
  startRaw(name, fps = 30) {
    const out = `/dev/shm/${name}.mkv`; try { fs.unlinkSync(out); } catch {}
    const ff = spawn('ffmpeg', ['-hide_banner', '-nostats', '-loglevel', 'warning', '-y', '-use_wallclock_as_timestamps', '1', '-copyts', '-f', 'x11grab', '-draw_mouse', '0', '-framerate', String(fps), '-video_size', `${this.W}x${this.H}`, '-i', process.env.DISPLAY, '-c:v', 'rawvideo', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    return { out, t0: Date.now(), stop: () => new Promise(r => { ff.on('close', r); ff.stdin.write('q'); }) };
  }
  async stop() { try { await this.ctx.close(); } catch {} try { this.xin.stdin.end(); } catch {} }
}
module.exports = { Rig, SITES, sleep, ease, SCR, HERE };

// ---- smoothness analysis of a raw capture (wall-clock pts) ----
Rig.analyze = function (file) {
  const out = execSync(`ffprobe -v error -select_streams v:0 -show_entries frame=pts_time -of csv=p=0 ${file}`, { maxBuffer: 1 << 28 }).toString().trim().split('\n').map(Number);
  const gaps = out.slice(1).map((t, i) => t - out[i]); const dur = out[out.length - 1] - out[0];
  const bad = gaps.filter(g => g > 1.5 / 30).length, worst = Math.max(...gaps);
  return { frames: out.length, dur: +dur.toFixed(2), fps: +(out.length / dur).toFixed(1), stalls: bad, worstGapMs: Math.round(worst * 1000), first: out[0] };
};
