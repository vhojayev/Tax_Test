import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, E, F } from '../theme';

/** ring + leader line + label, anchored in footage (1920x1080) space so it rides the camera */
export const Callout: React.FC<{ x: number; y: number; r?: number; label?: string; dx?: number; dy?: number; inAt: number; outAt?: number; color?: string; sub?: string; size?: number }> =
({ x, y, r = 36, label, dx = 150, dy = -90, inAt, outAt, color = C.mint, sub, size = 30 }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - inAt, fps, config: { damping: 14, stiffness: 170 } });
  const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (exit >= 1 || frame < inAt) return null;
  const line = interpolate(frame, [inAt + 4, inAt + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.out });
  const pulse = 1 + 0.12 * Math.sin((frame - inAt) / 6);
  const lx = x + dx, ly = y + dy; const len = Math.hypot(dx, dy) - r;
  const ang = Math.atan2(dy, dx); const sx = x + Math.cos(ang) * r, sy = y + Math.sin(ang) * r;
  return (<div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, pointerEvents: 'none' }}>
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <circle cx={x} cy={y} r={r * p * pulse} fill="none" stroke={color} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      <circle cx={x} cy={y} r={r * p * 1.55} fill="none" stroke={color} strokeWidth={2} opacity={0.35 * (1 - ((frame - inAt) % 36) / 36)} />
      {label ? <line x1={sx} y1={sy} x2={sx + (lx - sx) * line} y2={sy + (ly - sy) * line} stroke={color} strokeWidth={3} strokeLinecap="round" /> : null}
    </svg>
    {label ? (<div style={{ position: 'absolute', left: lx, top: ly, transform: `translate(${dx >= 0 ? 0 : '-100%'}, -50%) scale(${0.85 + 0.15 * line})`, transformOrigin: dx >= 0 ? '0 50%' : '100% 50%', opacity: line, padding: sub ? '12px 24px 14px' : '10px 24px', borderRadius: 18, background: 'rgba(7,12,26,.9)', border: `2px solid ${color}`, boxShadow: `0 10px 40px rgba(0,0,0,.45), 0 0 26px ${color}44`, fontFamily: F.ui, fontWeight: 700, fontSize: size, color: C.ink, whiteSpace: 'nowrap' }}>
      {label}{sub ? <div style={{ fontSize: size * 0.68, fontWeight: 500, color: C.dim, marginTop: 2 }}>{sub}</div> : null}</div>) : null}
  </div>);
};

/** glowing frame around a region (e.g. the tab strip) with a corner label chip */
export const Frame: React.FC<{ x: number; y: number; w: number; h: number; inAt: number; outAt?: number; color?: string; label?: string; radius?: number }> = ({ x, y, w, h, inAt, outAt, color = C.mint, label, radius = 14 }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - inAt, fps, config: { damping: 20, stiffness: 120 } });
  const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (exit >= 1 || frame < inAt) return null;
  const pad = 10 * (1 - p);
  return (<div style={{ position: 'absolute', left: x - pad, top: y - pad, width: w + pad * 2, height: h + pad * 2, borderRadius: radius, border: `3px solid ${color}`, boxShadow: `0 0 34px ${color}66, inset 0 0 24px ${color}22`, opacity: p * (1 - exit), pointerEvents: 'none' }}>
    {label ? <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: h + pad * 2 + 10, padding: '8px 18px', borderRadius: 12, background: color, color: '#06130d', fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</div> : null}
  </div>);
};
