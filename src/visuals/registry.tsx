/*
 * Maps the visual ids used in content/projects.ts to React components.
 *
 *  - `full`  renders inside a case study.
 *  - `cover` (optional) is a compact version for project cards and the case-study hero.
 *    When absent, the full component is used.
 *
 * Every visual is lazy-loaded: its code and data (some JSON files are ~90 KB)
 * are only downloaded when a page actually shows it.
 *
 * To add a visual: create the component in this folder, add its id to VisualId
 * in content/types.ts, then register it below.
 */
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import type { VisualId } from '../content/types'

type Loader = () => Promise<Record<string, unknown>>

/** Lazily loads one named export from a visuals module. */
function from(load: Loader, name: string, props: Record<string, unknown> = {}): LazyExoticComponent<ComponentType> {
  return lazy(async () => {
    const Component = (await load())[name] as ComponentType<Record<string, unknown>>
    return { default: () => <Component {...props} /> }
  })
}

const picture: Loader = () => import('./picture')
const leaf: Loader = () => import('./leaf')
const snake: Loader = () => import('./snake')
const systems: Loader = () => import('./systems')
const ml: Loader = () => import('./ml')
const terminals: Loader = () => import('./terminals')
const cub3d: Loader = () => import('./cub3d')

interface VisualEntry {
  full: ComponentType
  cover?: ComponentType
}

export const visuals: Record<VisualId, VisualEntry> = {
  'picture-pipeline': { full: from(picture, 'PicturePipeline'), cover: from(picture, 'PictureCover') },
  'picture-workflows': { full: from(picture, 'PictureWorkflows') },
  'picture-triplet': { full: from(picture, 'PictureTriplet') },
  'picture-ablation': { full: from(picture, 'PictureAblation') },
  'picture-augment': { full: from(picture, 'PictureAugment') },
  'picture-change': { full: from(picture, 'PictureChange') },

  'leaf-pipeline': { full: from(leaf, 'LeafPipeline') },
  'leaf-cnn': { full: from(leaf, 'LeafCnn') },
  'leaf-confusion': { full: from(leaf, 'LeafConfusion') },
  'leaf-predictions': { full: from(leaf, 'LeafPredictions'), cover: from(leaf, 'LeafPredictions', { compact: true }) },
  'leaf-distribution': { full: from(leaf, 'LeafDistribution') },

  'snake-loop': { full: from(snake, 'SnakeLoop') },
  'snake-state': { full: from(snake, 'SnakeState') },
  'snake-gameplay': { full: from(snake, 'SnakeGameplay'), cover: from(snake, 'SnakeCover') },
  'snake-hist': { full: from(snake, 'SnakeHist') },

  'kfs-boot': { full: from(systems, 'KfsBoot') },
  'kfs-memory': { full: from(systems, 'KfsMemory') },
  'kfs-interrupts': { full: from(systems, 'KfsInterrupts') },

  'matcha-architecture': { full: from(systems, 'MatchaArchitecture'), cover: from(systems, 'MatchaCover') },
  'matcha-schema': { full: from(systems, 'MatchaSchema') },

  'mlp-grid': { full: from(ml, 'MlpGrid') },

  'dslr-hist': { full: from(ml, 'DslrHist') },
  'dslr-scatter': { full: from(ml, 'DslrScatter'), cover: from(ml, 'DslrScatter', { compact: true }) },
  'dslr-ova': { full: from(ml, 'DslrOva') },

  'linreg-demo': { full: from(ml, 'LinregDemo'), cover: from(ml, 'LinregDemo', { compact: true }) },

  'cloud-architecture': { full: from(systems, 'CloudArchitecture'), cover: from(systems, 'CloudArchitecture', { compact: true }) },
  'cloud-pipeline': { full: from(systems, 'CloudPipeline') },

  'minishell-pipeline': { full: from(terminals, 'MinishellPipeline') },
  'minishell-terminal': { full: from(terminals, 'MinishellTerminal'), cover: from(terminals, 'MinishellTerminal', { compact: true }) },
  'irc-architecture': { full: from(terminals, 'IrcArchitecture') },
  'irc-terminal': { full: from(terminals, 'IrcTerminal'), cover: from(terminals, 'IrcTerminal', { compact: true }) },

  'cub3d-gameplay': { full: from(cub3d, 'Cub3dGameplay'), cover: from(cub3d, 'Cub3dCover') },
  'cub3d-pipeline': { full: from(cub3d, 'Cub3dPipeline') },
}

/** Renders a visual by id, in full or cover form, with a quiet placeholder while it loads. */
export function Visual({ id, variant = 'full' }: { id: VisualId; variant?: 'full' | 'cover' }) {
  const entry = visuals[id]
  const Component = variant === 'cover' ? (entry.cover ?? entry.full) : entry.full
  const placeholder =
    variant === 'cover' ? <div className="h-full w-full animate-pulse bg-fg/[0.03]" /> : <div className="h-48 animate-pulse rounded-xl border border-line bg-fg/[0.02]" />
  const failed = <div className="grid h-full min-h-24 place-items-center text-xs text-faint">This figure could not be loaded.</div>
  return (
    <ErrorBoundary fallback={failed}>
      <Suspense fallback={placeholder}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}
