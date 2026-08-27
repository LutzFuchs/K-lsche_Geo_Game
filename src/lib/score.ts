import type { GameState, Station, StationProgress } from '../types'

/** Base points by station difficulty (1-2, 3-4, 5-6) for the 6-stop route */
function getBasePoints(stationIndex: number): number {
  if (stationIndex < 2) return 160 // Stations 1-2
  if (stationIndex < 4) return 200 // Stations 3-4
  return 240 // Stations 5-6
}

/**
 * Smooth time bonus: linear decay from +60 (instant) to 0 over a 10-minute
 * window. Rewards every second saved instead of three hard buckets.
 */
const MAX_TIME_BONUS = 60
const TIME_BONUS_WINDOW_S = 600
function getTimeBonus(elapsedMs: number): number {
  const seconds = Math.max(0, elapsedMs / 1000)
  return Math.max(
    0,
    Math.round(MAX_TIME_BONUS * (1 - seconds / TIME_BONUS_WINDOW_S)),
  )
}

const WRONG_ATTEMPT_PENALTY = 15
const HINT_PENALTY = 30
const LETTER_REVEAL_PENALTY = 15

export function stationScore(
  _station: Station,
  progress: StationProgress,
  stationIndex: number = 0,
): number {
  if (!progress.solvedAt || !progress.unlockedAt) return 0

  const basePoints = getBasePoints(stationIndex)
  const elapsed = progress.solvedAt - progress.unlockedAt
  const timeBonus = getTimeBonus(elapsed)
  const wrongCost = Math.max(0, progress.attempts - 1) * WRONG_ATTEMPT_PENALTY
  const hintCost = progress.hintRevealed ? HINT_PENALTY : 0
  const letterCost = (progress.lettersRevealed ?? 0) * LETTER_REVEAL_PENALTY

  return Math.max(0, basePoints + timeBonus - wrongCost - hintCost - letterCost)
}

export function teamTotalScore(state: GameState, stations: Station[]): number {
  return stations.reduce((sum, s, index) => {
    const p = state.progress[s.id]
    return sum + (p ? stationScore(s, p, index) : 0)
  }, 0)
}

export function teamSolvedCount(state: GameState, stations: Station[]): number {
  return stations.reduce(
    (n, s) => n + (state.progress[s.id]?.solvedAt ? 1 : 0),
    0,
  )
}

export function teamLastSolveAt(
  state: GameState,
  stations: Station[],
): number | null {
  let latest: number | null = null
  for (const s of stations) {
    const t = state.progress[s.id]?.solvedAt
    if (t && (latest === null || t > latest)) latest = t
  }
  return latest
}
