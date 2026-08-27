import { useEffect, useMemo, useState } from 'react'
import type { GeoStatus, RivalTeam, Station, StationProgress } from '../types'
import { distanceMeters } from '../lib/distance'
import { answerMatches } from '../lib/answer'
import { stationScore } from '../lib/score'
import { buildLeaderboard, mapFirebaseEntries } from '../lib/leaderboard'
import { useFirebaseLeaderboard } from '../hooks/useFirebaseLeaderboard'
import { CompassGlyph, StationGlyph } from './icons'
import { ProgressDots } from './ProgressDots'
import { Leaderboard } from './Leaderboard'
import { TeamAvatar } from './WelcomeFlow'
import { StationHero } from './StationHero'

type Props = {
  station: Station
  index: number
  total: number
  solvedCount: number
  totalScore: number
  teamName: string
  teamPhoto: string | null
  teamId: string
  rivals: RivalTeam[]
  geo: GeoStatus
  progress: StationProgress
  fullState: import('../types').GameState
  stations: Station[]
  onUnlock: () => void
  onSolve: () => void
  onAdvance: () => void
  onWrongAttempt: () => void
  onHintReveal: () => void
  onLetterReveal: () => void
}

export function StationView({
  station,
  index,
  total,
  solvedCount,
  totalScore,
  teamName,
  teamPhoto,
  teamId,
  rivals,
  geo,
  progress,
  fullState,
  stations,
  onUnlock,
  onSolve,
  onAdvance,
  onWrongAttempt,
  onHintReveal,
  onLetterReveal,
}: Props) {
  const [answer, setAnswer] = useState('')
  const [wrongAttempt, setWrongAttempt] = useState(false)
  const [now, setNow] = useState(Date.now())
  const { entries: firebaseEntries } = useFirebaseLeaderboard()

  // Tick once per second to drive live leaderboard updates and proximity hints.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const { distance, withinRadius, accuracy } = useMemo(() => {
    if (geo.kind !== 'tracking') {
      return {
        distance: null as number | null,
        withinRadius: false,
        accuracy: null as number | null,
      }
    }
    const d = distanceMeters({ lat: geo.lat, lng: geo.lng }, station)
    return {
      distance: d,
      withinRadius: d <= station.radiusMeters,
      accuracy: geo.accuracy,
    }
  }, [geo, station])

  const isLocked = !progress.unlockedAt
  const isUnlocked = !!progress.unlockedAt && !progress.solvedAt
  const isSolved = !!progress.solvedAt
  const isLast = index === total - 1

  useEffect(() => {
    if (isLocked && withinRadius) onUnlock()
  }, [isLocked, withinRadius, onUnlock])

  // Reset transient input state when navigating between stations
  useEffect(() => {
    setAnswer('')
    setWrongAttempt(false)
  }, [station.id])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (answerMatches(answer, station.answer)) {
      onSolve()
      setWrongAttempt(false)
      // Vibration + sound = haptic-ish reward on supported devices
      if ('vibrate' in navigator) navigator.vibrate?.([12, 30, 12])
    } else {
      onWrongAttempt()
      setWrongAttempt(true)
      if ('vibrate' in navigator) navigator.vibrate?.(40)
      window.setTimeout(() => setWrongAttempt(false), 1200)
    }
  }

  const board = useMemo(() => {
    // Use Firebase leaderboard if available and non-empty, otherwise fall back to local rivals
    if (firebaseEntries.length > 0) {
      return mapFirebaseEntries(firebaseEntries, fullState.startedAt, teamId)
    }
    return buildLeaderboard(fullState, stations, rivals, now)
  }, [firebaseEntries, fullState, stations, rivals, now, teamId])
  const provisional = progress.solvedAt
    ? stationScore(station, progress, index)
    : null

  return (
    <main className="min-h-svh flex flex-col px-5 pt-3 pb-8">
      {/* HUD */}
      <header className="rounded-2xl bg-night text-paper px-3.5 py-3 mb-4 shadow-[0_6px_0_-2px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3">
          <TeamAvatar
            photo={teamPhoto}
            size={44}
            ringClass="border-paper/60"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 leading-none">
              {teamName}
            </p>
            <p className="font-display text-2xl font-black leading-tight tabular-nums">
              {totalScore}{' '}
              <span className="text-xs font-sans font-semibold tracking-widest uppercase opacity-70">
                Punkte
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 leading-none">
              Station
            </p>
            <p className="font-display text-2xl font-black leading-tight tabular-nums">
              {index + 1}
              <span className="text-xs font-sans font-semibold opacity-70">
                /{total}
              </span>
            </p>
          </div>
          <GpsBadge geo={geo} />
        </div>
        <div className="mt-3">
          <ProgressDots
            total={total}
            currentIndex={index}
            solvedCount={solvedCount}
          />
        </div>
      </header>

      <div className="relative rounded-2xl overflow-hidden border-2 border-ink dark:border-paper shadow-[0_8px_0_-2px_rgba(0,0,0,0.5)] mb-5">
        <div className="aspect-[15/8] w-full">
          <StationHero stationId={station.id} />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pt-12 pb-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 text-paper">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 leading-none mb-1">
                Station {index + 1} · Badge: {station.badge}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-black leading-[1.05]">
                {station.title}
              </h1>
              <p className="text-[11px] uppercase tracking-widest font-bold opacity-90 mt-0.5">
                {station.locationName}
              </p>
            </div>
            <div className="shrink-0 text-paper">
              <StationGlyph stationId={station.id} size={48} />
            </div>
          </div>
        </div>
      </div>

      {isLocked && (
        <LockedBlock
          station={station}
          distance={distance}
          accuracy={accuracy}
          geo={geo}
        />
      )}

      {isUnlocked && (
        <UnlockedBlock
          station={station}
          answer={answer}
          setAnswer={setAnswer}
          wrongAttempt={wrongAttempt}
          hintRevealed={progress.hintRevealed}
          lettersRevealed={progress.lettersRevealed ?? 0}
          onHintReveal={onHintReveal}
          onLetterReveal={onLetterReveal}
          onSubmit={submit}
        />
      )}

      {isSolved && (
        <SolvedBlock
          station={station}
          isLast={isLast}
          provisionalScore={provisional}
          onAdvance={onAdvance}
        />
      )}

      <section className="mt-6 pt-5 border-t border-rule/15">
        <div className="flex items-center justify-between mb-2">
          <p className="font-display text-sm font-black tracking-wide uppercase">
            Live-Tabelle
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted font-bold">
            Top 4
          </p>
        </div>
        <Leaderboard
          entries={board}
          total={total}
          variant="compact"
          teamPhoto={teamPhoto}
        />
      </section>
    </main>
  )
}

/* ----------------------------- locked block ----------------------------- */

function LockedBlock({
  station,
  distance,
  accuracy,
  geo,
}: {
  station: Station
  distance: number | null
  accuracy: number | null
  geo: GeoStatus
}) {
  const proximity =
    distance === null
      ? 0
      : Math.max(0, Math.min(1, 1 - (distance - station.radiusMeters) / 400))

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-dashed border-ink/30 dark:border-paper/30 p-5 flex items-start gap-4">
        <div className="shrink-0 text-tomato">
          <CompassGlyph size={56} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-tomato font-black mb-1">
            Verschlossen
          </p>
          <p className="font-display text-xl font-bold leading-snug">
            Geht zu {station.locationName}.
          </p>
          <p className="text-sm text-muted mt-1">
            Die nächste Nachricht öffnet sich, sobald ihr dort seid.
          </p>
        </div>
      </div>

      {geo.kind === 'tracking' && distance !== null && (
        <div className="rounded-xl bg-paper-dim dark:bg-white/5 px-4 py-3">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs uppercase tracking-widest font-bold text-muted">
              Entfernung
            </span>
            <span className="font-display text-lg font-black tabular-nums">
              {distance < 1000
                ? `${Math.round(distance)} m`
                : `${(distance / 1000).toFixed(1)} km`}
            </span>
          </div>
          <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-tomato to-gold transition-all duration-700"
              style={{ width: `${Math.round(proximity * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-muted">
              Radius {station.radiusMeters} m
            </span>
            {accuracy !== null && (
              <span className="text-[10px] text-muted">
                ±{Math.round(accuracy)} m
              </span>
            )}
          </div>
        </div>
      )}

      {geo.kind === 'requesting' && (
        <p className="text-sm text-muted">Standort wird ermittelt…</p>
      )}
      {geo.kind === 'denied' && (
        <p className="text-sm text-tomato font-semibold">{geo.message}</p>
      )}
      {geo.kind === 'unavailable' && (
        <p className="text-sm text-tomato font-semibold">{geo.message}</p>
      )}
    </section>
  )
}

/* --------------------------- unlocked block --------------------------- */

function UnlockedBlock({
  station,
  answer,
  setAnswer,
  wrongAttempt,
  hintRevealed,
  lettersRevealed,
  onHintReveal,
  onLetterReveal,
  onSubmit,
}: {
  station: Station
  answer: string
  setAnswer: (s: string) => void
  wrongAttempt: boolean
  hintRevealed: boolean
  lettersRevealed: number
  onHintReveal: () => void
  onLetterReveal: () => void
  onSubmit: (e: React.FormEvent) => void
}) {
  const answerLen = station.answer.length
  const allRevealed = lettersRevealed >= answerLen
  // Masked solution: revealed leading letters, the rest as underscores.
  const masked = station.answer
    .split('')
    .map((ch, i) => (i < lettersRevealed ? ch.toUpperCase() : '_'))
    .join(' ')
  return (
    <section className="flex flex-col gap-5">
      <p className="font-display text-lg leading-relaxed italic">
        {station.story}
      </p>

      <div className="rounded-2xl bg-gradient-to-br from-sapphire to-[#0f1d4f] text-white p-5 shadow-[0_8px_0_-2px_rgba(0,0,0,0.4)]">
        <p className="font-sans uppercase tracking-[0.25em] text-[10px] font-bold opacity-80 mb-1.5">
          Rätsel
        </p>
        <p className="font-display text-lg leading-relaxed">{station.riddle}</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Eure Antwort"
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className={`w-full px-4 py-4 text-2xl text-center font-display font-black tracking-[0.2em] uppercase bg-paper-dim dark:bg-white/5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-tomato/30 ${
            wrongAttempt
              ? 'border-tomato animate-pulse'
              : 'border-ink dark:border-paper'
          }`}
        />
        <button
          type="submit"
          disabled={answer.trim().length === 0}
          className="w-full px-4 py-4 rounded-xl font-display text-xl font-black tracking-wide bg-tomato text-white disabled:opacity-30 disabled:bg-night active:scale-[0.99] transition shadow-[0_6px_0_-2px_rgba(0,0,0,0.5)] disabled:shadow-none"
        >
          Senden
        </button>
        {!hintRevealed ? (
          <button
            type="button"
            onClick={onHintReveal}
            className="text-sm text-muted underline underline-offset-4"
          >
            Hinweis aufdecken (−30 Punkte)
          </button>
        ) : (
          <p className="text-sm text-muted italic text-center px-4 py-2 bg-paper-dim dark:bg-white/5 rounded-lg">
            Tipp: {station.hint}
          </p>
        )}

        {/* Give-up aid: reveal the solution one letter at a time */}
        {lettersRevealed > 0 && (
          <p className="text-center font-display text-2xl font-black tracking-[0.35em] tabular-nums">
            {masked}
          </p>
        )}
        {!allRevealed ? (
          <button
            type="button"
            onClick={onLetterReveal}
            className="text-sm text-tomato underline underline-offset-4 font-semibold"
          >
            {lettersRevealed === 0
              ? 'Aufgeben? Buchstaben aufdecken (−15 je Buchstabe)'
              : 'Nächsten Buchstaben aufdecken (−15)'}
          </button>
        ) : (
          <p className="text-sm text-muted italic text-center">
            Alle Buchstaben aufgedeckt — gebt das Lösungswort ein.
          </p>
        )}
        {wrongAttempt && (
          <p className="text-sm text-tomato font-semibold text-center">
            Nicht ganz. Schaut nochmal genauer hin. (−15 Punkte)
          </p>
        )}
      </form>
    </section>
  )
}

/* ----------------------------- solved block ---------------------------- */

function SolvedBlock({
  station,
  isLast,
  provisionalScore,
  onAdvance,
}: {
  station: Station
  isLast: boolean
  provisionalScore: number | null
  onAdvance: () => void
}) {
  return (
    <section className="flex flex-col gap-5 solve-burst">
      <div className="rounded-2xl bg-gradient-to-br from-success to-[#1f6c44] text-white p-5 shadow-[0_8px_0_-2px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-4">
          <SealCheck />
          <div className="flex-1">
            <p className="font-sans uppercase tracking-[0.25em] text-[10px] font-bold opacity-80">
              Gelöst — Badge erhalten
            </p>
            <p className="font-display text-2xl font-black leading-tight">
              {station.badge}
            </p>
          </div>
          {provisionalScore !== null && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">
                Punkte
              </p>
              <p className="font-display text-3xl font-black tabular-nums">
                +{provisionalScore}
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="font-display text-base text-muted italic">
        {isLast
          ? 'Die Mission ist vollendet. Geht zur Auswertung.'
          : 'Die nächste Nachricht wartet. Auf zur nächsten Station.'}
      </p>

      <button
        type="button"
        onClick={onAdvance}
        className="w-full px-4 py-5 rounded-xl font-display text-xl font-black tracking-wide bg-tomato text-white active:scale-[0.99] transition shadow-[0_8px_0_-2px_rgba(0,0,0,0.5)]"
      >
        {isLast ? 'Letzte Nachricht öffnen' : 'Weiter zur nächsten Station'}
      </button>
    </section>
  )
}

/* ------------------------------- chrome ------------------------------- */

function GpsBadge({ geo }: { geo: GeoStatus }) {
  const dotColor =
    geo.kind === 'tracking'
      ? 'bg-emerald-400'
      : geo.kind === 'requesting'
        ? 'bg-amber-400'
        : 'bg-tomato'
  const label =
    geo.kind === 'tracking'
      ? 'GPS'
      : geo.kind === 'requesting'
        ? 'Suche'
        : 'Aus'
  return (
    <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold opacity-80">
      <span className={`size-2 rounded-full ${dotColor} animate-pulse`} />
      {label}
    </span>
  )
}

function SealCheck() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="14" />
      <path d="M16 24l5 5 11-11" />
    </svg>
  )
}
