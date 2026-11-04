import type { ReactNode } from 'react'

interface FrameProps {
  /** Short label shown top-left, e.g. "Pipeline". */
  label: string
  /** Provenance shown top-right, e.g. "Illustrative" or "Data: repository". */
  source?: string
  children: ReactNode
  className?: string
  /** Remove inner padding for edge-to-edge content (images, canvases). */
  flush?: boolean
}

/** Common panel around every chart, diagram and demo, so provenance is always stated. */
export function Frame({ label, source, children, className = '', flush }: FrameProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-surface ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
        <span className="eyebrow">{label}</span>
        {source && <span className="font-mono text-[0.68rem] text-faint">{source}</span>}
      </div>
      <div className={flush ? '' : 'p-4 sm:p-6'}>{children}</div>
    </div>
  )
}

/** Legend row: a coloured swatch beside each series name (identity is never colour-only). */
export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <svg width="18" height="8" aria-hidden>
            <line
              x1="1"
              y1="4"
              x2="17"
              y2="4"
              stroke={item.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={item.dashed ? '3 3' : undefined}
            />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  )
}
