import { motion, useReducedMotion } from 'motion/react'

export interface FlowStep {
  title: string
  detail?: string
  /** Small mono annotation, e.g. a file name or a shape. */
  meta?: string
  /** Emphasise this step (accent border). */
  focus?: boolean
}

/**
 * A left-to-right pipeline on wide screens that stacks vertically on phones.
 * Used for most architecture and process diagrams on the site.
 */
export function Flow({ steps, columns }: { steps: FlowStep[]; columns?: number }) {
  const reduce = useReducedMotion()
  const cols = columns ?? Math.min(steps.length, 5)

  return (
    <ol
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${cols > 4 ? 150 : 180}px), 1fr))` }}
    >
      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.07 }}
          className={`relative flex flex-col rounded-lg border p-3.5 ${
            step.focus ? 'border-accent/50 bg-accent-soft' : 'border-line bg-bg/40'
          }`}
        >
          <span className="mb-2 font-mono text-[0.68rem] text-faint">{String(i + 1).padStart(2, '0')}</span>
          <span className="text-sm font-medium leading-snug text-fg">{step.title}</span>
          {step.detail && <span className="mt-1.5 text-xs leading-relaxed text-muted">{step.detail}</span>}
          {step.meta && <span className="mt-auto pt-3 font-mono text-[0.68rem] text-faint">{step.meta}</span>}
        </motion.li>
      ))}
    </ol>
  )
}
