import { skills } from '../../content/site'
import { Reveal } from '../ui/Reveal'

/** Technologies grouped by what they are used for. No proficiency bars — the projects are the evidence. */
export function Skills() {
  return (
    <section className="border-t border-line" aria-labelledby="skills-heading">
      <div className="container-page py-24 sm:py-32">
        <Reveal>
          <p className="eyebrow">Technical expertise</p>
          <h2 id="skills-heading" className="mt-3 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
            Tools, grouped by what they are for.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.05} className="bg-bg p-6 sm:p-8">
              <h3 className="text-lg font-medium tracking-tight">{group.group}</h3>
              <p className="mt-1 text-xs text-faint">{group.note}</p>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
