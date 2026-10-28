#!/usr/bin/env python3
"""Real X11 input via XTEST. stdin commands: 'm x y' move | 'd' / 'u' button1 down/up | 'w n' wheel (+up/-down) | 'k KeySym' tap | 'kd KeySym' | 'ku KeySym' | 't text' type. Replies 'ok'."""
import sys
from Xlib import X, XK, display
from Xlib.ext import xtest
d = display.Display(); root = d.screen().root
def kc(name):
    ks = XK.string_to_keysym(name)
    if ks == 0 and len(name) == 1: ks = ord(name)
    return d.keysym_to_keycode(ks), ks
def key(name, down):
    code, _ = kc(name); xtest.fake_input(d, X.KeyPress if down else X.KeyRelease, code); d.sync()
SHIFT = set('ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:"<>?~')
for line in sys.stdin:
    p = line.rstrip('\n').split(' ', 2)
    c = p[0]
    if c == 'm': xtest.fake_input(d, X.MotionNotify, x=int(float(p[1])), y=int(float(p[2]))); d.sync()
    elif c == 'd': xtest.fake_input(d, X.ButtonPress, 1); d.sync()
    elif c == 'u': xtest.fake_input(d, X.ButtonRelease, 1); d.sync()
    elif c == 'w':
        n = int(p[1]); b = 4 if n > 0 else 5
        for _ in range(abs(n)): xtest.fake_input(d, X.ButtonPress, b); xtest.fake_input(d, X.ButtonRelease, b); d.sync()
    elif c == 'k': key(p[1], True); key(p[1], False)
    elif c == 'kd': key(p[1], True)
    elif c == 'ku': key(p[1], False)
    elif c == 't':
        for ch in line[2:].rstrip('\n'):
            name = {' ': 'space', '.': 'period', ',': 'comma', '-': 'minus', '/': 'slash', ':': 'colon'}.get(ch, ch)
            sh = ch in SHIFT
            if sh: key('Shift_L', True)
            key(name, True); key(name, False)
            if sh: key('Shift_L', False)
            d.sync()
    sys.stdout.write('ok\n'); sys.stdout.flush()
