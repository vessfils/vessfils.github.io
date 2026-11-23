import { site } from '../content/site'

/** True when the visitor's browser has Italian as its first language. */
function prefersItalian(): boolean {
  if (typeof navigator === 'undefined') return false
  const first = navigator.languages?.[0] ?? navigator.language ?? ''
  return first.toLowerCase().startsWith('it')
}

/** Path of the CV to offer: the Italy version for Italian-language browsers, the default one otherwise. */
export function preferredResume(): string | null {
  return (prefersItalian() && site.resumeIt) || site.resume
}
