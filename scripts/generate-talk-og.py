"""Generate 1200×630 social cards after `npm run build` writes dist/talk-seo.json.

The PNGs are committed under public/ so the production build needs no Python.
Run this whenever a talk or paper is added or its public title changes.
"""

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PAGES = json.loads((ROOT / "dist/talk-seo.json").read_text(encoding="utf-8"))
OUTPUT = ROOT / "public/og-charlas"
OUTPUT.mkdir(parents=True, exist_ok=True)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
WIDTH, HEIGHT = 1200, 630


def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)


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
