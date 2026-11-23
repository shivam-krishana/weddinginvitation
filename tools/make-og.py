"""Build og.jpg for WhatsApp / Instagram link previews.

Same look as the envelope letter: card.jpg with the opening invitation copy
(You are invited · शुभ विवाह · names · date).

Run from the project root:  python3 tools/make-og.py
"""

import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.dirname(os.path.abspath(__file__))
W, H = 1200, 630


def _blush_bg() -> Image.Image:
    """Soft pink ground behind the letter, like the old envelope intro."""
    base = (255, 236, 244)
    lift = (255, 248, 252)
    img = Image.new("RGB", (W, H))
    px = img.load()
    cx, cy = W / 2, H * 0.42
    max_d = (cx * cx + cy * cy) ** 0.5
    for y in range(H):
        for x in range(W):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            t = min(1.0, d / max_d)
            px[x, y] = tuple(
                int(base[i] + (lift[i] - base[i]) * (1 - t) * 0.65)
                for i in range(3)
            )
    return img


def _center(draw: ImageDraw.ImageDraw, text: str, y: int, font, fill: tuple[int, int, int]) -> None:
    draw.text((W // 2, y), text, font=font, fill=fill, anchor="mm")


def _rule(draw: ImageDraw.ImageDraw, y: int, cx: int, half: int) -> None:
    gold = (154, 113, 23)
    draw.line([(cx - half, y), (cx - 22, y)], fill=gold, width=2)
    draw.line([(cx + 22, y), (cx + half, y)], fill=gold, width=2)
    draw.polygon(
        [(cx, y - 6), (cx + 7, y + 1), (cx, y + 8), (cx - 7, y + 1)],
        outline=gold,
        fill=gold,
    )


def _devanagari_font(size: int) -> ImageFont.FreeTypeFont:
    cinzel = os.path.join(TOOLS, "fonts", "Cinzel-SemiBold.ttf")
    for path in (
        os.path.join(TOOLS, "fonts", "NotoSansDevanagari-Regular.ttf"),
        os.path.join(TOOLS, "fonts", "TiroDevanagari-Regular.ttf"),
    ):
        if os.path.isfile(path):
            return ImageFont.truetype(path, size)
    return ImageFont.truetype(cinzel, size)


def main() -> None:
    cinzel = os.path.join(TOOLS, "fonts", "Cinzel-SemiBold.ttf")
    vibes = os.path.join(TOOLS, "fonts", "GreatVibes-Regular.ttf")
    card_path = os.path.join(ROOT, "card.jpg")
    out_path = os.path.join(ROOT, "og.jpg")

    if not os.path.isfile(card_path):
        raise SystemExit("card.jpg missing — run tools/prepare-art.py first")

    bg = _blush_bg()
    card = Image.open(card_path).convert("RGB")

    card_h = 572
    card_w = int(card.size[0] * card_h / card.size[1])
    card = card.resize((card_w, card_h), Image.LANCZOS)
    card_x = (W - card_w) // 2
    card_y = (H - card_h) // 2
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        [card_x + 8, card_y + 12, card_x + card_w + 8, card_y + card_h + 12],
        radius=6,
        fill=(70, 25, 40, 55),
    )
    layer = bg.convert("RGBA")
    layer = Image.alpha_composite(layer, shadow)
    layer.paste(card, (card_x, card_y))
    bg = layer.convert("RGB")

    draw = ImageDraw.Draw(bg)

    scale = card_w / 820.0
    font_eye = ImageFont.truetype(cinzel, max(22, int(30 * scale)))
    font_hi = _devanagari_font(max(26, int(34 * scale)))
    font_names = ImageFont.truetype(vibes, max(52, int(88 * scale)))
    font_amp = ImageFont.truetype(cinzel, max(18, int(26 * scale)))
    font_date = ImageFont.truetype(cinzel, max(22, int(32 * scale)))

    maroon = (138, 34, 49)
    hi = (124, 30, 56)
    ink = (47, 29, 12)
    gold = (154, 113, 23)
    date = (90, 58, 22)

    mid_y = card_y + int(card_h * 0.44)
    cx = W // 2

    _center(draw, "You are invited", mid_y - int(70 * scale), font_eye, maroon)
    _center(draw, "॥ शुभ विवाह ॥", mid_y - int(22 * scale), font_hi, hi)

    names_y = mid_y + int(42 * scale)
    _center(draw, "Shivali", names_y, font_names, ink)
    weds_y = names_y + int(54 * scale)
    _center(draw, "&", weds_y, font_amp, gold)
    _center(draw, "Aastik", names_y + int(92 * scale), font_names, ink)

    rule_y = names_y + int(128 * scale)
    _rule(draw, rule_y, cx, int(120 * scale))
    _center(draw, "23 January 2027", rule_y + int(44 * scale), font_date, date)

    bg.save(out_path, "JPEG", quality=90, optimize=True)
    print("og.jpg", bg.size, os.path.getsize(out_path) // 1024, "KB")


if __name__ == "__main__":
    main()