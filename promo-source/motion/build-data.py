#!/usr/bin/env python3
"""Copy recorded scene footage into public/ and derive src/data/{events,tracks}.json (times relative to each capture's first frame)."""
import json, glob, os, shutil
S='/tmp/claude-0/-home-user-Tax-Test/4fedfeb2-8390-5988-9b25-31402f93cc2c/scratchpad/real_out'
HERE=os.path.dirname(os.path.abspath(__file__))
os.makedirs(HERE+'/public/footage',exist_ok=True); os.makedirs(HERE+'/src/data',exist_ok=True)
ev={}; tr={}
for f in sorted(glob.glob(S+'/*.json')):
    n=os.path.basename(f)[:-5]
    if n=='tabs': continue
    d=json.load(open(f)); t0=d['stats']['first']
    ev[n]={'dur':d['stats']['dur'],'events':[{**{k:(round(v,1) if isinstance(v,float) else v) for k,v in e.items() if k not in('t',)},'t':round(e['t']-t0,3)} for e in d['events']]}
    # downsample track to ~60Hz
    out=[]; last=-1
    for t,x,y in d.get('track',[]):
        r=t-t0
        if r-last>=1/60: out.append([round(r,3),x,y]); last=r
    tr[n]=out
    shutil.copy(f'{S}/{n}.mp4',f'{HERE}/public/footage/{n}.mp4')
json.dump(ev,open(HERE+'/src/data/events.json','w')); json.dump(tr,open(HERE+'/src/data/tracks.json','w'))
print({k:len(v) for k,v in tr.items()})
