import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, F } from './theme';
import './fonts';

/** 1280x720 YouTube thumbnail built from the real tab-strip footage. */
export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 30% 35%, #17315a 0%, #0a1226 55%, #05070d 100%)', fontFamily: F.display, color: C.ink }}>
    {/* BEFORE strip */}
    <div style={{ position: 'absolute', left: 0, top: 42, width: 1280, height: 30, overflow: 'hidden', boxShadow: `0 0 0 3px ${C.coral}, 0 10px 40px rgba(255,138,76,.35)`, borderRadius: 6 }}>
      <Img src={staticFile('thumb/before.png')} style={{ width: 1280, height: 30, display: 'block', objectFit: 'fill' }} />
    </div>
    <div style={{ position: 'absolute', left: 36, top: 82, padding: '6px 20px', borderRadius: 999, background: C.coral, color: '#1c0a00', fontWeight: 800, fontSize: 30, letterSpacing: 2 }}>BEFORE · 45 TABS</div>

    {/* headline */}
    <div style={{ position: 'absolute', left: 52, top: 158, fontWeight: 800, fontSize: 160, lineHeight: 0.98, letterSpacing: -7, textShadow: '0 8px 50px rgba(0,0,0,.6)' }}>
      Tame your<br /><span style={{ color: C.mint }}>Chrome tabs</span>
    </div>
    <div style={{ position: 'absolute', left: 56, top: 488, fontFamily: F.ui, fontWeight: 600, fontSize: 42, color: C.dim }}>Find, group &amp; clean up in one click.</div>

    {/* AFTER strip */}
    <div style={{ position: 'absolute', left: 0, top: 612, width: 1280, height: 60, overflow: 'hidden', boxShadow: `0 0 0 3px ${C.mint}, 0 10px 40px rgba(138,232,189,.4)`, borderRadius: 6 }}>
      <Img src={staticFile('thumb/after_a.png')} style={{ width: 1280, height: 60, display: 'block' }} />
    </div>
    <div style={{ position: 'absolute', left: 36, top: 676 - 4, padding: '4px 18px', borderRadius: 999, background: C.mint, color: '#06130d', fontWeight: 800, fontSize: 26, letterSpacing: 2, display: 'none' }}>AFTER</div>
    <div style={{ position: 'absolute', right: 40, top: 100, display: 'flex', alignItems: 'center', gap: 16 }}>
      <Img src={staticFile('mark.png')} style={{ width: 84, height: 84, borderRadius: 22, boxShadow: `0 0 40px ${C.mint}77` }} />
      <div style={{ fontWeight: 800, fontSize: 52, letterSpacing: -1.5 }}>TabMapper</div>
    </div>
    <div style={{ position: 'absolute', left: 36, top: 568 - 2, padding: '6px 20px', borderRadius: 999, background: C.mint, color: '#06130d', fontWeight: 800, fontSize: 30, letterSpacing: 2 }}>AFTER · NAMED GROUPS</div>
  </AbsoluteFill>
);
