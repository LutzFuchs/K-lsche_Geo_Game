import type { GameState, RivalTeam, Station } from '../types'
import type { LeaderboardEntry as FirebaseEntry } from './firebase'
import { rivalLastSolveOffset, rivalSolvedCount } from './rivals'
import {
  teamLastSolveAt,
  teamSolvedCount,
  teamTotalScore,
} from './score'

export type LeaderboardEntry = {
  id: 'you' | string
  name: string
  isYou: boolean
  solved: number
  /** Last activity time relative to game start (ms). Tiebreaker. */
  lastActivityOffsetMs: number
  /** Total points (only the player has a real score; rivals get a synthetic
   *  rough estimate so the board stays meaningful while live). */
  score: number
  /** Team photo (data URL) when available — Firebase entries carry it. */
  photoUrl?: string | null
}

/**
 * Maps live Firebase leaderboard rows into the shared LeaderboardEntry shape.
 * Pass `youTeamId` so the current team is highlighted and shows its own photo.
 * Already sorted by score desc upstream, but we re-sort for safety.
 */
export function mapFirebaseEntries(
  firebaseEntries: FirebaseEntry[],
  startedAt: number | null,
  youTeamId?: string,
): LeaderboardEntry[] {
  return firebaseEntries
    .map((entry) => ({
      id: entry.teamId,
      name: entry.teamName,
      isYou: youTeamId ? entry.teamId === youTeamId : false,
      solved: entry.solvedCount,
      lastActivityOffsetMs: entry.lastUpdate - (startedAt ?? 0),
      score: entry.score,
      photoUrl: entry.photoUrl ?? null,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.solved !== a.solved) return b.solved - a.solved
      return a.lastActivityOffsetMs - b.lastActivityOffsetMs
    })
}

const RIVAL_BASE = 100
const RIVAL_AVG_SPEED_BONUS = 30 // synthetic, just to keep ordering coherent

export function buildLeaderboard(
  state: GameState,
  stations: Station[],
  rivals: RivalTeam[],
  nowMs: number,
): LeaderboardEntry[] {
  const startedAt = state.startedAt ?? nowMs
  const nowOffset = Math.max(0, nowMs - startedAt)

  const youSolved = teamSolvedCount(state, stations)
  const youLast = teamLastSolveAt(state, stations)
  const youScore = teamTotalScore(state, stations)

  const entries: LeaderboardEntry[] = [
    {
      id: 'you',
      name: state.teamName ?? 'Euer Team',
      isYou: true,
      solved: youSolved,
      lastActivityOffsetMs: youLast ? youLast - startedAt : 0,
      score: youScore,
    },
    ...rivals.map((r) => {
      const solved = rivalSolvedCount(r, nowOffset)
      const last = rivalLastSolveOffset(r, nowOffset)
      return {
        id: r.id,
        name: r.name,
        isYou: false,
        solved,
        lastActivityOffsetMs: last,
        score: solved * (RIVAL_BASE + RIVAL_AVG_SPEED_BONUS),
      } satisfies LeaderboardEntry
    }),
  ]

  return entries.sort((a, b) => {
    if (b.solved !== a.solved) return b.solved - a.solved
    if (a.solved === 0) return 0
    return a.lastActivityOffsetMs - b.lastActivityOffsetMs
  })
}

export function rankOf(board: LeaderboardEntry[]): number {
  return board.findIndex((e) => e.isYou) + 1
}
