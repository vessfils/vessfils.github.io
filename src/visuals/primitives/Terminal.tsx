import type { ReactNode } from 'react'

/** Window chrome around real recorded terminal output. Text stays selectable and readable by screen readers. */
export function Terminal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-[#0c0d0f] text-[#d7d9de]">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[0.7rem] text-white/45">{title}</span>
      </div>
      <pre className="max-h-[420px] overflow-auto p-4 font-mono text-[0.78rem] leading-relaxed">{children}</pre>
    </div>
  )
}
