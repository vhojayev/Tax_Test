import { SCENES, starts, MAIN_FRAMES, OV } from './Main';
console.log(JSON.stringify({ MAIN_FRAMES, OV, scenes: SCENES.map((s, i) => ({ id: s.id, start: starts[i], d: s.d })) }));
