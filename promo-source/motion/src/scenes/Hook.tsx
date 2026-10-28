import React from 'react';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Sfx } from '../components/Sfx';
import { Footage } from '../components/Footage';
import { Shell, Scrim } from '../components/Shell';
import { Count, Headline } from '../components/Type';
import { plan } from '../lib/plan';
import { t } from '../lib/ev';
import { C } from '../theme';

const S = 'hook';
const P = plan([{ from: 0.8, to: 1.6, rate: 1 }, { from: 1.6, to: t(S, 'hover') + 0.6, rate: 1.6 }, { from: t(S, 'hover') + 0.6, to: 4.9, rate: 1 }, { from: 4.9, to: 7.0, rate: 1.5 }]);
export const HOOK_FRAMES = P.total; export const HOOK = { P };
export const Hook: React.FC = () => {
  const o = P.srcToOut; const fps = 30; const f = (s: number) => o(s) * fps;
  const keys = [
    { t: 0, cx: 960, cy: 540, s: 1 }, { t: o(1.25), cx: 960, cy: 540, s: 1 }, { t: o(1.75), cx: 230, cy: 40, s: 2.1 },
    { t: o(3.9), cx: 700, cy: 40, s: 2.1 }, { t: o(4.6), cx: 700, cy: 40, s: 2.1 }, { t: o(5.1), cx: 960, cy: 540, s: 1 }];
  return (
    <Shell>
      <Camera keys={keys}><Footage src="footage/hook.mp4" items={P.items} /><Cursor scene="hook" plan={P} /></Camera>
      <Sfx cues={[{ n: 'tickrun', f: 0.35 * fps, v: 0.5 }, { n: 'click', f: f(t(S, 'tab-click', 0)), v: 0.7 }, { n: 'click', f: f(t(S, 'tab-click', 1)), v: 0.7 }, { n: 'click', f: f(t(S, 'tab-click', 2)), v: 0.7 }, { n: 'pop', f: 1.55 * fps, v: 0.6 }, { n: 'whoosh', f: P.total - 14, v: 0.7 }]} />
      <Scrim side="left" inAt={4} top={110} strength={0.95} blur={0} />
      <Count from={12} to={45} at={Math.round(0.35 * fps)} dur={Math.round(1.5 * fps)} x={110} y={380} size={250} label="tabs" />
      <Headline lines={[[{ t: 'Which' }, { t: 'one' }], [{ t: 'was' }, { t: 'it?', mark: 'rgba(255,138,76,.62)' }]]} x={110} y={640} size={132} inAt={Math.round(1.55 * fps)} />
    </Shell>);
};
