import raw from '../data/events.json';
type Ev = { n: string; t: number; [k: string]: any };
const D = raw as unknown as Record<string, { dur: number; events: Ev[] }>;
/** nth event called `name` in `scene` (source seconds) */
export const ev = (scene: string, name: string, nth = 0): Ev => {
  const a = D[scene].events.filter(e => e.n === name); if (!a[nth]) throw new Error(`no event ${scene}.${name}[${nth}]`); return a[nth];
};
export const t = (scene: string, name: string, nth = 0) => ev(scene, name, nth).t;

import trackRaw from '../data/tracks.json';
const TR = trackRaw as unknown as Record<string, [number, number, number][]>;
/** pointer position (1920x1080 footage space) at source time `st` seconds */
export const pointerAt = (scene: string, st: number): { x: number; y: number } | null => {
  const a = TR[scene]; if (!a || !a.length) return null;
  if (st <= a[0][0]) return { x: a[0][1], y: a[0][2] };
  let lo = 0, hi = a.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (a[m][0] <= st) lo = m; else hi = m; }
  const [t0, x0, y0] = a[lo], [t1, x1, y1] = a[hi]; const k = t1 > t0 ? Math.min(1, Math.max(0, (st - t0) / (t1 - t0))) : 0;
  return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k };
};
export const downs = (scene: string) => D[scene].events.filter(e => e.n === 'down').map(e => e.t);
