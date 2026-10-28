#!/usr/bin/env python3
"""Synthesise bed + SFX with ffmpeg lavfi, place them on the timeline, mux into the video."""
import json, subprocess, os
V2 = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(V2 + '/timeline.json')); TOT = T['total']
E = lambda s, k, d=0.0: T[s]['events'][k] + d
SR = 44100
def ae(expr, d): return f"aevalsrc='{expr}':d={d}:s={SR}"
SFX = {
  'tick':   (ae('sin(2*PI*2400*t)*exp(-t*170)*0.55', .07), ''),
  'key':    (ae('(sin(2*PI*1500*t)+0.4*sin(2*PI*900*t))*exp(-t*90)*0.45', .12), ''),
  'pop':    (ae('sin(2*PI*(380+300*exp(-t*45))*t)*exp(-t*20)*0.85', .3), ''),
  'whoosh': (f"anoisesrc=d=0.8:c=pink:a=0.7:r={SR}", 'highpass=f=350,lowpass=f=3200,afade=t=in:d=0.3,afade=t=out:st=0.35:d=0.45,volume=0.55'),
  'swoosh': (f"anoisesrc=d=1.4:c=pink:a=0.7:r={SR}", 'highpass=f=250,lowpass=f=2400,afade=t=in:d=0.6,afade=t=out:st=0.7:d=0.7,volume=0.5'),
  'rewind': (f"anoisesrc=d=0.9:c=pink:a=0.7:r={SR}", 'highpass=f=500,lowpass=f=3600,afade=t=in:d=0.5,afade=t=out:st=0.5:d=0.4,areverse,volume=0.5'),
  'rise':   (ae('sin(2*PI*(260+620*t/1.3)*t)*0.3*min(1,t*5)*max(0,1-t/1.3)', 1.3), ''),
  'ding':   (ae('(sin(2*PI*880*t)+0.5*sin(2*PI*1320*t))*exp(-t*5.5)*0.38', 1.0), ''),
  'boing':  (ae('sin(2*PI*(170+70*sin(2*PI*13*t))*t)*exp(-t*5)*0.75', .8), ''),
  'chime':  (ae('(sin(2*PI*523.3*t)+0.8*sin(2*PI*659.3*t)+0.7*sin(2*PI*784*t)+0.35*sin(2*PI*1046.5*t))*exp(-t*2.2)*0.28', 2.4), ''),
  'hit':    (ae('sin(2*PI*(300+500*exp(-t*30))*t)*exp(-t*14)*0.7', .35), ''),
  'tickrun': (ae('sin(2*PI*(1500+900*t/2.4)*t)*lt(mod(t,0.0714),0.02)*exp(-mod(t,0.0714)*140)*0.7', 2.4), ''),
}
ev = []  # (sfx, time, gain)
ev += [('tickrun', 0.0, .9), ('pop', E('s1','wrong1')-0.05, .8), ('pop', E('s1','wrong2')-0.05, .8), ('whoosh', E('s1','flash')-0.35, .8)]
ev += [('whoosh', T['s2']['start'] + .1, .8), ('pop', E('s2','fly', .45), .7), ('ding', E('s2','fly', .5), .4)]
ev += [('rise', E('s3','zoomed', -0.5), .6), ('ding', E('s3','hover', .05), .6), ('whoosh', E('s3','hover', .5), .5), ('ding', E('s3','path', -.1), .55), ('ding', E('s3','auto', -.1), .5)]
ev += [('pop', T['s4']['start'] + 1.0, .6), ('boing', E('s4','release'), 1.0)]
for j in range(4): ev.append(('key', E('s5','relatives', -0.35 * (4 - j) - .05), .8))
ev += [('key', E('s5','relatives'), .9), ('pop', T['s5']['start'] + .35, .5)]
for j in range(5): ev.append(('key', E('s6','typed', -0.38 + .05 * j - 0.30), .6))
ev += [('ding', E('s6','typed', -.05), .55), ('whoosh', E('s6','fly', -.2), .7), ('pop', E('s6','typed', 1.0), .4)]
ev += [('pop', E('s7','close'), 1.0), ('whoosh', E('s7','close', .0), .4), ('rewind', E('s7','undo', -.05), .9), ('chime', E('s7','undo', .3), .8)]
ev += [('whoosh', E('s8','click', -.1), .7), ('boing', E('s8','stretch', .45), .45)]
ev += [('swoosh', E('s9','lasso', -.6), .6), ('pop', E('s9','lasso', .9), .7), ('whoosh', E('s9','align', .0), 1.0), ('swoosh', E('s9','fit', -.1), .7)]
for k in ('aurora', 'deep', 'ember', 'nebula'): ev.append(('hit', E('s10', k, .02), .8))
ev += [('whoosh', E('s11','card', .15), .6), ('ding', E('s11','card', .35), .5), ('ding', E('s11','card', .55), .45), ('whoosh', E('s11','card', 1.9), .55), ('swoosh', E('s11','card', 2.3), .6), ('chime', E('s11','card', 3.15), 1.0), ('ding', E('s11','card', 3.9), .5)]

# bed
bed_expr = "(sin(2*PI*110*t)*0.5+sin(2*PI*164.8*t)*0.36+sin(2*PI*220*t)*0.28+sin(2*PI*261.6*t)*0.2+sin(2*PI*329.6*t)*0.12)*(0.75+0.25*sin(2*PI*0.16*t))"
bed_start = T['s2']['start']; bed_d = TOT - bed_start
inputs, chains, labels = [], [], []
i = 0
def add_input(src, post, delay, gain):
    global i
    inputs.extend(['-f', 'lavfi', '-i', src])
    f = (post + ',' if post else '') + f'volume={gain},adelay={int(max(0, delay) * 1000)}|{int(max(0, delay) * 1000)}'
    chains.append(f'[{i}:a]{f}[a{i}]'); labels.append(f'[a{i}]'); i += 1
add_input(ae(bed_expr, bed_d), f'lowpass=f=900,highpass=f=70,aecho=0.8:0.6:420:0.28,afade=t=in:d=2.2,afade=t=out:st={bed_d-2.4:.2f}:d=2.4', bed_start, 0.30)
for name, t, g in ev:
    src, post = SFX[name]; add_input(src, post, t, g)
fc = ';'.join(chains) + ';' + ''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=longest,atrim=0:{TOT:.2f},loudnorm=I=-16:TP=-1.5:LRA=9[out]'
cmd = ['ffmpeg', '-y', '-loglevel', 'error'] + inputs + ['-filter_complex', fc, '-map', '[out]', '-ar', '44100', V2 + '/audio.wav']
subprocess.run(cmd, check=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', V2 + '/main_silent.mp4', '-i', V2 + '/audio.wav', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', V2 + '/main.mp4'], check=True)
print('ok', TOT, len(ev), 'sfx')
