export type Station = {
  id: string
  title: string
  locationName: string
  lat: number
  lng: number
  radiusMeters: number
  story: string
  riddle: string
  hint: string
  answer: string
  /** Internal short label for badges/leaderboard */
  badge: string
}

export type StationProgress = {
  unlockedAt: number | null
  solvedAt: number | null
  hintRevealed: boolean
  attempts: number
  /** How many leading answer letters the team has revealed (give-up aid). */
  lettersRevealed: number
}

export type RivalTeam = {
  id: string
  name: string
  /**
   * Ordered solve timestamps relative to game start (ms).
   * `solveOffsets[i]` is when the rival solves station i. Length === stations.length.
   */
  solveOffsets: number[]
}

export type GameState = {
  teamName: string | null
  teamPhoto: string | null
  startedAt: number | null
  completedAt: number | null
  currentIndex: number
  progress: Record<string, StationProgress>
  rivals: RivalTeam[]
}

export type GeoStatus =
  | { kind: 'idle' }
  | { kind: 'requesting' }
  | { kind: 'denied'; message: string }
  | { kind: 'unavailable'; message: string }
  | { kind: 'tracking'; lat: number; lng: number; accuracy: number; updatedAt: number }
