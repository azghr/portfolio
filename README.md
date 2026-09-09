# azghr, a working record

The portfolio site of Muhammad Asghar Ali, presented as a book you flip
through. Live at https://azghr.github.io/portfolio/

## Run locally

There is nothing to build. Serve the folder with any static server:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight in the browser
works too, though the fonts load from Google Fonts so you need to be online.

## Controls

Click the page corners, use the arrow buttons, or swipe on mobile.
The keyboard also works: left and right arrows turn pages, Home and End jump
to the covers, Space advances. Entries in the table of contents take you
straight to their chapter.

## Files

- `index.html`: all the content, from cover to back cover
- `styles.css`: covers, paper, page turns and typography
- `script.js`: the page turn engine, keyboard, swipe and contents jumps
- `favicon.svg`: the browser tab icon

## Deploy

The site deploys itself. Every push to main runs the GitHub Actions workflow
in `.github/workflows/static.yml`, which publishes to GitHub Pages.
