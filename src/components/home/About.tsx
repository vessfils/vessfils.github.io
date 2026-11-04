import { about } from '../../content/site'
import { Reveal } from '../ui/Reveal'

export function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-line" aria-labelledby="about-heading">
      <div className="container-page grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">About</p>
          <h2 id="about-heading" className="mt-3 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
            {about.title}
          </h2>
          <dl className="mt-10 space-y-5">
            {about.focus.map((f) => (
              <div key={f.label}>
                <dt className="eyebrow">{f.label}</dt>
                <dd className="mt-1 text-sm text-muted">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="space-y-5 text-[1.0625rem] leading-relaxed text-muted">
          {about.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-fg' : ''}>
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
