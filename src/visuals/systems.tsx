/* Diagrams for the systems / web / infrastructure projects (KFS, Matcha, Cloud-1).
 * Each one is derived from the repository: linker script, migrations, playbook, compose file. */
import { Flow } from './primitives/Flow'
import { Frame } from './primitives/Frame'

// ── KFS ─────────────────────────────────────────────────────────────────────

export function KfsBoot() {
  return (
    <Frame label="Boot sequence" source="start.asm · main.c">
      <Flow
        steps={[
          { title: 'GRUB / QEMU', detail: 'Finds the Multiboot header and loads the flat binary at 1 MB.', meta: 'grub.cfg' },
          { title: 'start.asm', detail: 'Sets up the stack and calls the C entry point.', meta: 'NASM, 32-bit' },
          { title: 'GDT at 0x800', detail: 'Seven flat descriptors, lgdt, far jump to reload CS.', meta: 'gdt_install()', focus: true },
          { title: 'IDT, ISRs, IRQs', detail: 'Exceptions 0–31, PIC remapped to vectors 32–47.', meta: 'idt / isrs / irq.c' },
          { title: 'Drivers', detail: 'PIT timer, PS/2 keyboard, VGA text terminal.', meta: 'timer / kb / scrn.c' },
          { title: 'Shell', detail: 'Prompt, line buffer, built-in commands.', meta: 'shell.c' },
        ]}
      />
    </Frame>
  )
}

export function KfsMemory() {
  // Not to scale: regions are sized for readability.
  const regions = [
    { addr: '0x00000000', name: 'Real-mode IVT & BIOS data', tone: 'muted' },
    { addr: '0x00000800', name: 'GDT — 7 × 8 bytes (KFS-2)', tone: 'accent' },
    { addr: '…', name: 'Free conventional memory', tone: 'empty' },
    { addr: '0x000B8000', name: 'VGA text buffer — 80 × 25 × 2 bytes', tone: 'c2' },
    { addr: '0x00100000', name: 'Kernel .text / .rodata (linked here)', tone: 'c3' },
    { addr: '+ align 4K', name: '.data, .bss, kernel stack', tone: 'c3' },
  ]
  const fill: Record<string, string> = {
    muted: 'bg-fg/[0.05] border-line',
    accent: 'bg-accent-soft border-accent/50',
    empty: 'border-dashed border-line',
    c2: 'border-[color:var(--c2)]/50 bg-[color:var(--c2)]/10',
    c3: 'border-[color:var(--c3)]/50 bg-[color:var(--c3)]/10',
  }
  return (
    <Frame label="Physical memory (not to scale)" source="linker.ld · gdt.c · scrn.c">
      <ol className="space-y-1.5">
        {regions.map((r) => (
          <li key={r.addr + r.name} className="grid grid-cols-[96px_1fr] items-center gap-3">
            <span className="text-right font-mono text-[0.7rem] text-faint">{r.addr}</span>
            <span className={`rounded-md border px-3 py-2.5 text-xs text-fg ${fill[r.tone]}`}>{r.name}</span>
          </li>
        ))}
      </ol>
    </Frame>
  )
}

export function KfsInterrupts() {
  return (
    <Frame label="A keystroke, end to end" source="kb.c · irq.c · start.asm">
      <Flow
        steps={[
          { title: 'Key pressed', detail: 'The PS/2 controller raises IRQ 1.' },
          { title: 'PIC → vector 33', detail: 'Remapped so it cannot collide with CPU exceptions.' },
          { title: 'irq1 stub', detail: 'Pushes the vector, saves registers, calls irq_handler.', meta: 'start.asm' },
          { title: 'keyboard_handler', detail: 'Reads scancode from port 0x60; F1/F2 switch terminal.', meta: 'kb.c', focus: true },
          { title: 'EOI', detail: 'Acknowledge the PIC, restore registers, iret.', meta: 'out 0x20, 0x20' },
        ]}
      />
    </Frame>
  )
}

// ── Matcha ──────────────────────────────────────────────────────────────────

function Box({ title, items, tone = 'default' }: { title: string; items: string[]; tone?: 'default' | 'accent' }) {
  return (
    <div className={`rounded-lg border p-3.5 ${tone === 'accent' ? 'border-accent/50 bg-accent-soft' : 'border-line bg-bg/40'}`}>
      <p className="text-sm font-medium text-fg">{title}</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="font-mono text-[0.7rem] text-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MatchaArchitecture() {
  return (
    <Frame label="Architecture" source="Repository">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        <Box title="frontend/" items={['React 19 · Vite', 'React Router', 'TanStack Query', 'MapLibre map', 'socket.io-client']} />
        <Arrow label="REST + WebSocket" />
        <Box title="backend/" tone="accent" items={['Express 5 · Zod', 'auth · profiles · discovery', 'chat · notifications', 'Socket.IO realtime', 'node-cron jobs']} />
        <Arrow label="SQL (pg)" />
        <Box title="Services" items={['PostgreSQL 16', 'Mailpit (dev SMTP)', 'MaxMind GeoIP', 'Photon geocoder']} />
      </div>
      <div className="mt-3 rounded-lg border border-dashed border-line p-3 text-center text-xs text-muted">
        <span className="font-mono text-fg">packages/api-contract</span> — Zod schemas shared by both sides, so request and response types are checked at compile time.
      </div>
    </Frame>
  )
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-center md:flex-col">
      <span className="font-mono text-[0.65rem] text-faint">{label}</span>
      <span className="text-faint" aria-hidden>
        <span className="md:hidden">↓</span>
        <span className="hidden md:inline">→</span>
      </span>
    </div>
  )
}

export function MatchaSchema() {
  const tables = [
    { name: 'users', cols: ['id', 'email', 'username', 'password_hash', 'is_email_verified'] },
    { name: 'user_profiles', cols: ['user_id → users', 'gender_id, orientation_id', 'birthdate, biography', 'location_lat, location_lng', 'fame_rating'] },
    { name: 'likes', cols: ['liker_id → users', 'liked_id → users', 'cancelled_at'] },
    { name: 'profile_visits', cols: ['visitor_id → users', 'visited_id → users', 'created_at'] },
    { name: 'user_tags · tags', cols: ['user_id → users', 'tag_id → tags', 'tags.name_norm'] },
    { name: 'blocks · reports', cols: ['blocker_id / reporter_id', 'blocked_id / reported_id', 'reports.type_id, status'] },
    { name: 'conversations · messages', cols: ['user_low_id, user_high_id', 'messages.sender_id', 'messages.content'] },
    { name: 'notifications', cols: ['recipient_id → users', 'actor_id → users', 'type, payload', 'dedupe_key, read_at'] },
    { name: 'sessions · tokens', cols: ['user_sessions.token_hash', 'email_verifications', 'password_resets', 'oauth_accounts'] },
  ]
  return (
    <Frame label="Database" source="backend/migrations (simplified)">
      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((t) => (
          <li key={t.name} className="rounded-lg border border-line">
            <p className="border-b border-line px-3 py-2 font-mono text-xs text-fg">{t.name}</p>
            <ul className="px-3 py-2">
              {t.cols.map((c) => (
                <li key={c} className="font-mono text-[0.68rem] leading-5 text-muted">
                  {c}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-faint">Column lists are abridged; relations to users are shown with →.</p>
    </Frame>
  )
}

/** Card cover: discovery ranking as concentric distance rings around the requester. */
export function MatchaCover() {
  const dots = [
    { r: 40, a: 20, tags: 3 }, { r: 62, a: 140, tags: 1 }, { r: 78, a: 250, tags: 2 },
    { r: 98, a: 60, tags: 0 }, { r: 110, a: 200, tags: 2 }, { r: 52, a: 300, tags: 1 }, { r: 92, a: 330, tags: 3 },
  ]
  return (
    <svg viewBox="0 0 400 250" className="h-full w-full" role="img" aria-label="Illustration: candidate profiles ranked by distance and shared interests">
      {[40, 75, 110].map((r) => (
        <circle key={r} cx={200} cy={125} r={r} fill="none" stroke="var(--line-strong)" strokeDasharray="2 5" />
      ))}
      {dots.map((d, i) => {
        const x = 200 + d.r * Math.cos((d.a * Math.PI) / 180)
        const y = 125 + d.r * Math.sin((d.a * Math.PI) / 180) * 0.95
        return <circle key={i} cx={x} cy={y} r={5 + d.tags * 2} fill="var(--c3)" opacity={0.35 + d.tags * 0.2} />
      })}
      <circle cx={200} cy={125} r={7} fill="var(--fg)" />
      <text x={200} y={238} textAnchor="middle" className="fill-faint font-mono text-[10px]">
        distance · shared interests · fame rating
      </text>
    </svg>
  )
}

// ── Cloud-1 ─────────────────────────────────────────────────────────────────

export function CloudPipeline() {
  return (
    <Frame label="ansible-playbook playbook.yml" source="Repository">
      <Flow
        steps={[
          { title: 'Inventory', detail: 'Two Ubuntu hosts, SSH key per host.', meta: 'inventory.ini' },
          { title: 'role: docker', detail: 'Official apt repo, Engine + Compose plugin, service enabled.', meta: 'roles/docker' },
          { title: 'role: setup_cloud', detail: 'Folders, .env from vaulted template, configs, TLS certificate.', meta: 'roles/setup_cloud', focus: true },
          { title: 'role: deploy_docker', detail: 'docker_compose_v2 brings the stack up.', meta: 'roles/deploy_docker' },
          { title: 'HTTPS site', detail: 'WordPress served through Nginx on 443.', meta: 'idempotent re-runs' },
        ]}
      />
    </Frame>
  )
}

export function CloudArchitecture({ compact = false }: { compact?: boolean }) {
  const body = (
    <div className={compact ? 'flex h-full flex-col justify-center gap-2 p-5' : 'space-y-3'}>
      <div className="flex items-center justify-center gap-2 font-mono text-[0.7rem] text-muted">
        <span className="rounded-full border border-line px-2.5 py-1">Internet</span>
        <span aria-hidden>→</span>
        <span className="rounded-full border border-line px-2.5 py-1">:80 → :443</span>
      </div>
      <div className="rounded-xl border border-dashed border-line-strong p-3">
        <p className="mb-2 font-mono text-[0.65rem] text-faint">EC2 instance · Ubuntu · Docker network “inception”</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { n: 'nginx', d: 'TLS, reverse proxy', accent: true },
            { n: 'wordpress', d: 'PHP-FPM :9000' },
            { n: 'mariadb', d: 'internal only' },
            { n: 'phpmyadmin', d: 'under /phpmyadmin' },
          ].map((c) => (
            <div key={c.n} className={`rounded-md border px-2.5 py-2 ${c.accent ? 'border-accent/50 bg-accent-soft' : 'border-line'}`}>
              <p className="font-mono text-xs text-fg">{c.n}</p>
              {!compact && <p className="text-[0.68rem] text-muted">{c.d}</p>}
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[0.65rem] text-faint">volumes → host data/database, data/website</p>
      </div>
    </div>
  )
  if (compact) return body
  return (
    <Frame label="Runtime topology" source="docker-compose.yml · default.conf">
      {body}
    </Frame>
  )
}
