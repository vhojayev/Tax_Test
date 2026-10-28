#!/usr/bin/env python3
"""Synthesise every SFX + the music bed with ffmpeg lavfi into public/audio/*.wav"""
import subprocess, os
D=os.path.dirname(os.path.abspath(__file__))+'/public/audio'; os.makedirs(D,exist_ok=True)
SR=44100
def ae(expr,d): return f"aevalsrc='{expr}':d={d}:s={SR}"
S={
 'tick':(ae('sin(2*PI*2400*t)*exp(-t*170)*0.55',.07),''),
 'key':(ae('(sin(2*PI*1500*t)+0.4*sin(2*PI*900*t))*exp(-t*90)*0.45',.12),''),
 'click':(ae('(sin(2*PI*1100*t)+0.6*sin(2*PI*2200*t))*exp(-t*120)*0.5',.09),''),
 'pop':(ae('sin(2*PI*(380+300*exp(-t*45))*t)*exp(-t*20)*0.85',.3),''),
 'whoosh':(f"anoisesrc=d=0.8:c=pink:a=0.7:r={SR}",'highpass=f=350,lowpass=f=3200,afade=t=in:d=0.3,afade=t=out:st=0.35:d=0.45,volume=0.55'),
 'swoosh':(f"anoisesrc=d=1.4:c=pink:a=0.7:r={SR}",'highpass=f=250,lowpass=f=2400,afade=t=in:d=0.6,afade=t=out:st=0.7:d=0.7,volume=0.5'),
 'rewind':(f"anoisesrc=d=0.9:c=pink:a=0.7:r={SR}",'highpass=f=500,lowpass=f=3600,afade=t=in:d=0.5,afade=t=out:st=0.5:d=0.4,areverse,volume=0.5'),
 'rise':(ae('sin(2*PI*(260+620*t/1.3)*t)*0.3*min(1,t*5)*max(0,1-t/1.3)',1.3),''),
 'ding':(ae('(sin(2*PI*880*t)+0.5*sin(2*PI*1320*t))*exp(-t*5.5)*0.38',1.0),''),
 'boing':(ae('sin(2*PI*(170+70*sin(2*PI*13*t))*t)*exp(-t*5)*0.75',.8),''),
 'chime':(ae('(sin(2*PI*523.3*t)+0.8*sin(2*PI*659.3*t)+0.7*sin(2*PI*784*t)+0.35*sin(2*PI*1046.5*t))*exp(-t*2.2)*0.28',2.4),''),
 'hit':(ae('sin(2*PI*(300+500*exp(-t*30))*t)*exp(-t*14)*0.7',.35),''),
 'tickrun':(ae('sin(2*PI*(1500+900*t/1.6)*t)*lt(mod(t,0.05),0.014)*exp(-mod(t,0.05)*140)*0.7',1.6),''),
 'thump':(ae('sin(2*PI*(90+120*exp(-t*18))*t)*exp(-t*9)*0.9',.5),''),
}
for n,(src,post) in S.items():
    cmd=['ffmpeg','-y','-loglevel','error','-f','lavfi','-i',src]+(['-af',post] if post else [])+['-ac','1','-ar',str(SR),f'{D}/{n}.wav']; subprocess.run(cmd,check=True)
bed="(sin(2*PI*110*t)*0.5+sin(2*PI*164.8*t)*0.36+sin(2*PI*220*t)*0.28+sin(2*PI*261.6*t)*0.2+sin(2*PI*329.6*t)*0.12)*(0.75+0.25*sin(2*PI*0.16*t))"
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i',ae(bed,70),'-af','lowpass=f=900,highpass=f=70,aecho=0.8:0.6:420:0.28','-ac','1','-ar',str(SR),f'{D}/bed.wav'],check=True)
print('ok',sorted(os.listdir(D)))
