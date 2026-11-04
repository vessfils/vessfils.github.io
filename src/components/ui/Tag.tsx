import type { ReactNode } from 'react'

/** Small monospace label used for technologies and categories. */
export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'accent' }) {
  const palette =
    tone === 'accent' ? 'border-accent/30 bg-accent-soft text-accent' : 'border-line text-muted bg-transparent'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] leading-5 ${palette}`}>
      {children}
    </span>
  )
}
