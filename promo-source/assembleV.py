#!/usr/bin/env python3
"""Cut + speed-ramp the recorded shots into the main cut. Writes main_silent.mp4 and timeline.json
(event times on the final timeline, used by audio.py)."""
import json, subprocess, os, sys
V2 = os.path.dirname(os.path.abspath(__file__))
SH = V2 + '/shotsV'; TMP = V2 + '/tmpV'; os.makedirs(TMP, exist_ok=True)
OFF = 0.31  # ffmpeg capture start delay vs. marker clock

# (shot, [(src_start, src_dur, speed), ...]) ; times in VIDEO seconds of the recorded shot
CUTS = [
  ('v1', [(0.90, 2.90, 1.1)]),
  ('v2', [(5.10, 3.80, 1.1)]),
  ('v3', [(0.50, 2.90, 1.4), (3.40, 0.50, 0.5), (3.90, 0.70, 1.0)]),
  ('v4', [(0.50, 2.10, 2.0), (2.60, 4.20, 1.4)]),
  ('v5', [(1.00, 4.00, 1.5)]),
  ('v6', [(0.30, 5.00, 1.5)]),
]
# events: shot -> {name: video time} (marker time minus OFF), for audio sync
mk = {}
for f in sorted(os.listdir(SH)):
    if f.startswith('markers'): mk.update(json.load(open(SH + '/' + f)))

def run(cmd): subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

clips, timeline, t_final = [], {}, 0.0
for name, segs in CUTS:
    seg_files, shot_start = [], t_final
    seg_map = []  # (src_start, src_dur, speed, final_start)
    for i, (ss, d, sp) in enumerate(segs):
        out = f'{TMP}/{name}_{i}.mp4'
        vf = f'setpts=(PTS-STARTPTS)/{sp}'
        if sp < 1: vf = f'minterpolate=fps=60:mi_mode=blend,{vf}'
        vf += ',fps=30,scale=1080:1920,format=yuv420p'
        run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(ss), '-t', str(d), '-i', f'{SH}/{name}.mp4', '-an', '-vf', vf, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '15', out])
        seg_files.append(out); seg_map.append((ss, d, sp, t_final)); t_final += d / sp
    lst = f'{TMP}/{name}.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in seg_files))
    clip = f'{TMP}/{name}.mp4'; run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', clip]); clips.append(clip)
    def to_final(vt, seg_map=seg_map):
        for ss, d, sp, fs in seg_map:
            if ss <= vt <= ss + d: return fs + (vt - ss) / sp
        return None
    ev = {k: to_final(v - OFF) for k, v in mk.get(name, {}).items() if k != 'total'}
    timeline[name] = {'start': shot_start, 'end': t_final, 'events': {k: round(v, 3) for k, v in ev.items() if v is not None}}
    print(f'{name}: {shot_start:6.2f} -> {t_final:6.2f}  {timeline[name]["events"]}')

lst = f'{TMP}/all.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in clips))
fade_st = t_final - 0.5
run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-vf', f'fade=t=out:st={fade_st:.2f}:d=0.5', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', V2 + '/vert_silent.mp4'])
timeline['total'] = round(t_final, 3)
json.dump(timeline, open(V2 + '/timelineV.json', 'w'), indent=1)
print('TOTAL', round(t_final, 2))
