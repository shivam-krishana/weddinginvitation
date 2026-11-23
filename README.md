# Shivali weds Aastik — Wedding Invitation

A single-page wedding invitation. Plain HTML, CSS and JavaScript — no build step and no
dependencies. Open `index.html` in a browser to preview.

## Structure

| File | What it holds |
| --- | --- |
| `index.html` | All visible text: cover, invitation wording, the events, RSVP, footer |
| `style.css` | Blush-and-gold theme, layout, the envelope animation, scroll motion |
| `script.js` | Map links, countdown, envelope intro, petals, scroll-linked effects |
| `mandala.svg` | The circular motif that turns behind the cover and the intro |
| `floral-corner.jpg` | Watercolour corner bouquet, used on the cover and the opening screen |
| `pattern-bg.svg` | Repeating tile used as a faint texture on the page and cards |
| `favicon.svg`, `apple-touch-icon.svg` | The "S&A" monogram icons |

## Editing content

Event details are all in `index.html`, inside each `<article class="event">` — date, time, venue,
and the `data-map` address used to build its Google Maps link.

The one value `script.js` holds is `WEDDING_START`, the date and time the cover countdown runs
down to. It is written with an explicit `+05:30` offset so the countdown ends at the same real
moment for guests in any timezone.

## Opening envelope

Append `?intro=0` to skip the tap-to-open screen. Otherwise the envelope is shown once per
browser session.

## Motion

Scroll-linked effects live in one rAF-throttled handler at the bottom of `script.js`:

- the gold reading-progress bar across the top of the window,
- the cover drifting up and dissolving as the first section takes over,
- the gold line down the timeline filling as you pass each celebration.

Everything else is CSS: the drifting petals, the turning mandala, the drawn-on flourish, the
frosted sticky "Celebrations" heading, the alternating card reveals and the footer diya's flame.

## Artwork

Everything visual in this repo was made for it — the mandala, the pattern tile, the icons and
the watercolour bouquet. Nothing is stock, so there is no licence to honour and nobody to
credit. The bouquet is painted on a white background rather than a transparent one;
`mix-blend-mode: multiply` drops the white out against the blush page, which keeps the file
small and the petal edges clean.

## Notes

- `<meta name="robots" content="noindex, nofollow">` keeps the page out of search results.
- Fonts (Cormorant Garamond, Great Vibes, Cinzel) load from Google Fonts, so the first view
  needs a network connection.
- `prefers-reduced-motion` is respected — all animation is disabled for guests who ask for it.
