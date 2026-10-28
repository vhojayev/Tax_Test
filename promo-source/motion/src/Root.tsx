import React from 'react';
import { Composition } from 'remotion';
import { Main, MAIN_FRAMES } from './Main';
import { fontsReady } from './fonts';
import { Thumb } from './Thumb';
import { G1, G2, G3, G4, G5 } from './Gallery';
import { Short1, Short2, Short3, S1_FRAMES, S2_FRAMES, S3_FRAMES } from './shorts/Shorts';
import { W, H, FPS } from './theme';
void fontsReady;
export const Root: React.FC = () => (<>
  <Composition id="Main" component={Main} durationInFrames={MAIN_FRAMES} fps={FPS} width={W} height={H} />
  <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
  {[G1, G2, G3, G4, G5].map((G, i) => <Composition key={i} id={`G${i + 1}`} component={G} durationInFrames={1} fps={FPS} width={1270} height={760} />)}
  <Composition id="Short1" component={Short1} durationInFrames={S1_FRAMES} fps={FPS} width={1080} height={1920} />
  <Composition id="Short2" component={Short2} durationInFrames={S2_FRAMES} fps={FPS} width={1080} height={1920} />
  <Composition id="Short3" component={Short3} durationInFrames={S3_FRAMES} fps={FPS} width={1080} height={1920} />
</>);
