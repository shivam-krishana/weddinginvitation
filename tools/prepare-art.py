"""Prepare the generated artwork for the web.

Run from the project root:  python3 tools/prepare-art.py

Source paths are hard-coded on purpose: nothing here reads user input, so there is
no untrusted value reaching the filesystem.
"""

import os

from PIL import Image

ASSETS = os.path.expanduser(
    "~/.cursor/projects/Users-krishas1-Desktop-upsc-mains-generator/assets"
)
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# How far below pure white a channel must fall before the pixel is fully opaque.
FEATHER = 62


def knock_out_white(src_name, out_name, width, crop_top=0.0, crop_bottom=0.0,
                    colors=0, feather=FEATHER, trim=False, floor=0):
    """Turn a white studio background into transparency and save a sized PNG.

    crop_top and crop_bottom discard those fractions of empty space; trim crops to
    whatever is left opaque; colors, when set, quantises the result, which
    shrinks flat silhouettes dramatically. A smaller feather keeps near-white
    detail such as a flame tip, at the cost of a harder cut-out edge. floor
    discards pixels barely off white, which is what makes trim able to find the
    real edge of artwork sitting in a noisy white field.
    """
    img = Image.open(os.path.join(ASSETS, src_name)).convert("RGB")
    if crop_top or crop_bottom:
        img = img.crop((0, round(img.size[1] * crop_top),
                        img.size[0], round(img.size[1] * (1 - crop_bottom))))
    pixels = img.load()
    out = Image.new("RGBA", img.size)
    out_pixels = out.load()

    for y in range(img.size[1]):
        for x in range(img.size[0]):
            r, g, b = pixels[x, y]
            distance = 255 - min(r, g, b)
            if distance <= floor:
                alpha = 0
            elif distance >= feather:
                alpha = 255
            else:
                alpha = int(distance * 255 / feather)
            out_pixels[x, y] = (r, g, b, alpha)

    if trim:
        box = out.getbbox()
        if box:
            out = out.crop(box)

    height = round(out.size[1] * width / out.size[0])
    out = out.resize((width, height), Image.LANCZOS)
    if colors:
        out = out.quantize(colors=colors, method=Image.FASTOCTREE)
    out.save(os.path.join(OUT, out_name), optimize=True)
    print(out_name, out.size, os.path.getsize(os.path.join(OUT, out_name)) // 1024, "KB")


def to_jpeg(src_name, out_name, width, quality=72):
    """Resize a painting and save it as a JPEG."""
    img = Image.open(os.path.join(ASSETS, src_name)).convert("RGB")
    height = round(img.size[1] * width / img.size[0])
    img = img.resize((width, height), Image.LANCZOS)
    img.save(os.path.join(OUT, out_name), "JPEG", quality=quality, optimize=True)
    print(out_name, img.size, os.path.getsize(os.path.join(OUT, out_name)) // 1024, "KB")


knock_out_white("art-lantern.png", "lantern.png", 150)
knock_out_white("art-skyline.png", "skyline.png", 1400, crop_top=0.42, colors=24)
# The marigold toran hangs over the invitation band, so it keeps its alpha.
knock_out_white("art-toran-painted.png", "garland.png", 1100,
                crop_bottom=0.22, colors=160, trim=True)

# The illuminated page the opening card is printed on
to_jpeg("art-card.png", "card.jpg", 820, quality=80)

# Prototype: the scroll cover on scroll.html
knock_out_white("art-rod.png", "scroll-rod.png", 900, feather=40, trim=True,
                floor=14, colors=200)
to_jpeg("art-scroll-page.png", "scroll-page.jpg", 700, quality=80)

# Surfaces the envelope is cut from, plus the corner piece printed on its front
to_jpeg("art-paper.png", "env-paper.jpg", 640, quality=78)
to_jpeg("art-lining.png", "env-lining.jpg", 520, quality=74)
knock_out_white("art-corner-gold.png", "env-corner.png", 420, colors=96, trim=True)

to_jpeg("art-couple.png", "art-couple.jpg", 620)
to_jpeg("art-satsang.png", "art-satsang.jpg", 620)
to_jpeg("art-mehndi.png", "art-mehndi.jpg", 620)
to_jpeg("art-baraat.png", "art-baraat.jpg", 620)
