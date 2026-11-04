/** Maps a value from [d0, d1] to [r0, r1]. */
export function linear(d0: number, d1: number, r0: number, r1: number) {
  const span = d1 - d0 || 1
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0)
}

/** Evenly spaced "nice" tick values covering [min, max]. */
export function ticks(min: number, max: number, count = 4): number[] {
  const raw = (max - min) / count
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw
  const start = Math.ceil(min / step) * step
  const out: number[] = []
  for (let v = start; v <= max + step * 1e-9; v += step) out.push(Number(v.toFixed(10)))
  return out
}

export const pct = (v: number, digits = 1) => `${(v * 100).toFixed(digits)}%`
