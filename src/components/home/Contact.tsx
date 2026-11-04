import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { site } from '../../content/site'
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

  const links = [
    { label: 'GitHub', href: site.github, handle: 'vessfils' },
    { label: 'LinkedIn', href: site.linkedin, handle: 'jean-francois-campagnolle' },
    ...(site.resume ? [{ label: 'Résumé', href: site.resume, handle: 'PDF' }] : []),
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

        <Reveal delay={0.15} className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between bg-bg p-5 transition-colors hover:bg-raised">
              <span>
                <span className="eyebrow">{link.label}</span>
                <span className="mt-1 block truncate text-sm text-fg">{link.handle}</span>
              </span>
              <ArrowUpRight size={16} className="text-faint transition-colors group-hover:text-fg" />
            </a>
          ))}
          {site.location && (
            <div className="bg-bg p-5">
              <span className="eyebrow">Based in</span>
              <span className="mt-1 block text-sm text-fg">{site.location}</span>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
