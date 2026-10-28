import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate } from 'remotion';
import { Hook, HOOK_FRAMES } from './scenes/Hook';
import { Find, FIND_FRAMES } from './scenes/Find';
import { Group, GROUP_FRAMES } from './scenes/Group';
import { Site, SITE_FRAMES } from './scenes/Site';
import { Dupes, DUPES_FRAMES } from './scenes/Dupes';
import { MapScene, MAP_FRAMES } from './scenes/MapScene';
import { End, END_FRAMES } from './scenes/End';
import { Intro, INTRO_FRAMES } from './scenes/Intro';
export const OV = 6;   // frames each scene overlaps the previous one
export const SCENES = [
  { id: 'hook', C: Hook, d: HOOK_FRAMES }, { id: 'intro', C: Intro, d: INTRO_FRAMES }, { id: 'find', C: Find, d: FIND_FRAMES }, { id: 'group', C: Group, d: GROUP_FRAMES },
  { id: 'site', C: Site, d: SITE_FRAMES }, { id: 'dupes', C: Dupes, d: DUPES_FRAMES }, { id: 'map', C: MapScene, d: MAP_FRAMES }, { id: 'end', C: End, d: END_FRAMES },
];
export const starts = (() => { let s = 0; return SCENES.map(sc => { const a = s; s += sc.d - OV; return a; }); })();
export const MAIN_FRAMES = starts[starts.length - 1] + SCENES[SCENES.length - 1].d;
export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: '#05070d' }}>
    <Audio src={staticFile('audio/bed.wav')} volume={f => interpolate(f, [0, 60, MAIN_FRAMES - 70, MAIN_FRAMES - 4], [0, 0.17, 0.17, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
    {SCENES.map((sc, i) => (<Sequence key={sc.id} from={starts[i]} durationInFrames={sc.d}><sc.C /></Sequence>))}
  </AbsoluteFill>);
