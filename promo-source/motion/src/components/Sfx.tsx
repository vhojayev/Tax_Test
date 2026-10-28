import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
export type Cue = { n: string; f: number; v?: number };
/** scene-local sound cues: n = file in public/audio, f = frame within the scene, v = volume */
export const Sfx: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <>{cues.filter(c => c.f >= 0).map((c, i) => (
    <Sequence key={i} from={Math.round(c.f)}><Audio src={staticFile(`audio/${c.n}.wav`)} volume={c.v ?? 0.8} /></Sequence>))}</>
);
