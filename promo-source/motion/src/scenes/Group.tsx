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
import { Keycaps } from '../components/Type';
import { plan } from '../lib/plan';
import { ev } from '../lib/ev';
import { C } from '../theme';

const PO = plan([{ from: 1.2, to: 4.9, rate: 1.35 }]);
const PT = plan([{ from: 0.9, to: 2.2, rate: 0.62 }, { from: 2.2, to: 4.05, rate: 1.0 }, { from: 4.05, to: 6.6, rate: 1.25 }, { from: 6.6, to: 8.0, rate: 0.7 }, { from: 8.0, to: 9.2, rate: 1.4 }]);
export const GROUP_FRAMES = CARD + PO.total + PT.total;
export const Group: React.FC = () => {
  const fps = 30; const off = PO.total;                       // topic clip starts after the open clip (inside the footage sequence)
  const o = (s: number) => (off + PT.items.find(it => s >= it.from && s <= it.to)!.outFrom + ((s - PT.items.find(it => s >= it.from && s <= it.to)!.from) / PT.items.find(it => s >= it.from && s <= it.to)!.rate) * fps) / fps;
  const f = (s: number) => Math.round(o(s) * fps);
  const mi = ev('topic', 'menu-item');
  const keys = [
    { t: 0, cx: 960, cy: 540, s: 1 }, { t: off / fps + 0.1, cx: 960, cy: 540, s: 1 },
    { t: o(0.95), cx: 520, cy: 50, s: 1.9 }, { t: o(2.15), cx: 1400, cy: 50, s: 1.9 },                        // BEFORE: slow pan over the messy strip
    { t: o(2.6), cx: mi.x - 330, cy: mi.y - 70, s: 1.65 }, { t: o(4.0), cx: mi.x - 330, cy: mi.y - 70, s: 1.65 },   // menu + click
    { t: o(4.7), cx: 480, cy: 50, s: 1.9 }, { t: o(7.4), cx: 1440, cy: 50, s: 1.9 },                          // AFTER: slow pan over the named groups
    { t: o(8.2), cx: 960, cy: 400, s: 1.15 }];
  return (
    <Shell>
      <Card num="02" kicker="Group" lines={[[{ t: 'One' }, { t: 'click', c: C.sky }, { t: 'sorts' }], [{ t: 'every' }, { t: 'tab' }, { t: 'by' }, { t: 'topic.', c: C.sky }]]} sub="Your real Chrome tab bar turns into named, colour-coded groups." color={C.sky} icon="layers" />
      <Sequence from={CARD}>
        <Camera keys={keys}>
          <Footage src="footage/open.mp4" items={PO.items} />
          <Sequence from={PO.total}><Footage src="footage/topic.mp4" items={PT.items} /></Sequence>
          <Cursor scene="topic" plan={PT} offset={PO.total} />
          <Frame x={14} y={2} w={1892} h={38} inAt={f(1.0)} outAt={f(2.3)} color={C.coral} radius={10} />
          <Callout x={mi.x} y={mi.y} r={26} inAt={f(3.1)} outAt={f(4.3)} />
          <Frame x={14} y={2} w={1892} h={38} inAt={f(4.8)} outAt={f(7.6)} color={C.mint} radius={10} />
        </Camera>
        <Keycaps keys={['Alt', 'Shift', 'D']} x={90} y={440} inAt={4} pressAt={Math.round(0.55 * fps)} outAt={Math.round((off / fps - 0.15) * fps)} size={80} />
        <Chip kicker="Open the map" text="Press Alt + Shift + D" inAt={6} outAt={Math.round((off / fps - 0.1) * fps)} color={C.violet} />
        <Tag text="Before: 45 loose tabs" inAt={f(1.0)} outAt={f(2.3)} color={C.coral} y={300} />
        <Chip kicker="Group" text="Click “Group by topic”." inAt={f(2.4)} outAt={f(4.5)} color={C.sky} />
        <Tag text="After: named groups, one per topic" inAt={f(4.8)} outAt={f(7.6)} color={C.mint} y={300} />
        <Chip kicker="Group" text="Changed your mind? Undo." inAt={f(7.7)} color={C.sky} />
        <Sfx cues={[{ n: 'key', f: 0.55 * fps, v: 0.6 }, { n: 'key', f: 0.62 * fps, v: 0.6 }, { n: 'key', f: 0.69 * fps, v: 0.7 }, { n: 'whoosh', f: off - 20, v: 0.6 }, { n: 'pop', f: f(ev('topic', 'menu-open').t), v: 0.55 }, { n: 'click', f: f(ev('topic', 'menu-click').t), v: 0.8 }, { n: 'swoosh', f: f(ev('topic', 'menu-click').t + 0.1), v: 0.5 }, { n: 'chime', f: f(ev('topic', 'menu-click').t + 1.0), v: 0.55 }, { n: 'click', f: f(ev('topic', 'undo-click').t), v: 0.7 }, { n: 'rewind', f: f(ev('topic', 'undo-click').t), v: 0.6 }]} />
      </Sequence>
      <Sfx cues={[{ n: 'whoosh', f: 0, v: 0.5 }, { n: 'ding', f: 14, v: 0.4 }]} />
    </Shell>);
};
