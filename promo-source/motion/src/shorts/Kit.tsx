import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, E, F } from '../theme';
import { Count, Headline, Word } from '../components/Type';
import { Sfx, Cue } from '../components/Sfx';

export const VW = 1080, VH = 1920, PANEL = { x: 40, y: 560, w: 1000, h: 820 };
export const CTA_FRAMES = 96;

/** headline slots: each shows one headline between [from, to) frames */
export type Slot = { from: number; to: number; lines: Word[][]; size?: number };
export const Headlines: React.FC<{ slots: Slot[] }> = ({ slots }) => (<>{slots.map((s, i) => (
  <Sequence key={i} from={s.from} durationInFrames={s.to - s.from + 9}>
    <Headline lines={s.lines} x={VW / 2} y={250} size={s.size ?? 112} align="center" inAt={0} outAt={s.to - s.from} stagger={3} />
  </Sequence>))}</>);

/** rounded panel holding the real-Chrome footage */
export const Panel: React.FC<{ children: React.ReactNode; accent?: string }> = ({ children, accent = C.mint }) => (
  <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 30, overflow: 'hidden', background: '#05070d', boxShadow: `0 30px 90px rgba(0,0,0,.65), 0 0 0 3px ${accent}66` }}>{children}</div>);

/** dark area under the tab strip + big counter, for the opening "too many tabs" beat */
export const HookPain: React.FC<{ frames: number; from?: number; to?: number }> = ({ frames, from = 12, to = 45 }) => (
  <Sequence from={0} durationInFrames={frames + 6}>
    <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y + 150, width: PANEL.w, height: PANEL.h - 150, background: 'linear-gradient(180deg, rgba(5,8,18,0) 0%, rgba(5,8,18,.97) 14%, #05070d 100%)', borderRadius: '0 0 30px 30px' }} />
    <Count from={from} to={to} at={4} dur={Math.max(24, frames - 24)} x={150} y={PANEL.y + 330} size={250} label="tabs" />
  </Sequence>);

/** one-line caption under the panel */
export const Line: React.FC<{ text: string; inAt: number; outAt?: number; color?: string }> = ({ text, inAt, outAt, color = C.dim }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - inAt, fps, config: { damping: 20, stiffness: 130 } });
  const exit = outAt == null ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (frame < inAt || exit >= 1) return null;
  return <div style={{ position: 'absolute', left: 60, right: 60, top: 1412, textAlign: 'center', fontFamily: F.ui, fontWeight: 600, fontSize: 44, lineHeight: 1.25, color, opacity: p * (1 - exit), transform: `translateY(${(1 - p) * 20}px)` }}>{text}</div>;
};

export const Bg: React.FC<{ hue?: string }> = ({ hue = '#17315a' }) => (<AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 20%, ${hue} 0%, #0a1226 50%, #05070d 100%)` }} />);

/** closing card: logo, name, one line on what it is, where to get it */
export const Cta: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 140 } });
  const t1 = spring({ frame: frame - 14, fps, config: { damping: 18, stiffness: 120 } });
  const t2 = spring({ frame: frame - 28, fps, config: { damping: 18, stiffness: 120 } });
  const t3 = spring({ frame: frame - 44, fps, config: { damping: 14, stiffness: 140 } });
  return (<AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 34%, #1a3458 0%, #0a1020 55%, #05070d 100%)' }}>
    <Img src={staticFile('mark.png')} style={{ position: 'absolute', left: VW / 2 - 130, top: 430, width: 260, height: 260, borderRadius: 60, transform: `scale(${logo})`, boxShadow: `0 0 110px ${C.mint}66` }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 750, textAlign: 'center', fontFamily: F.display, fontWeight: 800, fontSize: 132, letterSpacing: -4, color: C.ink, opacity: t1, transform: `translateY(${(1 - t1) * 30}px)` }}>TabMapper</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 920, textAlign: 'center', fontFamily: F.ui, fontWeight: 700, fontSize: 38, letterSpacing: 5, textTransform: 'uppercase', color: C.mint, opacity: t2 }}>Visual tab manager for Chrome</div>
    <div style={{ position: 'absolute', left: 60, right: 60, top: 1040, textAlign: 'center', fontFamily: F.display, fontWeight: 700, fontSize: 56, lineHeight: 1.2, letterSpacing: -1, color: C.ink, opacity: t3, transform: `translateY(${(1 - t3) * 26}px)` }}>Search “TabMapper”<br />on the Chrome Web Store</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1250, display: 'flex', justifyContent: 'center', gap: 18, opacity: t3 }}>
      {['No account', 'No ads', 'Stays on your PC'].map((t, i) => <div key={i} style={{ padding: '12px 24px', borderRadius: 999, border: `2px solid ${C.mint}77`, background: 'rgba(138,232,189,.1)', color: C.mint, fontFamily: F.ui, fontWeight: 700, fontSize: 30 }}>{t}</div>)}
    </div>
    <Sfx cues={[{ n: 'whoosh', f: 0, v: 0.5 }, { n: 'chime', f: 6, v: 0.7 }, { n: 'pop', f: 44, v: 0.5 }]} />
  </AbsoluteFill>);
};

/** common wrapper: body (main footage part) then CTA; bed audio underneath */
export const Short: React.FC<{ bodyFrames: number; children: React.ReactNode; hue?: string }> = ({ bodyFrames, children, hue }) => (
  <AbsoluteFill style={{ background: '#05070d' }}>
    <Audio src={staticFile('audio/bed.wav')} volume={f => interpolate(f, [0, 30, bodyFrames + CTA_FRAMES - 50, bodyFrames + CTA_FRAMES], [0, 0.17, 0.17, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
    <Sequence from={0} durationInFrames={bodyFrames + 6}><Bg hue={hue} />{children}</Sequence>
    <Sequence from={bodyFrames} durationInFrames={CTA_FRAMES}><Cta /></Sequence>
  </AbsoluteFill>);
