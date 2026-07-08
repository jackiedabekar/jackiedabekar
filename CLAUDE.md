# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is `jackiedabekar/jackiedabekar` — a GitHub **profile repository** (repo name matches the username), so `README.md` renders directly on the GitHub profile page. There is no application here; the repo serves two published artifacts:

- **`README.md`** — the GitHub profile page. Heavy on shields.io badges, animated GIFs from `svgfiles/`, and externally-hosted dynamic images (capsule-render, readme-typing-svg, github-readme-stats). Editing it changes what visitors see on the profile.
- **`resume.html`** — a standalone, single-file HTML resume published via **GitHub Pages** at `https://jackiedabekar.github.io/jackiedabekar/resume.html` and rendered to `Deepak-V-Dabekar.pdf` for download.

The two are cross-linked: README's "Resume" section points at the Pages URL (online view) and the raw `master` PDF (download).

## Generating the resume PDF

`resume.html` is the source of truth for the resume. The committed PDF is a generated artifact — regenerate it whenever `resume.html` changes:

```bash
npm install        # first time only; installs puppeteer (the sole dependency)
node generate-pdf.js
```

`generate-pdf.js` launches headless Chromium, loads `resume.html` from the local filesystem, waits for fonts, then **force-adds the `.visible` class to every `.animate-on-scroll` element** before printing. This step is essential: the resume's content is hidden by default (`opacity: 0`) and only revealed on scroll via an `IntersectionObserver`, which never fires in a PDF render — without it the PDF would be blank.

There is no build, lint, or test setup. `package.json` has no scripts.

A GitHub Actions workflow (`.github/workflows/generate-resume-pdf.yml`) regenerates and commits the PDF automatically on any push to `master` that touches `resume.html` or `generate-pdf.js` — but the README links serve `master`, so resume changes only reach visitors once merged there.

## resume.html architecture

Everything (styling, config, behavior) lives inline in the one file — there is no bundler or asset pipeline:

- **Tailwind via CDN** (`cdn.tailwindcss.com`) with an inline `tailwind.config` defining the theme colors (`accent: #2a7a6f`, etc.) and Inter as the sans font.
- **Reveal-on-scroll pattern**: elements marked `.animate-on-scroll` start hidden and gain `.visible` when an `IntersectionObserver` sees them. Any new section must carry this class to appear, and see the PDF note above for how it's handled at print time.
- **Print/PDF layout** is driven by an `@media print` block and `.page-break` — page breaks and A4 sizing are controlled in CSS, not in `generate-pdf.js` (which uses zero margins and `printBackground`).

`dummy.html` is a mirror copy of `resume.html` (not published or referenced anywhere). The owner wants resume edits applied to **both** files and kept identical — verify with `diff resume.html dummy.html` after editing.

## Committing artifacts

`.gitignore` ignores all `*.pdf` **except** `Deepak-V-Dabekar.pdf`, and ignores `node_modules/`. The one whitelisted PDF is meant to be committed so the README download link resolves against `raw/master`.
