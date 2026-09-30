"""Generate 1200×630 social cards from the talk catalog.

`npm run build:talks` writes the catalog with scripts/write-talk-seo.mjs, runs
this script, then builds once. Pass the catalog path as the first argument;
without it the script reads dist/talk-seo.json from a previous build.

The PNGs are committed under public/ so the production build needs no Python.
Run this whenever a talk or paper is added or its public title changes.

Fonts: DejaVu Sans is the reference face. TALK_OG_FONT and TALK_OG_FONT_BOLD
override it; otherwise the usual Linux and macOS paths and `fc-match` are
tried, and Pillow's built-in face is the last resort (with a warning).
"""

import json
import os
import shutil
import subprocess
import sys
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
CATALOG = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "dist/talk-seo.json"
PAGES = json.loads(CATALOG.read_text(encoding="utf-8"))
OUTPUT = ROOT / "public/og-charlas"
OUTPUT.mkdir(parents=True, exist_ok=True)
WIDTH, HEIGHT = 1200, 630

FONT_CANDIDATES = {
    False: [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans.ttf",
        "/usr/share/fonts/dejavu-sans-fonts/DejaVuSans.ttf",
        "/opt/homebrew/share/fonts/DejaVuSans.ttf",
        str(Path.home() / "Library/Fonts/DejaVuSans.ttf"),
        "/Library/Fonts/DejaVuSans.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ],
    True: [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/dejavu-sans-fonts/DejaVuSans-Bold.ttf",
        "/opt/homebrew/share/fonts/DejaVuSans-Bold.ttf",
        str(Path.home() / "Library/Fonts/DejaVuSans-Bold.ttf"),
        "/Library/Fonts/DejaVuSans-Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ],
}


@lru_cache(maxsize=None)
def font_path(bold):
    override = os.environ.get("TALK_OG_FONT_BOLD" if bold else "TALK_OG_FONT")
    candidates = ([override] if override else []) + FONT_CANDIDATES[bold]
    for candidate in candidates:
        if Path(candidate).is_file():
            return candidate
    if shutil.which("fc-match"):
        pattern = "DejaVu Sans:bold" if bold else "DejaVu Sans"
        found = subprocess.run(["fc-match", "-f", "%{file}", pattern], capture_output=True, text=True).stdout.strip()
        if found and Path(found).is_file():
            return found
    print(f"warning: no {'bold ' if bold else ''}TrueType font found; set TALK_OG_FONT{'_BOLD' if bold else ''}. "
          "Using Pillow's built-in face, which will not match the committed cards.", file=sys.stderr)
    return None


def font(size, bold=False):
    path = font_path(bold)
    return ImageFont.truetype(path, size) if path else ImageFont.load_default(size)


def lines(draw, text, typeface, max_width):
    words = text.split()
    result = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and draw.textlength(candidate, font=typeface) > max_width:
            result.append(current)
            current = word
        else:
            current = candidate
    if current:
        result.append(current)
    return result


for page in PAGES:
    image = Image.new("RGB", (WIDTH, HEIGHT), "#0a0e15")
    draw = ImageDraw.Draw(image)
    accent = (113, 216, 190)
    draw.rectangle((0, 0, WIDTH, 8), fill=accent)
    draw.rectangle((60, 65, 65, 545), fill="#264338")

    source = ROOT / "public/charlas" / page["id"] / "still.webp"
    if source.exists():
        with Image.open(source) as original:
            crop = ImageOps.fit(original.convert("RGB"), (440, 440), method=Image.Resampling.LANCZOS)
        image.paste(crop, (710, 100))
    else:
        draw.rounded_rectangle((710, 100, 1150, 540), radius=24, fill="#16251f", outline="#375749", width=2)
        draw.text((930, 320), "VT", font=font(108, True), fill=accent, anchor="mm")
    draw.rectangle((710, 100, 1150, 540), outline="#3a4b4a", width=2)

    draw.text((95, 94), page["event"].upper(), font=font(23, True), fill=accent)
    title = page["title"]["es"]
    size = 53
    while size > 30:
        title_font = font(size, True)
        wrapped = lines(draw, title, title_font, 570)
        if len(wrapped) <= 5 and len(wrapped) * (size + 11) <= 340:
            break
        size -= 2
    top = max(175, 308 - len(wrapped) * (size + 11) // 2)
    for line in wrapped:
        draw.text((95, top), line, font=title_font, fill="#f3f3ee")
        top += size + 11
    draw.text((95, 514), page["date"], font=font(25), fill="#b5c4bf")
    draw.text((95, 568), "VALENTORASSA.COM / CHARLAS", font=font(18, True), fill="#83978f")
    image.save(OUTPUT / f'{page["id"]}.png', optimize=True)

print(f"Generated {len(PAGES)} social cards in {OUTPUT}")
