import type { GameState } from '../types'
import { stations } from '../stations'

// v4: trimmed to 6-stop route ending at Marienplatz.
// Bumping the key forces a clean slate so stale progress/rivals sized for
// the old 8-stop route can't leak in.
const STORAGE_KEY = 'kope.state.v4'
const LEGACY_KEYS = ['kope.state.v3', 'kope.state.v2', 'kope.state.v1']

export function emptyState(): GameState {
  const progress: GameState['progress'] = {}
  for (const s of stations) {
    progress[s.id] = {
      unlockedAt: null,
      solvedAt: null,
      hintRevealed: false,
      attempts: 0,
      lettersRevealed: 0,
    }
  }
  return {
    teamName: null,
    teamPhoto: null,
    startedAt: null,
    completedAt: null,
    currentIndex: 0,
    progress,
    rivals: [],
  }
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // Legacy payloads predate teamPhoto/score — drop and start fresh.
      for (const k of LEGACY_KEYS) localStorage.removeItem(k)
      return emptyState()
    }
    const parsed = JSON.parse(raw) as Partial<GameState>
    const fresh = emptyState()
    return {
      ...fresh,
      ...parsed,
      progress: {
        ...fresh.progress,
        ...(parsed.progress ?? {}),
      },
      rivals: parsed.rivals ?? [],
    }
  } catch {
    return emptyState()
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota or private mode — degrade gracefully.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    for (const k of LEGACY_KEYS) localStorage.removeItem(k)
  } catch {
    // ignore
  }
}
