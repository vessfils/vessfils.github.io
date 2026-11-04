import { useEffect } from 'react'
import { site } from '../content/site'

/**
 * Updates the document title and description on client-side navigation.
 * The static equivalents for each route are written by scripts/prerender.mjs,
 * so crawlers and link previews see them without running JavaScript.
 */
export function usePageMeta(title: string | null, description: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — ${site.role}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
