import { ButtonLink } from '../components/ui/Button'
import { usePageMeta } from '../lib/seo'

export function NotFound() {
  usePageMeta('Page not found', 'This page does not exist.')
  return (
    <div className="container-page flex min-h-[70svh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">Nothing here.</h1>
      <p className="mt-4 text-muted">The page may have moved. The project archive lists everything.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink to="/work">Browse work</ButtonLink>
        <ButtonLink to="/" variant="ghost">
          Home
        </ButtonLink>
      </div>
    </div>
  )
}
