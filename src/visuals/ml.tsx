/* Visuals for the from-scratch ML projects: MLP, DSLR and linear regression.
 * Data files are exported from the repositories (see src/content/data/). */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import mlp from '../content/data/mlp.json'
import dslr from '../content/data/dslr.json'
import { BarList } from './primitives/BarList'
import { Frame, Legend } from './primitives/Frame'
import { LineChart } from './primitives/LineChart'
import { linear, ticks } from './primitives/scale'
import { useWidth } from './primitives/useWidth'

// ── Multilayer perceptron ───────────────────────────────────────────────────

/** Network diagram. Wide layers are drawn with a capped number of nodes plus an ellipsis. */
export function MlpNetwork({ compact = false }: { compact?: boolean }) {
  const layers = [30, 64, 32, 16, 8, 2]
  const shown = (n: number) => Math.min(n, 9)
  const W = 520
  const H = 240
  const x = (i: number) => 40 + (i * (W - 80)) / (layers.length - 1)
  const y = (j: number, n: number) => H / 2 + (j - (n - 1) / 2) * 22

  const svg = (
    <svg viewBox={`0 0 ${W} ${H + (compact ? 0 : 30)}`} className="h-full w-full" role="img" aria-label="Network: 30 inputs, hidden layers of 64, 32, 16 and 8 ReLU units, 2 softmax outputs">
      {layers.slice(0, -1).map((n, i) =>
        Array.from({ length: shown(n) }, (_, a) =>
          Array.from({ length: shown(layers[i + 1]) }, (_, b) => (
            <line key={`${i}-${a}-${b}`} x1={x(i)} y1={y(a, shown(n))} x2={x(i + 1)} y2={y(b, shown(layers[i + 1]))} stroke="var(--fg)" strokeOpacity={0.07} />
          )),
        ),
      )}
      {layers.map((n, i) =>
        Array.from({ length: shown(n) }, (_, j) => {
          const ellipsis = n > 9 && j === 4
          return ellipsis ? (
            <text key={`${i}-${j}`} x={x(i)} y={y(j, shown(n)) + 4} textAnchor="middle" className="fill-faint text-[12px]">⋮</text>
          ) : (
            <circle key={`${i}-${j}`} cx={x(i)} cy={y(j, shown(n))} r={6} fill={i === layers.length - 1 ? 'var(--accent)' : 'var(--surface)'} stroke={i === 0 ? 'var(--fg-faint)' : 'var(--fg-muted)'} strokeWidth={1.4} />
          )
        }),
      )}
      {!compact &&
        layers.map((n, i) => (
          <text key={i} x={x(i)} y={H + 22} textAnchor="middle" className="fill-muted font-mono text-[11px]">
            {n}
          </text>
        ))}
    </svg>
  )
  if (compact) return <div className="h-full p-4">{svg}</div>
  return (
    <Frame label="Architecture" source="srcs/mlp.py (default --layers)">
      {svg}
      <p className="mt-1 text-center text-xs text-faint">input · ReLU · ReLU · ReLU · ReLU · softmax</p>
    </Frame>
  )
}

export function MlpCurves() {
  const m = mlp.main
  return (
    <Frame label={`Training history · layers ${m.layers}`} source="data/historic (repository)">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm text-fg">Loss (cross-entropy + L2)</p>
          <Legend items={[{ label: 'train', color: 'var(--c1)' }, { label: 'test', color: 'var(--c2)', dashed: true }]} />
          <LineChart
            ariaLabel="Train and test loss over iterations"
            xLabel="iteration"
            xStep={m.step}
            series={[
              { name: 'train', color: 'var(--c1)', values: m.trainLoss },
              { name: 'test', color: 'var(--c2)', values: m.testLoss, dashed: true },
            ]}
            yDomain={[0, Math.max(...m.trainLoss, ...m.testLoss)]}
            formatY={(v) => v.toFixed(2)}
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-fg">Accuracy</p>
          <Legend items={[{ label: 'train', color: 'var(--c1)' }, { label: 'test', color: 'var(--c2)', dashed: true }]} />
          <LineChart
            ariaLabel="Train and test accuracy over iterations"
            xLabel="iteration"
            xStep={m.step}
            series={[
              { name: 'train', color: 'var(--c1)', values: m.trainAcc },
              { name: 'test', color: 'var(--c2)', values: m.testAcc, dashed: true },
            ]}
            yDomain={[Math.floor(Math.min(...m.trainAcc, ...m.testAcc) * 10) / 10, 1]}
            formatY={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>
      </div>
    </Frame>
  )
}

export function MlpGrid() {
  const items = [...mlp.runs]
    .sort((a, b) => b.testAcc - a.testAcc)
    .map((r) => ({
      label: `${r.layers} · lr ${r.lr}`,
      value: r.testAcc,
      detail: `${r.iters.toLocaleString('en')} iterations · min test loss ${r.minTestLoss}`,
      highlight: r.layers === '(64, 32, 16, 8)' && r.lr === 0.01,
    }))
  return (
    <Frame label="Configurations compared · final test accuracy" source="data/historic (repository)">
      <BarList items={items} domain={[0.85, 1]} format={(v) => `${(v * 100).toFixed(1)}%`} />
      <p className="mt-4 text-xs text-faint">Highlighted: the default configuration. Axis starts at 85%. One test sample ≈ 0.7 points.</p>
    </Frame>
  )
}

// ── DSLR ────────────────────────────────────────────────────────────────────

const HOUSES = dslr.houses as string[]
const houseColor = (i: number) => `var(--c${i + 1})`

/** Ridgeline-style small multiples: one row per house, so colour is never the only cue. */
export function DslrHist() {
  const features = Object.keys(dslr.hist) as (keyof typeof dslr.hist)[]
  return (
    <Frame label="Score distribution per house" source="dataset_train.csv · 1,600 students">
      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((feature) => {
          const h = dslr.hist[feature]
          const max = Math.max(...HOUSES.flatMap((house) => (h.counts as Record<string, number[]>)[house]))
          return (
            <div key={feature}>
              <p className="mb-2 text-sm text-fg">{feature}</p>
              <div className="space-y-1">
                {HOUSES.map((house, hi) => (
                  <div key={house} className="grid grid-cols-[76px_1fr] items-end gap-2">
                    <span className="text-[0.68rem] text-muted">{house}</span>
                    <div className="flex h-7 items-end gap-px border-b border-line">
                      {(h.counts as Record<string, number[]>)[house].map((c, i) => (
                        <span key={i} className="flex-1 rounded-t-[2px]" style={{ height: `${(c / max) * 100}%`, background: houseColor(hi) }} title={`${house}: ${c}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Frame>
  )
}

function Scatter({
  points,
  xLabel,
  yLabel,
  focus,
  height = 260,
}: {
  points: [string, number, number][]
  xLabel: string
  yLabel: string
  focus: string | null
  height?: number
}) {
  const [ref, width] = useWidth<HTMLDivElement>(320)
  const xs = points.map((p) => p[1])
  const ys = points.map((p) => p[2])
  const M = { l: 44, r: 10, t: 10, b: 30 }
  const x = linear(Math.min(...xs), Math.max(...xs), M.l, width - M.r)
  const y = linear(Math.min(...ys), Math.max(...ys), height - M.b, M.t)
  return (
    <div ref={ref}>
      <svg width={width} height={height} role="img" aria-label={`Scatter plot of ${yLabel} against ${xLabel}`}>
        {ticks(Math.min(...ys), Math.max(...ys), 4).map((t) => (
          <g key={t}>
            <line x1={M.l} x2={width - M.r} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
            <text x={M.l - 6} y={y(t)} dy="0.32em" textAnchor="end" className="fill-faint font-mono text-[9px]">{t}</text>
          </g>
        ))}
        {points.map(([house, px, py], i) => {
          const hi = HOUSES.indexOf(house)
          const dim = focus !== null && focus !== house
          return <circle key={i} cx={x(px)} cy={y(py)} r={2.4} fill={dim ? 'var(--fg-faint)' : houseColor(hi)} opacity={dim ? 0.18 : 0.75} />
        })}
        <text x={width - M.r} y={height - 6} textAnchor="end" className="fill-faint text-[10px]">{xLabel} →</text>
        <text x={M.l} y={M.t - 0} dy="-0.2em" className="fill-faint text-[10px]">↑ {yLabel}</text>
      </svg>
    </div>
  )
}

/** Two scatter plots with a house filter: one house in colour, the others greyed (avoids 4 overlapping hues). */
export function DslrScatter({ compact = false }: { compact?: boolean }) {
  const [focus, setFocus] = useState<string | null>(compact ? null : 'Ravenclaw')
  const correlated = dslr.scatterCorrelated as [string, number, number][]
  const separating = dslr.scatterSeparating as [string, number, number][]

  if (compact) {
    return (
      <div className="h-full p-3">
        <Scatter points={separating} xLabel="Herbology" yLabel="Charms" focus={null} height={220} />
      </div>
    )
  }
  return (
    <Frame label="Feature relationships" source="dataset_train.csv">
      <div role="radiogroup" aria-label="Highlight a house" className="mb-4 flex flex-wrap gap-1.5">
        {[null, ...HOUSES].map((house, i) => (
          <button
            key={house ?? 'all'}
            role="radio"
            aria-checked={focus === house}
            onClick={() => setFocus(house)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${focus === house ? 'border-fg text-fg' : 'border-line text-muted hover:text-fg'}`}
          >
            {house && <span className="size-2 rounded-full" style={{ background: houseColor(i - 1) }} />}
            {house ?? 'All houses'}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-1 text-sm text-fg">Astronomy vs Defense Against the Dark Arts</p>
          <p className="mb-2 text-xs text-muted">r = {dslr.corr.toFixed(2)} — redundant, keep one.</p>
          <Scatter points={correlated} xLabel="Astronomy" yLabel="Defense" focus={focus} />
        </div>
        <div>
          <p className="mb-1 text-sm text-fg">Herbology vs Charms</p>
          <p className="mb-2 text-xs text-muted">Two features already separate most students.</p>
          <Scatter points={separating} xLabel="Herbology" yLabel="Charms" focus={focus} />
        </div>
      </div>
    </Frame>
  )
}

export function DslrOva() {
  return (
    <Frame label="One-vs-all" source="logreg_train.py · logreg_predict.py">
      <div className="grid items-center gap-4 md:grid-cols-[auto_1fr_auto]">
        <div className="rounded-lg border border-line p-3 text-xs text-muted">
          <p className="text-fg">4 standardised features</p>
          <p className="mt-1 font-mono text-[0.7rem]">Charms · Herbology · Divination · History of Magic</p>
        </div>
        <ul className="grid grid-cols-2 gap-2">
          {HOUSES.map((house, i) => (
            <li key={house} className="rounded-lg border border-line p-2.5">
              <p className="flex items-center gap-2 text-xs text-fg">
                <span className="size-2 rounded-full" style={{ background: houseColor(i) }} />
                {house} vs rest
              </p>
              <p className="mt-1 font-mono text-[0.68rem] text-muted">σ(θᵀx) → P({house.slice(0, 1)})</p>
            </li>
          ))}
        </ul>
        <div className="rounded-lg border border-accent/50 bg-accent-soft p-3 text-center text-xs">
          <p className="text-fg">argmax</p>
          <p className="mt-1 text-muted">predicted house</p>
        </div>
      </div>
    </Frame>
  )
}

// ── Linear regression (interactive) ─────────────────────────────────────────

/** The project's data.csv (24 cars) and the parameters saved by train.py in values.txt. */
const CARS: [number, number][] = [
  [240000, 3650], [139800, 3800], [150500, 4400], [185530, 4450], [176000, 5250], [114800, 5350],
  [166800, 5800], [89000, 5990], [144500, 5999], [84000, 6200], [82029, 6390], [63060, 6390],
  [74000, 6600], [97500, 6800], [67000, 6800], [76025, 6900], [48235, 6900], [93000, 6990],
  [60949, 7490], [65674, 7555], [54000, 7990], [68500, 7990], [22899, 7990], [61789, 8290],
]
const KM_MIN = 22899
const KM_MAX = 240000
const SAVED = { theta1: -4656.263513551565, theta0: 8008.3155934045235 }
const norm = (km: number) => (km - KM_MIN) / (KM_MAX - KM_MIN)

/** One batch gradient-descent step on MSE — identical to the loop in srcs/train.py. */
function gradientStep(t1: number, t0: number, lr: number) {
  const n = CARS.length
  let dm = 0
  let dc = 0
  for (const [km, price] of CARS) {
    const error = price - (t1 * norm(km) + t0)
    dm += norm(km) * error
    dc += error
  }
  return { t1: t1 - lr * (-2 / n) * dm, t0: t0 - lr * (-2 / n) * dc }
}

const STEPS_PER_FRAME = 5
const MAX_EPOCHS = 2000

const rmse = (t1: number, t0: number) => Math.sqrt(CARS.reduce((s, [km, p]) => s + (p - (t1 * norm(km) + t0)) ** 2, 0) / CARS.length)

export function LinregDemo({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion()
  const [lr, setLr] = useState(0.1)
  const [state, setState] = useState({ t1: 0, t0: 0, epoch: 0 })
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState<number[]>([rmse(0, 0)])
  // The animation loop reads the latest parameters from a ref, then publishes them to React state.
  const current = useRef(state)
  current.current = state

  useEffect(() => {
    if (!running) return
    let frame = 0
    const tick = () => {
      let { t1, t0, epoch } = current.current
      for (let k = 0; k < STEPS_PER_FRAME; k++) ({ t1, t0 } = gradientStep(t1, t0, lr))
      epoch += STEPS_PER_FRAME
      current.current = { t1, t0, epoch }
      setState(current.current)
      setHistory((h) => [...h, rmse(t1, t0)])
      if (epoch >= MAX_EPOCHS) setRunning(false)
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running, lr])

  const reset = () => {
    setRunning(false)
    setState({ t1: 0, t0: 0, epoch: 0 })
    setHistory([rmse(0, 0)])
  }

  const [ref, width] = useWidth<HTMLDivElement>()
  const height = compact ? 230 : 280
  const M = { l: 52, r: 12, t: 12, b: 32 }
  const x = useMemo(() => linear(0, 250000, M.l, width - M.r), [width, M.l, M.r])
  const y = useMemo(() => linear(0, 9000, height - M.b, M.t), [height, M.b, M.t])
  const line = (t1: number, t0: number) => `M${x(KM_MIN)},${y(t1 * norm(KM_MIN) + t0)}L${x(KM_MAX)},${y(t1 * norm(KM_MAX) + t0)}`

  const plot = (
    <div ref={ref}>
      <svg width={width} height={height} role="img" aria-label="Car price against mileage with the regression line">
        {ticks(0, 9000, 3).map((t) => (
          <g key={t}>
            <line x1={M.l} x2={width - M.r} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
            <text x={M.l - 6} y={y(t)} dy="0.32em" textAnchor="end" className="fill-faint font-mono text-[10px]">€{(t / 1000).toFixed(0)}k</text>
          </g>
        ))}
        {ticks(0, 250000, width < 420 ? 2 : 5).map((t) => (
          <text key={t} x={x(t)} y={height - 12} textAnchor="middle" className="fill-faint font-mono text-[10px]">{t / 1000}k km</text>
        ))}
        {compact ? (
          <path d={line(SAVED.theta1, SAVED.theta0)} stroke="var(--c1)" strokeWidth={2} />
        ) : (
          <>
            <path d={line(SAVED.theta1, SAVED.theta0)} stroke="var(--fg-faint)" strokeWidth={1.5} strokeDasharray="4 4" />
            <path d={line(state.t1, state.t0)} stroke="var(--c1)" strokeWidth={2} />
          </>
        )}
        {CARS.map(([km, price]) => (
          <circle key={km} cx={x(km)} cy={y(price)} r={4} fill="var(--c2)" stroke="var(--surface)" strokeWidth={1.5} />
        ))}
      </svg>
    </div>
  )

  if (compact) return <div className="flex h-full items-center p-3">{plot}</div>

  return (
    <Frame label="Gradient descent, live" source="Runs in your browser · data.csv">
      <div className="mb-3">
        <Legend
          items={[
            { label: 'Training data (24 cars)', color: 'var(--c2)' },
            { label: 'Current line', color: 'var(--c1)' },
            { label: 'Saved model (values.txt)', color: 'var(--fg-faint)', dashed: true },
          ]}
        />
      </div>
      {plot}
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-3">
          <label className="block text-xs text-muted">
            Learning rate <span className="font-mono text-fg">{lr}</span>
            <input
              type="range"
              min={0.01}
              max={0.9}
              step={0.01}
              value={lr}
              onChange={(e) => setLr(Number(e.target.value))}
              className="mt-1 block w-full accent-[var(--accent)]"
            />
          </label>
          <dl className="grid grid-cols-2 gap-2 font-mono text-xs sm:grid-cols-4">
            {[
              ['epoch', state.epoch.toLocaleString('en')],
              ['θ₁', state.t1.toFixed(0)],
              ['θ₀', state.t0.toFixed(0)],
              ['RMSE', `€${rmse(state.t1, state.t0).toFixed(0)}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-md border border-line px-2.5 py-1.5">
                <dt className="text-faint">{k}</dt>
                <dd className="text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => (state.epoch >= MAX_EPOCHS ? (reset(), setRunning(true)) : setRunning((r) => !r))}
            className="min-h-10 rounded-full bg-fg px-4 text-sm text-bg hover:bg-accent hover:text-accent-fg"
          >
            {running ? 'Pause' : state.epoch ? 'Resume' : 'Train'}
          </button>
          <button
            onClick={() => {
              setRunning(false)
              const next = gradientStep(state.t1, state.t0, lr)
              setState({ ...next, epoch: state.epoch + 1 })
              setHistory((h) => [...h, rmse(next.t1, next.t0)])
            }}
            className="min-h-10 rounded-full border border-line px-4 text-sm hover:border-fg/40"
          >
            Step
          </button>
          <button onClick={reset} className="min-h-10 rounded-full border border-line px-4 text-sm hover:border-fg/40">
            Reset
          </button>
        </div>
      </div>
      {history.length > 2 && (
        <div className="mt-5">
          <p className="mb-1 text-xs text-muted">RMSE during training</p>
          <LineChart
            ariaLabel="Root mean squared error over training updates"
            xLabel="update"
            height={140}
            series={[{ name: 'RMSE', color: 'var(--c1)', values: history }]}
            yDomain={[0, Math.max(...history)]}
            formatY={(v) => `€${(v / 1000).toFixed(1)}k`}
          />
        </div>
      )}
      {reduce && <p className="mt-3 text-xs text-faint">Reduced motion is on: use “Step” to advance one update at a time.</p>}
    </Frame>
  )
}
