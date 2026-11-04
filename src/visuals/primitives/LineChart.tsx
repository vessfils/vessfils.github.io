import { useState } from 'react'
import { linear, ticks } from './scale'
import { useWidth } from './useWidth'

export interface LineSeries {
  name: string
  color: string
  values: number[]
  dashed?: boolean
}

interface LineChartProps {
  series: LineSeries[]
  /** x value of index i is i * xStep (e.g. iterations logged every 10 steps). */
  xStep?: number
  xLabel: string
  yDomain?: [number, number]
  formatY?: (v: number) => string
  height?: number
  ariaLabel: string
}

const M = { top: 12, right: 16, bottom: 34, left: 48 }

/** Minimal multi-series line chart with a hover crosshair and value tooltip. One y-axis only. */
export function LineChart({ series, xStep = 1, xLabel, yDomain, formatY = String, height = 240, ariaLabel }: LineChartProps) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const n = Math.max(...series.map((s) => s.values.length))
  const all = series.flatMap((s) => s.values)
  const [y0, y1] = yDomain ?? [Math.min(...all), Math.max(...all)]
  const x = linear(0, (n - 1) * xStep, M.left, width - M.right)
  const y = linear(y0, y1, height - M.bottom, M.top)
  const yTicks = ticks(y0, y1, 4)
  const xTicks = ticks(0, (n - 1) * xStep, width < 480 ? 3 : 5)

  const path = (values: number[]) => values.map((v, i) => `${i ? 'L' : 'M'}${x(i * xStep).toFixed(1)},${y(v).toFixed(1)}`).join('')

  const onMove = (event: React.PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const px = event.clientX - box.left + M.left
    const index = Math.round(((px - M.left) / (width - M.left - M.right)) * (n - 1))
    setHover(Math.max(0, Math.min(n - 1, index)))
  }

  return (
    <div ref={ref} className="relative">
      <svg width={width} height={height} role="img" aria-label={ariaLabel} className="block overflow-visible">
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
            <text x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-faint font-mono text-[10px]">
              {formatY(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={height - M.bottom + 16} textAnchor="middle" className="fill-faint font-mono text-[10px]">
            {t.toLocaleString('en')}
          </text>
        ))}
        <text x={width - M.right} y={height - 4} textAnchor="end" className="fill-faint text-[10px]">
          {xLabel}
        </text>

        {series.map((s) => (
          <path
            key={s.name}
            d={path(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={s.dashed ? '4 4' : undefined}
          />
        ))}

        {hover !== null && (
          <g>
            <line x1={x(hover * xStep)} x2={x(hover * xStep)} y1={M.top} y2={height - M.bottom} stroke="var(--line-strong)" />
            {series.map((s) =>
              s.values[hover] === undefined ? null : (
                <circle key={s.name} cx={x(hover * xStep)} cy={y(s.values[hover])} r={4} fill={s.color} stroke="var(--surface)" strokeWidth={2} />
              ),
            )}
          </g>
        )}

        <rect
          x={M.left}
          y={M.top}
          width={Math.max(0, width - M.left - M.right)}
          height={height - M.top - M.bottom}
          fill="transparent"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        />
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-md border border-line bg-raised px-3 py-2 text-xs shadow-lg"
          style={{ left: Math.min(x(hover * xStep) + 12, width - 170) }}
        >
          <div className="mb-1 font-mono text-faint">
            {xLabel} {(hover * xStep).toLocaleString('en')}
          </div>
          {series.map((s) =>
            s.values[hover] === undefined ? null : (
              <div key={s.name} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="size-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-mono text-fg">{formatY(s.values[hover])}</span>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
