import React from 'react';
import { Sequence } from 'remotion';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Footage } from '../components/Footage';
import { Callout, Frame } from '../components/Callout';
import { Card, CARD } from '../components/Card';
import { Chip, Tag } from '../components/Chip';
import { Shell } from '../components/Shell';
import { Sfx } from '../components/Sfx';
import { plan } from '../lib/plan';
import { ev } from '../lib/ev';
import { C } from '../theme';

const S = 'site';
const P = plan([{ from: 1.2, to: 4.0, rate: 1.6 }, { from: 4.0, to: 6.8, rate: 1.1 }, { from: 6.8, to: 7.9, rate: 0.75 }]);
export const SITE_FRAMES = CARD + P.total;
export const Site: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => Math.round(o(s) * fps);
  const a = ev(S, 'menu-item', 0);
  const keys = [
    { t: 0, cx: 960, cy: 540, s: 1 }, { t: o(2.4), cx: 960, cy: 540, s: 1 }, { t: o(3.1), cx: a.x - 330, cy: a.y - 70, s: 1.65 }, { t: o(4.0), cx: a.x - 330, cy: a.y - 70, s: 1.65 },
    { t: o(4.6), cx: 480, cy: 50, s: 1.9 }, { t: o(7.6), cx: 1440, cy: 50, s: 1.9 }];
  return (
    <Shell>
      <Card num="03" kicker="Or by website" lines={[[{ t: 'Prefer' }, { t: 'sites?' }], [{ t: 'Group', c: C.coral }, { t: 'by' }, { t: 'website.', c: C.coral }]]} sub="One tab group for every site. Or line the same sites up side by side." color={C.coral} icon="globe" />
      <Sequence from={CARD}>
        <Camera keys={keys}>
          <Footage src="footage/site.mp4" items={P.items} /><Cursor scene="site" plan={P} />
          <Callout x={a.x} y={a.y} r={26} inAt={f(3.1)} outAt={f(4.2)} />
          <Frame x={14} y={2} w={1892} h={38} inAt={f(4.5)} outAt={f(7.7)} color={C.mint} radius={10} />
        </Camera>
        <Chip kicker="Group" text="Click “Group each site”." inAt={f(2.5)} outAt={f(4.5)} color={C.coral} />
        <Tag text="One group for every website" inAt={f(4.6)} outAt={f(7.8)} color={C.mint} y={300} />
        <Sfx cues={[{ n: 'pop', f: f(ev(S, 'menu-open', 0).t), v: 0.5 }, { n: 'click', f: f(ev(S, 'menu-click', 0).t), v: 0.8 }, { n: 'swoosh', f: f(ev(S, 'menu-click', 0).t + 0.1), v: 0.5 }, { n: 'chime', f: f(ev(S, 'menu-click', 0).t + 0.9), v: 0.5 }, { n: 'rewind', f: f(ev(S, 'undo-click', 0).t), v: 0.6 }, { n: 'rewind', f: f(ev(S, 'undo-click', 0).t), v: 0.6 }]} />
      </Sequence>
      <Sfx cues={[{ n: 'whoosh', f: 0, v: 0.5 }, { n: 'ding', f: 14, v: 0.4 }]} />
    </Shell>);
};
