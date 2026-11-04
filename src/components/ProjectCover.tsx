import type { Project } from '../content/types'
import { Visual } from '../visuals/registry'
import { Img } from './ui/Img'

/** The visual that represents a project on cards and in the case-study hero: an image or a cover visual. */
export function ProjectCover({ project, eager }: { project: Project; eager?: boolean }) {
  if ('image' in project.cover) {
    const { src, alt, fit = 'cover' } = project.cover.image
    if (fit === 'contain') {
      // Wide figures (e.g. matplotlib output with a white background) are shown whole, on white.
      return (
        <div className="flex h-full w-full items-center justify-center bg-white p-3 sm:p-5">
          <Img src={src} alt={alt} eager={eager} sizes="(min-width: 1024px) 1200px, 100vw" className="max-h-full w-full object-contain" />
        </div>
      )
    }
    return <Img src={src} alt={alt} eager={eager} sizes="(min-width: 1024px) 700px, 100vw" className="h-full w-full object-cover object-top" />
  }
  return <Visual id={project.cover.visual} variant="cover" />
}
