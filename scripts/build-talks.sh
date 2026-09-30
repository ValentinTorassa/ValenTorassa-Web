#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# One build: write the catalog, draw the social cards it needs, then build.
# Cards are committed in public/ so Vercel needs only the normal Node build.
catalog="$(mktemp "${TMPDIR:-/tmp}/talk-seo.XXXXXX")"
trap 'rm -f "$catalog"' EXIT
node scripts/write-talk-seo.mjs "$catalog"
python3 scripts/generate-talk-og.py "$catalog"
npm run build

echo "Talk pages, social cards, and sitemap are ready in dist/."
