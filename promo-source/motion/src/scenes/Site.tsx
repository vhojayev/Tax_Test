import React from 'react';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Sfx } from '../components/Sfx';
import { Footage } from '../components/Footage';
import { Callout, Frame } from '../components/Callout';
import { Shell, Scrim } from '../components/Shell';
import { Headline, Kicker, Sub } from '../components/Type';
import { plan } from '../lib/plan';
import { ev } from '../lib/ev';
import { C } from '../theme';

const S = 'site';
const P = plan([{ from: 1.0, to: 4.0, rate: 1.6 }, { from: 4.0, to: 6.6, rate: 1.0 }, { from: 6.6, to: 7.4, rate: 1.5 }, { from: 8.7, to: 11.4, rate: 1.8 }, { from: 11.4, to: 14.0, rate: 1.0 }, { from: 14.0, to: 14.7, rate: 1.5 }]);
export const SITE_FRAMES = P.total;
export const Site: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => Math.round(o(s) * fps);
  const a = ev(S, 'menu-item', 0), b = ev(S, 'menu-item', 1);
  const keys = [
    { t: 0, cx: 960, cy: 540, s: 1 }, { t: o(2.2), cx: 960, cy: 540, s: 1 }, { t: o(3.0), cx: a.x - 330, cy: a.y - 70, s: 1.65 }, { t: o(4.0), cx: a.x - 330, cy: a.y - 70, s: 1.65 },
    { t: o(4.4), cx: 960, cy: 50, s: 2.05 }, { t: o(7.0), cx: 960, cy: 50, s: 2.05 }, { t: o(7.4), cx: 960, cy: 540, s: 1 },
    { t: o(9.6), cx: 960, cy: 540, s: 1 }, { t: o(10.4), cx: b.x - 330, cy: b.y - 70, s: 1.65 }, { t: o(11.4), cx: b.x - 330, cy: b.y - 70, s: 1.65 },
    { t: o(11.8), cx: 960, cy: 50, s: 2.05 }, { t: o(14.5), cx: 960, cy: 50, s: 2.05 }];
  return (
    <Shell>
      <Camera keys={keys}>
        <Footage src="footage/site.mp4" items={P.items} /><Cursor scene="site" plan={P} />
        <Callout x={a.x} y={a.y} r={26} inAt={f(3.1)} outAt={f(4.2)} />
        <Frame x={14} y={2} w={1892} h={38} inAt={f(4.5)} outAt={f(7.2)} label="One group per site" color={C.mint} radius={10} />
        <Callout x={b.x} y={b.y} r={26} inAt={f(10.4)} outAt={f(11.6)} />
        <Frame x={14} y={2} w={1892} h={38} inAt={f(11.9)} outAt={f(14.7)} label="Same site, side by side" color={C.sky} radius={10} />
      </Camera>
      <Sfx cues={[{ n: 'pop', f: f(ev(S, 'menu-open', 0).t), v: 0.5 }, { n: 'click', f: f(ev(S, 'menu-click', 0).t), v: 0.8 }, { n: 'swoosh', f: f(ev(S, 'menu-click', 0).t + 0.1), v: 0.5 }, { n: 'chime', f: f(ev(S, 'menu-click', 0).t + 0.9), v: 0.5 }, { n: 'rewind', f: f(ev(S, 'undo-click', 0).t), v: 0.6 }, { n: 'pop', f: f(ev(S, 'menu-open', 1).t), v: 0.5 }, { n: 'click', f: f(ev(S, 'menu-click', 1).t), v: 0.8 }, { n: 'swoosh', f: f(ev(S, 'menu-click', 1).t + 0.1), v: 0.55 }, { n: 'chime', f: f(ev(S, 'menu-click', 1).t + 1.0), v: 0.5 }]} />
      <Scrim side="left" inAt={4} strength={0.9} top={0} />
      <Kicker text="Or" x={90} y={250} inAt={f(1.3)} outAt={f(7.3)} />
      <Headline lines={[[{ t: 'By' }, { t: 'site.', c: C.mint }]]} x={90} y={330} size={120} inAt={f(1.4)} outAt={f(7.3)} />
      <Sub text="One tab group for every website." x={90} y={520} inAt={f(1.9)} outAt={f(7.3)} maxW={560} size={34} />
      <Kicker text="Or" x={90} y={250} inAt={f(9.0)} color={C.sky} />
      <Headline lines={[[{ t: 'Side' }, { t: 'by' }, { t: 'side.', c: C.sky }]]} x={90} y={330} size={104} inAt={f(9.1)} />
      <Sub text="No groups. Just every site's tabs pulled together." x={90} y={500} inAt={f(9.6)} maxW={560} size={34} />
    </Shell>);
};
