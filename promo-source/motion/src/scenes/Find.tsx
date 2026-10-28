import React from 'react';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Sfx } from '../components/Sfx';
import { Footage } from '../components/Footage';
import { Callout } from '../components/Callout';
import { Shell, Scrim } from '../components/Shell';
import { Headline, Kicker, Sub } from '../components/Type';
import { plan } from '../lib/plan';
import { ev, t } from '../lib/ev';
import { C } from '../theme';

const S = 'find';
const P = plan([{ from: 0.8, to: 2.0, rate: 1.5 }, { from: 2.0, to: 4.5, rate: 1.0 }, { from: 4.5, to: 6.6, rate: 1.0 }, { from: 6.6, to: 8.5, rate: 1.0 }]);
export const FIND_FRAMES = P.total;
export const Find: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => Math.round(o(s) * fps);
  const pf = ev(S, 'popup-find'), pr = ev(S, 'popup-row');
  const keys = [{ t: 0, cx: 960, cy: 540, s: 1 }, { t: o(1.7), cx: 960, cy: 540, s: 1 }, { t: o(2.55), cx: 1560, cy: 270, s: 1.95 }, { t: o(6.5), cx: 1560, cy: 270, s: 1.95 }, { t: o(7.4), cx: 960, cy: 200, s: 1.25 }];
  return (
    <Shell>
      <Camera keys={keys}>
        <Footage src="footage/find.mp4" items={P.items} /><Cursor scene="find" plan={P} />
        <Callout x={pf.x} y={pf.y} r={30} label="Type a word" dx={-190} dy={90} inAt={f(3.4)} outAt={f(4.8)} />
        <Callout x={pr.x} y={pr.y} r={34} label="Jump straight there" sub="even if it's a one-letter sliver" dx={-210} dy={110} inAt={f(5.7)} outAt={f(6.9)} />
      </Camera>
      <Sfx cues={[{ n: 'click', f: f(t(S, 'popup-open') - 0.15), v: 0.7 }, { n: 'pop', f: f(t(S, 'popup-open') + 0.05), v: 0.5 }, ...Array.from({ length: 9 }, (_, i) => ({ n: 'key', f: f(t(S, 'popup-find') + 0.15 + i * 0.105), v: 0.45 })), { n: 'ding', f: f(t(S, 'typed') + 0.1), v: 0.5 }, { n: 'click', f: f(t(S, 'row-click')), v: 0.8 }, { n: 'whoosh', f: f(t(S, 'row-click') + 0.1), v: 0.5 }]} />
      <Scrim side="left" inAt={f(1.9)} strength={0.94} top={96} />
      <Kicker text="Find" x={110} y={300} inAt={f(1.8)} />
      <Headline lines={[[{ t: 'Type' }, { t: 'a' }, { t: 'word.', c: C.mint }], [{ t: 'Land' }, { t: 'on' }, { t: 'the' }, { t: 'tab.' }]]} x={110} y={380} size={96} inAt={f(2.0)} />
      <Sub text="Search across every tab at once. Results arrive already sorted by topic." x={110} y={680} inAt={f(2.6)} maxW={720} size={34} />
    </Shell>);
};
