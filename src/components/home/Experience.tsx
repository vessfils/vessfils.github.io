import { Award } from 'lucide-react'
import { education, experience, type ExperienceItem } from '../../content/site'
import { Reveal } from '../ui/Reveal'

const kindLabel: Record<ExperienceItem['kind'], string> = {
  engineering: 'Engineering',
  education: 'Education',
  venture: 'Venture',
  finance: 'Finance',
}

/** Vertical timeline. Engineering entries get the accent dot so the current direction reads at a glance. */
export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 border-t border-line" aria-labelledby="experience-heading">
      <div className="container-page py-24 sm:py-32">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2 id="experience-heading" className="mt-3 max-w-xl text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
            A path from finance to engineering.
          </h2>
        </Reveal>

        <ol className="relative mt-14 border-l border-line">
          {experience.map((item, i) => (
            <Reveal as="li" key={item.org + item.role} delay={i * 0.04} className="relative pb-12 pl-8 last:pb-0 sm:pl-12">
              <span
                className={`absolute -left-[5px] top-2 size-[9px] rounded-full ring-4 ring-bg ${
                  item.kind === 'engineering' ? 'bg-accent' : item.kind === 'education' ? 'bg-fg' : 'bg-faint'
                }`}
                aria-hidden
              />
              <div className="grid gap-2 lg:grid-cols-[200px_1fr] lg:gap-10">
                <div>
                  <p className="font-mono text-xs text-muted">{item.period}</p>
                  <p className="mt-1 eyebrow">{kindLabel[item.kind]}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium tracking-tight">{item.role}</h3>
                  <p className="text-sm text-muted">
                    {item.org} · {item.place}
                  </p>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">{item.summary}</p>
                  {item.points && (
                    <ul className="mt-3 max-w-2xl space-y-1.5 text-sm text-muted">
                      {item.points.map((p) => (
                        <li key={p} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:h-px before:w-2 before:bg-accent">
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.award && (
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-fg">
                      <Award size={14} className="text-accent" aria-hidden /> {item.award}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-14 grid gap-2 border-t border-line pt-8 lg:grid-cols-[200px_1fr] lg:gap-10">
          <p className="eyebrow">Earlier education</p>
          <ul className="space-y-1 text-sm text-muted">
            {education.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
