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

const P = plan([{ from: 3.5, to: 5.6, rate: 1.2 }, { from: 5.6, to: 11.0, rate: 1.1 }, { from: 12.4, to: 15.2, rate: 1.25 }]);
export const MAP_FRAMES = CARD + P.total;
export const MapScene: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => Math.round(o(s) * fps);
  const keys = [{ t: 0, cx: 960, cy: 540, s: 1 }];
  return (
    <Shell>
      <Card num="05" kicker="See how tabs connect" lines={[[{ t: 'Every' }, { t: 'tab', c: C.violet }, { t: 'remembers' }], [{ t: 'where' }, { t: 'it' }, { t: 'came', c: C.violet }, { t: 'from.', c: C.violet }]]} sub="TabMapper draws your tabs as a map, so you can see which tab opened which." color={C.violet} icon="tree" />
      <Sequence from={CARD}>
        <Camera keys={keys}><Footage src="footage/mapplay.mp4" items={P.items} /><Cursor scene="mapplay" plan={P} /></Camera>
        <Chip kicker="The map" text="Each bubble is a tab. Lines show who opened whom." inAt={f(3.6)} outAt={f(7.2)} color={C.violet} />
        <Chip kicker="Hover" text="See where a tab came from." inAt={f(7.3)} outAt={f(8.7)} color={C.violet} />
        <Chip kicker="Drag" text="Pull one bubble and its family follows." inAt={f(8.8)} outAt={f(10.9)} color={C.violet} />
        <Chip kicker="Search" text="Type a word. Everything else dims." inAt={f(12.5)} color={C.violet} />
        <Sfx cues={[{ n: 'whoosh', f: 2, v: 0.5 }, { n: 'boing', f: f(ev('mapplay', 'release').t), v: 0.8 }]} />
      </Sequence>
      <Sfx cues={[{ n: 'whoosh', f: 0, v: 0.5 }, { n: 'ding', f: 14, v: 0.4 }]} />
    </Shell>);
};
