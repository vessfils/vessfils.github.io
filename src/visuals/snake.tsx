/* Learn2Slither visuals.
 *  - Gameplay images are genuine captures: the saved model played the game and the project's own
 *    Pygame renderer drew every frame (headless), see README › "Regenerating project media".
 *  - Statistics come from src/content/data/snake.json (200 greedy evaluation games). */
import { Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import data from '../content/data/snake.json'
import { Img } from '../components/ui/Img'
import { Flow } from './primitives/Flow'
import { Frame, Legend } from './primitives/Frame'

const [W, H] = data.grid as [number, number]
const GAMEPLAY = '/media/learn2slither/gameplay.webp'
const STILL = 'learn2slither/late'

/** Animated capture of a full game, with a pause control. Reduced motion shows a still frame instead. */
function Gameplay({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const showStill = reduce || paused
  return (
    <div className={`relative ${className}`}>
      {showStill ? (
        <Img src={STILL} alt="Trained agent late in a game, score 33" sizes="400px" className="h-full w-full" />
      ) : (
        <img
          src={GAMEPLAY}
          width={400}
          height={400}
          alt="Animated capture of the trained agent playing a full game until it reaches length 40"
          className="h-full w-full [image-rendering:pixelated]"
          loading="lazy"
          decoding="async"
        />
      )}
      {!reduce && (
        <button
          onClick={(event) => {
            event.preventDefault()
            setPaused((p) => !p)
          }}
          className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
          aria-label={paused ? 'Play animation' : 'Pause animation'}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      )}
    </div>
  )
}

export function SnakeGameplay() {
  const stills = [
    { src: 'learn2slither/start', alt: 'Start of a game: snake of length 3', label: 'Start' },
    { src: 'learn2slither/mid', alt: 'Middle of the game: the snake has grown', label: 'Middle' },
    { src: STILL, alt: 'Late game: long snake winding through the board', label: 'Late game' },
  ]
  return (
    <Frame label="Gameplay · trained agent" source="Real capture, project’s Pygame renderer">
      <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
        <Gameplay className="mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-md" />
        <div>
          <p className="text-sm text-muted">
            One complete game played greedily (ε = 0) by the saved model, from length 3 to 40. Every frame was drawn by the project’s own
            renderer and saved as it played.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {stills.map((s) => (
              <figure key={s.src}>
                <Img src={s.src} alt={s.alt} sizes="120px" className="aspect-square w-full rounded" />
                <figcaption className="mt-1 text-center text-[0.68rem] text-faint">{s.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-4">
            <Legend
              items={[
                { label: 'Head (cyan) / body (blue)', color: '#0064ff' },
                { label: 'Green apple: grow', color: '#00c800' },
                { label: 'Red apple: shrink', color: '#c80000' },
              ]}
            />
          </div>
        </div>
      </div>
    </Frame>
  )
}

/** Card cover: the same real capture, filling the panel. */
export function SnakeCover() {
  return (
    <div className="flex h-full items-center justify-center bg-black p-4">
      <Gameplay className="aspect-square h-full" />
    </div>
  )
}

export function SnakeLoop() {
  return (
    <Frame label="Training loop" source="srcs2/agent.py">
      <Flow
        steps={[
          { title: 'Observe', detail: '15-value state from the head’s point of view.', meta: 'get_state()' },
          { title: 'Act', detail: 'ε-greedy over Q(s, ·): straight, right or left.', meta: 'get_action()' },
          { title: 'Reward', detail: 'Apple, death, or a small shaped step penalty.', meta: 'play_step()' },
          { title: 'Remember', detail: 'Store (s, a, r, s′, done) in a 100k replay buffer.', meta: 'remember()' },
          { title: 'Learn', detail: 'Bellman targets on the step, then on a 1,024 batch after each game.', meta: 'train_step()', focus: true },
        ]}
      />
    </Frame>
  )
}

export function SnakeState() {
  // A fixed example position illustrating line-of-sight visibility from the head.
  const head = { x: 4, y: 5 }
  const size = 22
  const groups = [
    { name: 'Danger distance', count: 3, detail: 'Normalised distance to wall or body: straight, right, left.' },
    { name: 'Heading', count: 4, detail: 'One-hot: left, right, up, down.' },
    { name: 'Green apple visible', count: 4, detail: 'In line of sight: left, right, up, down.' },
    { name: 'Red apple visible', count: 4, detail: 'In line of sight: left, right, up, down.' },
  ]
  return (
    <Frame label="State and network" source="Code version f7db27e">
      <div className="grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
        <svg viewBox={`0 0 ${W * size} ${H * size}`} className="mx-auto w-48" role="img" aria-label="Example board: the agent only sees along the row and column of its head">
          {Array.from({ length: W * H }, (_, k) => (
            <rect key={k} x={(k % W) * size + 2} y={Math.floor(k / W) * size + 2} width={size - 4} height={size - 4} rx={3} fill="var(--grid)" />
          ))}
          <rect x={0} y={head.y * size + 7} width={W * size} height={8} fill="var(--accent)" opacity={0.15} />
          <rect x={head.x * size + 7} y={0} width={8} height={H * size} fill="var(--accent)" opacity={0.15} />
          {[[3, 5], [2, 5]].map(([x, y]) => (
            <rect key={`${x}${y}`} x={x * size + 2} y={y * size + 2} width={size - 4} height={size - 4} rx={3} fill="var(--fg-muted)" />
          ))}
          <rect x={head.x * size + 2} y={head.y * size + 2} width={size - 4} height={size - 4} rx={3} fill="var(--fg)" />
          <circle cx={4 * size + size / 2} cy={1 * size + size / 2} r={6} fill="var(--c1)" />
          <circle cx={8 * size + size / 2} cy={7 * size + size / 2} r={6} fill="var(--c1)" />
          <circle cx={8 * size + size / 2} cy={5 * size + size / 2} r={6} fill="var(--c4)" />
        </svg>

        <ul className="space-y-2.5">
          {groups.map((g) => (
            <li key={g.name} className="flex gap-3">
              <span className="mt-0.5 inline-flex gap-0.5" aria-hidden>
                {Array.from({ length: g.count }, (_, i) => (
                  <span key={i} className="block h-4 w-1.5 rounded-sm bg-accent/70" />
                ))}
              </span>
              <span>
                <span className="text-sm text-fg">
                  {g.name} <span className="font-mono text-xs text-faint">×{g.count}</span>
                </span>
                <span className="block text-xs text-muted">{g.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-line p-3 text-center font-mono text-xs text-muted">
          <p>15</p>
          <p className="text-faint">↓</p>
          <p>64 · ReLU</p>
          <p className="text-faint">↓</p>
          <p>64 · ReLU</p>
          <p className="text-faint">↓</p>
          <p className="text-fg">3 Q-values</p>
          <p className="mt-1 text-[0.65rem] text-faint">straight · right · left</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-faint">In this schematic example, the green apple above the head and the red apple to its right are visible; the one below-right is not.</p>
    </Frame>
  )
}

export function SnakeHist() {
  const { edges, trained, untrained } = data
  const max = Math.max(...trained.hist, ...untrained.hist)
  return (
    <Frame label={`Maximum length per game · ${data.episodes} games each`} source="Evaluation re-run">
      <div className="mb-4">
        <Legend
          items={[
            { label: `Trained (mean ${trained.mean})`, color: 'var(--c1)' },
            { label: `Untrained (mean ${untrained.mean})`, color: 'var(--c2)' },
          ]}
        />
      </div>
      <div className="flex h-44 items-end gap-1" role="img" aria-label={`Histogram: trained agent mean ${trained.mean}, untrained mean ${untrained.mean}`}>
        {trained.hist.map((t, i) => (
          <div key={i} className="group relative flex h-full flex-1 items-end justify-center gap-[2px]">
            <span className="w-1/2 rounded-t-[3px]" style={{ height: `${(untrained.hist[i] / max) * 100}%`, background: 'var(--c2)' }} />
            <span className="w-1/2 rounded-t-[3px]" style={{ height: `${(t / max) * 100}%`, background: 'var(--c1)' }} />
            <span className="pointer-events-none absolute -top-8 z-10 hidden whitespace-nowrap rounded border border-line bg-raised px-2 py-1 font-mono text-[0.65rem] group-hover:block">
              {edges[i]}–{edges[i + 1] - 1}: {t} trained · {untrained.hist[i]} untrained
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[0.65rem] text-faint">
        <span>{edges[0]}</span>
        <span>max length reached</span>
        <span>{edges[edges.length - 1]}</span>
      </div>
    </Frame>
  )
}
