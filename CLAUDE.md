# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Pixora is a Norwegian web agency website for three co-founders based in Stavanger. It is a **pure static site** — plain HTML, CSS and vanilla JavaScript. No build tools, no frameworks, no Node dependencies. Hosted on **GitHub Pages** at `https://rasmusostensen.github.io/Pixora/`.

## Serving locally

```bash
python3 -m http.server 5173 --directory "/Users/rasmus/Documents/Pixora/Pixora website"
# Then open http://localhost:5173
```

## Deploying

Upload changed files directly via the GitHub web UI: `github.com/rasmusostensen/Pixora` → **Add file → Upload files**. GitHub Pages redeploys automatically within ~2 minutes. There is no CI pipeline or build step.

## File structure

| File | Purpose |
|------|---------|
| `index.html` | Homepage with Spline 3D robot hero, BackgroundPaths animation, laptop showcase, services, why-us, CTA |
| `priser.html` | Pricing cards (3 500 / 5 000 / 8 000 kr one-time) + maintenance comparison table + FAQ accordion |
| `tjenester.html` | Services detail page with alternating rows |
| `om-oss.html` | About page — team cards (Rasmus centre/elevated, Aksel, Arne), values, history |
| `kontakt.html` | Contact page — info panel + Formspree form (`https://formspree.io/f/maqkbrwr`) |
| `style.css` | Single shared stylesheet for all pages |
| `script.js` | Single shared JS for all pages |
| `chat.js` | Self-contained Pixorbot chat widget — injects its own HTML + CSS |

## Architecture

### CSS
One file (`style.css`) covers all pages. CSS custom properties are defined in `:root`:
- **Colours:** `--p` (purple `#6C47FF`), `--bg` / `--bg-2` / `--bg-3` / `--bg-4` (light greys), `--text-1` / `--text-2` / `--text-3`
- **Theme:** Light (white/grey backgrounds). The **only** dark section is `.laptop-showcase` (`background: #0d0d20`) — headings there need `color:#fff` overrides via `.laptop-showcase .light-heading`.
- **Footer** (`background: #000`) uses hard-coded `rgba(255,255,255,x)` colours, not CSS variables, because the variables are light-theme dark values.
- Responsive breakpoints: `1024px`, `768px`, `480px`.

### JavaScript (`script.js`)
Runs as an IIFE on every page. Key sections:
1. **Hamburger menu** — toggles `.open` on `#nav-links`
2. **Active nav link** — matches `window.location.pathname` against href
3. **Hero cursor spotlight** — radial gradient follows mouse inside `#hero`
4. **FAQ accordion** — `.faq-item` open/close
5. **Scroll-reveal** — `IntersectionObserver` on `.reveal` and `.reveal-stat` elements
6. **Spline card click → Pixorbot** — click on `.spline-card` calls `e.stopPropagation()` then `#px-toggle.click()`. The `stopPropagation` is essential to prevent `chat.js`'s "click outside → close" handler from immediately closing the panel.
7. **BackgroundPaths** — injects two mirrored SVGs (36 paths each) into `#hero`. The wrapper has a CSS `mask-image` gradient so paths only appear on the right (robot) side and never cover the left (text) side.
8. **Spline cursor forwarding** — listens on `document.mousemove` and dispatches both `PointerEvent('pointermove')` and `MouseEvent('mousemove')` to the canvas inside `spline-viewer`'s shadow DOM. Only forwards when cursor is **outside** the card (inside the card, native events reach the canvas directly). This makes the robot track the cursor across the entire page.

### Spline 3D robot (`index.html` only)
```html
<spline-viewer url="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"></spline-viewer>
```
Loaded via `<script type="module" src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js">`. The `spline-viewer` element has **no** `pointer-events:none` — native events reach the canvas so cursor tracking works. A `.spline-click-capture` overlay sits above it with `pointer-events:none` so clicks fall through to `spline-viewer` and bubble up to `.spline-card`.

### Pixorbot (`chat.js`)
Self-contained widget — appends its own `<style>` and HTML to `<body>`. No external dependencies.
- **Toggle:** `#px-toggle` button (bottom-right). Opening/closing managed via `.open` class on `#px-chat`.
- **Responses:** Keyword scoring against a `KB` array. Each entry has `patterns` (strings), `response` (HTML string), and `quick` (follow-up pill labels). Longer pattern matches score higher.
- **Quick-reply pills:** Certain labels navigate directly (`kontakt.html`, `priser.html`) instead of querying the KB.
- **Proactive badge:** Appears after 4.5 s if the panel hasn't been opened.
- `chat.js` is included on **all five pages**.

## Team

| Person | Role | Initials in SVG avatars |
|--------|------|------------------------|
| Rasmus Hansen Østensen | Medgründer & Teknisk ansvarlig | RØ |
| Aksel Dørum Middelthon | Medgründer & Økonomiansvarlig | AD |
| Arne Farstad | Medgründer & Markedssjef | AF |

Rasmus's team card uses `.team-card--featured` (elevated `translateY(-20px)`, purple border/shadow). On mobile this resets to `transform:none`.

## Prices (as of 2026)

| Package | One-time | Monthly maintenance |
|---------|----------|-------------------|
| Basis | 3 500 kr | 500 kr/mnd |
| Profesjonell | 5 000 kr | 800 kr/mnd |
| Nettbutikk | 8 000 kr | 1 000 kr/mnd |

## Key copy rules

- **No claims of coding "from scratch" / "fra bunnen"** — the FAQ in `priser.html` still contains this phrase and may need updating.
- Language is Norwegian throughout. Tone: direct, opinionated, slightly editorial — not generic AI marketing copy.
- Contact: `pixorawebdesigns@gmail.com` / `465 12 634` / Stavanger, Norge.
