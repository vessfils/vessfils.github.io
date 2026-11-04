import { Fragment, type ReactNode } from 'react'

/**
 * Renders the tiny subset of inline Markdown used in content files:
 * **bold**, *italic* and `code`. Kept deliberately small — content
 * stays readable as plain strings and needs no Markdown dependency.
 */
export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const token = match[0]
    if (token.startsWith('**')) parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>)
    else if (token.startsWith('`')) parts.push(<code key={match.index}>{token.slice(1, -1)}</code>)
    else parts.push(<em key={match.index}>{token.slice(1, -1)}</em>)
    last = match.index + token.length
  }
  if (last < text.length) parts.push(text.slice(last))

  return <Fragment>{parts}</Fragment>
}
