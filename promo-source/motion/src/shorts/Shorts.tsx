import React from 'react';
import { Sequence } from 'remotion';
import { Camera } from '../components/Camera';
import { Cursor } from '../components/Cursor';
import { Footage } from '../components/Footage';
import { Callout } from '../components/Callout';
import { Count, Stamp } from '../components/Type';
import { Sfx } from '../components/Sfx';
import { plan } from '../lib/plan';
import { ev } from '../lib/ev';
import { C } from '../theme';
import { CTA_FRAMES, Headlines, HookPain, Line, Panel, PANEL, Short, Slot } from './Kit';

const FPS = 30;
const W = (t: string, c?: string, mark?: string) => ({ t, c, mark });

/* ---------------------------------------------------------------- Short 1: Too many tabs? One click. */
const PH1 = plan([{ from: 0.8, to: 4.4, rate: 1.1 }]);
const PT1 = plan([{ from: 1.9, to: 2.2, rate: 1 }, { from: 2.2, to: 4.05, rate: 1.1 }, { from: 4.05, to: 6.6, rate: 1.0 }, { from: 6.6, to: 7.7, rate: 0.8 }, { from: 7.7, to: 9.0, rate: 1.3 }]);
const BODY1 = PH1.total + PT1.total;
export const S1_FRAMES = BODY1 + CTA_FRAMES;
export const Short1: React.FC = () => {
  const oT = (s: number) => (PH1.total + PT1.srcToOut(s) * FPS);       // frames
  const mi = ev('topic', 'menu-item');
  const keys = [
    { t: 0, cx: 650, cy: 300, s: 1.3 }, { t: PH1.total / FPS, cx: 1250, cy: 300, s: 1.3 },
    { t: oT(2.1) / FPS, cx: mi.x - 150, cy: mi.y - 40, s: 1.35 }, { t: oT(4.0) / FPS, cx: mi.x - 150, cy: mi.y - 40, s: 1.35 },
    { t: oT(4.5) / FPS, cx: 480, cy: 200, s: 2.0 }, { t: oT(6.4) / FPS, cx: 1440, cy: 200, s: 2.0 }, { t: oT(7.0) / FPS, cx: 1440, cy: 200, s: 2.0 },
    { t: oT(7.6) / FPS, cx: 960, cy: 300, s: 1.35 }, { t: BODY1 / FPS, cx: 960, cy: 300, s: 1.35 }];
  const slots: Slot[] = [
    { from: 0, to: Math.round(PH1.total), lines: [[W('Too'), W('many'), W('tabs?', C.coral)]] },
    { from: Math.round(PH1.total), to: Math.round(oT(4.4)), lines: [[W('One', C.ink), W('click.', C.mint)]] },
    { from: Math.round(oT(4.4)), to: Math.round(oT(7.55)), lines: [[W('Sorted')], [W('by'), W('topic.', C.mint)]], size: 104 },
    { from: Math.round(oT(7.55)), to: BODY1, lines: [[W('Undo'), W('anytime.', C.sky)]] }];
  return (
    <Short bodyFrames={BODY1}>
      <Headlines slots={slots} />
      <Panel>
        <Camera keys={keys} viewW={PANEL.w} viewH={PANEL.h}>
          <Footage src="footage/hook.mp4" items={PH1.items} /><Cursor scene="hook" plan={PH1} />
          <Sequence from={Math.round(PH1.total)}><Footage src="footage/topic.mp4" items={PT1.items} /><Cursor scene="topic" plan={PT1} />
            <Callout x={mi.x} y={mi.y} r={26} inAt={Math.round(PT1.srcToOut(3.0) * FPS)} outAt={Math.round(PT1.srcToOut(4.2) * FPS)} /></Sequence>
        </Camera>
      </Panel>
      <HookPain frames={Math.round(PH1.total)} />
      <Line text="Real Chrome tab bar. One click." inAt={Math.round(oT(4.5))} outAt={Math.round(oT(7.5))} />
      <Line text="Changed your mind? Undo." inAt={Math.round(oT(7.6))} color={C.sky} />
      <Sfx cues={[{ n: 'tickrun', f: 8, v: 0.45 }, { n: 'click', f: Math.round(PH1.srcToOut(ev('hook', 'tab-click', 0).t) * FPS), v: 0.7 }, { n: 'click', f: Math.round(PH1.srcToOut(ev('hook', 'tab-click', 1).t) * FPS), v: 0.7 },
        { n: 'whoosh', f: Math.round(PH1.total) - 6, v: 0.6 }, { n: 'pop', f: Math.round(oT(ev('topic', 'menu-open').t)), v: 0.5 }, { n: 'click', f: Math.round(oT(ev('topic', 'menu-click').t)), v: 0.8 },
        { n: 'swoosh', f: Math.round(oT(4.15)), v: 0.5 }, { n: 'chime', f: Math.round(oT(5.0)), v: 0.55 }, { n: 'click', f: Math.round(oT(ev('topic', 'undo-click').t)), v: 0.7 }, { n: 'rewind', f: Math.round(oT(ev('topic', 'undo-click').t)), v: 0.6 }]} />
    </Short>);
};

/* ---------------------------------------------------------------- Short 2: Which tab was it? */
const PH2 = plan([{ from: 1.0, to: 3.2, rate: 1.2 }]);
const PF2 = plan([{ from: 1.9, to: 2.1, rate: 1 }, { from: 2.1, to: 4.6, rate: 1.0 }, { from: 4.6, to: 6.6, rate: 0.95 }, { from: 6.6, to: 8.2, rate: 0.95 }]);
const BODY2 = PH2.total + PF2.total;
export const S2_FRAMES = BODY2 + CTA_FRAMES;
export const Short2: React.FC = () => {
  const oF = (s: number) => PH2.total + PF2.srcToOut(s) * FPS;
  const pf = ev('find', 'popup-find'), pr = ev('find', 'popup-row');
  const keys = [{ t: 0, cx: 800, cy: 300, s: 1.3 }, { t: PH2.total / FPS, cx: 1200, cy: 300, s: 1.3 },
    { t: oF(2.3) / FPS, cx: 1500, cy: 330, s: 1.6 }, { t: oF(7.5) / FPS, cx: 1500, cy: 330, s: 1.6 }, { t: BODY2 / FPS, cx: 960, cy: 410, s: 1.0 }];
  const slots: Slot[] = [
    { from: 0, to: Math.round(PH2.total), lines: [[W('Which'), W('tab')], [W('was'), W('it?', C.coral)]], size: 118 },
    { from: Math.round(PH2.total), to: Math.round(oF(5.4)), lines: [[W('Type'), W('a')], [W('word.', C.mint)]], size: 118 },
    { from: Math.round(oF(5.4)), to: BODY2, lines: [[W('Jump')], [W('straight'), W('there.', C.mint)]], size: 104 }];
  return (
    <Short bodyFrames={BODY2}>
      <Headlines slots={slots} />
      <Panel>
        <Camera keys={keys} viewW={PANEL.w} viewH={PANEL.h}>
          <Footage src="footage/hook.mp4" items={PH2.items} /><Cursor scene="hook" plan={PH2} />
          <Sequence from={Math.round(PH2.total)}><Footage src="footage/find.mp4" items={PF2.items} /><Cursor scene="find" plan={PF2} />
            <Callout x={pr.x} y={pr.y} r={34} inAt={Math.round(PF2.srcToOut(5.7) * FPS)} outAt={Math.round(PF2.srcToOut(6.9) * FPS)} /></Sequence>
        </Camera>
      </Panel>
      <HookPain frames={Math.round(PH2.total)} />
      <Line text="Results arrive grouped by topic." inAt={Math.round(oF(4.4))} outAt={Math.round(oF(7.0))} />
      <Sfx cues={[{ n: 'click', f: Math.round(oF(ev('find', 'popup-open').t) - 3), v: 0.7 }, { n: 'pop', f: Math.round(oF(ev('find', 'popup-open').t)), v: 0.5 },
        ...Array.from({ length: 9 }, (_, i) => ({ n: 'key', f: Math.round(oF(ev('find', 'popup-find').t + 0.15 + i * 0.105)), v: 0.45 })),
        { n: 'ding', f: Math.round(oF(ev('find', 'typed').t + 0.1)), v: 0.5 }, { n: 'click', f: Math.round(oF(ev('find', 'row-click').t)), v: 0.8 }, { n: 'whoosh', f: Math.round(oF(ev('find', 'row-click').t + 0.1)), v: 0.5 }]} />
    </Short>);
};

/* ---------------------------------------------------------------- Short 3: Duplicate tabs? */
const PD3 = plan([{ from: 0.9, to: 2.6, rate: 1.1 }, { from: 2.6, to: 4.9, rate: 0.85 }, { from: 4.9, to: 7.0, rate: 0.95 }]);
const BODY3 = PD3.total;
export const S3_FRAMES = BODY3 + CTA_FRAMES;
export const Short3: React.FC = () => {
  const o = (s: number) => PD3.srcToOut(s) * FPS;
  const ch = ev('dupes', 'chip');
  const keys = [{ t: 0, cx: 880, cy: 260, s: 1.6 }, { t: BODY3 / FPS, cx: 880, cy: 260, s: 1.6 }];
  const slots: Slot[] = [
    { from: 0, to: Math.round(o(2.5)), lines: [[W('Duplicate'), W('tabs?', C.rose)]], size: 118 },
    { from: Math.round(o(2.5)), to: Math.round(o(5.0)), lines: [[W('One'), W('click.', C.rose)]] },
    { from: Math.round(o(5.0)), to: BODY3, lines: [[W('Undo')], [W('anything.', C.mint)]], size: 118 }];
  return (
    <Short bodyFrames={BODY3}>
      <Headlines slots={slots} />
      <Panel accent={C.rose}>
        <Camera keys={keys} viewW={PANEL.w} viewH={PANEL.h}>
          <Footage src="footage/dupes.mp4" items={PD3.items} /><Cursor scene="dupes" plan={PD3} />
          <Callout x={ch.x} y={ch.y} r={44} inAt={Math.round(o(1.5))} outAt={Math.round(o(3.0))} color={C.rose} />
        </Camera>
      </Panel>
      <Count from={45} to={42} at={Math.round(o(2.65))} dur={26} x={640} y={1190} size={150} label="tabs" outAt={Math.round(o(5.0))} />
      <Count from={42} to={45} at={Math.round(o(5.05))} dur={22} x={640} y={1190} size={150} label="tabs" color={C.mint} />
      <Stamp text="Nothing lost." x={540} y={950} at={Math.round(o(5.2))} dur={38} size={78} />
      <Line text="Only extra copies close." inAt={Math.round(o(2.7))} outAt={Math.round(o(4.9))} color={C.dim} />
      <Sfx cues={[{ n: 'click', f: Math.round(o(ev('dupes', 'dedupe-click').t)), v: 0.8 }, { n: 'pop', f: Math.round(o(ev('dupes', 'dedupe-click').t + 0.15)), v: 0.9 }, { n: 'thump', f: Math.round(o(ev('dupes', 'dedupe-click').t + 0.15)), v: 0.5 },
        { n: 'click', f: Math.round(o(ev('dupes', 'undo-click').t)), v: 0.7 }, { n: 'rewind', f: Math.round(o(ev('dupes', 'undo-click').t)), v: 0.65 }, { n: 'chime', f: Math.round(o(ev('dupes', 'undo-click').t + 0.2)), v: 0.65 }]} />
    </Short>);
};
