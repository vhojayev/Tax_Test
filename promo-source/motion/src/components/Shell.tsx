import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { E } from '../theme';
/** scene wrapper: soft fade/scale-in over the previous scene */
export const Shell: React.FC<{ children: React.ReactNode; fade?: number }> = ({ children, fade = 9 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, fade], [0, 1], { extrapolateRight: 'clamp', easing: E.soft });
  const s = interpolate(f, [0, fade + 6], [1.025, 1], { extrapolateRight: 'clamp', easing: E.out });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})`, background: '#05070d' }}>{children}</AbsoluteFill>;
};
/** dark gradient + blurred backing behind white type, over bright footage */
export const Scrim: React.FC<{ side?: 'left' | 'bottom' | 'top'; inAt?: number; outAt?: number; strength?: number; top?: number; blur?: number }> = ({ side = 'left', inAt = 0, outAt, strength = 0.9, top = 0, blur = 14 }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [inAt, inAt + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (outAt == null ? 1 : 1 - interpolate(f, [outAt, outAt + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const dir = side === 'left' ? '90deg' : side === 'bottom' ? '0deg' : '180deg';
  const g = `linear-gradient(${dir}, rgba(4,8,18,${strength}) 0%, rgba(4,8,18,${strength * 0.86}) 45%, rgba(4,8,18,0) 88%)`;
  const mask = `linear-gradient(${dir}, #000 0%, #000 42%, transparent 90%)`;
  return (<>
    <div style={{ position: 'absolute', left: 0, right: 0, top, bottom: 0, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, WebkitMaskImage: mask, maskImage: mask, opacity: a, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top, bottom: 0, background: g, opacity: a, pointerEvents: 'none' }} />
  </>);
};
