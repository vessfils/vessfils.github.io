import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { ProjectCard } from '../components/home/ProjectCard'
import { Reveal } from '../components/ui/Reveal'
import { allCategories, projects } from '../content/projects'
import type { Category } from '../content/types'
import { usePageMeta } from '../lib/seo'

/** Archive of every project with a category filter. */
export function Work() {
  usePageMeta('Work', 'Every project with a detailed case study: computer vision, deep learning, reinforcement learning, systems, web and infrastructure.')
  const [filter, setFilter] = useState<Category | 'All'>('All')

  const visible = useMemo(() => (filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter))), [filter])
  const count = (c: Category) => projects.filter((p) => p.categories.includes(c)).length

  return (
    <div className="container-page pb-28 pt-32 sm:pt-40">
      <Reveal>
        <p className="eyebrow">Work</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-[-0.035em] sm:text-6xl">Every project, with its case study.</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          The professional computer vision work, the École 42 machine learning track and the systems, web and infrastructure projects
          behind it. Results are re-run from the repositories wherever possible.
        </p>
      </Reveal>

      <div role="radiogroup" aria-label="Filter by category" className="mt-12 flex flex-wrap gap-2">
        {(['All', ...allCategories] as const).map((c) => (
          <button
            key={c}
            role="radio"
            aria-checked={filter === c}
            onClick={() => setFilter(c)}
            className={`min-h-9 rounded-full border px-3.5 text-sm transition-colors ${
              filter === c ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-line-strong hover:text-fg'
            }`}
          >
            {c}
            <span className="ml-1.5 font-mono text-[0.7rem] opacity-60">{c === 'All' ? projects.length : count(c)}</span>
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <ProjectCard project={project} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
