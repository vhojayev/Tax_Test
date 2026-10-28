import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, E, F } from '../theme';

export type Word = { t: string; c?: string; mark?: string };      // c: colour, mark: highlighter-swipe colour behind the word
const sp = (frame: number, fps: number, delay: number, damping = 18, stiffness = 140, mass = 0.9) =>
  spring({ frame: frame - delay, fps, config: { damping, stiffness, mass } });

/** Kinetic headline: words rise out of a mask with a springy stagger, optional highlighter swipes, clean exit. */
export const Headline: React.FC<{
  lines: Word[][]; x: number; y: number; size?: number; weight?: number; align?: 'left' | 'center' | 'right';
  inAt?: number; outAt?: number; stagger?: number; lineGap?: number; color?: string; shadow?: boolean; maxW?: number;
}> = ({ lines, x, y, size = 120, weight = 800, align = 'left', inAt = 0, outAt, stagger = 3, lineGap = 1.04, color = C.ink, shadow = true }) => {   // note: shadow is applied per word below
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  let n = 0;
  const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.io });
  if (exit >= 1) return null;
  return (
    <div style={{ position: 'absolute', left: align === 'center' ? x - 1200 : align === 'right' ? x - 2400 : x, top: y, width: align === 'left' ? 'auto' : align === 'center' ? 2400 : 2400, textAlign: align,
      fontFamily: F.display, fontWeight: weight, fontSize: size, lineHeight: lineGap, letterSpacing: -size * 0.03, color,
      opacity: 1 - exit, transform: `translateY(${-exit * 28}px)`, filter: exit > 0 ? `blur(${exit * 6}px)` : undefined }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ whiteSpace: 'nowrap', display: 'block' }}>
          {ln.map((w, wi) => {
            const k = n++; const p = sp(frame, fps, inAt + k * stagger); const m = w.mark ? interpolate(frame, [inAt + k * stagger + 10, inAt + k * stagger + 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.out }) : 0;
            return (
              <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: size * 0.16, marginBottom: -size * 0.16, marginRight: size * 0.24, position: 'relative' }}>
                {w.mark ? <span style={{ position: 'absolute', left: -size * 0.06, right: -size * 0.04, top: size * 0.46, height: size * 0.42, background: w.mark, borderRadius: size * 0.1, transformOrigin: '0 50%', transform: `scaleX(${m}) skewX(-8deg)`, opacity: 0.9, zIndex: 0 }} /> : null}
                <span style={{ position: 'relative', zIndex: 1, display: 'inline-block', color: w.c ?? color, filter: shadow ? 'drop-shadow(0 6px 22px rgba(2,6,18,.55))' : undefined, transform: `translateY(${(1 - p) * 118}%) rotate(${(1 - p) * 5}deg)`, opacity: Math.min(1, p * 3) }}>{w.t}</span>
              </span>);
          })}
        </div>))}
    </div>);
};

/** small uppercase pill, e.g. "01 · FIND" */
export const Kicker: React.FC<{ text: string; x: number; y: number; inAt?: number; outAt?: number; color?: string }> = ({ text, x, y, inAt = 0, outAt, color = C.mint }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = sp(frame, fps, inAt, 20, 170); const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (exit >= 1) return null;
  return (<div style={{ position: 'absolute', left: x, top: y, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 22px', borderRadius: 999, background: 'rgba(8,13,28,.72)', border: `1.5px solid ${color}55`, color, fontFamily: F.ui, fontWeight: 700, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', transform: `translateY(${(1 - p) * 24}px) scale(${0.9 + p * 0.1})`, opacity: p * (1 - exit), boxShadow: `0 0 28px ${color}33` }}>
    <span style={{ width: 10, height: 10, borderRadius: 5, background: color, boxShadow: `0 0 14px ${color}` }} />{text}</div>);
};

/** supporting sentence under a headline */
export const Sub: React.FC<{ text: string; x: number; y: number; inAt?: number; outAt?: number; size?: number; maxW?: number; align?: 'left' | 'center' }> = ({ text, x, y, inAt = 0, outAt, size = 40, maxW = 900, align = 'left' }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = sp(frame, fps, inAt, 22, 120); const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (exit >= 1) return null;
  return (<div style={{ position: 'absolute', left: align === 'center' ? x - maxW / 2 : x, top: y, width: maxW, textAlign: align, fontFamily: F.ui, fontWeight: 500, fontSize: size, lineHeight: 1.3, color: C.dim, textShadow: '0 4px 24px rgba(2,6,18,.7)', opacity: p * (1 - exit), transform: `translateY(${(1 - p) * 26}px)` }}>{text}</div>);
};

/** big animated number */
export const Count: React.FC<{ from: number; to: number; at: number; dur: number; x: number; y: number; size?: number; label?: string; color?: string; outAt?: number }> = ({ from, to, at, dur, x, y, size = 220, label, color = C.ink, outAt }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.out });
  const v = Math.round(from + (to - from) * k); const p = sp(frame, fps, at - 4, 16, 160);
  const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (exit >= 1) return null;
  const warm = interpolate(k, [0.55, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const col = to > from ? `rgb(255,${Math.round(255 - warm * 120)},${Math.round(255 - warm * 175)})` : color;
  return (<div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'baseline', gap: size * 0.1, fontFamily: F.display, fontWeight: 800, fontSize: size, lineHeight: 1, color: col, letterSpacing: -size * 0.04, fontVariantNumeric: 'tabular-nums', opacity: p * (1 - exit), transform: `scale(${0.92 + p * 0.08})`, transformOrigin: '0 100%', textShadow: '0 8px 50px rgba(2,6,18,.6)' }}>
    {v}{label ? <span style={{ fontSize: size * 0.28, fontWeight: 600, color: C.dim, letterSpacing: 0 }}>{label}</span> : null}</div>);
};

/** keyboard shortcut caps; `press` = frame at which each key presses */
export const Keycaps: React.FC<{ keys: string[]; x: number; y: number; inAt: number; pressAt: number; outAt?: number; size?: number }> = ({ keys, x, y, inAt, pressAt, outAt, size = 64 }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (exit >= 1) return null;
  return (<div style={{ position: 'absolute', left: x, top: y, display: 'flex', gap: 14, alignItems: 'center', opacity: 1 - exit }}>
    {keys.map((k, i) => { const p = sp(frame, fps, inAt + i * 3, 16, 170); const pr = interpolate(frame, [pressAt, pressAt + 4, pressAt + 14], [0, 1, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      return (<React.Fragment key={i}>{i > 0 ? <span style={{ color: C.faint, fontFamily: F.ui, fontSize: size * 0.5, fontWeight: 600, opacity: p }}>+</span> : null}
        <div style={{ minWidth: size * 1.15, height: size, padding: `0 ${size * 0.3}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: size * 0.24, fontFamily: F.ui, fontWeight: 700, fontSize: size * 0.46, color: pr > 0.5 ? '#06130d' : C.ink, background: pr > 0.5 ? C.mint : 'rgba(255,255,255,.14)', border: `2px solid ${pr > 0.5 ? C.mint : 'rgba(255,255,255,.35)'}`, boxShadow: `0 ${6 - pr * 5}px 0 rgba(0,0,0,.35), 0 0 ${pr * 36}px ${C.mint}88`, transform: `translateY(${(1 - p) * 30 + pr * 5}px)`, opacity: p }}>{k}</div></React.Fragment>); })}
  </div>);
};

/** rubber-stamp pop, e.g. "Nothing lost." */
export const Stamp: React.FC<{ text: string; x: number; y: number; at: number; dur?: number; color?: string; size?: number; rot?: number }> = ({ text, x, y, at, dur = 45, color = C.mint, size = 76, rot = -4 }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  if (frame < at || frame > at + dur + 8) return null;
  const p = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 190, mass: 0.8 } });
  const out = interpolate(frame, [at + dur, at + dur + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (<div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1.9 - p * 0.9})`, opacity: Math.min(1, p * 2) * out, padding: '10px 38px 12px', border: `6px solid ${color}`, borderRadius: 20, color, fontFamily: F.display, fontWeight: 800, fontSize: size, background: 'rgba(6,12,24,.62)', boxShadow: `0 0 50px ${color}55`, whiteSpace: 'nowrap' }}>{text}</div>);
};
