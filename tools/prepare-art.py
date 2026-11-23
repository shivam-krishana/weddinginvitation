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


def knock_out_white(src_name, out_name, width, crop_top=0.0, colors=0):
    """Turn a white studio background into transparency and save a sized PNG.

    crop_top discards that fraction of empty space off the top; colors, when set,
    quantises the result, which shrinks flat silhouettes dramatically.
    """
    img = Image.open(os.path.join(ASSETS, src_name)).convert("RGB")
    if crop_top:
        img = img.crop((0, round(img.size[1] * crop_top), img.size[0], img.size[1]))
    pixels = img.load()
    out = Image.new("RGBA", img.size)
    out_pixels = out.load()

    for y in range(img.size[1]):
        for x in range(img.size[0]):
            r, g, b = pixels[x, y]
            distance = 255 - min(r, g, b)
            alpha = 255 if distance >= FEATHER else int(distance * 255 / FEATHER)
            out_pixels[x, y] = (r, g, b, alpha)

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

to_jpeg("art-couple.png", "art-couple.jpg", 620)
to_jpeg("art-mehndi.png", "art-mehndi.jpg", 620)
to_jpeg("art-baraat.png", "art-baraat.jpg", 620)
