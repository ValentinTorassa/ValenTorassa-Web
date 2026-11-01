// Builds the media project: copies the heavy talk files out of public/ into
// media-site/dist. vercel.json at the repo root proxies their URLs here.
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { offloaded } from '../scripts/media-files.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, '..', 'public');
const out = path.join(here, 'dist');

async function walk(dir, base = dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full, base));
    else files.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return files;
}

await rm(out, { recursive: true, force: true });
let count = 0;
for (const { dir, match } of offloaded) {
  for (const rel of await walk(path.join(pub, dir))) {
    if (!match(rel)) continue;
    const target = path.join(out, dir, rel);
    await mkdir(path.dirname(target), { recursive: true });
    await cp(path.join(pub, dir, rel), target);
    count += 1;
  }
}
if (count === 0) throw new Error('media-site: no files copied');
console.log(`media-site: copied ${count} files into ${out}`);
