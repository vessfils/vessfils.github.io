import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  lang: string
  code: string
  file?: string
  caption?: string
}

/**
 * Code excerpt with a file label and copy button. No syntax-highlighting library:
 * excerpts are short and a monochrome block keeps the bundle small and the page calm.
 */
export function CodeBlock({ lang, code, file, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable (e.g. insecure context): silently ignore */
    }
  }

  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-sunken">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <span className="truncate font-mono text-[0.7rem] text-faint">{file ?? lang}</span>
        <button onClick={copy} className="grid size-7 shrink-0 place-items-center rounded text-faint hover:text-fg" aria-label="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[0.78rem] leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
      {caption && <figcaption className="border-t border-line px-3 py-2 text-xs text-faint">{caption}</figcaption>}
    </figure>
  )
}
