import React from 'react';
import { Sequence } from 'remotion';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Footage } from '../components/Footage';
import { Callout } from '../components/Callout';
import { Card, CARD } from '../components/Card';
import { Chip } from '../components/Chip';
import { Shell } from '../components/Shell';
import { Sfx } from '../components/Sfx';
import { plan } from '../lib/plan';
import { ev, t } from '../lib/ev';
import { C } from '../theme';

const S = 'find';
const P = plan([{ from: 0.9, to: 2.0, rate: 1.3 }, { from: 2.0, to: 4.6, rate: 1.0 }, { from: 4.6, to: 6.6, rate: 0.9 }, { from: 6.6, to: 8.4, rate: 0.9 }]);
export const FIND_FRAMES = CARD + P.total;
export const Find: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => Math.round(o(s) * fps);
  const pf = ev(S, 'popup-find'), pr = ev(S, 'popup-row');
  const keys = [{ t: 0, cx: 960, cy: 540, s: 1 }, { t: o(1.9), cx: 960, cy: 540, s: 1 }, { t: o(2.7), cx: 1480, cy: 290, s: 1.7 }, { t: o(6.7), cx: 1480, cy: 290, s: 1.7 }, { t: o(7.6), cx: 960, cy: 540, s: 1 }];
  return (
    <Shell>
      <Card num="01" kicker="Find" lines={[[{ t: 'Search' }, { t: 'every' }, { t: 'open' }], [{ t: 'tab', c: C.mint }, { t: 'at' }, { t: 'once.' }]]} sub="Type a word. Jump straight to the tab, even when the tab bar shows only letters." color={C.mint} icon="search" />
      <Sequence from={CARD}>
        <Camera keys={keys}>
          <Footage src="footage/find.mp4" items={P.items} /><Cursor scene="find" plan={P} />
          <Callout x={pf.x} y={pf.y} r={30} label="Type a word" dx={-150} dy={70} inAt={f(3.4)} outAt={f(4.9)} />
          <Callout x={pr.x} y={pr.y} r={34} label="Click the result" dx={-170} dy={80} inAt={f(5.8)} outAt={f(7.0)} />
        </Camera>
        <Chip kicker="Find" text="Results arrive grouped by topic." inAt={f(3.0)} />
        <Sfx cues={[{ n: 'click', f: f(t(S, 'popup-open') - 0.15), v: 0.7 }, { n: 'pop', f: f(t(S, 'popup-open') + 0.05), v: 0.5 }, ...Array.from({ length: 9 }, (_, i) => ({ n: 'key', f: f(t(S, 'popup-find') + 0.15 + i * 0.105), v: 0.45 })), { n: 'ding', f: f(t(S, 'typed') + 0.1), v: 0.5 }, { n: 'click', f: f(t(S, 'row-click')), v: 0.8 }, { n: 'whoosh', f: f(t(S, 'row-click') + 0.1), v: 0.5 }]} />
      </Sequence>
      <Sfx cues={[{ n: 'whoosh', f: 0, v: 0.5 }, { n: 'ding', f: 14, v: 0.4 }]} />
    </Shell>);
};
