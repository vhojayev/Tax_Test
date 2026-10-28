import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../components/Sfx';
import { Headline } from '../components/Type';
import { Shell } from '../components/Shell';
import { C, E, F } from '../theme';
export const INTRO_FRAMES = 140;
const CH = [{ t: 'Find', c: C.mint }, { t: 'Group', c: C.sky }, { t: 'Clean up', c: C.coral }];
export const Intro: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 140 } });
  const line = spring({ frame: frame - 44, fps, config: { damping: 20, stiffness: 110 } });
  return (
    <Shell fade={10}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 38%, rgba(26,52,88,1) 0%, #0a1020 55%, #05070d 100%)' }}>
        <Img src={staticFile('mark.png')} style={{ position: 'absolute', left: 960 - 80, top: 150, width: 160, height: 160, borderRadius: 38, transform: `scale(${logo})`, opacity: Math.min(1, logo * 2), boxShadow: `0 0 90px ${C.mint}55` }} />
        <Headline lines={[[{ t: 'TabMapper' }]]} x={960} y={340} size={128} align="center" inAt={14} stagger={4} shadow={false} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', fontFamily: F.ui, fontWeight: 600, fontSize: 40, letterSpacing: 6, textTransform: 'uppercase', color: C.mint, opacity: interpolate(frame, [30, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>Visual tab manager for Chrome</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', fontFamily: F.display, fontWeight: 700, fontSize: 64, color: C.ink, letterSpacing: -1.5, opacity: line, transform: `translateY(${(1 - line) * 26}px)` }}>Find any tab. Group them in one click.<br />Clean up safely.</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', justifyContent: 'center', gap: 28 }}>
          {CH.map((c, i) => { const p = spring({ frame: frame - (70 + i * 10), fps, config: { damping: 14, stiffness: 160 } });
            return <div key={i} style={{ padding: '18px 44px', borderRadius: 999, border: `2px solid ${c.c}`, background: `${c.c}18`, color: c.c, fontFamily: F.display, fontWeight: 800, fontSize: 40, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})` }}>{c.t}</div>; })}
        </div>
        <Sfx cues={[{ n: 'whoosh', f: 0, v: 0.6 }, { n: 'chime', f: 6, v: 0.6 }, { n: 'pop', f: 44, v: 0.5 }, { n: 'pop', f: 70, v: 0.5 }, { n: 'pop', f: 80, v: 0.5 }, { n: 'pop', f: 90, v: 0.5 }]} />
      </AbsoluteFill>
    </Shell>);
};
