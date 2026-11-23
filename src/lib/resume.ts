import { site } from '../content/site'

export interface Resume {
  href: string
  /** Language of the CV, written in that language. */
  language: 'English' | 'Italiano'
}

const english = (): Resume | null => (site.resume ? { href: site.resume, language: 'English' } : null)
const italian = (): Resume | null => (site.resumeIt ? { href: site.resumeIt, language: 'Italiano' } : null)

/** True when the visitor's browser lists Italian as one of its preferred languages. */
function prefersItalian(): boolean {
  if (typeof navigator === 'undefined') return false
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  // Only the first language counts: an English speaker who also reads Italian keeps the English CV.
  return (languages[0] ?? '').toLowerCase().startsWith('it')
}

/** The CV to offer by default: Italian for Italian-language browsers, English otherwise. */
export function preferredResume(): Resume | null {
  return (prefersItalian() && italian()) || english()
}

/** Every available CV, the preferred one first. */
export function allResumes(): Resume[] {
  const preferred = preferredResume()
  const others = [english(), italian()].filter((r): r is Resume => r !== null && r.href !== preferred?.href)
  return preferred ? [preferred, ...others] : others
}
