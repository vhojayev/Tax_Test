import React from 'react';
import { OffthreadVideo, Sequence, staticFile } from 'remotion';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Sfx } from '../components/Sfx';
import { Footage } from '../components/Footage';
import { Callout, Frame } from '../components/Callout';
import { Shell, Scrim } from '../components/Shell';
import { Headline, Keycaps, Kicker, Sub } from '../components/Type';
import { plan } from '../lib/plan';
import { ev, t } from '../lib/ev';
import { C } from '../theme';

const PO = plan([{ from: 0.8, to: 4.2, rate: 1.4 }]);
const PT = plan([{ from: 1.0, to: 2.2, rate: 1.3 }, { from: 2.2, to: 4.0, rate: 1.0 }, { from: 4.0, to: 6.6, rate: 1.0 }, { from: 6.6, to: 7.9, rate: 1.0 }, { from: 7.9, to: 9.0, rate: 1.6 }]);
export const GROUP_FRAMES = PO.total + PT.total;
export const Group: React.FC = () => {
  const fps = 30; const off = PO.total / fps;            // topic clip starts after the open clip
  const o = (s: number) => off + PT.srcToOut(s); const f = (s: number) => Math.round(o(s) * fps);
  const mi = ev('topic', 'menu-item');
  const keys = [
    { t: 0, cx: 960, cy: 540, s: 1 }, { t: off + 0.2, cx: 960, cy: 540, s: 1 },
    { t: o(2.3), cx: mi.x - 330, cy: mi.y - 70, s: 1.65 },                     // menu opens: lean in, menu sits on the right
    { t: o(4.35), cx: mi.x - 330, cy: mi.y - 70, s: 1.65 },
    { t: o(4.75), cx: 960, cy: 50, s: 2.05 },                            // click -> watch the real tab strip transform
    { t: o(6.9), cx: 960, cy: 50, s: 2.05 },
    { t: o(7.6), cx: 960, cy: 400, s: 1.2 }];
  const sc = ev('open', 'shortcut');
  return (
    <Shell>
      <Camera keys={keys}>
        <Footage src="footage/open.mp4" items={PO.items} /><Cursor scene="open" plan={PO} />
        <Sequence from={PO.total}><Footage src="footage/topic.mp4" items={PT.items} /><Cursor scene="topic" plan={PT} /></Sequence>
        <Frame x={14} y={2} w={1892} h={38} inAt={f(2.4)} outAt={f(4.1)} label="Before" color={C.coral} radius={10} />
        <Frame x={14} y={2} w={1892} h={38} inAt={f(4.75)} outAt={f(8.3)} label="After" color={C.mint} radius={10} />
        <Callout x={mi.x} y={mi.y} r={26} inAt={f(3.1)} outAt={f(4.4)} />
      </Camera>
      <Sfx cues={[{ n: 'key', f: 0.55 * fps, v: 0.6 }, { n: 'key', f: 0.62 * fps, v: 0.6 }, { n: 'key', f: 0.69 * fps, v: 0.7 }, { n: 'whoosh', f: PO.total - 20, v: 0.6 }, { n: 'pop', f: f(ev('topic', 'menu-open').t), v: 0.55 }, { n: 'click', f: f(ev('topic', 'menu-click').t), v: 0.8 }, { n: 'swoosh', f: f(ev('topic', 'menu-click').t + 0.1), v: 0.5 }, { n: 'chime', f: f(ev('topic', 'grouped').t - 1.7), v: 0.55 }, { n: 'click', f: f(ev('topic', 'undo-click').t), v: 0.7 }, { n: 'rewind', f: f(ev('topic', 'undo-click').t), v: 0.6 }]} />
      <Scrim side="left" inAt={Math.round((off + 0.1) * fps)} strength={0.9} top={96} />
      <Keycaps keys={['Alt', 'Shift', 'D']} x={110} y={470} inAt={4} pressAt={Math.round(0.55 * fps)} outAt={Math.round((off - 0.1) * fps)} size={78} />
      <Kicker text="Open the map" x={110} y={380} inAt={2} outAt={Math.round((off - 0.1) * fps)} />
      <Kicker text="Group" x={90} y={240} inAt={f(2.0)} />
      <Headline lines={[[{ t: 'One' }, { t: 'click.', c: C.mint }], [{ t: 'Sorted' }, { t: 'by' }, { t: 'topic.' }]]} x={90} y={320} size={100} inAt={f(2.1)} />
      <Sub text="Your real tab bar regroups into named, colour-coded groups. Undo puts it all back." x={90} y={640} inAt={f(2.9)} maxW={620} size={32} />
    </Shell>);
};
