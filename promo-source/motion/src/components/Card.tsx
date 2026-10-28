import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, E, F } from '../theme';
import { Headline } from './Type';
export const CARD = 58;   // frames a title card occupies (reading time included)

/** Full-screen title card: nothing behind the text, so it can be read before the action starts. */
export const Card: React.FC<{ num: string; kicker: string; lines: { t: string; c?: string }[][]; sub: string; color?: string; icon?: 'search' | 'layers' | 'globe' | 'sparkle' | 'tree' }> = ({ num, kicker, lines, sub, color = C.mint, icon = 'search' }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const out = interpolate(frame, [CARD - 8, CARD], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.io });
  const num_p = spring({ frame: frame - 2, fps, config: { damping: 16, stiffness: 150 } });
  const subp = spring({ frame: frame - 16, fps, config: { damping: 20, stiffness: 120 } });
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></>,
    layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></>,
    sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></>,
    tree: <><circle cx="12" cy="5" r="2.2" /><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M12 7.2v4.3M12 11.5L6.8 15.9M12 11.5l5.2 4.4" /></>,
  };
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 28% 40%, ${color}22 0%, rgba(11,18,38,1) 52%, #05070d 100%)`, opacity: 1 - out * 0.0 }}>
      <div style={{ position: 'absolute', left: 150, top: 250, display: 'flex', alignItems: 'center', gap: 26, opacity: num_p, transform: `translateY(${(1 - num_p) * 24}px)` }}>
        <div style={{ width: 84, height: 84, borderRadius: 24, border: `2px solid ${color}77`, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" width={46} height={46} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{paths[icon]}</svg></div>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 30, letterSpacing: 4, color, textTransform: 'uppercase' }}>{num} &nbsp;·&nbsp; {kicker}</div>
      </div>
      <Headline lines={lines.map(l => l.map(w => ({ t: w.t, c: w.c })))} x={146} y={370} size={118} inAt={6} stagger={3} shadow={false} />
      <div style={{ position: 'absolute', left: 150, top: 740, width: 1300, fontFamily: F.ui, fontWeight: 500, fontSize: 44, lineHeight: 1.3, color: C.dim, opacity: subp, transform: `translateY(${(1 - subp) * 22}px)` }}>{sub}</div>
      <div style={{ position: 'absolute', inset: 0, background: '#05070d', opacity: out, pointerEvents: 'none' }} />
    </AbsoluteFill>);
};
