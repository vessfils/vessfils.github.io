import { ArrowRight, ArrowUpRight, Play } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { featuredProjects, projects } from '../../content/projects'
import type { Project } from '../../content/types'
import { ProjectCover } from '../ProjectCover'
import { Reveal } from '../ui/Reveal'
import { Tag } from '../ui/Tag'

/**
 * Editorial list of featured projects. The first (flagship) project spans the full width;
 * the following ones alternate cover-left / cover-right so the page never becomes a grid of identical cards.
 */
export function SelectedWork() {
  const [flagship, ...rest] = featuredProjects
  return (
    <section id="work" className="container-page scroll-mt-20 py-24 sm:py-32" aria-labelledby="work-heading">
      <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 id="work-heading" className="mt-3 max-w-2xl text-3xl font-medium tracking-[-0.03em] sm:text-5xl">
            From industrial vision research to a kernel that boots.
          </h2>
        </div>
        <Link to="/work" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          All {projects.length} projects <ArrowRight size={15} />
        </Link>
      </Reveal>

      <FlagshipRow project={flagship} />

      <div className="mt-24 space-y-24 sm:space-y-32">
        {rest.map((project, i) => (
          <FeatureRow key={project.slug} project={project} reversed={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}

function FlagshipRow({ project }: { project: Project }) {
  return (
    <Reveal as="article">
      <Link to={`/work/${project.slug}`} className="group block">
        <TiltCover className="aspect-[16/10] sm:aspect-[21/9]">
          <ProjectCover project={project} />
          <span className="absolute bottom-5 left-5 rounded-full border border-line bg-bg/80 px-3 py-1 font-mono text-[0.68rem] text-fg backdrop-blur">
            {project.context} · {project.period}
          </span>
        </TiltCover>
      </Link>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <ProjectHeading project={project} large />
        <ProjectBody project={project} />
      </div>
    </Reveal>
  )
}

function FeatureRow({ project, reversed }: { project: Project; reversed: boolean }) {
  return (
    <Reveal as="article" className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-12`}>
      <Link to={`/work/${project.slug}`} className={`group block lg:col-span-7 ${reversed ? 'lg:order-2' : ''}`} aria-label={`${project.title} case study`}>
        <TiltCover className="aspect-[16/10]">
          <ProjectCover project={project} />
          {project.interactive && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bg/85 px-2.5 py-1 font-mono text-[0.65rem] text-fg backdrop-blur">
              <Play size={11} /> interactive demo inside
            </span>
          )}
        </TiltCover>
      </Link>
      <div className={`lg:col-span-5 ${reversed ? 'lg:order-1' : ''}`}>
        <ProjectHeading project={project} />
        <div className="mt-5">
          <ProjectBody project={project} />
        </div>
      </div>
    </Reveal>
  )
}

function ProjectHeading({ project, large }: { project: Project; large?: boolean }) {
  return (
    <div>
      <p className="eyebrow">
        <span className="text-accent">{project.index}</span> · {project.categories.join(' · ')}
      </p>
      <h3 className={`mt-3 font-medium tracking-[-0.03em] ${large ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>
        <Link to={`/work/${project.slug}`} className="link-underline">
          {project.title}
        </Link>
      </h3>
      <p className="mt-3 text-lg text-muted">{project.tagline}</p>
    </div>
  )
}

function ProjectBody({ project }: { project: Project }) {
  return (
    <div>
      <p className="leading-relaxed text-muted">{project.summary}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 6).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
        <Link to={`/work/${project.slug}`} className="group inline-flex items-center gap-1.5 font-medium text-fg">
          Read the case study <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        {project.source.public && (
          <a href={project.source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-fg">
            Source <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </div>
  )
}

/**
 * Cover panel that follows the pointer by a few pixels and scales slightly on hover.
 * Movement is disabled for touch input and when reduced motion is requested.
 */
function TiltCover({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const x = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 20 })
  const y = useSpring(useTransform(py, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 20 })

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - box.left) / box.width - 0.5)
    py.set((event.clientY - box.top) / box.height - 0.5)
  }

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
      className={`relative overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-500 group-hover:border-line-strong ${className}`}
    >
      <motion.div style={{ x, y }} className="absolute inset-[-8px] transition-transform duration-700 ease-out group-hover:scale-[1.02]">
        {children}
      </motion.div>
    </div>
  )
}
