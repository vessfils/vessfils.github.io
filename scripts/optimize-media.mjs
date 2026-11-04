// Converts raw captures in media-src/ into responsive WebP files in public/media/
// and writes a size manifest consumed by the <Img> component.
// Usage: node scripts/optimize-media.mjs
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import { join, parse, relative } from 'node:path'
import sharp from 'sharp'

const SRC = 'media-src'
const OUT = 'public/media'
const WIDTHS = [480, 960, 1600]
// Pixel-art style captures (emulator text screens) must stay crisp when scaled.
const NEAREST = [/^kfs\//, /^learn2slither\//]

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) yield p
  }
}

const manifest = {}
for await (const file of walk(SRC)) {
  const rel = relative(SRC, file)
  const { dir, name } = parse(rel)
  const key = `${dir}/${name}`
  const img = sharp(file)
  const meta = await img.metadata()
  const crisp = NEAREST.some((r) => r.test(key))
  await mkdir(join(OUT, dir), { recursive: true })

  const widths = []
  if (crisp) {
    // Upscale 2x with nearest-neighbour so VGA text stays sharp on retina screens.
    const w = meta.width * 2
    await sharp(file)
      .resize({ width: w, kernel: 'nearest' })
      .webp({ lossless: true })
      .toFile(join(OUT, dir, `${name}-${w}.webp`))
    widths.push(w)
  } else {
    const targets = WIDTHS.filter((w) => w < meta.width)
    targets.push(Math.min(meta.width, 2000))
    for (const w of [...new Set(targets)]) {
      await sharp(file)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(join(OUT, dir, `${name}-${w}.webp`))
      widths.push(w)
    }
  }
  manifest[key] = { w: meta.width, h: meta.height, widths, crisp }
  console.log(`✓ ${key} → ${widths.join(', ')}`)
}

await writeFile('src/content/media-manifest.json', JSON.stringify(manifest, null, 1) + '\n')
console.log(`\n${Object.keys(manifest).length} images written to ${OUT}`)
