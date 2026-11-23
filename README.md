# Shivali weds Aastik — Wedding Invitation

A single-page wedding invitation. Plain HTML, CSS and JavaScript — no build step and no
dependencies. Open `index.html` in a browser to preview.

## Structure

| File | What it holds |
| --- | --- |
| `index.html` | All visible text: cover, invitation wording, the events, RSVP, footer |
| `style.css` | Ivory-and-gold theme, layout, the opening-seal animation, scroll reveals |
| `script.js` | Map links, countdown, opening seal |

## Editing content

Event details are all in `index.html`, inside each `<article class="event">` — date, time, venue,
and the `data-map` address used to build its Google Maps link.

The one value `script.js` holds is `WEDDING_START`, the date and time the cover countdown runs
down to. It is written with an explicit `+05:30` offset so the countdown ends at the same real
moment for guests in any timezone.

## Opening seal

Append `?intro=0` to skip the tap-to-open screen. Otherwise the seal is shown once per browser
session.

## Notes

- `<meta name="robots" content="noindex, nofollow">` keeps the page out of search results.
- Fonts (Cormorant Garamond, Great Vibes, Cinzel) load from Google Fonts, so the first view
  needs a network connection.
- `prefers-reduced-motion` is respected — all animation is disabled for guests who ask for it.
