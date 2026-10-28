import React from 'react';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Sfx } from '../components/Sfx';
import { Footage } from '../components/Footage';
import { Shell, Scrim } from '../components/Shell';
import { Headline, Kicker } from '../components/Type';
import { plan } from '../lib/plan';
import { C } from '../theme';
import { ev } from '../lib/ev';

const P = plan([{ from: 2.0, to: 4.4, rate: 1.8 }, { from: 4.4, to: 7.8, rate: 1.0 }, { from: 9.6, to: 11.6, rate: 1.5 }, { from: 14.0, to: 18.4, rate: 2.0 }]);
export const MAP_FRAMES = P.total;
export const MapScene: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => Math.round(o(s) * fps);
  const keys = [{ t: 0, cx: 960, cy: 540, s: 1 }, { t: o(4.4), cx: 960, cy: 540, s: 1 }, { t: o(6.9), cx: 900, cy: 560, s: 1.18 }, { t: o(8.5), cx: 960, cy: 540, s: 1 }];
  return (
    <Shell>
      <Camera keys={keys}><Footage src="footage/mapplay.mp4" items={P.items} /><Cursor scene="mapplay" plan={P} /></Camera>
      <Sfx cues={[{ n: 'whoosh', f: 2, v: 0.5 }, { n: 'boing', f: f(ev('mapplay', 'release').t), v: 0.8 }, ...[0, 1, 2].map(i => ({ n: 'hit', f: f(ev('mapplay', 'look', i).t), v: 0.7 }))]} />
      <Scrim side="left" inAt={4} strength={0.7} />
      <Kicker text="See" x={90} y={560} inAt={f(2.0)} color={C.violet} />
      <Headline lines={[[{ t: 'Or' }, { t: 'see' }, { t: 'it' }], [{ t: 'as' }, { t: 'a' }, { t: 'map.', c: C.violet }]]} x={90} y={630} size={96} inAt={f(2.1)} />
    </Shell>);
};
