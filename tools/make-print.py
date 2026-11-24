"""Two-page wedding invite + envelope art for print.

Outputs (400 DPI, 5×7 inch card):
  print/invite-front.jpg
  print/invite-back.jpg
  print/invite-Shivali-Aastik-2page.pdf
  print/envelope-front.jpg
  print/envelope-fold-sheet.jpg

Run from project root:  python3 tools/make-print.py
"""

from __future__ import annotations

import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.dirname(os.path.abspath(__file__))
PRINT_DIR = os.path.join(ROOT, "print")
FONTS = os.path.join(TOOLS, "fonts")

DPI = 400
CARD_W = int(5 * DPI)
CARD_H = int(7 * DPI)

MAROON = (138, 34, 49)
INK = (47, 29, 12)
GOLD = (154, 113, 23)
GOLD_LT = (201, 162, 78)
CREAM = (252, 242, 224)
HI = (124, 30, 56)
MUTED = (90, 58, 22)
PLUM = (70, 21, 44)

EVENTS = [
    (
        "Sunday, 17th January 2027",
        "Ramayan Path",
        "9:00 am onwards",
        "At our residence — Gurah Jattan, Ghagwal, Samba, J&K",
    ),
    (
        "Monday, 18th January 2027",
        "Satsang",
        "11:00 am – 3:00 pm",
        "At our residence — Gurah Jattan, Ghagwal, Samba, J&K",
    ),
    (
        "Wednesday, 20th January 2027",
        "Lunch",
        "2:00 pm onwards",
        "At our residence — Gurah Jattan, Ghagwal, Samba, J&K",
    ),
    (
        "Thursday, 21st January 2027",
        "Mehndi & Sangeet",
        "12:00 pm – 4:00 pm",
        "Shivam RK Resort — Ghagwal, Samba, J&K",
    ),
    (
        "Saturday, 23rd January 2027",
        "Saanth",
        "5:00 pm",
        "At our residence — Gurah Jattan, Ghagwal, Samba, J&K",
    ),
    (
        "Saturday, 23rd January 2027",
        "Baraat",
        "8:00 pm onwards",
        "Ramada Plaza by Wyndham — Vijaypur, Samba, Jammu & Kashmir",
    ),
]

INVITE_LEAD = (
    "There are moments in life too joyful to celebrate alone. With hearts full of "
    "happiness and gratitude, our family requests the honour of your presence and "
    "your affectionate blessings on the auspicious occasion of the marriage of"
)


def _font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = os.path.join(FONTS, name)
    return ImageFont.truetype(path, size)


def _devanagari(size: int) -> ImageFont.FreeTypeFont:
    for name in ("NotoSansDevanagari-Regular.ttf", "TiroDevanagari-Regular.ttf"):
        path = os.path.join(FONTS, name)
        if os.path.isfile(path):
            return ImageFont.truetype(path, size)
    return _font("Cinzel-SemiBold.ttf", size)


def _cover_bg(path: str, w: int, h: int) -> Image.Image:
    src = Image.open(path).convert("RGB")
    sw, sh = src.size
    scale = max(w / sw, h / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    src = src.resize((nw, nh), Image.LANCZOS)
    left = (nw - w) // 2
    top = (nh - h) // 2
    return src.crop((left, top, left + w, top + h))


def _line_h(draw: ImageDraw.ImageDraw, text: str, font) -> int:
    box = draw.textbbox((0, 0), text, font=font, anchor="mt")
    return box[3] - box[1]


def _text_w(draw: ImageDraw.ImageDraw, text: str, font) -> float:
    box = draw.textbbox((0, 0), text, font=font, anchor="lt")
    return box[2] - box[0]


def _wrap(
    draw: ImageDraw.ImageDraw, text: str, font, max_w: int
) -> list[str]:
    words = text.split()
    lines: list[str] = []
    line: list[str] = []
    for word in words:
        trial = " ".join(line + [word])
        if _text_w(draw, trial, font) <= max_w or not line:
            line.append(word)
        else:
            lines.append(" ".join(line))
            line = [word]
    if line:
        lines.append(" ".join(line))
    return lines


def _rule(draw: ImageDraw.ImageDraw, y: int, cx: int, half: int, w: int = 3) -> None:
    draw.line([(cx - half, y), (cx - 28, y)], fill=GOLD, width=w)
    draw.line([(cx + 28, y), (cx + half, y)], fill=GOLD, width=w)
    draw.polygon(
        [(cx, y - 9), (cx + 10, y + 2), (cx, y + 12), (cx - 10, y + 2)],
        outline=GOLD,
        fill=GOLD,
    )


def _arch_couple(couple: Image.Image, out_w: int, out_h: int) -> Image.Image:
    cw, ch = couple.size
    target_ratio = out_w / out_h
    src_ratio = cw / ch
    if src_ratio > target_ratio:
        new_w = int(ch * target_ratio)
        left = (cw - new_w) // 2
        couple = couple.crop((left, 0, left + new_w, ch))
    else:
        new_h = int(cw / target_ratio)
        top = max(0, int(ch * 0.04))
        couple = couple.crop((0, top, cw, min(ch, top + new_h)))
    couple = couple.resize((out_w, out_h), Image.LANCZOS)
    mask = Image.new("L", (out_w, out_h), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.rectangle([0, int(out_h * 0.44), out_w, out_h], fill=255)
    mdraw.pieslice([0, 0, out_w, int(out_h * 0.92)], 180, 0, fill=255)
    framed = Image.new("RGBA", (out_w, out_h), (0, 0, 0, 0))
    framed.paste(couple, (0, 0), mask)
    return framed


def _stack(
    draw: ImageDraw.ImageDraw,
    cx: int,
    top_y: int,
    lines: list[tuple[str, ImageFont.FreeTypeFont, tuple[int, int, int]]],
    gaps: list[int],
) -> int:
    y = top_y
    for i, (text, font, fill) in enumerate(lines):
        draw.text((cx, y), text, font=font, fill=fill, anchor="mt")
        y += _line_h(draw, text, font) + gaps[i]
    return y


def _gold_frame(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], r: int = 24) -> None:
    x0, y0, x1, y1 = box
    for inset, color, w in ((0, GOLD_LT, 5), (10, GOLD, 2)):
        draw.rounded_rectangle(
            [x0 + inset, y0 + inset, x1 - inset, y1 - inset],
            radius=r,
            outline=color,
            width=w,
        )


def build_front() -> Image.Image:
    page = _cover_bg(os.path.join(ROOT, "card.jpg"), CARD_W, CARD_H)
    draw = ImageDraw.Draw(page)

    garland_path = os.path.join(ROOT, "garland.png")
    if os.path.isfile(garland_path):
        gar = Image.open(garland_path).convert("RGBA")
        gw = int(CARD_W * 0.92)
        gh = int(gar.size[1] * (gw / gar.size[0]))
        gar = gar.resize((gw, gh), Image.LANCZOS)
        page.paste(gar, ((CARD_W - gw) // 2, int(CARD_H * 0.02)), gar)

    art_w, art_h = int(CARD_W * 0.52), int(CARD_H * 0.28)
    art_x = (CARD_W - art_w) // 2
    art_y = int(CARD_H * 0.11)
    couple = Image.open(os.path.join(ROOT, "art-couple.jpg")).convert("RGB")
    framed = _arch_couple(couple, art_w, art_h)
    layer = page.convert("RGBA")
    layer.paste(framed, (art_x, art_y), framed)
    page = layer.convert("RGB")
    draw = ImageDraw.Draw(page)
    _gold_frame(draw, (art_x - 14, art_y - 14, art_x + art_w + 14, art_y + art_h + 14))

    f_eye = _font("Cinzel-SemiBold.ttf", 44)
    f_hi = _devanagari(48)
    f_names = _font("GreatVibes-Regular.ttf", 118)
    f_amp = _font("Cinzel-SemiBold.ttf", 36)
    f_date = _font("Cinzel-SemiBold.ttf", 48)
    f_sub = _font("Cinzel-SemiBold.ttf", 32)

    cx = CARD_W // 2
    y0 = art_y + art_h + int(CARD_H * 0.04)
    lines = [
        ("You are invited", f_eye, MAROON),
        ("॥ शुभ विवाह ॥", f_hi, HI),
        ("Shivali", f_names, INK),
        ("&", f_amp, GOLD),
        ("Aastik", f_names, INK),
    ]
    gaps = [18, 28, 8, 8, 24]
    bottom = _stack(draw, cx, y0, lines, gaps)
    _rule(draw, bottom + 8, cx, int(CARD_W * 0.22), w=4)
    draw.text(
        (cx, bottom + 36),
        "Saturday, 23rd January 2027",
        font=f_date,
        fill=MUTED,
        anchor="mt",
    )
    draw.text(
        (cx, bottom + 100),
        "Wedding celebrations · Samba & Jammu",
        font=f_sub,
        fill=GOLD,
        anchor="mt",
    )
    return page


def _draw_event_block(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    width: int,
    when: str,
    title: str,
    time: str,
    venue: str,
    f_when: ImageFont.FreeTypeFont,
    f_title: ImageFont.FreeTypeFont,
    f_time: ImageFont.FreeTypeFont,
    f_venue: ImageFont.FreeTypeFont,
) -> int:
    draw.text((x, y), when.upper(), font=f_when, fill=GOLD, anchor="lt")
    y += _line_h(draw, when, f_when) + 6
    draw.text((x, y), title, font=f_title, fill=MAROON, anchor="lt")
    y += _line_h(draw, title, f_title) + 4
    draw.text((x, y), time, font=f_time, fill=INK, anchor="lt")
    y += _line_h(draw, time, f_time) + 8
    for line in _wrap(draw, venue, f_venue, width):
        draw.text((x, y), line, font=f_venue, fill=MUTED, anchor="lt")
        y += _line_h(draw, line, f_venue) + 4
    return y + 22


def build_back() -> Image.Image:
    page = _cover_bg(os.path.join(ROOT, "scroll-page.jpg"), CARD_W, CARD_H)
    draw = ImageDraw.Draw(page)

    margin = int(CARD_W * 0.09)
    inner_w = CARD_W - margin * 2
    cx = CARD_W // 2

    f_kicker = _font("Cinzel-SemiBold.ttf", 38)
    f_body = _font("CormorantGaramond-Regular.ttf", 40)
    f_pair = _font("GreatVibes-Regular.ttf", 72)
    f_when = _font("Cinzel-SemiBold.ttf", 22)
    f_title = _font("Cinzel-SemiBold.ttf", 30)
    f_time = _font("CormorantGaramond-Regular.ttf", 34)
    f_venue = _font("CormorantGaramond-Regular.ttf", 30)
    f_rsvp = _font("Cinzel-SemiBold.ttf", 32)
    f_foot = _font("CormorantGaramond-Regular.ttf", 36)

    y = int(CARD_H * 0.055)
    draw.text((cx, y), "INVITATION", font=f_kicker, fill=MAROON, anchor="mt")
    y += 56
    for line in _wrap(draw, INVITE_LEAD, f_body, inner_w):
        draw.text((cx, y), line, font=f_body, fill=INK, anchor="mt")
        y += _line_h(draw, line, f_body) + 6
    y += 4
    draw.text((cx, y), "Shivali  &  Aastik", font=f_pair, fill=INK, anchor="mt")
    y += _line_h(draw, "Shivali", f_pair) + 14
    tail = (
        "as they begin their journey together, surrounded by the love of those "
        "dearest to them."
    )
    for line in _wrap(draw, tail, f_body, inner_w):
        draw.text((cx, y), line, font=f_body, fill=INK, anchor="mt")
        y += _line_h(draw, line, f_body) + 4
    y += 20
    _rule(draw, y, cx, int(CARD_W * 0.3), w=3)
    y += 28
    draw.text((cx, y), "ON THE FOLLOWING OCCASIONS", font=f_kicker, fill=GOLD, anchor="mt")
    y += 52

    col_gap = int(CARD_W * 0.06)
    col_w = (inner_w - col_gap) // 2
    left_x = margin
    right_x = margin + col_w + col_gap
    col_events = (EVENTS[:3], EVENTS[3:])
    col_y = [y, y]
    for col_idx, batch in enumerate(col_events):
        x = left_x if col_idx == 0 else right_x
        for ev in batch:
            col_y[col_idx] = _draw_event_block(
                draw, x, col_y[col_idx], col_w, *ev, f_when, f_title, f_time, f_venue
            )
    y = max(col_y) + 8
    _rule(draw, y, cx, int(CARD_W * 0.28), w=3)
    y += 36
    draw.text((cx, y), "PLEASE R.S.V.P.", font=f_rsvp, fill=MAROON, anchor="mt")
    y += 44
    draw.text(
        (cx, y),
        "We would be delighted to hear from you via WhatsApp or phone.",
        font=f_body,
        fill=INK,
        anchor="mt",
    )
    y = CARD_H - int(CARD_H * 0.08)
    draw.text((cx, y), "With compliments from", font=f_foot, fill=MUTED, anchor="mt")
    draw.text(
        (cx, y + 40),
        "Near & Dear Ones",
        font=f_pair,
        fill=GOLD,
        anchor="mt",
    )
    return page


def _plum_texture(w: int, h: int) -> Image.Image:
    base = PLUM
    lift = (138, 51, 96)
    img = Image.new("RGB", (w, h))
    px = img.load()
    cx, cy = w / 2, h * 0.4
    max_d = (cx * cx + cy * cy) ** 0.5
    for yy in range(h):
        for xx in range(w):
            d = ((xx - cx) ** 2 + (yy - cy) ** 2) ** 0.5
            t = min(1.0, d / max_d)
            px[xx, yy] = tuple(
                int(base[i] + (lift[i] - base[i]) * (1 - t) * 0.5) for i in range(3)
            )
    return img


def _paste_corners(canvas: Image.Image, corner_path: str, panel: tuple[int, int, int, int]) -> None:
    if not os.path.isfile(corner_path):
        return
    corner = Image.open(corner_path).convert("RGBA")
    x0, y0, x1, y1 = panel
    pw, ph = x1 - x0, y1 - y0
    size = int(min(pw, ph) * 0.22)
    corner = corner.resize((size, size), Image.LANCZOS)
    base = canvas.convert("RGBA")
    for sx, sy in (
        (x0 + 18, y0 + 18),
        (x1 - size - 18, y0 + 18),
        (x0 + 18, y1 - size - 18),
        (x1 - size - 18, y1 - size - 18),
    ):
        flip = corner
        if sx > x0 + pw // 2:
            flip = corner.transpose(Image.FLIP_LEFT_RIGHT)
        if sy > y0 + ph // 2:
            flip = flip.transpose(Image.FLIP_TOP_BOTTOM)
        base.paste(flip, (sx, sy), flip)
    canvas.paste(base.convert("RGB"))


def build_envelope_front() -> Image.Image:
    """Recipient-facing envelope (landscape artboard, front panel centred)."""
    env_w, env_h = int(7.25 * DPI), int(5.25 * DPI)
    page = _plum_texture(env_w, env_h)

    paper_path = os.path.join(ROOT, "env-paper.jpg")
    if os.path.isfile(paper_path):
        inset = _cover_bg(paper_path, env_w - 120, env_h - 100)
        layer = page.convert("RGBA")
        layer.paste(inset, (60, 50))
        page = layer.convert("RGB")

    lining_path = os.path.join(ROOT, "env-lining.jpg")
    if os.path.isfile(lining_path):
        band_h = int(env_h * 0.18)
        band = _cover_bg(lining_path, env_w - 80, band_h)
        page.paste(band, (40, env_h - band_h - 40))

    draw = ImageDraw.Draw(page)
    panel = (50, 45, env_w - 50, env_h - 45)
    _gold_frame(draw, panel, r=18)
    _paste_corners(page, os.path.join(ROOT, "env-corner.png"), panel)
    draw = ImageDraw.Draw(page)

    cx = env_w // 2
    cy = int(env_h * 0.44)
    text_panel = (cx - 420, cy - 130, cx + 420, cy + 150)
    draw.rounded_rectangle(text_panel, radius=28, fill=(255, 248, 238), outline=GOLD, width=3)
    draw.text((cx, cy - 58), "WEDDING INVITATION", font=_font("Cinzel-SemiBold.ttf", 40), fill=GOLD, anchor="mm")
    draw.text((cx, cy + 22), "Shivali  &  Aastik", font=_font("GreatVibes-Regular.ttf", 108), fill=INK, anchor="mm")
    draw.text(
        (cx, cy + 98),
        "23 January 2027",
        font=_font("Cinzel-SemiBold.ttf", 38),
        fill=MAROON,
        anchor="mm",
    )

    seal_r = 52
    sx, sy = env_w - 140, int(env_h * 0.28)
    draw.ellipse([sx - seal_r, sy - seal_r, sx + seal_r, sy + seal_r], fill=(120, 28, 48), outline=GOLD_LT, width=4)
    draw.text((sx, sy), "S", font=_font("Cinzel-SemiBold.ttf", 44), fill=GOLD_LT, anchor="mm")
    draw.text((sx + 28, sy + 24), "A", font=_font("Cinzel-SemiBold.ttf", 28), fill=GOLD_LT, anchor="mm")
    return page


def build_envelope_fold_sheet() -> Image.Image:
    """Print-at-home unfold template for a 5×7 card (guides in light grey)."""
    sheet_w = int(10.5 * DPI)
    sheet_h = int(13 * DPI)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (248, 242, 236))

    body_w = int(7.25 * DPI)
    body_h = int(5.25 * DPI)
    bx = (sheet_w - body_w) // 2
    by = int(sheet_h * 0.28)

    front = build_envelope_front().resize((body_w, body_h), Image.LANCZOS)
    sheet.paste(front, (bx, by))

    lining = _cover_bg(os.path.join(ROOT, "env-lining.jpg"), body_w, int(body_h * 0.35))
    sheet.paste(lining, (bx, by - lining.size[1] + 20))

    draw = ImageDraw.Draw(sheet)
    guide = (180, 170, 165)
    flap_h = int(2.2 * DPI)
    draw.polygon(
        [(bx, by), (bx + body_w, by), (bx + body_w // 2, by - flap_h)],
        outline=guide,
        fill=(255, 250, 245),
    )
    draw.line([(bx, by + body_h), (bx + body_w, by + body_h), (bx + body_w, by + body_h + int(1.6 * DPI)),
             (0, by + body_h + int(1.6 * DPI)), (0, by), (bx, by)], fill=guide, width=3)
    draw.text(
        (sheet_w // 2, sheet_h - int(0.4 * DPI)),
        "Cut on grey lines · fold side flaps inward · glue · fold bottom · fold top flap",
        font=_font("Cinzel-SemiBold.ttf", 26),
        fill=MUTED,
        anchor="mm",
    )
    draw.text(
        (sheet_w // 2, int(0.5 * DPI)),
        "Envelope fold sheet · fits 5×7″ invitation card",
        font=_font("Cinzel-SemiBold.ttf", 32),
        fill=MAROON,
        anchor="mm",
    )
    return sheet


def main() -> None:
    os.makedirs(PRINT_DIR, exist_ok=True)

    front = build_front()
    back = build_back()
    env_front = build_envelope_front()
    env_fold = build_envelope_fold_sheet()

    front_path = os.path.join(PRINT_DIR, "invite-front.jpg")
    back_path = os.path.join(PRINT_DIR, "invite-back.jpg")
    pdf_path = os.path.join(PRINT_DIR, "invite-Shivali-Aastik-2page.pdf")
    env_path = os.path.join(PRINT_DIR, "envelope-front.jpg")
    fold_path = os.path.join(PRINT_DIR, "envelope-fold-sheet.jpg")

    front.save(front_path, "JPEG", quality=95, dpi=(DPI, DPI), optimize=True)
    back.save(back_path, "JPEG", quality=95, dpi=(DPI, DPI), optimize=True)
    env_front.save(env_path, "JPEG", quality=95, dpi=(DPI, DPI), optimize=True)
    env_fold.save(fold_path, "JPEG", quality=93, dpi=(DPI, DPI), optimize=True)

    import img2pdf

    page_pt = (5 * 72, 7 * 72)
    layout = img2pdf.get_layout_fun(pagesize=page_pt)
    with open(pdf_path, "wb") as pdf:
        pdf.write(
            img2pdf.convert(
                [front_path, back_path],
                layout_fun=layout,
            )
        )

    for label, path in (
        ("Front", front_path),
        ("Back", back_path),
        ("PDF", pdf_path),
        ("Envelope", env_path),
        ("Envelope fold", fold_path),
    ):
        size_kb = os.path.getsize(path) // 1024
        if path.lower().endswith(".pdf"):
            print(label, size_kb, "KB")
        else:
            print(label, size_kb, "KB", Image.open(path).size)


if __name__ == "__main__":
    main()