/** A raster image produced by scripts/optimize-media.mjs (key = path in media-src without extension). */
export interface MediaRef {
  src: string
  alt: string
  caption?: string
}

/** Custom React visuals (diagrams, charts, demos) are referenced by id and resolved in src/components/registry.tsx. */
export type VisualId =
  | 'picture-pipeline'
  | 'picture-workflows'
  | 'picture-triplet'
  | 'picture-ablation'
  | 'picture-augment'
  | 'picture-change'
  | 'leaf-pipeline'
  | 'leaf-cnn'
  | 'leaf-confusion'
  | 'leaf-predictions'
  | 'leaf-distribution'
  | 'snake-loop'
  | 'snake-state'
  | 'snake-gameplay'
  | 'snake-hist'
  | 'kfs-boot'
  | 'kfs-memory'
  | 'kfs-interrupts'
  | 'matcha-architecture'
  | 'matcha-schema'
  | 'mlp-network'
  | 'mlp-curves'
  | 'mlp-grid'
  | 'dslr-hist'
  | 'dslr-scatter'
  | 'dslr-ova'
  | 'linreg-demo'
  | 'cloud-architecture'
  | 'cloud-pipeline'
  | 'minishell-pipeline'
  | 'minishell-terminal'
  | 'irc-architecture'
  | 'irc-terminal'

export type Block =
  | { type: 'text'; title?: string; body: string[] }
  | { type: 'list'; title?: string; intro?: string; items: string[] }
  | { type: 'figure'; images: MediaRef[]; caption?: string; layout?: 'single' | 'grid-2' | 'grid-3' | 'grid-4' }
  | { type: 'visual'; id: VisualId; caption?: string; wide?: boolean }
  | { type: 'metrics'; items: { value: string; label: string; note?: string }[]; footnote?: string }
  | { type: 'code'; lang: string; file?: string; code: string; caption?: string }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string; highlightRow?: number }
  | { type: 'callout'; tone: 'note' | 'caveat'; title?: string; body: string }
  | { type: 'highlight'; title: string; body: string[]; code?: { lang: string; code: string; file?: string } }

export type CaseSectionKey =
  | 'context'
  | 'approach'
  | 'architecture'
  | 'highlights'
  | 'visuals'
  | 'results'
  | 'challenges'
  | 'lessons'

export type Category =
  | 'Computer Vision'
  | 'Deep Learning'
  | 'Reinforcement Learning'
  | 'Machine Learning'
  | 'Systems'
  | 'Full-Stack'
  | 'Infrastructure'
  | 'Networking'
  | 'Graphics'

export interface Project {
  slug: string
  index: string
  title: string
  tagline: string
  summary: string
  categories: Category[]
  context: 'Professional' | 'École 42' | 'École 42 · Team of 2' | 'École 42 · Team project'
  period: string
  role: string
  status: 'Complete' | 'Prototype' | 'Research in progress'
  stack: string[]
  featured: boolean
  /** True when the case study contains a live demo or an explorable chart (shown as a badge on cards). */
  interactive?: boolean
  /** Cover visual for cards and case-study hero. */
  cover: { visual: VisualId } | { image: MediaRef }
  source: { public: true; url: string } | { public: false; note: string }
  facts: { label: string; value: string }[]
  sections: Partial<Record<CaseSectionKey, Block[]>>
  related: string[]
}
