// Turn "play source [from,to] at rate" segments into an output timeline + a srcTime -> outTime mapper.
export type Seg = { from: number; to: number; rate: number };
export type Item = Seg & { outFrom: number; dur: number };
export function plan(segs: Seg[], fps = 30) {
  let out = 0;
  const items: Item[] = segs.map(s => { const dur = Math.max(1, Math.round(((s.to - s.from) / s.rate) * fps)); const it = { ...s, outFrom: out, dur }; out += dur; return it; });
  const srcToOut = (t: number) => {   // seconds -> seconds on the scene's output timeline
    for (const it of items) if (t >= it.from && t <= it.to) return (it.outFrom + ((t - it.from) / it.rate) * fps) / fps;
    return t < items[0].from ? 0 : out / fps;
  };
  const outToSrc = (frame: number) => {   // output frame -> source seconds
    for (const it of items) if (frame >= it.outFrom && frame < it.outFrom + it.dur) return it.from + ((frame - it.outFrom) / fps) * it.rate;
    return frame < items[0].outFrom ? items[0].from : items[items.length - 1].to;
  };
  return { items, total: out, srcToOut, outToSrc, fps };
}
export type Plan = ReturnType<typeof plan>;
