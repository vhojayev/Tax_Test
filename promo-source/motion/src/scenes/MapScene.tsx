import React from 'react';
import { Sequence } from 'remotion';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Footage } from '../components/Footage';
import { Card, CARD } from '../components/Card';
import { Chip } from '../components/Chip';
import { Shell } from '../components/Shell';
import { Sfx } from '../components/Sfx';
import { plan } from '../lib/plan';
import { ev } from '../lib/ev';
import { C } from '../theme';

const P = plan([{ from: 2.2, to: 4.4, rate: 1.3 }, { from: 4.4, to: 7.9, rate: 0.9 }, { from: 9.7, to: 12.2, rate: 1.2 }]);
export const MAP_FRAMES = CARD + P.total;
export const MapScene: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => Math.round(o(s) * fps);
  const keys = [{ t: 0, cx: 960, cy: 540, s: 1 }, { t: o(4.4), cx: 960, cy: 540, s: 1 }, { t: o(5.0), cx: 760, cy: 620, s: 1.35 }, { t: o(7.8), cx: 760, cy: 620, s: 1.35 }, { t: o(9.9), cx: 960, cy: 540, s: 1 }];
  return (
    <Shell>
      <Card num="05" kicker="See how tabs connect" lines={[[{ t: 'Every' }, { t: 'tab', c: C.violet }, { t: 'remembers' }], [{ t: 'where' }, { t: 'it' }, { t: 'came', c: C.violet }, { t: 'from.', c: C.violet }]]} sub="TabMapper draws your tabs as a map, so you can see which tab opened which." color={C.violet} icon="tree" />
      <Sequence from={CARD}>
        <Camera keys={keys}><Footage src="footage/mapplay.mp4" items={P.items} /><Cursor scene="mapplay" plan={P} /></Camera>
        <Chip kicker="The map" text="Each bubble is a tab. Lines show who opened whom." inAt={f(2.4)} outAt={f(4.6)} color={C.violet} />
        <Chip kicker="The map" text="Pull one bubble and its family follows." inAt={f(5.2)} outAt={f(7.8)} color={C.violet} />
        <Chip kicker="The map" text="Search dims everything else." inAt={f(9.9)} outAt={f(12.2)} color={C.violet} />
        <Sfx cues={[{ n: 'whoosh', f: 2, v: 0.5 }, { n: 'boing', f: f(ev('mapplay', 'release').t), v: 0.8 }]} />
      </Sequence>
      <Sfx cues={[{ n: 'whoosh', f: 0, v: 0.5 }, { n: 'ding', f: 14, v: 0.4 }]} />
    </Shell>);
};
