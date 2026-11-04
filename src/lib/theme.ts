import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function readInitialTheme(): Theme {
  // index.html sets data-theme before first paint; React simply adopts it.
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/** Current colour theme plus a toggle that persists the choice when storage is available. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0c0e' : '#f7f7f5')
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* private mode or blocked storage: the toggle still works for this visit */
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
