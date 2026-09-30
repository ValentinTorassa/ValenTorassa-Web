// Writes the talk and paper catalog (src/talkSeo.ts) as JSON without a build,
// so scripts/generate-talk-og.py can draw missing cards before `vite build`
// runs. The build then finds every card and needs a single pass.
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runnerImport } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const output = path.resolve(process.argv[2] ?? path.join(root, 'dist/talk-seo.json'))

const { module } = await runnerImport(path.join(root, 'src/talkSeo.ts'), { configFile: false, root, logLevel: 'error' })
await mkdir(path.dirname(output), { recursive: true })
await writeFile(output, JSON.stringify(module.talkPages, null, 2))
console.log(`Wrote ${module.talkPages.length} talk pages to ${output}`)
