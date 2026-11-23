"""Build og.jpg for WhatsApp / Instagram link previews.

Plum ground + large arch miniature (left) and hero type (right) — tuned for
small thumbnails.

Run from the project root:  python3 tools/make-og.py
"""

import os

from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.dirname(os.path.abspath(__file__))
W, H = 1200, 630


def _gradient_plum() -> Image.Image:
    base = (70, 21, 44)
    lift = (138, 51, 96)
    img = Image.new("RGB", (W, H))
    px = img.load()
    cx, cy = W * 0.38, H / 2
    max_d = (cx * cx + cy * cy) ** 0.5
    for y in range(H):
        for x in range(W):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            t = min(1.0, d / max_d)
            px[x, y] = tuple(
                int(base[i] + (lift[i] - base[i]) * (1 - t) * 0.55)
                for i in range(3)
            )
    return img


def _damask_overlay(base: Image.Image) -> None:
    tile = 118
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    stroke = (255, 255, 255, 30)
    dot = (255, 255, 255, 38)
    for ty in range(-tile, H + tile, tile):
        for tx in range(-tile, W + tile, tile):
            cx, cy = tx + tile // 2, ty + tile // 2
            draw.ellipse([cx - 12, cy - 28, cx + 12, cy - 4], outline=stroke, width=2)
            draw.line([(cx, cy - 4), (cx, cy + 22)], fill=stroke, width=2)
            draw.ellipse([cx - 5, cy + 20, cx + 5, cy + 30], fill=dot)
    base.paste(Image.alpha_composite(base.convert("RGBA"), layer).convert("RGB"))


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


def _gold_frame(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    gold = (201, 162, 78)
    gold_dim = (154, 113, 23)
    x0, y0, x1, y1 = box
    for inset, color, w in ((0, gold, 3), (7, gold_dim, 1)):
        draw.rounded_rectangle(
            [x0 + inset, y0 + inset, x1 - inset, y1 - inset],
            radius=16,
            outline=color,
            width=w,
        )


def _center_col(
    draw: ImageDraw.ImageDraw, text: str, y: int, font, fill: tuple[int, int, int], cx: int
) -> None:
    draw.text((cx, y), text, font=font, fill=fill, anchor="mm")


def _paste_rod(canvas: Image.Image, rod: Image.Image, x: int, y: int, tw: int) -> None:
    rw, rh = rod.size
    th = max(8, int(rh * (tw / rw)))
    rod = rod.resize((tw, th), Image.LANCZOS).convert("RGBA")
    base = canvas.convert("RGBA")
    base.paste(rod, (x, y), rod)
    canvas.paste(base.convert("RGB"))


def main() -> None:
    cinzel = os.path.join(TOOLS, "fonts", "Cinzel-SemiBold.ttf")
    vibes = os.path.join(TOOLS, "fonts", "GreatVibes-Regular.ttf")
    couple_path = os.path.join(ROOT, "art-couple.jpg")
    rod_path = os.path.join(ROOT, "scroll-rod.png")
    out_path = os.path.join(ROOT, "og.jpg")

    bg = _gradient_plum()
    _damask_overlay(bg)

    art_w, art_h = 472, 500
    art_x, art_y = 56, (H - art_h) // 2 + 8
    couple = Image.open(couple_path).convert("RGB")
    framed = _arch_couple(couple, art_w, art_h)
    bg_rgba = bg.convert("RGBA")
    bg_rgba.paste(framed, (art_x, art_y), framed)
    bg = bg_rgba.convert("RGB")

    draw = ImageDraw.Draw(bg)
    pad = 12
    _gold_frame(draw, (art_x - pad, art_y - pad, art_x + art_w + pad, art_y + art_h + pad))

    if os.path.isfile(rod_path):
        rod_w = art_w + 80
        _paste_rod(bg, Image.open(rod_path), art_x - 40, art_y - 34, rod_w)
        draw = ImageDraw.Draw(bg)

    font_kicker = ImageFont.truetype(cinzel, 34)
    font_line = ImageFont.truetype(vibes, 92)
    font_date = ImageFont.truetype(cinzel, 36)
    font_day = ImageFont.truetype(cinzel, 28)

    rcx = 888
    cream = (252, 242, 224)
    gold = (212, 175, 92)
    blush = (230, 195, 200)

    _center_col(draw, "WEDDING INVITATION", 148, font_kicker, gold, rcx)
    draw.line([(rcx - 120, 182), (rcx + 120, 182)], fill=gold, width=2)
    _center_col(draw, "Shivali  &  Aastik", 268, font_line, cream, rcx)
    _center_col(draw, "Saturday", 358, font_day, gold, rcx)
    _center_col(draw, "23 January 2027", 408, font_date, blush, rcx)

    vignette = Image.new("L", (W, H), 0)
    vdraw = ImageDraw.Draw(vignette)
    vdraw.ellipse([-W * 0.12, -H * 0.25, W * 1.12, H * 1.3], fill=255)
    vignette = ImageChops.invert(vignette).point(lambda p: int(p * 0.2))
    bg = Image.composite(Image.new("RGB", (W, H), (40, 10, 28)), bg, vignette)

    bg.save(out_path, "JPEG", quality=90, optimize=True)
    print("og.jpg", bg.size, os.path.getsize(out_path) // 1024, "KB")


if __name__ == "__main__":
    main()