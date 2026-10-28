#!/usr/bin/env python3
"""Local multi-host demo web: serves generic pages for *.example (Chrome maps them to 127.0.0.1)."""
import json, hashlib, os, html
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
D = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sites.json')))
PAGES = {}; TOPIC = {}
for topic, v in D.items():
    for h, p, t in v['pages']: PAGES[(h, p)] = (t, topic, v['color'])
HUES = {}
def site_color(host):
    h = int(hashlib.md5(host.encode()).hexdigest()[:6], 16) % 360
    return f'hsl({h} 58% 48%)'
def related(host, path, topic):
    v = D.get(topic, {}); pages = v.get('pages', []); tree = v.get('tree')
    idx = next((i for i, (h, p, t) in enumerate(pages) if (h, p) == (host, path)), None)
    if tree and idx is not None:
        kids = [pages[i] for i, par in enumerate(tree) if par == idx]
        if kids: return kids
    return [pg for pg in pages if (pg[0], pg[1]) != (host, path)][:2]
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        host = (self.headers.get('Host') or '').split(':')[0]
        if self.path.startswith('/favicon'):
            letter = host[:1].upper() or 'T'
            svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="{site_color(host)}"/><text x="16" y="23" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="20" fill="#fff">{letter}</text></svg>'
            self.send_response(200); self.send_header('Content-Type', 'image/svg+xml'); self.send_header('Cache-Control', 'max-age=3600'); self.end_headers(); self.wfile.write(svg.encode()); return
        path = self.path.split('?')[0]
        title, topic, color = PAGES.get((host, path), (path.strip('/').replace('/', ' · ') or host, 'misc', '#868e96'))
        rel = ''.join(f'<a href="http://{h}{p}" target="_blank">{html.escape(t)}<small>{h}</small></a>' for h, p, t in related(host, path, topic))
        body = f'''<!doctype html><meta charset=utf-8><title>{html.escape(title)}</title><link rel="icon" href="/favicon.svg">
<style>body{{margin:0;font-family:Inter,Segoe UI,system-ui,sans-serif;background:#f6f7fb;color:#1b2030}}
header{{background:{color};color:#fff;padding:26px 56px;font-weight:700;font-size:22px;letter-spacing:.3px}}
main{{max-width:980px;margin:48px auto;padding:0 40px}}h1{{font-size:64px;letter-spacing:-2px;margin:0 0 28px;line-height:1.05}}
p{{height:18px;border-radius:9px;background:#dfe3ee;margin:20px 0}}.l{{display:flex;gap:14px;flex-wrap:wrap;margin-top:44px}}
.l a{{display:flex;flex-direction:column;padding:18px 22px;border-radius:16px;background:#fff;color:#1b2030;text-decoration:none;font-weight:600;min-width:240px;border:1px solid #e1e5f0}}.l small{{color:#7a8299;font-weight:500;margin-top:4px}}</style>
<header>{html.escape(host)}</header><main><h1>{html.escape(title)}</h1><p style="width:96%"></p><p style="width:88%"></p><p style="width:92%"></p><p style="width:60%"></p><div class="l">{rel}</div></main>'''
        self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.end_headers(); self.wfile.write(body.encode())
if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 80), H).serve_forever()
