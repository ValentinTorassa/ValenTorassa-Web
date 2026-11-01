// Runs after `npm run build` on Vercel only (see vercel.json buildCommand):
// removes the files that media-site/ serves, so each deploy of the site stays
// small. Their URLs keep working through the rewrites in vercel.json.
import { readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { offloaded } from './media-files.mjs';

const dist = path.resolve('dist');

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full, base));
    else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

let files = 0;
let bytes = 0;
for (const { dir, match } of offloaded) {
  const root = path.join(dist, dir);
  for (const rel of await walk(root)) {
    if (!match(rel)) continue;
    const file = path.join(root, rel);
    bytes += (await stat(file)).size;
    await rm(file);
    files += 1;
  }
}
if (files === 0) throw new Error('strip-media: nothing to strip, check scripts/media-files.mjs');
console.log(`strip-media: removed ${files} files (${(bytes / 1048576).toFixed(1)} MB) served by media-site`);
