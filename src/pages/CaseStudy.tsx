import { ArrowLeft, ArrowRight, ArrowUpRight, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Blocks } from '../components/case/Blocks'
import { ProjectCard } from '../components/home/ProjectCard'
import { ProjectCover } from '../components/ProjectCover'
import { Reveal } from '../components/ui/Reveal'
import { Tag } from '../components/ui/Tag'
import { projectBySlug, projects } from '../content/projects'
import type { CaseSectionKey } from '../content/types'
import { usePageMeta } from '../lib/seo'
import { NotFound } from './NotFound'

/** Order and headings of case-study sections. Sections missing from a project are skipped. */
const SECTIONS: { key: CaseSectionKey; title: string }[] = [
  { key: 'context', title: 'Context & problem' },
  { key: 'approach', title: 'Technical approach' },
  { key: 'architecture', title: 'Architecture' },
  { key: 'highlights', title: 'Implementation highlights' },
  { key: 'visuals', title: 'Visual demonstration' },
  { key: 'results', title: 'Results' },
  { key: 'challenges', title: 'Engineering challenges' },
  { key: 'lessons', title: 'What it shows' },
]

export function CaseStudy() {
  const { slug = '' } = useParams()
  const project = projectBySlug(slug)
  usePageMeta(project?.title ?? 'Not found', project?.summary ?? '')

  const sections = project ? SECTIONS.filter((s) => project.sections[s.key]?.length) : []
  const active = useActiveSection(sections.map((s) => s.key))

  if (!project) return <NotFound />

  const position = projects.indexOf(project)
  const next = projects[(position + 1) % projects.length]
  const related = project.related.map(projectBySlug).filter((p) => p !== undefined)

  return (
    <article className="pb-24 pt-28 sm:pt-32">
      {/* ── Hero ── */}
      <header className="container-page">
        <Link to="/work" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <ArrowLeft size={15} /> All work
        </Link>

        <Reveal className="mt-8">
          <p className="eyebrow">
            {project.index} · {project.categories.join(' · ')}
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-[-0.03em] sm:text-6xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted sm:text-xl">{project.tagline}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Context', project.context],
            ['Period', project.period],
            ['Role', project.role],
            ['Status', project.status],
          ].map(([label, value]) => (
            <div key={label} className="bg-bg p-4">
              <p className="eyebrow">{label}</p>
              <p className="mt-1.5 text-sm text-fg">{value}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          {project.source.public ? (
            <a href={project.source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-fg link-underline">
              Source on GitHub <ArrowUpRight size={14} />
            </a>
          ) : (
            <p className="inline-flex items-center gap-1.5 text-xs text-faint">
              <Lock size={13} /> {project.source.note}
            </p>
          )}
        </Reveal>

        <Reveal delay={0.2} className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-surface sm:aspect-[21/9]">
          <ProjectCover project={project} eager />
        </Reveal>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {project.facts.map((f) => (
            <div key={f.label} className="border-l border-line pl-4">
              <dt className="eyebrow">{f.label}</dt>
              <dd className="mt-1 text-sm text-muted">{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ── Body ── */}
      <div className="container-page mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Sections" className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 border-l border-line">
            {sections.map((s, i) => (
              <li key={s.key}>
                <a
                  href={`#${s.key}`}
                  className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors ${
                    active === s.key ? 'border-accent text-fg' : 'border-transparent text-faint hover:text-muted'
                  }`}
                >
                  <span className="mr-2 font-mono text-[0.68rem]">{String.fromCharCode(65 + i)}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 max-w-[860px] space-y-20">
          {sections.map((s, i) => (
            <section key={s.key} id={s.key} className="scroll-mt-28">
              <Reveal>
                <p className="eyebrow">{String.fromCharCode(65 + i)}</p>
                <h2 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">{s.title}</h2>
              </Reveal>
              <div className="mt-8">
                <Blocks blocks={project.sections[s.key]!} />
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ── Related & next ── */}
      {related.length > 0 && (
        <section className="container-page mt-28" aria-labelledby="related-heading">
          <h2 id="related-heading" className="eyebrow mb-6">
            Related work
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} compact />
            ))}
          </div>
        </section>
      )}

      <div className="container-page mt-16">
        <Link to={`/work/${next.slug}`} className="group flex items-center justify-between border-t border-line pt-8">
          <span>
            <span className="eyebrow">Next project</span>
            <span className="mt-2 block text-2xl font-medium tracking-tight sm:text-3xl">{next.title}</span>
          </span>
          <ArrowRight className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg" />
        </Link>
      </div>
    </article>
  )
}

/** Returns the id of the section currently nearest the top of the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)
  const key = ids.join(',')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    key.split(',').forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [key])

  return active
}
