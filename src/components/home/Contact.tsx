import { ArrowUpRight, Check, Copy, Download, FileText, MapPin } from 'lucide-react'
import { useState, type ComponentType } from 'react'
import { site } from '../../content/site'
import { GitHubIcon, LinkedInIcon } from '../ui/BrandIcons'
import { Reveal } from '../ui/Reveal'

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  }

  const links: { label: string; href: string; handle: string; Icon: ComponentType<{ size?: number }>; download?: boolean }[] = [
    { label: 'GitHub', href: site.github, handle: 'github.com/vessfils', Icon: GitHubIcon },
    { label: 'LinkedIn', href: site.linkedin, handle: 'Jean-François Campagnolle', Icon: LinkedInIcon },
    ...(site.resume ? [{ label: 'Résumé', href: site.resume, handle: 'PDF · English', Icon: FileText, download: true }] : []),
  ]

  return (
    <section id="contact" className="scroll-mt-20 border-t border-line" aria-labelledby="contact-heading">
      <div className="container-page py-24 sm:py-36">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-heading" className="mt-4 max-w-3xl text-[clamp(2.2rem,6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            Let’s build something meaningful.
          </h2>
          <p className="mt-6 max-w-lg text-muted">
            I am looking for machine learning, computer vision and software engineering roles. Email is the best way to reach me.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-6 text-base font-medium text-bg transition-colors hover:bg-accent hover:text-accent-fg"
          >
            {site.email}
            <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button
            onClick={copyEmail}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-5 text-sm text-muted hover:text-fg"
            aria-live="polite"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy address'}
          </button>
        </Reveal>

        <Reveal delay={0.15} className="mt-16 grid max-w-3xl gap-3 sm:grid-cols-2">
          {links.map(({ label, href, handle, Icon, download }) => (
            <a
              key={label}
              href={href}
              {...(download ? { download: true } : { target: '_blank', rel: 'noreferrer' })}
              className="group flex items-center gap-4 rounded-xl border border-line p-4 transition-colors hover:border-line-strong hover:bg-raised"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-fg/[0.06] text-fg transition-colors group-hover:bg-accent group-hover:text-accent-fg">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-fg">{label}</span>
                <span className="block truncate text-xs text-muted">{handle}</span>
              </span>
              {download ? (
                <Download size={16} className="shrink-0 text-faint transition-colors group-hover:text-fg" />
              ) : (
                <ArrowUpRight size={16} className="shrink-0 text-faint transition-colors group-hover:text-fg" />
              )}
            </a>
          ))}
          {site.location && (
            <div className="flex items-center gap-4 rounded-xl border border-line p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-fg/[0.06] text-fg">
                <MapPin size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">Based in</span>
                <span className="block text-xs text-muted">{site.location}</span>
              </span>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
