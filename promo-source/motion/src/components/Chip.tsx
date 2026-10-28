import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, F } from '../theme';

/** Small solid caption in the bottom-left corner. Never blurs or dims the footage. */
export const Chip: React.FC<{ kicker: string; text: string; inAt: number; outAt?: number; color?: string; x?: number; y?: number }> = ({ kicker, text, inAt, outAt, color = C.mint, x = 56, y = 930 }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - inAt, fps, config: { damping: 18, stiffness: 150 } });
  const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (frame < inAt || exit >= 1) return null;
  return (<div style={{ position: 'absolute', left: x, top: y, transform: `translateY(${(1 - p) * 30 + exit * 14}px)`, opacity: p * (1 - exit), padding: '14px 28px 16px', borderRadius: 20, background: 'rgba(7,12,26,.94)', border: `2px solid ${color}88`, boxShadow: `0 12px 40px rgba(0,0,0,.45)`, maxWidth: 900 }}>
    <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 21, letterSpacing: 3, color, textTransform: 'uppercase', marginBottom: 4 }}>{kicker}</div>
    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 38, color: C.ink, letterSpacing: -0.5, lineHeight: 1.15 }}>{text}</div></div>);
};

/** Centered tag in screen space (stays put while the camera moves), e.g. BEFORE / AFTER over the tab strip. */
export const Tag: React.FC<{ text: string; inAt: number; outAt?: number; color?: string; y?: number }> = ({ text, inAt, outAt, color = C.mint, y = 150 }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - inAt, fps, config: { damping: 16, stiffness: 170 } });
  const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (frame < inAt || exit >= 1) return null;
  return (<div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: p * (1 - exit), transform: `translateY(${(1 - p) * -20}px)` }}>
    <div style={{ padding: '12px 30px', borderRadius: 999, background: color, color: '#06130d', fontFamily: F.display, fontWeight: 800, fontSize: 40, letterSpacing: -0.5, boxShadow: `0 10px 44px ${color}66` }}>{text}</div></div>);
};
