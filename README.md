# Shivali weds Aastik — Wedding Invitation

A single-page wedding invitation. Plain HTML, CSS and JavaScript — no build step and no
dependencies. Open `index.html` in a browser to preview.

## Structure

| File | What it holds |
| --- | --- |
| `index.html` | All visible text: cover, invitation wording, the five events, RSVP, footer |
| `style.css` | Ivory-and-gold theme, layout, the opening-seal animation, scroll reveals |
| `script.js` | `EVENTS` data, map links, `.ics` downloads, countdown, personalised greeting |

Every placeholder is marked `TODO` in both files.

## Editing content

Event details live in **two** places and must be kept in sync:

- `index.html` — the `<article class="event">` block a guest reads (date, time, venue, `data-map`)
- `script.js` — the matching `EVENTS` entry used for the `.ics` calendar file and the countdown

The `data-key` on the article, the `data-cal` on its button, and the `EVENTS` key must all match.
All `start` times are India Standard Time; `mins` is the duration.

`MAIN_EVENT` in `script.js` picks which event the cover countdown points at.

## Personalised links

Add query parameters to give each guest their own opening screen:

```
index.html?to=Amarjeet Singh&city=Delhi&sub=W/F
```

- `to` — guest name, also used in the browser tab title
- `city` — shown after the name
- `sub` — second line; empty or `W/F` renders "With Family"
- `intro=0` — skip the opening seal entirely

Values are inserted with `textContent` and length-capped, so a crafted link cannot inject markup.
The seal is shown once per browser session.

## Notes

- `<meta name="robots" content="noindex, nofollow">` keeps the page out of search results.
- Fonts (Cormorant Garamond, Great Vibes, Cinzel) load from Google Fonts, so the first view
  needs a network connection.
- `prefers-reduced-motion` is respected — all animation is disabled for guests who ask for it.
