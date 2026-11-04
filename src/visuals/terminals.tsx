/* Minishell and ft_irc: recorded sessions (src/content/data/transcripts.json) and pipeline diagrams. */
import transcripts from '../content/data/transcripts.json'
import { Flow } from './primitives/Flow'
import { Frame } from './primitives/Frame'
import { Terminal } from './primitives/Terminal'

export function MinishellTerminal({ compact = false }: { compact?: boolean }) {
  const lines = compact ? transcripts.minishell.slice(0, 7) : transcripts.minishell
  const body = (
    <Terminal title="./minishell">
      {lines.map((line, i) =>
        line.startsWith('->') ? (
          <div key={i}>
            <span className="text-[#5fb8b0]">-&gt;</span>
            {line.slice(2)}
          </div>
        ) : (
          <div key={i} className="text-white/60">
            {line}
          </div>
        ),
      )}
    </Terminal>
  )
  if (compact) return <div className="flex h-full items-center p-4">{body}</div>
  return (
    <Frame label="Recorded session" source="Built from the repository" flush>
      <div className="p-3 sm:p-4">{body}</div>
    </Frame>
  )
}

export function IrcTerminal({ compact = false }: { compact?: boolean }) {
  const lines = compact ? transcripts.irc.slice(8, 20) : transcripts.irc
  const body = (
    <Terminal title="./ircserv 6697 ••••  ·  two clients">
      {lines.map((line, i) => {
        const [who, dir, ...rest] = line.split(' ')
        const outgoing = dir === '>'
        const error = / 4\d\d /.test(line)
        return (
          <div key={i} className="grid grid-cols-[3.2rem_1rem_1fr] gap-1">
            <span className={who === 'alice' ? 'text-[#5fb8b0]' : 'text-[#e39a5a]'}>{who}</span>
            <span className="text-white/35">{outgoing ? '→' : '←'}</span>
            <span className={error ? 'text-[#ef8a9c]' : outgoing ? 'text-white' : 'text-white/60'}>{rest.join(' ')}</span>
          </div>
        )
      })}
    </Terminal>
  )
  if (compact) return <div className="flex h-full items-center p-4">{body}</div>
  return (
    <Frame label="Recorded session" source="Built from the repository" flush>
      <div className="p-3 sm:p-4">{body}</div>
    </Frame>
  )
}

export function MinishellPipeline() {
  return (
    <Frame label="From input line to processes" source="srcs/">
      <Flow
        steps={[
          { title: 'readline', detail: 'Prompt, history, Ctrl-C / Ctrl-\\ handling.', meta: 'main.c' },
          { title: 'Tokenize', detail: 'Words and operators, each fragment tagged with its quoting.', meta: 'token/' },
          { title: 'Expand & check', detail: '$VAR and $? expansion, quote removal, syntax errors.', meta: 'parsing/', focus: true },
          { title: 'Build tree', detail: 'Commands, pipes and redirections as a tree.', meta: 'tree/' },
          { title: 'Execute', detail: 'Builtins in-process; others via fork, pipe, dup2, execve.', meta: 'builtins/' },
        ]}
      />
    </Frame>
  )
}

export function IrcArchitecture() {
  return (
    <Frame label="Request path" source="srcs/">
      <Flow
        steps={[
          { title: 'poll()', detail: 'One call watches the listening socket and every client.', meta: 'Server.cpp' },
          { title: 'recv()', detail: 'Bytes from a ready client go into the server context.', meta: 'User.cpp' },
          { title: 'CommandParser', detail: 'Prefix, command, params, trailing → a packet object.', meta: 'parser/', focus: true },
          { title: 'Command handler', detail: 'Checks permissions; throws a typed exception on failure.', meta: 'packet/received/' },
          { title: 'Replies', detail: 'Numeric error to the sender, or a broadcast to the channel.', meta: 'sendToChannel()' },
        ]}
      />
    </Frame>
  )
}
