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

        <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          {links.map(({ label, href, handle, Icon, download }) => (
            <a
              key={label}
              href={href}
              title={handle}
              {...(download ? { download: true } : { target: '_blank', rel: 'noreferrer' })}
              className="group inline-flex min-h-10 items-center gap-2 text-muted transition-colors hover:text-fg"
            >
              <Icon size={16} />
              <span className="link-underline">{label}</span>
              {download ? <Download size={13} className="text-faint group-hover:text-fg" /> : <ArrowUpRight size={13} className="text-faint group-hover:text-fg" />}
            </a>
          ))}
        </Reveal>

        {site.location && (
          <Reveal delay={0.2}>
            <p className="mt-10 inline-flex items-center gap-2 text-xs text-faint">
              <MapPin size={13} aria-hidden /> {site.location}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
