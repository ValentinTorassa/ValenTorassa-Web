#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# The first build writes dist/talk-seo.json from the current event catalog.
# Cards are committed in public/ so Vercel needs only the normal Node build.
npm run build
python3 scripts/generate-talk-og.py
npm run build

echo "Talk pages, social cards, and sitemap are ready in dist/."
