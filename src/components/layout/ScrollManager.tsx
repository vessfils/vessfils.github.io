import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** How long to wait for a lazily loaded page to render the section a URL points to. */
const MAX_WAIT_MS = 2000

/**
 * Router-aware scrolling:
 *  - a URL with a hash (e.g. /#about or /work/matcha#results) scrolls to that section
 *    as soon as it exists — pages are lazy-loaded, so it may appear a little later;
 *  - any other navigation starts at the top of the new page.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    const started = performance.now()
    let frame = 0

    const tryScroll = () => {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
      else if (performance.now() - started < MAX_WAIT_MS) frame = requestAnimationFrame(tryScroll)
    }
    frame = requestAnimationFrame(tryScroll)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
