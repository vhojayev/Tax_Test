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
import { Count, Stamp } from '../components/Type';
import { plan } from '../lib/plan';
import { ev } from '../lib/ev';
import { C } from '../theme';

const S = 'dupes';
const P = plan([{ from: 0.9, to: 2.6, rate: 1.2 }, { from: 2.6, to: 4.9, rate: 0.85 }, { from: 4.9, to: 7.0, rate: 0.95 }]);
export const DUPES_FRAMES = CARD + P.total;
export const Dupes: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => Math.round(o(s) * fps);
  const ch = ev(S, 'chip');
  const keys = [{ t: 0, cx: 960, cy: 540, s: 1 }, { t: o(1.3), cx: 960, cy: 540, s: 1 }, { t: o(2.0), cx: 880, cy: 190, s: 1.4 }, { t: o(6.3), cx: 880, cy: 190, s: 1.4 }, { t: o(6.9), cx: 960, cy: 540, s: 1 }];
  return (
    <Shell>
      <Card num="04" kicker="Clean up" lines={[[{ t: 'Close' }, { t: 'duplicates' }], [{ t: 'in' }, { t: 'one', c: C.rose }, { t: 'click.', c: C.rose }]]} sub="Only the extra copies close. Undo brings everything back." color={C.rose} icon="sparkle" />
      <Sequence from={CARD}>
        <Camera keys={keys}>
          <Footage src="footage/dupes.mp4" items={P.items} /><Cursor scene="dupes" plan={P} />
          <Callout x={ch.x} y={ch.y} r={44} inAt={f(1.5)} outAt={f(3.0)} color={C.rose} />
        </Camera>
        <Chip kicker="Clean up" text="“Close 3 duplicates”" inAt={f(1.3)} outAt={f(4.6)} color={C.rose} />
        <Count from={45} to={42} at={f(2.65)} dur={30} x={1480} y={760} size={170} label="tabs" outAt={f(5.0)} />
        <Count from={42} to={45} at={f(5.05)} dur={26} x={1480} y={760} size={170} label="tabs" color={C.mint} />
        <Chip kicker="Safe" text="Undo anything." inAt={f(4.9)} color={C.mint} />
        <Stamp text="Nothing lost." x={960} y={500} at={f(5.2)} dur={42} size={84} />
        <Sfx cues={[{ n: 'click', f: f(ev(S, 'dedupe-click').t), v: 0.8 }, { n: 'pop', f: f(ev(S, 'dedupe-click').t + 0.15), v: 0.9 }, { n: 'thump', f: f(ev(S, 'dedupe-click').t + 0.15), v: 0.5 }, { n: 'click', f: f(ev(S, 'undo-click').t), v: 0.7 }, { n: 'rewind', f: f(ev(S, 'undo-click').t), v: 0.65 }, { n: 'chime', f: f(ev(S, 'undo-click').t + 0.2), v: 0.65 }]} />
      </Sequence>
      <Sfx cues={[{ n: 'whoosh', f: 0, v: 0.5 }, { n: 'ding', f: 14, v: 0.4 }]} />
    </Shell>);
};
