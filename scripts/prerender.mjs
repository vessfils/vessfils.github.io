// Post-build step for GitHub Pages (no server-side rewrites):
//  1. writes dist/<route>/index.html for every route, so direct links and refreshes work,
//     each with its own <title>, description, canonical URL and Open Graph tags;
//  2. writes dist/404.html, so unknown URLs still load the app (which shows its 404 page);
//  3. writes sitemap.xml and robots.txt.
// Node ≥ 22.18 runs the TypeScript content files directly (type stripping).
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { projects } from '../src/content/projects.ts'
import { site } from '../src/content/site.ts'

const DIST = 'dist'
const template = await readFile(join(DIST, 'index.html'), 'utf8')

const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Replaces the head metadata of the built index.html for one route. */
function page({ path, title, description }) {
  const url = `${site.url}${path}`
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.role}`
  return template
    .replace(/<title>.*?<\/title>/, `<title>${escape(fullTitle)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${escape(description)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${escape(fullTitle)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${escape(description)}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
}

const routes = [
  { path: '/', title: null, description: `${site.intro} ${site.supporting}` },
  { path: '/work/', title: 'Work', description: 'Every project with a detailed case study: computer vision, deep learning, reinforcement learning, systems, web and infrastructure.' },
  ...projects.map((p) => ({ path: `/work/${p.slug}/`, title: p.title, description: p.summary })),
]

for (const route of routes) {
  const dir = join(DIST, route.path)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'index.html'), page(route))
}

await writeFile(join(DIST, '404.html'), page({ path: '/404', title: 'Page not found', description: 'This page does not exist.' }))

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${site.url}${r.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
await writeFile(join(DIST, 'sitemap.xml'), sitemap)
await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)

console.log(`Prerendered ${routes.length} routes + 404.html, sitemap.xml, robots.txt`)
