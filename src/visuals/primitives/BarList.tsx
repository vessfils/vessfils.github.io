import { useState } from 'react'

export interface BarItem {
  label: string
  value: number
  /** Optional secondary text shown on hover, e.g. the configuration behind the bar. */
  detail?: string
  highlight?: boolean
}

interface BarListProps {
  items: BarItem[]
  domain: [number, number]
  format: (v: number) => string
  /** Signed bars grow left or right from zero (diverging). */
  diverging?: boolean
}

/**
 * Horizontal bars with the value written at the end of each bar.
 * Labels sit above bars so long names never get truncated on phones.
 */
export function BarList({ items, domain, format, diverging }: BarListProps) {
  const [active, setActive] = useState<number | null>(null)
  const [d0, d1] = domain
  const toPct = (v: number) => ((v - d0) / (d1 - d0)) * 100
  const zero = diverging ? toPct(0) : 0

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const end = toPct(item.value)
        const left = Math.min(zero, end)
        const width = Math.abs(end - zero)
        return (
          <li
            key={item.label}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            className="group"
          >
            <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
              <span className={item.highlight ? 'text-fg' : 'text-muted'}>{item.label}</span>
              <span className="font-mono text-fg">{format(item.value)}</span>
            </div>
            <div className="relative h-2.5 rounded-full bg-fg/[0.05]">
              {diverging && <span className="absolute inset-y-[-3px] w-px bg-line-strong" style={{ left: `${zero}%` }} />}
              <span
                className="absolute inset-y-0 rounded-full transition-opacity"
                style={{
                  left: `${left}%`,
                  width: `${Math.max(width, 0.6)}%`,
                  background: item.highlight ? 'var(--c1)' : 'var(--fg-faint)',
                  opacity: active === null || active === i ? 1 : 0.45,
                }}
              />
            </div>
            {item.detail && <p className="mt-1 text-[0.7rem] text-faint">{item.detail}</p>}
          </li>
        )
      })}
    </ul>
  )
}
