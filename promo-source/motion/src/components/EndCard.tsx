import React from 'react';
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, E, F } from '../theme';
import { Headline } from './Type';

const HUES = [C.mint, C.sky, C.coral, C.violet, C.gold, C.rose, C.mint, C.sky, C.violet, C.coral];
const Icon: React.FC<{ k: 'person' | 'shield' | 'laptop' | 'ban' }> = ({ k }) => {
  const d = { person: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /><path d="M3 3l18 18" /></>, shield: <><path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5z" /><path d="M8.5 12l2.6 2.6L16 9.5" /></>, laptop: <><rect x="4" y="5" width="16" height="11" rx="2" /><path d="M2 20h20" /></>, ban: <><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></> }[k];
  return <svg viewBox="0 0 24 24" width={58} height={58} fill="none" stroke={C.mint} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
};

/** Bubbles spiral in and merge into the logo, then wordmark, privacy trio and CTA. 1920x1080 space. */
export const EndCard: React.FC<{ cx?: number; cy?: number; vertical?: boolean }> = ({ cx = 960, cy = 330, vertical = false }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const bg = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  const MERGE = 52;   // frame at which bubbles meet
  const logo = spring({ frame: frame - MERGE, fps, config: { damping: 11, stiffness: 150, mass: 0.9 } });
  const ring = interpolate(frame, [MERGE, MERGE + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.out });
  const S = vertical ? 0.78 : 1;
  const chips: ['person' | 'shield' | 'laptop', string][] = [['person', 'No account'], ['shield', 'No ads. No tracking.'], ['laptop', 'Stays on your computer']];
  const items = vertical ? 3 : 3;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, rgba(20,40,70,${0.9 * bg}), rgba(5,8,18,${0.97 * bg}))`, opacity: 1 }}>
      {/* converging bubbles */}
      {HUES.map((h, i) => {
        const s0 = random('b' + i); const s1 = random('a' + i);
        const start = 4 + i * 2; const k = interpolate(frame, [start, MERGE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.io });
        const R0 = 520 + s0 * 380, a0 = s1 * Math.PI * 2; const ang = a0 + (1 - k) * (2.4 + s0 * 1.4) * (i % 2 ? 1 : -1);
        const rad = R0 * (1 - k) ** 1.6; const x = cx + Math.cos(ang) * rad * (vertical ? 0.55 : 1), y = cy + Math.sin(ang) * rad * 0.62;
        const size = (26 + s0 * 34) * (1 - k * 0.55); const op = interpolate(frame, [start - 4, start + 4, MERGE - 3, MERGE + 2], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return <div key={i} style={{ position: 'absolute', left: x - size, top: y - size, width: size * 2, height: size * 2, borderRadius: '50%', opacity: op, background: `radial-gradient(circle at 32% 28%, #fff 0%, ${h} 36%, rgba(0,0,0,.55) 100%)`, boxShadow: `0 0 ${size}px ${h}99, inset 0 -6px 14px rgba(0,0,0,.35)` }} />;
      })}
      {/* shockwave */}
      <div style={{ position: 'absolute', left: cx - 260 * ring, top: cy - 260 * ring, width: 520 * ring, height: 520 * ring, borderRadius: '50%', border: `4px solid ${C.mint}`, opacity: (1 - ring) * 0.8, boxShadow: `0 0 60px ${C.mint}` }} />
      {/* logo */}
      <Img src={staticFile('mark.png')} style={{ position: 'absolute', left: cx - 120 * S, top: cy - 120 * S, width: 240 * S, height: 240 * S, borderRadius: 56 * S, opacity: Math.min(1, logo * 2), transform: `scale(${logo})`, boxShadow: `0 0 ${110 * logo}px ${C.mint}77` }} />
      <Headline lines={[[{ t: 'TabMapper' }]]} x={cx} y={cy + 150 * S} size={(vertical ? 112 : 124) } align="center" inAt={MERGE + 6} stagger={4} shadow={false} />
      <Headline lines={[[{ t: 'See how your tabs connect.', c: C.dim }]]} x={cx} y={cy + 150 * S + (vertical ? 150 : 165)} size={vertical ? 44 : 52} weight={600} align="center" inAt={MERGE + 18} stagger={2} shadow={false} />
      {/* privacy trio */}
      <div style={{ position: 'absolute', left: vertical ? 90 : 0, right: vertical ? 90 : 0, top: cy + (vertical ? 560 : 440), display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: vertical ? 18 : 28, justifyContent: 'center', alignItems: 'center' }}>
        {chips.map(([k, t], i) => { const p = spring({ frame: frame - (MERGE + 38 + i * 6), fps, config: { damping: 16, stiffness: 150 } });
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 32px', borderRadius: 22, background: 'rgba(138,232,189,.08)', border: '1.5px solid rgba(138,232,189,.38)', fontFamily: F.ui, fontWeight: 600, fontSize: vertical ? 38 : 36, color: C.ink, opacity: p, transform: `translateY(${(1 - p) * 34}px)`, width: vertical ? '100%' : 'auto' }}><Icon k={k} />{t}</div>; })}
      </div>
      {/* CTA */}
      {(() => { const p = spring({ frame: frame - (MERGE + 62), fps, config: { damping: 12, stiffness: 140 } }); const glow = 0.5 + 0.5 * Math.sin(frame / 7);
        return <div style={{ position: 'absolute', left: 0, right: 0, top: cy + (vertical ? 800 : 585), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
          <div style={{ padding: '22px 64px', borderRadius: 22, background: C.mint, color: '#06130d', fontFamily: F.display, fontWeight: 800, fontSize: 46, boxShadow: `0 14px 60px ${C.mint}${Math.round(40 + glow * 40).toString(16)}` }}>Add to Chrome</div>
          <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 28, color: C.faint }}>On the Chrome Web Store</div></div>; })()}
    </AbsoluteFill>
  );
};
