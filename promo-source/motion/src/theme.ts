import { Easing } from 'remotion';
export const C = {
  bg: '#060a14', navy: '#0b1226', ink: '#f6f8ff', dim: 'rgba(246,248,255,.74)', faint: 'rgba(246,248,255,.45)',
  mint: '#8ae8bd', coral: '#ff8a4c', violet: '#a78bfa', sky: '#6fb7ff', gold: '#ffd36a', rose: '#ff7aa8',
  glass: 'rgba(8,13,28,.66)', line: 'rgba(255,255,255,.14)',
};
export const F = { display: "Sora, 'Inter', system-ui, sans-serif", ui: "Inter, system-ui, sans-serif" };
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),        // expo-ish out
  io: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
};
export const W = 1920, H = 1080, FPS = 30;
