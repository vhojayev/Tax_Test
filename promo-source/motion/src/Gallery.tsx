import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, F } from './theme';
import './fonts';

const BG = 'radial-gradient(ellipse at 20% 15%, #17315a 0%, #0a1226 55%, #05070d 100%)';
const Head: React.FC<{ kicker: string; color: string; children: React.ReactNode; sub?: string }> = ({ kicker, color, children, sub }) => (
  <div style={{ position: 'absolute', left: 52, top: 34 }}>
    <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 22, letterSpacing: 4, color, textTransform: 'uppercase', marginBottom: 6 }}>{kicker}</div>
    <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 52, lineHeight: 1.04, letterSpacing: -1.5, color: C.ink }}>{children}</div>
    {sub ? <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 28, color: C.dim, marginTop: 8 }}>{sub}</div> : null}
  </div>);
const Logo = () => (<div style={{ position: 'absolute', right: 40, top: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
  <Img src={staticFile('mark.png')} style={{ width: 44, height: 44, borderRadius: 12 }} /><div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 28, color: C.ink, letterSpacing: -1 }}>TabMapper</div></div>);
const Shot: React.FC<{ src: string; top?: number }> = ({ src, top = 230 }) => (
  <div style={{ position: 'absolute', left: 40, top, width: 1190, height: 760 - top - 36, borderRadius: 22, overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.14)' }}>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' }} /></div>);

export const G1: React.FC = () => (<AbsoluteFill style={{ background: BG }}><Logo />
  <Head kicker="Group" color={C.mint}>One click sorts your tabs by topic</Head>
  <div style={{ position: 'absolute', left: 40, top: 270, width: 1190 }}>
    <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 26, color: C.coral, marginBottom: 8 }}>BEFORE · 45 tabs</div>
    <div style={{ width: 1190, height: 28, overflow: 'hidden', borderRadius: 8, boxShadow: `0 0 0 3px ${C.coral}` }}><Img src={staticFile('thumb/before.png')} style={{ width: 1190, height: 28, display: 'block' }} /></div>
    <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 26, color: C.mint, margin: '64px 0 8px' }}>AFTER · named groups</div>
    <div style={{ width: 1190, height: 56, overflow: 'hidden', borderRadius: 8, boxShadow: `0 0 0 3px ${C.mint}` }}><Img src={staticFile('thumb/after_a.png')} style={{ width: 1190, height: 56, display: 'block', objectFit: 'cover', objectPosition: 'left' }} /></div>
    <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 28, color: C.dim, marginTop: 52 }}>Your real Chrome tab bar becomes colour-coded groups. Undo puts it all back.</div>
  </div></AbsoluteFill>);
export const G2: React.FC = () => (<AbsoluteFill style={{ background: BG }}><Logo /><Head kicker="Find" color={C.mint}>Search every open tab at once</Head><Shot src="thumb/g_find.png" top={170} /></AbsoluteFill>);
export const G3: React.FC = () => (<AbsoluteFill style={{ background: BG }}><Logo /><Head kicker="Clean up" color={C.rose}>Close duplicates. Undo anything.</Head><Shot src="thumb/g_dupes.png" top={170} /></AbsoluteFill>);
export const G4: React.FC = () => (<AbsoluteFill style={{ background: BG }}><Logo /><Head kicker="The map" color={C.violet}>See which tab opened which</Head><Shot src="thumb/g_map.png" top={170} /></AbsoluteFill>);
export const G5: React.FC = () => (<AbsoluteFill style={{ background: BG }}><Logo />
  <Head kicker="Private by design" color={C.mint}>Your tabs stay on your computer</Head>
  <div style={{ position: 'absolute', left: 52, right: 52, top: 230, display: 'flex', gap: 24 }}>
    {[['No account', 'Install it and use it. There is nothing to sign up for.'], ['No ads, no tracking', 'No analytics. Nothing is sold or shared.'], ['On your computer', 'It reads tab titles and addresses locally, never page content.']].map(([t, s], i) => (
      <div key={i} style={{ flex: 1, padding: '48px 30px', minHeight: 400, borderRadius: 24, background: 'rgba(138,232,189,.08)', border: '2px solid rgba(138,232,189,.4)' }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: C.mint, marginBottom: 20, boxShadow: `0 0 18px ${C.mint}` }} />
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 42, letterSpacing: -1, color: C.ink, marginBottom: 16 }}>{t}</div>
        <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 28, lineHeight: 1.35, color: C.dim }}>{s}</div></div>))}
  </div></AbsoluteFill>);
