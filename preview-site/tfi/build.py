#!/usr/bin/env python3
"""Builds the unlisted page for the professors: blackice, final engineering project at UAI.

python3 build.py <delivery-dir>

<delivery-dir> is the local «Entrega Final 2C» folder. It holds what stays out of this public repo:
  web-privada/fuente/slug.txt  the slug, the only thing that keeps the page unlisted
  web-privada/assets/          videos, posters and the deck (presentacion.html, still with its speaker notes)
  videos-promo/*.srt           subtitles of the ad
  web-privada/deploy/          the output: a static Vercel project linked to valentorassa-preview (.vercel)

The page lives at /<slug>/ in that project and valentorassa.com proxies /p/:path* to it (../../vercel.json),
so the link is https://valentorassa.com/p/<slug>, without a trailing slash. Every response carries
X-Robots-Tag: noindex. Deploy with `vercel deploy --prod --yes` from web-privada/deploy/.
"""
import json
import re
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROBOTS = '<meta name="robots" content="noindex,nofollow,noarchive">'
FILES = ['presentacion.html', 'video.mp4', 'portada.jpg', 'publicidad.mp4', 'publicidad.jpg', 'aviso.mp4', 'aviso.jpg']


def vtt(srt: Path) -> str:
    body = re.sub(r'(\d\d:\d\d:\d\d),(\d\d\d)', r'\1.\2', srt.read_text().strip())
    return 'WEBVTT\n\n' + body + '\n'


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    delivery = Path(sys.argv[1]).expanduser().resolve()
    assets = delivery / 'web-privada' / 'assets'
    out = delivery / 'web-privada' / 'deploy'
    slug = (delivery / 'web-privada' / 'fuente' / 'slug.txt').read_text().strip()

    # Rebuild only the page folder: out/.vercel keeps the link to the Vercel project.
    site = out / slug
    if site.exists():
        shutil.rmtree(site)
    # Only what the page uses: no slides, scene images or PDF (it presents the project, it is not the talk).
    site.mkdir(parents=True)
    for name in FILES:
        shutil.copy2(assets / name, site / name)

    page = (HERE / 'pagina.src.html').read_text()
    page = page.replace('/*__PIXEL__*/', (HERE / 'pixel.css').read_text())
    page = page.replace('__SLUG__', slug)
    assert '__' + 'SLUG' not in page and '/*__' not in page
    (site / 'index.html').write_text(page)

    # The deck, without the speaker notes: they are the talk's script, not something to hand out.
    deck = site / 'presentacion.html'
    html, n = re.subn(r'"notes":"(?:[^"\\]|\\.)*"', '"notes":""', deck.read_text())
    assert n == 16, n
    for a, b in [('<meta charset="utf-8">', '<meta charset="utf-8">\n' + ROBOTS),
                 (' <span>/</span> N notas', ''),
                 (' / N notas / F pantalla completa', ' / F pantalla completa'),
                 ('</head>', '<style>#notesButton{display:none!important}</style>\n</head>')]:
        assert html.count(a) == 1, a
        html = html.replace(a, b)
    deck.write_text(html)

    (site / 'publicidad.vtt').write_text(vtt(delivery / 'videos-promo' / 'blackice-publicidad-sustentable-16x9.srt'))

    (out / 'vercel.json').write_text(json.dumps({
        '$schema': 'https://openapi.vercel.sh/vercel.json',
        'framework': None,
        'cleanUrls': True,
        'headers': [
            {'source': '/(.*)', 'headers': [{'key': 'X-Robots-Tag', 'value': 'noindex, nofollow, noarchive'},
                                            {'key': 'Referrer-Policy', 'value': 'same-origin'}]},
        ],
    }, indent=2) + '\n')
    (out / '.vercelignore').write_text('.vercel\n.env*\n.gitignore\n')
    total = sum(f.stat().st_size for f in out.rglob('*') if f.is_file())
    print(f'{out} · /{slug}/ · {total / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
