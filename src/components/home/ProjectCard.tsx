import { ArrowUpRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../../content/types'
import { ProjectCover } from '../ProjectCover'
import { Tag } from '../ui/Tag'

/** Compact project card used in the archive and "related work". */
export function ProjectCard({ project, compact }: { project: Project; compact?: boolean }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-300 hover:border-line-strong"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-sunken">
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <ProjectCover project={project} />
        </div>
        {project.interactive && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bg/85 px-2 py-0.5 font-mono text-[0.62rem] text-fg backdrop-blur">
            <Play size={10} /> interactive
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">
              {project.index} · {project.categories[0]}
            </p>
            <h3 className="mt-1.5 text-lg font-medium tracking-tight">{project.title}</h3>
          </div>
          <ArrowUpRight size={17} className="mt-1 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{compact ? project.tagline : project.summary}</p>
        {!compact && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {project.stack.slice(0, 4).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

