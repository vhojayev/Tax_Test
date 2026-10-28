import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { E } from '../theme';
export const CamScale = React.createContext(1);
export type CamKey = { t: number; cx: number; cy: number; s: number };   // t in seconds (scene-local), focus point in 1920x1080 space
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export function camAt(keys: CamKey[], t: number) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t <= b.t) { const k = E.io((t - a.t) / Math.max(1e-6, b.t - a.t)); return { t, cx: a.cx + (b.cx - a.cx) * k, cy: a.cy + (b.cy - a.cy) * k, s: a.s + (b.s - a.s) * k }; }
  }
  return keys[keys.length - 1];
}
export const Camera: React.FC<{ keys: CamKey[]; children: React.ReactNode; w?: number; h?: number; viewW?: number; viewH?: number }> = ({ keys, children, w, h, viewW, viewH }) => {
  const frame = useCurrentFrame(); const { fps, width: cw, height: ch } = useVideoConfig(); const width = viewW ?? cw, height = viewH ?? ch; const W = w ?? 1920, H = h ?? 1080;
  const c = camAt(keys, frame / fps);
  const tx = clamp(width / 2 - c.cx * c.s, width - W * c.s, 0), ty = clamp(height / 2 - c.cy * c.s, height - H * c.s, 0);
  return (<AbsoluteFill style={{ overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${c.s})` }}><CamScale.Provider value={c.s}>{children}</CamScale.Provider></div>
  </AbsoluteFill>);
};
