import { AlertTriangle, Info, Maximize2 } from 'lucide-react'
import { useState } from 'react'
import type { Block, MediaRef } from '../../content/types'
import { Inline } from '../../lib/inline'
import { Visual } from '../../visuals/registry'
import { Img } from '../ui/Img'
import { Lightbox } from '../ui/Lightbox'
import { Reveal } from '../ui/Reveal'
import { CodeBlock } from './CodeBlock'

/** Renders a list of content blocks. Wide blocks may break out of the reading column. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => (
        <Reveal key={i}>
          <BlockView block={block} />
        </Reveal>
      ))}
    </div>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="prose-cs">
          {block.title && <h3 className="mb-3 text-lg font-medium tracking-tight">{block.title}</h3>}
          {block.body.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
        </div>
      )

    case 'list':
      return (
        <div className="prose-cs">
          {block.title && <h3 className="mb-1 text-lg font-medium tracking-tight">{block.title}</h3>}
          {block.intro && (
            <p>
              <Inline text={block.intro} />
            </p>
          )}
          <ul>
            {block.items.map((item, i) => (
              <li key={i}>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        </div>
      )

    case 'highlight':
      return (
        <article className="rounded-xl border border-line p-5 sm:p-6">
          <h3 className="text-lg font-medium tracking-tight">{block.title}</h3>
          <div className="prose-cs mt-3">
            {block.body.map((p, i) => (
              <p key={i}>
                <Inline text={p} />
              </p>
            ))}
          </div>
          {block.code && (
            <div className="mt-5">
              <CodeBlock {...block.code} />
            </div>
          )}
        </article>
      )

    case 'code':
      return <CodeBlock lang={block.lang} file={block.file} code={block.code} caption={block.caption} />

    case 'visual':
      return (
        <figure>
          <Visual id={block.id} />
          {block.caption && <figcaption className="mt-3 text-sm text-faint">{block.caption}</figcaption>}
        </figure>
      )

    case 'figure':
      return <Figure images={block.images} caption={block.caption} layout={block.layout} />

    case 'metrics':
      return (
        <div>
          <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {block.items.map((m) => (
              <div key={m.label} className="bg-bg p-5">
                <dt className="eyebrow">{m.label}</dt>
                <dd className="mt-2 text-4xl font-medium tracking-tight tabular-nums">{m.value}</dd>
                {m.note && <dd className="mt-1 text-sm text-muted">{m.note}</dd>}
              </div>
            ))}
          </dl>
          {block.footnote && <p className="mt-3 text-sm text-faint">{block.footnote}</p>}
        </div>
      )

    case 'table':
      return (
        <figure className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-mono text-xs font-normal text-faint">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={`border-b border-line last:border-0 ${block.highlightRow === i ? 'bg-accent-soft' : ''}`}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-3 align-top ${j === 0 ? 'whitespace-nowrap font-medium' : 'text-muted'}`}>
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && <figcaption className="border-t border-line px-4 py-2 text-sm text-faint">{block.caption}</figcaption>}
        </figure>
      )

    case 'callout': {
      const Icon = block.tone === 'caveat' ? AlertTriangle : Info
      return (
        <aside
          className={`flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${
            block.tone === 'caveat' ? 'border-[color:var(--c2)]/40 bg-[color:var(--c2)]/[0.06]' : 'border-line bg-fg/[0.025]'
          }`}
        >
          <Icon size={17} className={`mt-0.5 shrink-0 ${block.tone === 'caveat' ? 'text-[color:var(--c2)]' : 'text-faint'}`} aria-hidden />
          <div>
            {block.title && <p className="mb-1 font-medium text-fg">{block.title}</p>}
            <p className="text-muted">
              <Inline text={block.body} />
            </p>
          </div>
        </aside>
      )
    }
  }
}

const gridClass = {
  single: 'grid-cols-1',
  'grid-2': 'grid-cols-1 sm:grid-cols-2',
  'grid-3': 'grid-cols-1 sm:grid-cols-3',
  'grid-4': 'grid-cols-2 lg:grid-cols-4',
}

/** Image group with click-to-expand. Each thumbnail is a button so it works with the keyboard. */
function Figure({ images, caption, layout = 'single' }: { images: MediaRef[]; caption?: string; layout?: keyof typeof gridClass }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <figure>
      <div className={`grid gap-3 ${gridClass[layout]}`}>
        {images.map((image, i) => (
          <button
            key={image.src}
            onClick={() => setOpen(i)}
            className="group relative overflow-hidden rounded-lg border border-line bg-sunken"
            aria-label={`Enlarge image: ${image.alt}`}
          >
            <Img
              src={image.src}
              alt={image.alt}
              sizes={layout === 'single' ? '(min-width: 1024px) 960px, 100vw' : '(min-width: 1024px) 480px, 50vw'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Maximize2 size={14} />
            </span>
          </button>
        ))}
      </div>
      {caption && <figcaption className="mt-3 text-sm text-faint">{caption}</figcaption>}
      <Lightbox images={images} index={open} onChange={setOpen} caption={caption} />
    </figure>
  )
}
