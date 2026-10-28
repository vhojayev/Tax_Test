import { staticFile } from 'remotion';
import { loadFont } from '@remotion/fonts';
const f = (family: string, file: string, weight: string) => loadFont({ family, url: staticFile(`fonts/${file}`), weight, format: 'woff2' });
export const fontsReady = Promise.all([
  f('Sora', 'sora-latin-600-normal.woff2', '600'), f('Sora', 'sora-latin-700-normal.woff2', '700'), f('Sora', 'sora-latin-800-normal.woff2', '800'),
  f('Inter', 'inter-latin-500-normal.woff2', '500'), f('Inter', 'inter-latin-600-normal.woff2', '600'), f('Inter', 'inter-latin-700-normal.woff2', '700'),
]);
