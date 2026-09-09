# azghr — A Learner's Log

A portfolio website bound as a physical book. Flip through chapters of projects
curated from [github.com/azghr](https://github.com/azghr).

## Run

No build step — it's a static site:

```sh
# any static server, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly also works, though Google Fonts need network.)

## Controls

- Click the page corners, the ← → buttons, or swipe (mobile)
- Keyboard: ← → to turn pages, `Home`/`End` to jump, Space to advance
- The Table of Contents entries jump straight to their chapters

## Structure

- `index.html` — all content (cover, preface, TOC, chapters I–IV, appendix, ex libris)
- `styles.css` — cloth covers, paper texture, 3D page turns, print-inspired typography
- `script.js` — the page-turn engine (z-index bookkeeping, keyboard, swipe, TOC jumps)

## Deploy

Push to a `gh-pages` branch (or enable Pages on `main`) at GitHub → Settings → Pages.
