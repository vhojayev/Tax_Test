#!/usr/bin/env python3
"""frames.py scene  t1 t2 ... -> contact sheet of frames at given seconds (relative to first frame) from /dev/shm/<scene>.mkv"""
import json, subprocess, sys, os
S='/tmp/claude-0/-home-user-Tax-Test/4fedfeb2-8390-5988-9b25-31402f93cc2c/scratchpad'
sc=sys.argv[1]; ts=[float(x) for x in sys.argv[2:]]
d=json.load(open(f'{S}/real_out/{sc}.json')); f=d['stats']['first']
parts=[]
for i,t in enumerate(ts):
    p=f'{S}/fr_{sc}_{i}.png'; subprocess.run(['ffmpeg','-loglevel','error','-y','-ss',str(t),'-i',f'{S}/real_out/{sc}.mp4','-frames:v','1','-vf','scale=800:-1',p],check=True); parts.append(p)
cols=2; rows=(len(parts)+1)//2
cmd=['ffmpeg','-loglevel','error','-y']; [cmd.extend(['-i',p]) for p in parts]
fc=''.join(f'[{i}:v]' for i in range(len(parts)))+f'xstack=inputs={len(parts)}:layout='+'|'.join(f'{(i%cols)*800}_{(i//cols)*450}' for i in range(len(parts)))
cmd+=['-filter_complex',fc,f'{S}/sheet_{sc}.png']; subprocess.run(cmd,check=True); print('ok',f'{S}/sheet_{sc}.png')
