import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { E } from '../theme';
import { downs, pointerAt } from '../lib/ev';
import type { Plan } from '../lib/plan';
import { CamScale } from './Camera';

/** Clean arrow pointer + click ripples driven by the logged mouse track. Lives in footage space (rides the camera). */
export const Cursor: React.FC<{ scene: string; plan: Plan; offset?: number }> = ({ scene, plan, offset = 0 }) => {
  const zoom = React.useContext(CamScale);
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const lf = frame - offset; if (lf < 0 || lf >= plan.total) return null;
  const st = plan.outToSrc(lf); const p = pointerAt(scene, st); if (!p) return null;
  const ds = downs(scene); const lastDown = [...ds].reverse().find(d => d <= st); const sinceDown = lastDown == null ? 9 : st - lastDown;
  const press = interpolate(sinceDown, [0, 0.06, 0.24], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s = 1.15 / Math.sqrt(zoom);
  return (<>
    {ds.filter(d => st - d >= 0 && st - d < 0.55).map((d, i) => { const q = pointerAt(scene, d)!; const k = (st - d) / 0.55;
      return <div key={i} style={{ position: 'absolute', left: q.x - 34, top: q.y - 34, width: 68, height: 68, borderRadius: '50%', border: '4px solid #8ae8bd', opacity: (1 - k) * 0.95, transform: `scale(${0.35 + E.out(k) * 1.5})`, boxShadow: '0 0 24px #8ae8bd88' }} />; })}
    <div style={{ position: 'absolute', left: p.x, top: p.y, width: 0, height: 0, transform: `scale(${s * (1 - press * 0.16)})`, transformOrigin: '0 0', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.5))' }}>
      <svg width="30" height="38" viewBox="0 0 24 30" style={{ position: 'absolute', left: -2, top: -2 }}><path d="M3 2l15.5 12.2-6.6.9 4 7.8-3.2 1.6-4-7.9L3.4 22z" fill="#fff" stroke="#0b1020" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    </div></>);
};
