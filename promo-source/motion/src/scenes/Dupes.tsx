import React from 'react';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Sfx } from '../components/Sfx';
import { Footage } from '../components/Footage';
import { Callout } from '../components/Callout';
import { Shell, Scrim } from '../components/Shell';
import { Count, Headline, Kicker, Stamp } from '../components/Type';
import { plan } from '../lib/plan';
import { ev } from '../lib/ev';
import { C } from '../theme';

const S = 'dupes';
const P = plan([{ from: 0.9, to: 2.6, rate: 1.5 }, { from: 2.6, to: 4.9, rate: 1.0 }, { from: 4.9, to: 6.9, rate: 1.15 }]);
export const DUPES_FRAMES = P.total;
export const Dupes: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => Math.round(o(s) * fps);
  const ch = ev(S, 'chip');
  const keys = [{ t: 0, cx: 960, cy: 540, s: 1 }, { t: o(1.3), cx: 960, cy: 540, s: 1 }, { t: o(2.0), cx: 760, cy: 150, s: 1.5 }, { t: o(6.0), cx: 760, cy: 150, s: 1.5 }, { t: o(6.8), cx: 960, cy: 540, s: 1 }];
  return (
    <Shell>
      <Camera keys={keys}>
        <Footage src="footage/dupes.mp4" items={P.items} /><Cursor scene="dupes" plan={P} />
        <Callout x={ch.x} y={ch.y} r={44} label="3 duplicate tabs" dx={150} dy={110} inAt={f(1.5)} outAt={f(3.0)} />
      </Camera>
      <Sfx cues={[{ n: 'click', f: f(ev(S, 'dedupe-click').t), v: 0.8 }, { n: 'pop', f: f(ev(S, 'dedupe-click').t + 0.15), v: 0.9 }, { n: 'thump', f: f(ev(S, 'dedupe-click').t + 0.15), v: 0.5 }, { n: 'click', f: f(ev(S, 'undo-click').t), v: 0.7 }, { n: 'rewind', f: f(ev(S, 'undo-click').t), v: 0.65 }, { n: 'chime', f: f(ev(S, 'undo-click').t + 0.2), v: 0.65 }]} />
      <Scrim side="bottom" inAt={4} strength={0.94} top={430} />
      <Kicker text="Clean up" x={110} y={640} inAt={f(1.2)} />
      <Headline lines={[[{ t: 'Close' }, { t: 'duplicates.', c: C.mint }]]} x={110} y={710} size={112} inAt={f(1.3)} />
      <Count from={45} to={42} at={f(2.65)} dur={30} x={1330} y={680} size={190} label="tabs" outAt={f(5.75)} />
      <Count from={42} to={45} at={f(5.85)} dur={26} x={1330} y={680} size={190} label="tabs" color={C.mint} />
      <Stamp text="Undo anything." x={1500} y={880} at={f(5.95)} dur={40} />
    </Shell>);
};
