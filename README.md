# Shivali weds Aastik — Wedding Invitation

A single-page wedding invitation. Plain HTML, CSS and JavaScript — no build step and no
dependencies. Open `index.html` in a browser to preview.

## Structure

| File | What it holds |
| --- | --- |
| `index.html` | All visible text: hero, invitation wording, the events, RSVP, footer |
| `style.css` | The band palette, type scale, arch framing, envelope and motion |
| `script.js` | Map links, countdown, envelope intro, sky lanterns, scroll effects |
| `damask.svg` | Block-print tile used as the tonal watermark inside every band |
| `art-couple.jpg`, `art-satsang.jpg`, `art-mehndi.jpg`, `art-baraat.jpg` | The arch-framed paintings |
| `garland.png` | Painted marigold toran hung over the invitation band |
| `skyline.png` | Temple and haveli silhouette along the bottom of the hero |
| `lantern.png` | The sky lantern, cloned and animated upward on the night bands |
| `mandala.svg`, `pattern-bg.svg`, `floral-corner.jpg` | Earlier artwork, no longer referenced |
| `favicon.svg`, `apple-touch-icon.svg` | The "S&A" monogram icons |
| `tools/prepare-art.py` | Turns the source paintings into the web-sized assets above |

## Design

The page is a stack of full-bleed colour bands — indigo night, saffron, jade, plum, ochre,
rose — one celebration per band, rather than cards on a pale page. Four bands carry an Indian
miniature painting framed in an ogee arch. Every band shares a canvas grain overlay and a
tonal damask watermark so the colours read as painted board.

Each band carries at most one ornament, and some carry none on purpose — a page that moves
everywhere reads as busy rather than alive:

| Band | Ornament |
| --- | --- |
| Hero, night | sky lanterns rising over a temple silhouette |
| Invitation, saffron | painted marigold toran, swaying |
| Ramayan Path, jade | a drawn ogee arch, still once drawn |
| Satsang, plum | the painting alone |
| Lunch, ochre | marigold petals drifting down |
| Mehndi, rose | the painting alone |
| Saanth, jade | a rangoli that draws itself on arrival |
| Baraat, night | lanterns and fireworks |
| R.S.V.P., plum | a drawn ogee arch |
| Footer, night | the diya, its flame flickering over a pulsing glow |

Bands without a painting get a drawn ogee arch rather than a rectangular frame, so the
decoration echoes the shape around the paintings.

Bands after the hero are masked into a shallow arcade of arches along their top edge and pulled
up over the band above, so each colour change lands on a scallop instead of a straight line.

Gold small-caps vanish against the two warm light bands, so `--accent` is overridden there to a
deep ink; everything that uses gold (kickers, rules, buttons) follows that variable.

## Editing content

Event details are all in `index.html`, inside each `<section class="band … event">` — date, time,
venue, and either an explicit Google Maps link or the `data-map` address used to build one.

The one value `script.js` holds is `WEDDING_START`, the date and time the hero countdown runs
down to. It is written with an explicit `+05:30` offset so the countdown ends at the same real
moment for guests in any timezone.

## Opening envelope

Append `?intro=0` to skip the tap-to-open screen. Otherwise the envelope is shown once per
browser session. It is cream paper with gold foil rules and a deep-crimson patterned liner,
built from two inline SVG sheets (a pointed euro flap and a dipped-mouth pocket) so the
geometry scales with `--env-width`.

## Motion

Scroll-linked effects live in one rAF-throttled handler at the bottom of `script.js`: the gold
reading-progress bar, and the hero text lifting away faster than the skyline behind it.

Everything else is CSS or a one-off setup pass: the rising sky lanterns, the staggered band
reveals, the twinkling stars, the fireworks (each burst is one element whose `box-shadow`
carries every spark, so it costs a single composited layer), the countdown digits popping as
they change, and the footer diya's flame.

Drawn ornaments use `pathLength="1"` on every shape, so one `stroke-dasharray` rule draws
circles and paths alike when the band scrolls in.

## Artwork

Everything visual in this repo was made for it — the paintings, the skyline, the lantern, the
damask tile and the icons. Nothing is stock, so there is no licence to honour and nobody to
credit. `tools/prepare-art.py` is the pipeline: it knocks the white studio background out of
the lantern, skyline and garland to transparency, crops and quantizes, and writes the paintings
out as web-sized JPEGs. Re-run it from the project root after regenerating any source art.

## Notes

- `<meta name="robots" content="noindex, nofollow">` keeps the page out of search results.
- Fonts (Cormorant Garamond, Great Vibes, Cinzel, Tiro Devanagari) load from Google Fonts, so
  the first view needs a network connection.
- `prefers-reduced-motion` is respected — all animation is disabled for guests who ask for it.
