import { useMemo } from 'react'
import {
  finalMeetingPointAddress,
  finalMeetingPointMapsUrl,
  finalMeetingPointName,
  showMeetingPoint,
} from '../config'
import type { GameState, RivalTeam, Station } from '../types'
import { buildLeaderboard, mapFirebaseEntries, rankOf } from '../lib/leaderboard'
import { teamSolvedCount, teamTotalScore } from '../lib/score'
import { useFirebaseLeaderboard } from '../hooks/useFirebaseLeaderboard'
import { LionGlyph, PinGlyph } from './icons'
import { Leaderboard } from './Leaderboard'
import { TeamAvatar } from './WelcomeFlow'

type Props = {
  state: GameState
  stations: Station[]
  rivals: RivalTeam[]
  teamId: string
  onReset: () => void
}

function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function rankPhrase(rank: number): { title: string; tone: string; medal: string } {
  if (rank === 1)
    return { title: 'CHAMPION', tone: 'text-gold', medal: '★' }
  if (rank === 2)
    return { title: 'PODEST', tone: 'text-silver', medal: '★' }
  if (rank === 3)
    return { title: 'PODEST', tone: 'text-bronze', medal: '★' }
  return { title: 'GESCHAFFT', tone: 'text-tomato', medal: '◆' }
}

export function Final({ state, stations, rivals, teamId, onReset }: Props) {
  // Poll the live Firebase board so finished teams keep seeing standings update
  // as other teams solve. Falls back to the local synthetic board when offline.
  const { entries: firebaseEntries } = useFirebaseLeaderboard()
  const board = useMemo(() => {
    if (firebaseEntries.length > 0) {
      return mapFirebaseEntries(firebaseEntries, state.startedAt, teamId)
    }
    return buildLeaderboard(state, stations, rivals, state.completedAt ?? Date.now())
  }, [firebaseEntries, state, stations, rivals, teamId])
  const myRank = rankOf(board)
  const phrase = rankPhrase(myRank)

  const startedAt = state.startedAt ?? 0
  const completedAt = state.completedAt ?? Date.now()
  const duration = formatDuration(completedAt - startedAt)
  // Own score/solved come from authoritative local state so the stat card is
  // always populated even if this team's Firebase row hasn't synced yet.
  const totalScore = teamTotalScore(state, stations)
  const solved = teamSolvedCount(state, stations)

  const onShare = async () => {
    const text = `${state.teamName ?? 'Team'} hat „Die letzte Nachricht des Stadtarchitekten" beendet.\nPlatz ${myRank} · ${totalScore} Punkte · ${duration} Minuten.`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mission vollendet', text })
        return
      } catch {
        // user cancelled — fall through
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      window.alert('In die Zwischenablage kopiert.')
    } catch {
      window.alert(text)
    }
  }

  return (
    <main className="min-h-svh flex flex-col px-5 pt-8 pb-10 relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/heroes/podium.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
        }}
      />
      <div className="relative z-10">
        <p className={`text-center font-display font-black text-3xl tracking-[0.25em] mb-2 solve-burst ${phrase.tone}`}>
          {phrase.title}
        </p>
        <p className="text-center text-xs uppercase tracking-[0.4em] text-muted font-bold mb-6">
          Mission vollendet · Platz {myRank} von {board.length}
        </p>

        <Podium board={board} teamPhoto={state.teamPhoto} />

        <h1 className="font-display text-4xl font-black leading-tight text-center mt-8 mb-6">
          Die Stadt war die Nachricht.
        </h1>

        <div className="rounded-2xl bg-night text-paper p-5 mb-6 shadow-[0_10px_0_-2px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-4 mb-4">
            <TeamAvatar
              photo={state.teamPhoto}
              size={64}
              ringClass="border-paper"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">
                Team
              </p>
              <p className="font-display text-2xl font-black leading-tight truncate">
                {state.teamName}
              </p>
            </div>
            <LionGlyph size={48} strokeWidth={1.4} />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat label="Punkte" value={String(totalScore)} />
            <Stat label="Stationen" value={`${solved}/${stations.length}`} />
            <Stat label="Zeit" value={duration} />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-tomato p-5 mb-6">
          <p className="text-[10px] uppercase tracking-widest font-black text-tomato mb-2">
            Abendlicher Treffpunkt freigeschaltet
          </p>
          {showMeetingPoint ? (
            <a
              href={finalMeetingPointMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 -mx-2 -mb-2 mt-1 px-2 py-2 rounded-xl active:scale-[0.99] transition"
            >
              <span className="min-w-0">
                <span className="font-display text-xl font-black leading-tight block">
                  {finalMeetingPointName}
                </span>
                <span className="text-sm text-muted block truncate">
                  {finalMeetingPointAddress}
                </span>
                <span className="text-xs font-bold text-tomato uppercase tracking-widest mt-1 block">
                  Navigation starten →
                </span>
              </span>
              <PinGlyph size={32} />
            </a>
          ) : (
            <p className="font-display text-lg italic text-muted">
              Euer Ziel wird bald enthüllt.
            </p>
          )}
        </div>

        <div className="mb-8">
          <p className="font-display text-sm font-black tracking-wide uppercase mb-2">
            Endtabelle
          </p>
          <Leaderboard
            entries={board}
            total={stations.length}
            variant="full"
            teamPhoto={state.teamPhoto}
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onShare}
            className="w-full px-4 py-4 rounded-xl font-display text-lg font-black tracking-wide bg-tomato text-white active:scale-[0.99] transition shadow-[0_6px_0_-2px_rgba(0,0,0,0.5)]"
          >
            Ergebnis teilen
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted underline underline-offset-4 py-3"
          >
            Gerät zurücksetzen
          </button>
        </div>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 py-2.5">
      <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">
        {label}
      </p>
      <p className="font-display text-xl font-black tabular-nums">{value}</p>
    </div>
  )
}

/* -------------------------------- podium ------------------------------ */

function Podium({
  board,
  teamPhoto,
}: {
  board: ReturnType<typeof buildLeaderboard>
  teamPhoto: string | null
}) {
  const top3 = board.slice(0, 3)
  // Display order: 2nd, 1st, 3rd for visual height stack
  const displayOrder = [top3[1], top3[0], top3[2]].filter(Boolean)
  const heights = [110, 140, 95]

  return (
    <div className="flex items-end justify-center gap-2 mb-2">
      {displayOrder.map((entry, i) => {
        if (!entry) return null
        const rank = entry === top3[0] ? 1 : entry === top3[1] ? 2 : 3
        const color =
          rank === 1
            ? 'bg-gold'
            : rank === 2
              ? 'bg-silver'
              : 'bg-bronze'
        const ring =
          rank === 1
            ? 'border-gold'
            : rank === 2
              ? 'border-silver'
              : 'border-bronze'
        const photo = entry.photoUrl ?? (entry.isYou ? teamPhoto : null)
        return (
          <div
            key={entry.id}
            className="flex-1 flex flex-col items-center max-w-[8.5rem]"
          >
            <div className="mb-2">
              {photo ? (
                <span
                  className={`block size-14 rounded-full overflow-hidden border-[3px] ${ring} shadow-md`}
                >
                  <img
                    src={photo}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
              ) : (
                <span
                  className={`flex size-14 rounded-full border-[3px] ${ring} bg-paper-dim dark:bg-white/10 items-center justify-center font-display font-black text-lg uppercase`}
                >
                  {entry.name.slice(0, 2)}
                </span>
              )}
            </div>
            <p className="font-sans text-[11px] font-bold text-center leading-tight line-clamp-2 mb-1 px-0.5">
              {entry.name}
            </p>
            <p className="font-display text-sm font-black tabular-nums mb-2">
              {entry.score}
            </p>
            <div
              className={`w-full rounded-t-xl ${color} text-ink flex items-start justify-center pt-2 font-display font-black text-2xl shadow-[0_-2px_0_rgba(0,0,0,0.15)_inset]`}
              style={{ height: heights[i] }}
            >
              {rank}
            </div>
          </div>
        )
      })}
    </div>
  )
}
