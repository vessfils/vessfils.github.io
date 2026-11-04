// Generates public/og.png (1200×630), the preview image shown when the site is shared.
// Usage: node scripts/og-image.mjs
import sharp from 'sharp'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0b0c0e"/>
  <g stroke="#ffffff" stroke-opacity="0.05">
    ${Array.from({ length: 26 }, (_, i) => `<line x1="${i * 48}" y1="0" x2="${i * 48}" y2="630"/>`).join('')}
    ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 48}" x2="1200" y2="${i * 48}"/>`).join('')}
  </g>
  ${[[900, 180], [1010, 300], [860, 420], [1060, 470]]
    .map(([cx, cy], k) =>
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2 + k
        const r = 18 + ((i * 7) % 22)
        return `<circle cx="${cx + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" r="4" fill="${k === 0 ? '#2fa59b' : '#ececed'}" fill-opacity="${k === 0 ? 0.95 : 0.45}"/>`
      }).join(''),
    )
    .join('')}
  <text x="80" y="150" font-family="Menlo, monospace" font-size="20" letter-spacing="2" fill="#6c6f77">SOFTWARE ENGINEERING · MACHINE LEARNING · COMPUTER VISION</text>
  <text x="80" y="330" font-family="Helvetica Neue, Arial, sans-serif" font-size="78" font-weight="500" letter-spacing="-3" fill="#ececed">Jean-François</text>
  <text x="80" y="415" font-family="Helvetica Neue, Arial, sans-serif" font-size="78" font-weight="500" letter-spacing="-3" fill="#ececed">Campagnolle</text>
  <text x="80" y="490" font-family="Helvetica Neue, Arial, sans-serif" font-size="32" fill="#a0a2a9">Software &amp; Machine Learning Engineer</text>
  <text x="80" y="560" font-family="Menlo, monospace" font-size="20" fill="#2fa59b">vessfils.github.io</text>
</svg>`

await sharp(Buffer.from(svg)).png().toFile('public/og.png')
console.log('✓ public/og.png')
