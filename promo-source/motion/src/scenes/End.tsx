import React from 'react';
import { Shell } from '../components/Shell';
import { EndCard } from '../components/EndCard';
import { Sfx } from '../components/Sfx';
export const END_FRAMES = 215;
export const End: React.FC = () => <Shell fade={12}><EndCard /><Sfx cues={[{ n: 'rise', f: 6, v: 0.55 }, { n: 'swoosh', f: 20, v: 0.5 }, { n: 'thump', f: 52, v: 0.8 }, { n: 'chime', f: 54, v: 0.8 }, { n: 'ding', f: 90, v: 0.4 }, { n: 'ding', f: 96, v: 0.4 }, { n: 'ding', f: 102, v: 0.4 }, { n: 'pop', f: 114, v: 0.6 }]} /></Shell>;
