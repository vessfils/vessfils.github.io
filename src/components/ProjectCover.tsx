import type { Project } from '../content/types'
import { Visual } from '../visuals/registry'
import { Img } from './ui/Img'

/** The visual that represents a project on cards and in the case-study hero: an image or a cover visual. */
export function ProjectCover({ project, eager }: { project: Project; eager?: boolean }) {
  if ('image' in project.cover) {
    return (
      <Img
        src={project.cover.image.src}
        alt={project.cover.image.alt}
        eager={eager}
        sizes="(min-width: 1024px) 700px, 100vw"
        className="h-full w-full object-cover object-top"
      />
    )
  }
  return <Visual id={project.cover.visual} variant="cover" />
}
