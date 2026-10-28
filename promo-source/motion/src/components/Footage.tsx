import React from 'react';
import { OffthreadVideo, Sequence, staticFile } from 'remotion';
import type { Item } from '../lib/plan';
import { W, H, FPS } from '../theme';
// source is 2560x1440; drawn at 1920x1080 layout size (crisp when the camera zooms in)
export const Footage: React.FC<{ src: string; items: Item[] }> = ({ src, items }) => (
  <>{items.map((it, i) => (
    <Sequence key={i} from={it.outFrom} durationInFrames={it.dur}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(it.from * FPS)} playbackRate={it.rate} muted style={{ width: W, height: H, display: 'block' }} />
    </Sequence>))}
  </>
);
