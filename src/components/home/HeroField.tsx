import { useEffect, useRef } from 'react'

/**
 * Background animation for the hero: points drift towards a few cluster centres,
 * like embeddings of the same identity converging during metric learning.
 * Nearest neighbours inside a cluster are joined by faint lines.
 *
 * Performance: one canvas, ~90 points, paused when off-screen or when the tab is hidden.
 * Accessibility: purely decorative (aria-hidden); with reduced motion a single static frame is drawn.
 */

const POINTS = 90
const CLUSTERS = 5
const LINK_DISTANCE = 70

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  cluster: number
  /** Resting offset from the cluster centre, so clusters stay loose instead of collapsing to a dot. */
  ox: number
  oy: number
}

const CLUSTER_RADIUS = 64

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let centres: { x: number; y: number }[] = []
    let points: Point[] = []
    let frame = 0
    let visible = true

    const random = mulberry32(42) // seeded: the layout is the same on every visit

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Cluster centres sit mostly on the right half, leaving room for the headline.
      centres = Array.from({ length: CLUSTERS }, (_, i) => ({
        x: width * (0.5 + 0.45 * random()) - (width < 640 ? width * 0.25 : 0),
        y: height * (0.15 + (0.7 * (i + random() * 0.6)) / CLUSTERS),
      }))
      points = Array.from({ length: POINTS }, (_, i) => {
        // Uniform position in a disc (sqrt keeps density even).
        const angle = random() * Math.PI * 2
        const radius = Math.sqrt(random()) * CLUSTER_RADIUS
        return {
          x: random() * width,
          y: random() * height,
          vx: 0,
          vy: 0,
          cluster: i % CLUSTERS,
          ox: Math.cos(angle) * radius,
          oy: Math.sin(angle) * radius,
        }
      })
    }

    const css = getComputedStyle(document.documentElement)
    const color = (name: string) => css.getPropertyValue(name).trim()

    const step = (t: number) => {
      for (const p of points) {
        const c = centres[p.cluster]
        // Each centre breathes slowly so clusters never fully collapse.
        const tx = c.x + p.ox + Math.cos(t / 3200 + p.cluster) * 22
        const ty = c.y + p.oy + Math.sin(t / 2700 + p.cluster * 2) * 16
        p.vx = p.vx * 0.92 + (tx - p.x) * 0.0012 + (random() - 0.5) * 0.08
        p.vy = p.vy * 0.92 + (ty - p.y) * 0.0012 + (random() - 0.5) * 0.08
        p.x += p.vx
        p.y += p.vy
      }
    }

    const draw = () => {
      const fg = color('--fg')
      const accent = color('--accent')
      ctx.clearRect(0, 0, width, height)

      ctx.lineWidth = 1
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i]
          const b = points[j]
          if (a.cluster !== b.cluster) continue
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d > LINK_DISTANCE) continue
          ctx.globalAlpha = (1 - d / LINK_DISTANCE) * 0.18
          ctx.strokeStyle = fg
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      for (const p of points) {
        ctx.globalAlpha = p.cluster === 0 ? 0.9 : 0.45
        ctx.fillStyle = p.cluster === 0 ? accent : fg
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.cluster === 0 ? 2.2 : 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => {
      if (visible) {
        step(t)
        draw()
      }
      frame = requestAnimationFrame(loop)
    }

    layout()
    if (reduceMotion) {
      for (let k = 0; k < 600; k++) step(k * 16) // settle into clusters, then draw once
      draw()
    } else {
      frame = requestAnimationFrame(loop)
    }

    const resize = new ResizeObserver(() => {
      layout()
      if (reduceMotion) draw()
    })
    resize.observe(canvas)
    const onScreen = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting && !document.hidden))
    onScreen.observe(canvas)
    const theme = new MutationObserver(() => reduceMotion && draw())
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      onScreen.disconnect()
      theme.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}

/** Small deterministic PRNG (public-domain mulberry32). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
