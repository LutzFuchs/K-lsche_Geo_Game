import { useCallback, useEffect, useState } from 'react'
import type { GameState } from './types'
import { stations } from './stations'
import { clearState, loadState, saveState } from './lib/storage'
import { useGeolocation } from './hooks/useGeolocation'
import { generateRivals } from './lib/rivals'
import { teamSolvedCount, teamTotalScore } from './lib/score'
import { registerTeam, updateTeamScore } from './lib/firebase'
import { WelcomeFlow } from './components/WelcomeFlow'
import { StationView } from './components/StationView'
import { Final } from './components/Final'

function App() {
  const [state, setState] = useState<GameState>(() => loadState())
  const [teamId] = useState(() => {
    const stored = localStorage.getItem('teamId')
    if (stored) return stored
    const newId = `team-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    localStorage.setItem('teamId', newId)
    return newId
  })
  const [firebaseReady, setFirebaseReady] = useState(false)

  useEffect(() => {
    saveState(state)
  }, [state])

  // Register team when race starts
  useEffect(() => {
    if (state.startedAt && !firebaseReady && state.teamName) {
      registerTeam(teamId, state.teamName, state.teamPhoto ?? undefined)
        .then(() => setFirebaseReady(true))
        .catch((err) => console.error('Firebase register failed:', err))
    }
  }, [state.startedAt, state.teamName, state.teamPhoto, teamId, firebaseReady])

  // Sync score to Firebase whenever progress changes
  useEffect(() => {
    if (firebaseReady && state.startedAt && !state.completedAt) {
      const solved = teamSolvedCount(state, stations)
      const score = teamTotalScore(state, stations)
      updateTeamScore(teamId, score, solved).catch((err) =>
        console.error('Firebase sync failed:', err)
      )
    }
  }, [state.progress, firebaseReady, state.startedAt, state.completedAt, teamId])

  const inGame = state.startedAt !== null && state.completedAt === null
  const geo = useGeolocation(inGame)

  const setTeamName = useCallback((teamName: string) => {
    setState((s) => ({ ...s, teamName }))
  }, [])

  const setTeamPhoto = useCallback((teamPhoto: string | null) => {
    setState((s) => ({ ...s, teamPhoto }))
  }, [])

  const startRace = useCallback(() => {
    setState((s) => {
      const name = s.teamName ?? 'Team'
      const rivals =
        s.rivals.length > 0 ? s.rivals : generateRivals(name, stations.length)
      return {
        ...s,
        startedAt: Date.now(),
        rivals,
      }
    })
  }, [])

  const unlockCurrent = useCallback(() => {
    setState((s) => {
      const station = stations[s.currentIndex]
      if (!station) return s
      const current = s.progress[station.id]
      if (current.unlockedAt) return s
      return {
        ...s,
        progress: {
          ...s.progress,
          [station.id]: {
            ...current,
            unlockedAt: Date.now(),
          },
        },
      }
    })
  }, [])

  const solveCurrent = useCallback(() => {
    setState((s) => {
      const station = stations[s.currentIndex]
      if (!station) return s
      const current = s.progress[station.id]
      if (!current.unlockedAt || current.solvedAt) return s
      return {
        ...s,
        progress: {
          ...s.progress,
          [station.id]: { ...current, solvedAt: Date.now() },
        },
      }
    })
  }, [])

  const advance = useCallback(() => {
    setState((s) => {
      const isLast = s.currentIndex >= stations.length - 1
      if (isLast) return { ...s, completedAt: Date.now() }
      return { ...s, currentIndex: s.currentIndex + 1 }
    })
  }, [])

  const onWrongAttempt = useCallback(() => {
    setState((s) => {
      const station = stations[s.currentIndex]
      if (!station) return s
      const current = s.progress[station.id]
      return {
        ...s,
        progress: {
          ...s.progress,
          [station.id]: { ...current, attempts: current.attempts + 1 },
        },
      }
    })
  }, [])

  const onHintReveal = useCallback(() => {
    setState((s) => {
      const station = stations[s.currentIndex]
      if (!station) return s
      const current = s.progress[station.id]
      if (current.hintRevealed) return s
      return {
        ...s,
        progress: {
          ...s.progress,
          [station.id]: { ...current, hintRevealed: true },
        },
      }
    })
  }, [])

  const onLetterReveal = useCallback(() => {
    setState((s) => {
      const station = stations[s.currentIndex]
      if (!station) return s
      const current = s.progress[station.id]
      const revealed = current.lettersRevealed ?? 0
      if (revealed >= station.answer.length) return s
      return {
        ...s,
        progress: {
          ...s.progress,
          [station.id]: { ...current, lettersRevealed: revealed + 1 },
        },
      }
    })
  }, [])

  const reset = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.confirm(
        'Allen Fortschritt auf diesem Gerät zurücksetzen? Das lässt sich nicht rückgängig machen.',
      )
    ) {
      clearState()
      window.location.reload()
    }
  }, [])

  // Pre-race / lobby flow
  if (state.startedAt === null) {
    return (
      <WelcomeFlow
        teamName={state.teamName}
        teamPhoto={state.teamPhoto}
        onSetTeamName={setTeamName}
        onSetTeamPhoto={setTeamPhoto}
        onStartRace={startRace}
      />
    )
  }

  // Final screen
  if (state.completedAt !== null) {
    return (
      <Final
        state={state}
        stations={stations}
        rivals={state.rivals}
        teamId={teamId}
        onReset={reset}
      />
    )
  }

  const station = stations[state.currentIndex]
  if (!station) {
    return (
      <Final
        state={{ ...state, completedAt: Date.now() }}
        stations={stations}
        rivals={state.rivals}
        teamId={teamId}
        onReset={reset}
      />
    )
  }

  const solvedCount = teamSolvedCount(state, stations)
  const totalScore = teamTotalScore(state, stations)

  return (
    <StationView
      station={station}
      index={state.currentIndex}
      total={stations.length}
      solvedCount={solvedCount}
      totalScore={totalScore}
      teamName={state.teamName ?? 'Team'}
      teamPhoto={state.teamPhoto}
      teamId={teamId}
      rivals={state.rivals}
      geo={geo}
      progress={state.progress[station.id]}
      fullState={state}
      stations={stations}
      onUnlock={unlockCurrent}
      onSolve={solveCurrent}
      onAdvance={advance}
      onWrongAttempt={onWrongAttempt}
      onHintReveal={onHintReveal}
      onLetterReveal={onLetterReveal}
    />
  )
}

export default App
