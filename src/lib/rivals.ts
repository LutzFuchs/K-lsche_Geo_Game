import type { RivalTeam } from '../types'

const RIVAL_NAMES = [
  'Kölsch-Kommando',
  'Domspitzen-Gang',
  'Rheinauen-Rebellen',
  'Kwatta-Bande',
  'Hänneschen-Helden',
  'Altstadt-Adler',
  'Zoch-Zoccis',
  'Höhner-Horde',
  'Veedel-Vagabunden',
  'Rheinblitz',
]

/** Mulberry32 PRNG — tiny, deterministic, good enough for this. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = t
    r = Math.imul(r ^ (r >>> 15), r | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(name: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Generates 5 deterministic rival teams seeded by the player's team name. Each
 * rival has a per-station solve offset (ms since game start). Solves are
 * monotonically increasing and roughly bounded inside a 60-min event window.
 *
 * Rivals are tuned to be plausible competition: a couple are usually faster,
 * a couple slower, one wildcard. Every run produces a real podium fight.
 */
export function generateRivals(
  teamName: string,
  totalStations: number,
): RivalTeam[] {
  const seed = hashSeed(teamName)
  const rng = mulberry32(seed)

  const pool = [...RIVAL_NAMES]
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const names = pool.slice(0, 5)

  return names.map((name, ix) => {
    // Per-rival pace multiplier: 0.7 (fast) → 1.3 (slow), with one wildcard.
    const pace =
      ix === 0
        ? 0.78 + rng() * 0.08
        : ix === 1
          ? 0.92 + rng() * 0.1
          : ix === 2
            ? 1.0 + rng() * 0.12
            : ix === 3
              ? 1.15 + rng() * 0.1
              : 0.85 + rng() * 0.4 // wildcard
    const offsets: number[] = []
    let t = 0
    for (let i = 0; i < totalStations; i++) {
      // Per-station base time scales with how much walking the station implies
      // (we approximate with a flat 6.5min average and ±jitter).
      const stationMs = (5.5 + rng() * 3) * 60 * 1000 * pace
      t += stationMs
      offsets.push(Math.round(t))
    }
    return {
      id: `rival-${ix}`,
      name,
      solveOffsets: offsets,
    }
  })
}

/**
 * How many stations a given rival has solved at `nowOffsetMs`.
 */
export function rivalSolvedCount(rival: RivalTeam, nowOffsetMs: number): number {
  let c = 0
  for (const t of rival.solveOffsets) {
    if (nowOffsetMs >= t) c++
    else break
  }
  return c
}

export function rivalLastSolveOffset(rival: RivalTeam, nowOffsetMs: number): number {
  let last = 0
  for (const t of rival.solveOffsets) {
    if (nowOffsetMs >= t) last = t
    else break
  }
  return last
}
