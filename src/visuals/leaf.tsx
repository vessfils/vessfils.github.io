/* Leaffliction visuals — all numbers come from src/content/data/leaf.json,
 * produced by evaluating the saved checkpoint on the repository's test split. */
import { useState } from 'react'
import data from '../content/data/leaf.json'
import { Img } from '../components/ui/Img'
import { BarList } from './primitives/BarList'
import { Flow } from './primitives/Flow'
import { Frame } from './primitives/Frame'

/** "Apple_Black_rot" → "Apple · black rot" */
const pretty = (name: string) => {
  const [plant, ...rest] = name.split('_')
  return `${plant} · ${rest.join(' ').toLowerCase()}`
}

export function LeafPipeline() {
  return (
    <Frame label="Pipeline" source="Repository">
      <Flow
        steps={[
          { title: 'Distribution', detail: 'Count images per class and plant.', meta: 'Distribution.py' },
          { title: 'Split 80 / 10 / 10', detail: 'Per class, before any augmentation.', meta: 'preprocessing.py' },
          { title: 'Balance by augmentation', detail: 'Top every training class up to 1,312 images.', meta: 'Albumentations' },
          { title: 'Train CNN', detail: 'Adam, early stopping on validation accuracy.', meta: 'Train.py', focus: true },
          { title: 'Predict', detail: 'Top class and probabilities for one image.', meta: 'Predict.py' },
        ]}
      />
    </Frame>
  )
}

export function LeafDistribution() {
  const items = Object.entries(data.raw)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label: pretty(label), value }))
  return (
    <Frame label="Images per class (raw)" source="Dataset">
      <BarList items={items} domain={[0, 1800]} format={(v) => v.toLocaleString('en')} />
    </Frame>
  )
}

export function LeafCnn() {
  const layers = [
    { name: 'Input', shape: '3 × 128 × 128', h: 92 },
    { name: 'Conv 3×3 · ReLU · Pool', shape: '32 × 64 × 64', h: 80 },
    { name: 'Conv 3×3 · ReLU · Pool', shape: '64 × 32 × 32', h: 64 },
    { name: 'Conv 3×3 · ReLU · Pool', shape: '64 × 16 × 16', h: 48 },
    { name: 'Flatten · Dense · ReLU', shape: '16,384 → 512', h: 110, dense: true },
    { name: 'Dense', shape: '512 → 8', h: 34, dense: true },
  ]
  return (
    <Frame label="Network" source="srcs/Train.py">
      <div className="flex items-end gap-2 overflow-x-auto pb-2 sm:gap-3">
        {layers.map((layer, i) => (
          <div key={i} className="flex min-w-[96px] flex-1 flex-col items-center">
            <div
              className={`w-full rounded-md border ${layer.dense ? 'border-accent/40 bg-accent-soft' : 'border-line-strong bg-fg/[0.04]'}`}
              style={{ height: layer.h }}
            />
            <p className="mt-2 text-center text-[0.72rem] leading-tight text-fg">{layer.name}</p>
            <p className="mt-0.5 text-center font-mono text-[0.66rem] text-faint">{layer.shape}</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/** Confusion matrix as a heat map; hovering (or focusing) a cell names the pair and count. */
export function LeafConfusion() {
  const { classes, cm } = data
  const [cell, setCell] = useState<[number, number] | null>(null)
  const rowTotals = cm.map((row) => row.reduce((a, b) => a + b, 0))
  const short = (name: string) => name.replace('Apple_', 'A·').replace('Grape_', 'G·').replace('_', ' ')

  return (
    <Frame label="Confusion matrix · test split" source="leaf_cnn.pth, 723 images">
      <div className="overflow-x-auto">
        <table className="mx-auto border-separate border-spacing-[2px] text-[0.7rem]">
          <caption className="sr-only">Rows are true classes, columns are predicted classes.</caption>
          <thead>
            <tr>
              <th className="p-1 text-left font-normal text-faint">true ↓ / predicted →</th>
              {classes.map((c) => (
                <th key={c} scope="col" className="h-16 w-9 p-0 align-bottom font-normal text-muted">
                  <span className="inline-block origin-bottom-left translate-x-4 -rotate-45 whitespace-nowrap">{short(c)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cm.map((row, i) => (
              <tr key={classes[i]}>
                <th scope="row" className="whitespace-nowrap pr-2 text-right font-normal text-muted">
                  {short(classes[i])}
                </th>
                {row.map((count, j) => {
                  const share = count / rowTotals[i]
                  const diagonal = i === j
                  return (
                    <td
                      key={j}
                      tabIndex={count > 0 ? 0 : -1}
                      onPointerEnter={() => setCell([i, j])}
                      onFocus={() => setCell([i, j])}
                      onPointerLeave={() => setCell(null)}
                      onBlur={() => setCell(null)}
                      className="size-9 rounded-[4px] text-center font-mono"
                      style={{
                        background: count === 0 ? 'var(--grid)' : diagonal ? `color-mix(in oklab, var(--c1) ${20 + share * 80}%, transparent)` : `color-mix(in oklab, var(--c2) ${30 + share * 400}%, transparent)`,
                        color: diagonal && share > 0.5 ? 'var(--accent-fg)' : 'var(--fg)',
                      }}
                    >
                      {count > 0 ? count : ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 min-h-5 text-center text-xs text-muted" aria-live="polite">
        {cell
          ? `${cm[cell[0]][cell[1]]} × ${pretty(classes[cell[0]])} predicted as ${pretty(classes[cell[1]])}`
          : 'Diagonal: correct predictions (teal). Off-diagonal: errors (orange). Hover a cell for details.'}
      </p>
    </Frame>
  )
}

/** Real test images with the saved model's top-3 probabilities. */
export function LeafPredictions({ compact = false }: { compact?: boolean }) {
  const samples = compact ? data.samples.slice(0, 4) : data.samples
  if (compact) {
    return (
      <div className="grid h-full grid-cols-2 gap-1.5 p-1.5">
        {samples.map((s) => (
          <div key={s.img} className="relative overflow-hidden rounded-md">
            <Img src={`leaffliction/${s.img}`} alt={`Test leaf: ${pretty(s.true)}`} sizes="200px" className="h-full w-full object-cover" />
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[0.6rem] text-white">
              {pretty(s.top[0][0] as string)} · {((s.top[0][1] as number) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    )
  }
  return (
    <Frame label="Predictions on test images" source="leaf_cnn.pth">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {samples.map((s) => {
          const correct = s.top[0][0] === s.true
          return (
            <li key={s.img} className="overflow-hidden rounded-lg border border-line">
              <Img src={`leaffliction/${s.img}`} alt={`Test leaf labelled ${pretty(s.true)}`} sizes="(min-width: 1024px) 220px, 45vw" className="aspect-square w-full object-cover" />
              <div className="space-y-1 p-2.5">
                <p className="text-[0.7rem] text-faint">
                  true: <span className="text-muted">{pretty(s.true)}</span>
                </p>
                {s.top.map(([name, p], k) => (
                  <div key={name as string} className="flex items-center gap-2 text-[0.68rem]">
                    <span className={`w-24 truncate ${k === 0 ? 'text-fg' : 'text-faint'}`}>{pretty(name as string)}</span>
                    <span className="h-1.5 flex-1 rounded-full bg-fg/[0.06]">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${(p as number) * 100}%`, background: k === 0 ? (correct ? 'var(--c1)' : 'var(--c2)') : 'var(--fg-faint)' }}
                      />
                    </span>
                    <span className="w-9 text-right font-mono text-muted">{((p as number) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}
