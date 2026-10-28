import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path'; import fs from 'fs';
const frames = process.argv.slice(2).map(Number);
const out = process.env.OUT || '/tmp/stills2'; fs.mkdirSync(out, { recursive: true });
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), onProgress: () => {} });
const comp = await selectComposition({ serveUrl, id: 'Main', browserExecutable });
for (const f of frames) { await renderStill({ composition: comp, serveUrl, frame: f, output: `${out}/f${f}.png`, browserExecutable, imageFormat: 'jpeg', jpegQuality: 88 }); console.log('still', f); }
console.log('STILLS_DONE');
