import React from 'react';
import { Composition } from 'remotion';
import { Main, MAIN_FRAMES } from './Main';
import { fontsReady } from './fonts';
import { Thumb } from './Thumb';
import { W, H, FPS } from './theme';
void fontsReady;
export const Root: React.FC = () => (<>
  <Composition id="Main" component={Main} durationInFrames={MAIN_FRAMES} fps={FPS} width={W} height={H} />
  <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
</>);
