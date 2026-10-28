# TabMapper — "Where Did That Tab Come From?" — Promo Scenario v2

## 1. Logline / promise / hook / arc
**Logline.** A person drowning in 47 identical tab stubs discovers their tabs were a family tree all along, and a calm, private map that lets them find, follow and clean up without fear.
**Core promise (one sentence).** TabMapper turns your open tabs into a map that shows which tab opened which, so you can find anything and clean up with Undo, all on your own computer.
**Hook (0-4s).** Product-and-pain, no logo: a Chrome strip of tiny unreadable tabs while a ticker climbs 12 → 47 and the cursor hunts. Caption: "47 tabs. Which one was it?" Why: relatable for the biggest segment (hoarders), instantly understood muted, decided in 3s, ticker gives motion from frame 1.
**Arc.** Overwhelm (tight, cold, desaturated, jittery cursor) → relief (the map "blooms", warm, slow, elastic) → competence (find, follow, clean up) → safety (Undo, private) → calm invitation. Tone wry and gentle; never shaming ("your tabs aren't a failure, they're a trail").

## 2. Tagline and CTA
Tagline: **"See how your tabs connect."** (alt: "Your tabs, as a map.")
End card: logo + "TabMapper: Visual Tab Manager" / "Free on the Chrome Web Store" / small line "No account. No cloud. Stays on your computer." CTA button graphic (non-clickable): "Add to Chrome".

## 3. Shot list — main cut 16:9, 46.0s, 1920x1080 30fps
Global setup: demo mode (or real mode where stated) at `view.html?clean`, `localStorage['droplet.simple']='0'` (glass/breathing/wobble ON), `droplet.tipsDone='1'`, welcome modal pre-dismissed (click #wOk during setup, not recorded), Look preset **Horizon** (dim ~0.35) except in the montage. Record a clean take per shot; stitch. Overlay kit (all built with createElement + el.style.* + el.animate, no <style>): `#fx` root div (position fixed, inset 0, pointer-events none, z-index max); fake cursor (SVG arrow) + click ripple ring; caption pill (see style: 64px, weight 700, white on 55% black blur pill, bottom-center at y=900, pop-in 220ms ease-out-back, out 160ms); highlight ring (circle, 3px accent stroke, scale 1.6→1 + fade, loop 2x); arrow/lineage SVG path using strokeDashoffset animation; full-screen wipe div for transitions; ticker (monospace-ish big numerals, animated with requestAnimationFrame to textContent).

### S1 — Hook: the hunt (0.0-4.0)
- Purpose: pain in 3 seconds, no logo.
- On screen: Real-extension take (persistent Chromium, 40+ localhost tabs opened by link clicks) showing the real Chrome tab strip crowded to stubs; OR fallback: injected fake strip (see Risks). Crop to top 220px, scaled 2.2x so stubs read as a crush.
- Choreography: cursor enters from right, scrubs along the strip left→right in 1.2s, pauses on tab 9 (ease-in-out), flicks back left to tab 3, jitters 2 small circles (hunting), sharp click on a tab, wrong page flashes.
- Overlay: giant ticker top-left "12 tabs" counting up to 47 over 2.4s (ease-out), digits in warm red-orange at the end; strip tab stubs shrink by CSS animate on the fake strip. Subtle camera shake (±2px, 6Hz) via transform on recorded video in post.
- Caption (0.4s in): "47 tabs. Which one was it?"
- Pacing: fast, cuts every ~1s in post (3 micro-cuts of the hunt), desaturate -20%.
- Post: ffmpeg `eq=saturation=0.8`, 1.0→1.08 slow zoom via zoompan; hard cut at 4.0 (impact frame: white flash 2 frames).

### S2 — The turn (4.0-7.0)
- Purpose: bridge from pain to product.
- On screen: white flash resolves to the TabMapper map already open, bubbles gathered tight at center (load animation) — i.e. record view.html load, starting at the moment bubbles settle.
- Choreography: load page, wait 1.2s, no mouse.
- Overlay: ticker shrinks and flies from top-left to #count region ("34" in the product's own #count) — implement by animating a copy to the #count bounding rect (getBoundingClientRect), 600ms ease-in-out, then fade; radial light bloom behind bubbles (blurred circle div, opacity 0→0.5→0, 1.2s).
- Caption: "Or see them as a map."
- Post: 0.5s crossfade from flash; tone shifts warm (colorbalance +). Soft whoosh sfx.

### S3 — Bloom of a family tree (7.0-13.0)
- Purpose: signature differentiator #1: automatic tab tree.
- On screen: whole map, Tokyo-trip tree (tab 1 hub with 5 children, tab 4 hub with 3 grandchildren).
- Choreography: press F (#fit) to settle; cursor glides (700ms bezier) to hub bubble for tab 1 ("Planning a trip to Tokyo"); hover 0.9s so #tip shows "Opened 5 tabs from here"; double-wheel zoom-in at pointer 1.6x (mouse.wheel -240 in 3 steps of 80, 120ms apart) so the sunflower fan fills the screen; cursor then traces a line to child tab 4 then to grandchild tab 7, pausing 400ms on each.
- Overlay: 0-1.5s dim everything except the tree (full-screen dark scrim with a circular hole around the hub radius, hole animates 80px→520px "bloom" with el.animate on a radial-gradient mask-size? CSSOM-safe alternative: 4 scrim rects forming a hole, or one SVG with a path whose r animates) ; lineage callout: an SVG dashed accent path drawn (dashoffset) hub → 4 → 7 over 1.4s, with floating chips at each node "opened", "opened" and small labels "parent → child". Highlight ring pulse on hub x2.
- Caption: "Every tab remembers its parent." (3.0s) then "Automatic tab tree." (4.4s)
- Pacing: slow, held shots, ease-in-out; the only slow-motion beat in the video (play 0.85x during zoom).
- Post: punch-in 1.0→1.25 centered on hub across shot; 6 frame dissolve out.

### S4 — Pull a bubble, family follows (13.0-18.0)
- Purpose: tactile delight, "bubbles on a map".
- On screen: same view, Tokyo hotel hub (tab 4) and its children.
- Choreography: cursor to bubble 4 (500ms); mousedown; drag with eased path ~420px right and 120px down over 900ms (sine ease) so threads stretch ~1.5x and neighbours tow; hold 300ms; drag back across a 140px loop; release (jiggle visible ~600ms); cursor retreats.
- Overlay: ring on dragged bubble on mousedown; thin speed-line trails behind cursor; tiny tension "stretch" arrow along one thread (SVG, fades). No caption crowding.
- Caption: "Pull one. The family follows."
- Pacing: ease with anticipation (small 40px pull-back before the big pull); release is the beat.
- Post: speed ramp: 1.0x → 0.6x at release for 0.7s (setpts), then 1.2x; add elastic "boing" sfx synced on release frame; shallow shake.

### S5 — Follow the trail by keyboard + relatives (18.0-22.0)
- Purpose: "which led to which" context recovery.
- On screen: focus on one bubble, camera walking.
- Choreography: click bubble 7 once (peek opens at ~240ms; press Esc to close card); keys: ArrowUp (to parent 4), ArrowUp (to 1), ArrowDown, ArrowRight (sibling) with 650ms between presses (camera follows, .kfocus ring); then Shift+F (relatives only, chip "relatives of …" shows); hold 700ms; Esc to clear.
- Overlay: key-cap overlay bottom-right that lights ↑ ↑ ↓ → Shift+F in sync (DOM keycaps, scale 0.9→1 on press); breadcrumb path glow along the walked threads (SVG polyline built from bubble rects, drawn as it is walked).
- Caption: "Walk back to where you started."
- Post: speed 1.0x; cross-dissolve; subtle push-in 1.0→1.12.

### S6 — Find anything: search + list (22.0-27.0)
- Purpose: answer "can't find the right tab".
- Choreography: press `/`; type "hotel" with 90ms/char (page.keyboard.type delay 90); non-matches dim; hold 600ms; press Escape/clear (select-all + Backspace); click #listBtn; panel #panel slides in; hover a row "Sourdough" 300ms, click a row (camera flies to bubble, card opens); wait 900ms; close panel (#panelClose).
- Overlay: spotlight sweep: after typing, animated ring on each matching bubble in sequence (80ms stagger, DOM rings from rects); counter badge "4 matches" pops near search; during the camera fly, a trailing comet streak (canvas, optional).
- Caption: "Type a word. It lights up."
- Pacing: typing quick, fly-to is the glide moment (let it breathe 0.8s).
- Post: punch-in on search box then back out (1.0→1.3→1.0 over 2s via zoompan with expressions or two crops and xfade).

### S7 — One-click cleanup, with Undo (27.0-33.0)
- Purpose: differentiator #3, the anti-fear beat.
- On screen: chips row #chips with "Close 3 duplicates" (.chip.dup); duplicate bubbles with N× badge.
- Choreography: cursor to a duplicate bubble to show badge (hover 500ms); move to .chip.dup (hover 400ms); click; wait 700ms for bubbles to leave and #count to tick down; toast appears with Undo; wait 1.2s (let it be read); click the #toast button (Undo); bubbles return; wait 800ms.
- Overlay: pulsing rings on the three N× badges; animated ticker tracking #count "34 → 31" using overlay copy that rolls digits (odometer-style, translateY animate) near the count; after Undo, ticker rolls back "31 → 34" with green check glow; label burst "Nothing lost." (not a caption, an end-of-beat stamp, 1.0s).
- Caption: "Close duplicates. Undo anytime."
- Pacing: deliberate; the pause on the toast is essential for trust.
- Post: no speed change; add soft "pop" on closure, "rewind swoosh" on Undo; 8 frame slide transition.

### S8 — Sites view and soap-film membranes (33.0-37.0)
- Purpose: B-roll, wow visual, second way to see.
- Choreography: click #modeSeg [data-g=sites] (cursor ease 600ms); wait 1.3s for hulls; drag one bubble 300px away slowly (1000ms) to stretch its site's membrane; release; hover the hull edge (do not click: groupMenu is for later) or optionally click the edge to show #groupMenu for 1.0s then Esc (menu items rename/colours/Make a Chrome tab group are fine to show, do NOT click Make group).
- Overlay: label sweep "By family" → "By site" tag toggling above the segment control (small wipe text); ring on the stretching membrane.
- Caption: "Or group by site."
- Post: slow ramp 0.75x on the membrane stretch; cross-zoom into next shot.

### S9 — Lasso and align glide (37.0-40.0)
- Purpose: control / "organise my way".
- Choreography: click [data-g=family] to return; hold Ctrl (keyboard.down('Control')), mouse.move to empty stage corner, mouse.down, drag diagonal over a cluster in 600ms (lasso #lasso visible), up; #selbar shows count; release Control; click #alignBtn; click `#alignMenu [data-a=left]`; bubbles glide into big/medium/small columns with jiggle; wait 900ms; press R (#tidy) at the end if time allows (else cut).
- Overlay: selection count ticker mirrors #selcount; arrows indicating columns "big / medium / small" label sweep, 400ms each.
- Caption: "Select. Align. Done."
- Post: 1.15x speed on lasso, normal on glide; avoid clicking selbar Group….

### S10 — Look montage (40.0-42.5)
- Purpose: cinematic, emotional payoff, brand beauty (shows backgrounds).
- Choreography: click #lookBtn; #look opens; in quick succession click `.lk-tile[data-p]` for Aurora, Deep sea, Ember, Nebula (0.5s each, mouse jumps with 120ms eases); close with #lookX before the last frame OR hide panel via overlay crop.
- Overlay: none except a soft vignette; each switch accompanied by a small colour-name tag flicker (e.g. "Aurora") bottom-left, 400ms.
- Caption: "Make it yours."
- Post: hard cuts on the beat; each at 0.5s; slight scale-up 1.0→1.04 each; light flash transitions. Use crop to hide the panel if desired (crop right 380px then scale back).

### S11 — Private by design + end card (42.5-46.0)
- Purpose: closer with trust, CTA.
- On screen: map from Aurora slightly blurred (boxblur 12 in post) behind overlay cards.
- Overlay (3 beats): 42.5-44.0 three icon rows slide in staggered 120ms: "No account", "No ads, no tracking", "Stays on your computer" (SVG icons: person-slash, shield, laptop; 500ms each ease-out). 44.0-46.0 end card: logo scales 0.9→1 with bubble-cluster animation (6 circles orbiting then settling into the logo, 900ms), tagline, "Free on the Chrome Web Store", Add to Chrome button.
- Caption: "Private. Free to try." is NOT allowed unless free is true; use "Your tabs stay yours."
- Post: fade out to black last 8 frames; hold final logo 1.3s.

Timing check: 4+3+6+5+4+5+6+4+3+2.5+3.5 = 46.0s.

Optional swap (+0s, replaces S9 if lasso is flaky): **Sprout** — press N with a bubble focused; seed sprouts on a line; type "tokyo ramen map" into #spInput; Enter (real extension only; opens real tab). Caption "Start new tabs from any tab."

## 4. Curated demo dataset (34 tabs)
`window.DROPLET_DEMO_TABS` entries `{id, openerTabId, title, url, description, windowId:1, active}`; active=true only for id 24. Hosts use reserved `.example` domains (invented names). Description = one short plain sentence.

TRIP (expected topic names like "Tokyo · Trip" / "Tokyo · Hotels"):
1 root "Tokyo trip in April – search" https://searchly.example/?q=tokyo+trip+in+april
2 op1 "Tokyo in April: what to expect" https://wayfarer.example/tokyo/april
3 op1 "Best neighborhoods to stay in Tokyo" https://wayfarer.example/tokyo/where-to-stay
4 op1 "Tokyo hotels under $150" https://stayfinder.example/tokyo/hotels
5 op1 "Cheap flights to Tokyo" https://skyfare.example/flights/tokyo
6 op1 "Tokyo rail pass: worth it?" https://wayfarer.example/tokyo/rail-pass
7 op4 "Shinjuku hotel reviews" https://stayfinder.example/tokyo/shinjuku
8 op4 "Capsule hotel guide" https://stayfinder.example/tokyo/capsule
9 op4 "Hotel near Shinjuku station" https://stayfinder.example/tokyo/shinjuku-station
10 op3 "Tokyo hotels under $150" https://stayfinder.example/tokyo/hotels   (DUPLICATE of 4)
11 op2 "Day trips from Tokyo" https://wayfarer.example/tokyo/day-trips
12 op2 "Cherry blossom forecast" https://wayfarer.example/tokyo/blossom
13 op3 "Tokyo food guide" https://wayfarer.example/tokyo/food
SOURDOUGH ("Sourdough · Starter", "Sourdough · Bread"):
14 root "sourdough starter not rising – search" https://searchly.example/?q=sourdough+starter+not+rising
15 op14 "Why is my sourdough starter not rising?" https://breadlab.example/starter/troubleshooting
16 op14 "Feeding schedule for a starter" https://breadlab.example/starter/feeding
17 op14 "Best flour for sourdough" https://breadlab.example/flour
18 op17 "Dutch oven loaf recipe" https://breadlab.example/recipes/dutch-oven
19 op18 "Scoring patterns for beginners" https://breadlab.example/scoring
20 op16 "Why is my sourdough starter not rising?" https://breadlab.example/starter/troubleshooting (DUPLICATE of 15)
USED CAR ("Used car · Hatchback"):
21 root "Used car buying checklist" https://carwise.example/guides/checklist
22 op21 "Reliable used hatchbacks" https://carwise.example/reviews/hatchbacks
23 op21 "Hatchback listings near me" https://autolist.example/search?type=hatchback
24 op23 "2018 hatchback, 62k miles" https://autolist.example/listing/48213   (active)
25 op23 "2017 hatchback, 71k miles" https://autolist.example/listing/47790
26 op21 "How to check vehicle history" https://carwise.example/guides/history
27 op22 "Insurance quotes for a used hatchback" https://coverly.example/quotes/used-car
SIDE PROJECT ("habit-tracker · Dates", "Code · Dates"):
28 root "habit-tracker: repository" https://codehub.example/me/habit-tracker
29 op28 "Issue 12: streak resets at midnight" https://codehub.example/me/habit-tracker/issues/12
30 op29 "Date handling in JavaScript" https://devdocs.example/js/date
31 op30 "Time zones explained" https://devdocs.example/time-zones
32 op29 "Answer: reset at local midnight" https://qa-hub.example/q/9921
33 op32 "Unit testing dates" https://devdocs.example/testing/dates
34 op29 "Date handling in JavaScript" https://devdocs.example/js/date (DUPLICATE of 30)
Structure: hubs with 3+ children: 1 (5), 4 (3), 14 (3), 21 (3), 29 (3); chains: 1→4→7, 17→18→19, 23→24, 29→30→31; duplicates produce "Close 3 duplicates"; search-query tabs: 1 and 14 (render as quoted queries). Dry-run the load, screenshot, and rename titles until auto-names look good (naming is heuristic; do NOT show topic labels in a shot if names look odd — use S3/S5 crops that exclude them). To get "N not viewed today"/"sleeping" chips, leave them off the cut (only the duplicate chip is scripted).

## 5. Vertical cut 9:16 (1080x1920), 18s
Do not letterbox the 16:9 capture; re-record or crop: set viewport 1080x1920 with `?clean` (the map reflows; verify) OR crop a 608x1080 window from the 1920x1080 recording and upscale 1.78x (acceptable for glassy bubbles). Prefer true 1080x1920 viewport recording for S3/S4/S7 shots; captions at 90px, placed at y=1500 (thumb-safe, above platform UI).
- 0.0-2.5 V-Hook (S1 fake-strip cropped to the ticker, 12→47). Caption "47 tabs. Which one?"
- 2.5-5.0 S2/S3 compressed bloom: tree appears + lineage path draw. "Every tab remembers its parent."
- 5.0-8.5 S4 drag with elastic threads (speed ramp). "Pull one. The family follows."
- 8.5-12.5 S7 cleanup + Undo (only the chip, badge rings, ticker odometer). "Close duplicates. Undo anytime."
- 12.5-15.0 S10 look montage x3 (0.8s each). "Make it yours."
- 15.0-18.0 End card, private line + logo. "Your tabs stay yours."
Loop-friendly: final frame cross-dissolves to the first frame.

## 6. Audio plan
Silent-first: every beat readable muted via captions and motion. Optional bed (ffmpeg lavfi): ~92 BPM, `sine` pads on A minor-ish chord (220, 261.6, 329.6 Hz) with `tremolo`, low-pass `lowpass=f=1800`, `aecho=0.8:0.7:60:0.3`, gain -22 dB, fade-in 1s; hook segment dry/no music (or a tick sound synced to ticker). SFX (all synthesizable): tick (`sine=f=2000:d=0.03`, 12 per second during ticker), whoosh (`anoisesrc=d=0.6,highpass=f=500,afade in/out` with `lowpass` sweep via `afftfilt` or `volume` automation), pop (`sine=f=520:d=0.08` with `afade out`), boing on release (`sine=f=180` with `vibrato=f=14:d=0.9`, 0.45s), rewind swoosh (`areverse` of whoosh), soft chime on end card (`sine 880 + 1320` decaying with `aecho`). Mix with `amix`, normalise -16 LUFS (`loudnorm=I=-16:TP=-1.5`). Final deliver both with music and a silent version.

## 7. Risks and fallbacks
- Real tab strip needs real extension + real Chrome UI: x11grab shows browser chrome only in headed windowed mode; fallback is a CSS-built fake strip overlay on a dark page (generic stubs, no brand look).
- Extension CSP: no <style>/inline style attributes; build overlays with createElement + `el.style.prop = ...` and WAAPI. Radial "bloom" masks via style.maskImage may work; fallback is an SVG circle with animated `r` (setAttribute allowed via WAAPI on the attribute? if not, animate transform: scale on a circle div).
- Demo mode: favicons absent (initials), real tab switching just toasts, Group makes a toast: do not show "Make a Chrome tab group" outcome; if wanted, fake with overlay ("Grouped!") and label as illustration.
- Drag/lasso need pointer events: use `page.mouse` with `steps`; verify Ctrl-drag lasso starts on empty stage (not over bubbles). If flaky, cut S9 and use Sprout or extend S8.
- Auto-naming may look odd with few tabs: tune titles; hide labels via crop.
- Simple mode default ON: if wobble missing, check `droplet.simple` set before load (or click #simpleBtn).
- Hover buttons (✕ and +) appear after ~377ms: never click ✕ in demo unless intended; Enter/Delete/double-click act on real tabs in real mode.
- Duplicate cleanup keeps "best copy": re-record if the wrong one disappears; the chip count must read 3 (verify in dry run).
- Timing drift: record each shot separately with 1s handles at both ends; assemble by ffmpeg `xfade`; keep a master EDL.
- Closed-parent ghost bubbles: not guaranteed in demo; not scripted.
- Screen capture frame-rate drops under heavy overlay canvases: limit simultaneous animations to 3.

## 8. What NOT to show or claim
- No "only", "first", "best", "AI", "smart AI"; say "automatic tab tree", "bubbles", "on your computer".
- No competitor names, logos, or comparison charts; no statistics ("saves X hours", "Y% users").
- No clinical or ADHD claims; no shaming language ("messy", "lazy", "chaos" as an insult). Wry is fine: "Which one was it?".
- No real brands, real URLs, personal data, email, banking or health pages; no incognito claims.
- Do not claim it reads pages, syncs, or backs up; do not claim "zero permissions" (group tabs needs an optional permission); do not mention right-click menus or a minimap (they do not exist).
- Do not show the welcome modal, #hint strip, the "#older" banner, or the real Delete/Enter actions on real tabs.
- Do not say "droplet" in captions; say "bubbles".
- Do not claim it is free unless confirmed by the owner; End card "Free on the Chrome Web Store" requires owner confirmation, otherwise use "On the Chrome Web Store".
