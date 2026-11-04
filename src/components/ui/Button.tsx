import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

const styles: Record<Variant, string> = {
  primary:
    'bg-fg text-bg hover:bg-accent hover:text-accent-fg border border-transparent',
  ghost: 'border border-line-strong text-fg hover:border-fg/40 hover:bg-fg/[0.04]',
}

const base =
  'group inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-300'

interface ButtonLinkProps {
  to: string
  children: ReactNode
  variant?: Variant
  external?: boolean
  download?: boolean
}

/** A link styled as a button. Internal paths use the router; anything else is a plain anchor. */
export function ButtonLink({ to, children, variant = 'primary', external, download }: ButtonLinkProps) {
  const className = `${base} ${styles[variant]}`
  if (external || download || to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('#')) {
    return (
      <a
        href={to}
        className={className}
        download={download || undefined}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}
