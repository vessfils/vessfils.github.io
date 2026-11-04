/*
 * PICTURE IA visuals. No Veolia imagery is used: every figure is an original
 * schematic or a chart of numbers from the internship report / seminar deck.
 */
import { motion, useReducedMotion, type TargetAndTransition } from 'motion/react'
import { useId, useState } from 'react'
import { BarList } from './primitives/BarList'
import { Flow } from './primitives/Flow'
import { Frame } from './primitives/Frame'

// ── Pipeline ────────────────────────────────────────────────────────────────

export function PicturePipeline() {
  return (
    <Frame label="Re-identification pipeline" source="Illustrative">
      <Flow
        steps={[
          { title: 'Site cameras', detail: '3–4 cameras per site, one 6000×4000 frame every two minutes.', meta: 'no video, no tracks' },
          { title: 'Truck detection', detail: 'Bounding boxes on every incoming frame.', meta: 'workflow 1 · continuous' },
          { title: 'Crop & normalise', detail: 'Per-model input statistics (ImageNet for DINOv3).', meta: '224 × 224' },
          { title: 'Embedding', detail: 'DINOv3 ViT, last 3 blocks fine-tuned, projection head.', meta: '256-d vector', focus: true },
          { title: 'Candidate filter', detail: 'Same site, consistent time window, cameras that can see the truck.', meta: 'domain rules' },
          { title: 'Ranking', detail: 'Euclidean distance to the entrance image; best match first.', meta: 'Rank-1 · mAP' },
        ]}
      />
    </Frame>
  )
}

/** Card cover: identities as clusters in embedding space; a query links to its nearest neighbour. */
export function PictureCover() {
  const reduce = useReducedMotion()
  const clusters = [
    { cx: 90, cy: 80, color: 'var(--c1)' },
    { cx: 230, cy: 60, color: 'var(--c3)' },
    { cx: 300, cy: 160, color: 'var(--c2)' },
    { cx: 150, cy: 190, color: 'var(--c4)' },
  ]
  // Deterministic offsets so the cover looks identical on every render.
  const offsets = [
    [-18, -8], [12, -16], [20, 10], [-6, 18], [-22, 12], [4, -2], [16, 24],
  ]
  const gridId = useId() // unique per instance: the cover can appear twice on a page
  return (
    <svg viewBox="0 0 400 250" className="h-full w-full" role="img" aria-label="Illustration: truck images grouped into identity clusters in embedding space">
      <defs>
        <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--grid)" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#${gridId})`} />
      {clusters.map((c, ci) => (
        <g key={ci}>
          <circle cx={c.cx} cy={c.cy} r={36} fill={c.color} opacity={0.07} />
          {offsets.map(([dx, dy], i) => (
            <motion.circle
              key={i}
              cx={c.cx + dx}
              cy={c.cy + dy}
              r={3.5}
              fill={c.color}
              initial={reduce ? false : { opacity: 0, scale: 0 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ delay: 0.15 + ci * 0.12 + i * 0.03, duration: 0.4 }}
            />
          ))}
        </g>
      ))}
      {/* query → nearest identity */}
      <motion.line
        x1={330} y1={52} x2={244} y2={66}
        stroke="var(--fg)" strokeWidth={1.2} strokeDasharray="3 4"
        initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.8 }}
      />
      <rect x={326} y={44} width={16} height={16} rx={3} fill="none" stroke="var(--fg)" strokeWidth={1.5} />
      <text x={346} y={40} className="fill-faint font-mono text-[10px]">query</text>
    </svg>
  )
}

// ── Workflows ───────────────────────────────────────────────────────────────

export function PictureWorkflows() {
  const items = [
    { n: '1', mode: 'Continuous', title: 'Detect', body: 'Every incoming frame is processed: trucks are detected and a visual signature is stored.' },
    { n: '2', mode: 'On demand', title: 'Re-identify', body: 'When an operator opens a delivery, the system queries the stored signatures for images of that truck.' },
    { n: '3', mode: 'In development', title: 'Locate the waste', body: 'From those images, the newly dropped pile is outlined for the operator.' },
  ]
  return (
    <Frame label="Three workflows" source="From the seminar deck">
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.n} className="rounded-lg border border-line p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl text-accent">{item.n}</span>
              <span className="eyebrow">{item.mode}</span>
            </div>
            <p className="mt-3 font-medium">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}

// ── Triplet loss ────────────────────────────────────────────────────────────

export function PictureTriplet() {
  const reduce = useReducedMotion()
  const anchor = { x: 200, y: 130 }
  const anim = (from: TargetAndTransition, to: TargetAndTransition, delay = 0) =>
    reduce ? { initial: false as const, animate: to } : { initial: from, whileInView: to, viewport: { once: true }, transition: { duration: 1.2, delay, ease: 'easeInOut' as const } }

  return (
    <Frame label="Triplet loss with margin" source="Illustrative">
      <svg viewBox="0 0 400 260" className="mx-auto w-full max-w-xl" role="img" aria-label="Diagram: training pulls the positive towards the anchor and pushes the negative beyond the margin">
        {/* margin ring */}
        <circle cx={anchor.x} cy={anchor.y} r={58} fill="none" stroke="var(--line-strong)" strokeDasharray="4 5" />
        <circle cx={anchor.x} cy={anchor.y} r={104} fill="none" stroke="var(--accent)" strokeOpacity={0.5} strokeDasharray="2 6" />
        <text x={anchor.x + 74} y={anchor.y - 78} className="fill-accent font-mono text-[10px]">margin</text>

        {/* positive pulled in */}
        <motion.g {...anim({ x: 120, y: -40 }, { x: 0, y: 0 })}>
          <line x1={anchor.x} y1={anchor.y} x2={anchor.x + 40} y2={anchor.y - 36} stroke="var(--c1)" strokeWidth={1.5} />
          <circle cx={anchor.x + 40} cy={anchor.y - 36} r={9} fill="var(--c1)" />
          <text x={anchor.x + 54} y={anchor.y - 40} className="fill-muted text-[11px]">positive · same truck</text>
        </motion.g>

        {/* negative pushed out */}
        <motion.g {...anim({ x: 60, y: -30 }, { x: 0, y: 0 }, 0.15)}>
          <line x1={anchor.x} y1={anchor.y} x2={anchor.x - 112} y2={anchor.y + 52} stroke="var(--c4)" strokeWidth={1.5} strokeDasharray="4 3" />
          <circle cx={anchor.x - 112} cy={anchor.y + 52} r={9} fill="var(--c4)" />
          <text x={anchor.x - 112} y={anchor.y + 80} textAnchor="middle" className="fill-muted text-[11px]">negative · other truck</text>
        </motion.g>

        <circle cx={anchor.x} cy={anchor.y} r={10} fill="var(--fg)" />
        <text x={anchor.x} y={anchor.y + 28} textAnchor="middle" className="fill-fg text-[11px] font-medium">anchor · unloading image</text>
      </svg>
      <p className="mt-2 text-center font-mono text-xs text-muted">L = max(0, d(a, p) − d(a, n) + margin) · margin = 0.5</p>
    </Frame>
  )
}

// ── Ablations ───────────────────────────────────────────────────────────────

const ablations = {
  freezing: {
    label: 'Backbone freezing',
    note: 'Reference configuration: DINOv3, embedding 256, margin 0.5, lr 5e-5, semi-hard mining.',
    items: [
      { label: 'Last 3 blocks unfrozen · AdamW', value: 73.17, highlight: true },
      { label: 'Backbone frozen · AdamW', value: 64.99 },
      { label: 'Fully fine-tuned', value: 64.57 },
      { label: 'Backbone frozen · SGD', value: 58.91 },
    ],
  },
  margin: {
    label: 'Triplet margin',
    note: 'Last 3 blocks unfrozen, other settings unchanged.',
    items: [
      { label: 'Margin 0.5', value: 73.17, highlight: true },
      { label: 'Margin 1.0', value: 71.7 },
      { label: 'Margin 0.6', value: 70.23 },
      { label: 'Margin 0.3', value: 70.02 },
    ],
  },
  dimension: {
    label: 'Embedding size',
    note: 'Measured earlier, on the first reference configuration (before partial unfreezing).',
    items: [
      { label: '256 dimensions', value: 66.67, highlight: true },
      { label: '512 dimensions', value: 65.62 },
      { label: '128 dimensions', value: 62.89 },
    ],
  },
}

type AblationKey = keyof typeof ablations

export function PictureAblation() {
  const [tab, setTab] = useState<AblationKey>('freezing')
  const current = ablations[tab]
  return (
    <Frame label="Ablations · Rank-1 with temporal constraint" source="Internship report, internal test set">
      <div role="tablist" aria-label="Ablation" className="mb-5 flex flex-wrap gap-1.5">
        {(Object.keys(ablations) as AblationKey[]).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              tab === key ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:text-fg'
            }`}
          >
            {ablations[key].label}
          </button>
        ))}
      </div>
      <BarList items={current.items} domain={[50, 80]} format={(v) => `${v.toFixed(1)}%`} />
      <p className="mt-4 text-xs text-faint">{current.note} Axis starts at 50%.</p>
    </Frame>
  )
}

export function PictureAugment() {
  return (
    <Frame label="Effect of data augmentation" source="Seminar deck">
      <BarList
        diverging
        domain={[-5, 1]}
        format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)} pts`}
        items={[
          { label: 'Random flip, p = 0.5', value: -1.5 },
          { label: 'Blur, k = 5–9, σ = 0.1–2', value: -1.5 },
          { label: 'Random crop', value: -2.7 },
          { label: 'Random flip, p = 0.25', value: -3.8 },
        ]}
      />
      <p className="mt-4 text-xs text-faint">Δ Rank-1 versus no augmentation. Every tested augmentation reduced accuracy.</p>
    </Frame>
  )
}

// ── Change detection ────────────────────────────────────────────────────────

/** Six schematic panels of the before/after pipeline, drawn with simple shapes. */
export function PictureChange() {
  const panels: { title: string; draw: React.ReactNode }[] = [
    {
      title: 'Before / after',
      draw: (
        <>
          <rect x="8" y="40" width="34" height="20" rx="3" fill="var(--fg-faint)" opacity="0.5" />
          <rect x="54" y="40" width="34" height="20" rx="3" fill="var(--fg-faint)" opacity="0.5" />
          <ellipse cx="78" cy="56" rx="10" ry="5" fill="var(--c2)" />
        </>
      ),
    },
    { title: 'ECC alignment', draw: <><rect x="20" y="22" width="56" height="44" fill="none" stroke="var(--fg-faint)" /><rect x="24" y="18" width="56" height="44" fill="none" stroke="var(--accent)" strokeDasharray="3 3" /></> },
    {
      title: 'LAB difference',
      draw: (
        <>
          <ellipse cx="62" cy="52" rx="16" ry="9" fill="var(--fg)" opacity="0.8" />
          <circle cx="24" cy="30" r="4" fill="var(--fg)" opacity="0.4" />
          <circle cx="70" cy="22" r="3" fill="var(--fg)" opacity="0.3" />
        </>
      ),
    },
    {
      title: 'Otsu + floor',
      draw: (
        <>
          <ellipse cx="62" cy="52" rx="16" ry="9" fill="var(--fg)" />
          <circle cx="24" cy="30" r="4" fill="var(--fg)" />
        </>
      ),
    },
    { title: 'Morphology', draw: <ellipse cx="62" cy="52" rx="17" ry="10" fill="var(--fg)" /> },
    {
      title: 'Pile selected',
      draw: (
        <>
          <rect x="14" y="30" width="32" height="18" rx="3" fill="none" stroke="var(--c4)" />
          <ellipse cx="62" cy="52" rx="17" ry="10" fill="var(--c2)" fillOpacity="0.35" stroke="var(--c2)" strokeWidth="1.5" />
        </>
      ),
    },
  ]
  return (
    <Frame label="Pile localisation · change detection" source="Illustrative schematic">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {panels.map((panel, i) => (
          <li key={panel.title} className="rounded-lg border border-line bg-bg/40 p-2">
            <svg viewBox="0 0 96 80" className="w-full" aria-hidden>
              {panel.draw}
            </svg>
            <p className="mt-1 text-[0.72rem] text-muted">
              <span className="font-mono text-faint">{i + 1}</span> {panel.title}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-faint">Final step: the region scoring best on area / (1 + distance to the truck’s rear) is kept and outlined on the after image.</p>
    </Frame>
  )
}
