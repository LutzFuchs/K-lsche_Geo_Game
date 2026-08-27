import { useEffect, useState } from 'react'
import { PhotoCapture } from './PhotoCapture'
import { Countdown } from './Countdown'
import { PasswordGate } from './PasswordGate'
import { MunichSkyline } from './StationHero'
import { Leaderboard } from './Leaderboard'
import { raceStartAt, teamGateOpen, testModePassword } from '../config'
import { useFirebaseLeaderboard } from '../hooks/useFirebaseLeaderboard'
import { mapFirebaseEntries } from '../lib/leaderboard'

const ADMIN_MODE_KEY = 'kope.adminModeEnabled'

type Props = {
  teamName: string | null
  teamPhoto: string | null
  onSetTeamName: (n: string) => void
  onSetTeamPhoto: (p: string | null) => void
  onStartRace: () => void
}

type Step = 'name' | 'photo' | 'lobby'

// Short labels, all derived from config.ts so dates/times live in one place.
const RACE_DATE_SHORT = raceStartAt.toLocaleDateString('de-DE', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Berlin',
})
const RACE_TIME = raceStartAt.toLocaleTimeString('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
})

export function WelcomeFlow({
  teamName,
  teamPhoto,
  onSetTeamName,
  onSetTeamPhoto,
  onStartRace,
}: Props) {
  const [step, setStep] = useState<Step>(() => {
    if (!teamName) return 'name'
    if (!teamPhoto) return 'photo'
    return 'lobby'
  })

  // Tick once a second only on the lobby so the GO button enables in real time
  const [, force] = useState(0)
  useEffect(() => {
    if (step !== 'lobby') return
    const id = window.setInterval(() => force((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [step])

  if (step === 'name') {
    return (
      <NameStep
        initial={teamName ?? ''}
        onNext={(n) => {
          onSetTeamName(n)
          setStep('photo')
        }}
      />
    )
  }

  if (step === 'photo') {
    return (
      <PhotoStep
        teamName={teamName ?? ''}
        photo={teamPhoto}
        onPhoto={onSetTeamPhoto}
        onBack={() => setStep('name')}
        onNext={() => setStep('lobby')}
      />
    )
  }

  return (
    <LobbyStep
      teamName={teamName ?? ''}
      teamPhoto={teamPhoto}
      onBack={() => setStep('photo')}
      onStart={onStartRace}
    />
  )
}

/* ------------------------------- step 1 ------------------------------- */

function NameStep({
  initial,
  onNext,
}: {
  initial: string
  onNext: (name: string) => void
}) {
  const [name, setName] = useState(initial)
  const trimmed = name.trim()
  const valid = trimmed.length >= 2

  return (
    <main className="min-h-svh flex flex-col px-6 pt-6 pb-8">
      <div className="rounded-2xl overflow-hidden border-2 border-ink dark:border-paper shadow-[0_8px_0_-2px_rgba(0,0,0,0.4)] mb-6">
        <div className="aspect-[15/9] w-full">
          <MunichSkyline />
        </div>
      </div>

      <p className="text-center font-sans uppercase tracking-[0.3em] text-xs font-semibold text-tomato mb-3">
        München · {RACE_DATE_SHORT} · {RACE_TIME}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-black leading-[1.05] tracking-tight text-center mb-2">
        Die letzte Nachricht des Stadtarchitekten
      </h1>
      <p className="text-center text-base text-muted mb-6">
        Sechs Stationen. 60 Minuten. Eine Stadt voller Hinweise.
      </p>

      <div className="mt-auto">
        <p className="text-xs uppercase tracking-widest text-muted mb-2 font-semibold">
          Schritt 1 von 3 · Teamname
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (valid) onNext(trimmed)
          }}
          className="flex flex-col gap-3"
        >
          <label className="sr-only" htmlFor="team-name">
            Teamname
          </label>
          <input
            id="team-name"
            type="text"
            placeholder="z. B. Brezn-Bande"
            autoComplete="off"
            autoCapitalize="words"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-4 text-lg text-center font-sans font-semibold tracking-wide bg-paper-dim dark:bg-white/5 border-2 border-ink dark:border-paper rounded-xl focus:outline-none focus:ring-4 focus:ring-tomato/30"
          />
          <PrimaryButton type="submit" disabled={!valid}>
            Weiter
          </PrimaryButton>
        </form>
      </div>
    </main>
  )
}

/* ------------------------------- step 2 ------------------------------- */

function PhotoStep({
  teamName,
  photo,
  onPhoto,
  onBack,
  onNext,
}: {
  teamName: string
  photo: string | null
  onPhoto: (p: string | null) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <main className="min-h-svh flex flex-col px-6 pt-10 pb-8">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-xs uppercase tracking-widest text-muted font-semibold mb-4"
      >
        ← Zurück
      </button>

      <p className="text-xs uppercase tracking-widest text-muted font-semibold mb-2">
        Schritt 2 von 3 · Teamfoto
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-black leading-tight mb-1">
        {teamName}
      </h1>
      <p className="text-sm text-muted mb-6">
        Macht ein Gruppenfoto — es begleitet euch durch die ganze Mission und
        steht auf dem Siegerpodest.
      </p>

      <PhotoCapture value={photo} onChange={onPhoto} />

      <div className="mt-auto pt-6 flex flex-col gap-2">
        <PrimaryButton onClick={onNext} disabled={!photo}>
          {photo ? 'Weiter zur Lobby' : 'Foto erforderlich'}
        </PrimaryButton>
        <button
          type="button"
          onClick={onNext}
          className="w-full py-3 text-sm text-muted underline underline-offset-4"
        >
          Ohne Foto fortfahren
        </button>
      </div>
    </main>
  )
}

/* ------------------------------- step 3 ------------------------------- */

function LobbyStep({
  teamName,
  teamPhoto,
  onBack,
  onStart,
}: {
  teamName: string
  teamPhoto: string | null
  onBack: () => void
  onStart: () => void
}) {
  const [showRules, setShowRules] = useState(false)
  const [showAdminPrompt, setShowAdminPrompt] = useState(false)
  const [launching, setLaunching] = useState(false)
  const [adminModeEnabled, setAdminModeEnabled] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_MODE_KEY) === 'true'
    } catch {
      return false
    }
  })

  // Live leaderboard data — used in admin mode so the organizer can see all teams.
  const { entries: liveEntries, loading: boardLoading } = useFirebaseLeaderboard()
  const now = Date.now()
  const started = teamGateOpen(adminModeEnabled, now)

  if (launching) {
    return <LaunchCountdown onDone={onStart} />
  }

  if (showAdminPrompt) {
    return (
      <PasswordGate
        password={testModePassword}
        onUnlock={() => {
          try {
            localStorage.setItem(ADMIN_MODE_KEY, 'true')
          } catch {
            // Quota or private mode — degrade gracefully.
          }
          setAdminModeEnabled(true)
          setShowAdminPrompt(false)
        }}
        onCancel={() => setShowAdminPrompt(false)}
      />
    )
  }

  if (showRules) {
    return (
      <main className="min-h-svh flex flex-col px-6 pt-8 pb-8">
        <button
          type="button"
          onClick={() => setShowRules(false)}
          className="self-start text-xs uppercase tracking-widest text-muted font-semibold mb-6"
        >
          ← Zurück
        </button>

        <h1 className="font-display text-3xl font-black leading-tight mb-6">
          Spielregeln
        </h1>

        <div className="space-y-4 text-sm mb-8 flex-1 overflow-y-auto">
          <div>
            <p className="font-bold text-tomato mb-1">Die Mission</p>
            <p className="text-muted">6 Stationen. Löst Rätsel und findet die Antworten. Der Timer startet, sobald ihr auf GO tippt.</p>
          </div>

          <div>
            <p className="font-bold text-tomato mb-1">Basispunkte (pro Station)</p>
            <ul className="space-y-1 text-muted text-xs">
              <li>• Stationen 1-2: 160 Punkte</li>
              <li>• Stationen 3-4: 200 Punkte</li>
              <li>• Stationen 5-6: 240 Punkte</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-tomato mb-1">Zeitbonus</p>
            <p className="text-muted text-xs">Je schneller ihr löst, desto mehr: bis zu +60 Punkte sofort, linear fallend bis 0 nach 10 Minuten.</p>
          </div>

          <div>
            <p className="font-bold text-tomato mb-1">Strafen</p>
            <ul className="space-y-1 text-muted text-xs">
              <li>• Jede falsche Antwort: -15 Punkte</li>
              <li>• Hinweis offenbaren: -30 Punkte</li>
              <li>• Buchstabe aufdecken: -15 Punkte je Buchstabe</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-tomato mb-1">Beispiel</p>
            <p className="text-muted text-xs">Station 3 · 1 falsch · 1 Hinweis · 1,5 Min = 200 + 51 − 15 − 30 = <span className="font-bold">206 Punkte</span></p>
          </div>

          <div>
            <p className="font-bold text-tomato mb-1">Gewinner</p>
            <p className="text-muted">Höchste Punktzahl gewinnt. Live-Tabelle zeigt alle Teams.</p>
          </div>

          <div>
            <p className="font-bold text-tomato mb-1">GPS-Freischaltung</p>
            <p className="text-muted">Stationen entsperren automatisch wenn ihr in der Nähe seid. Erlaubt Standortzugriff!</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowRules(false)}
          className="w-full px-4 py-3 rounded-xl font-display font-black bg-ink text-paper active:scale-[0.99] transition shadow-[0_6px_0_-2px_rgba(0,0,0,0.5)]"
        >
          Verstanden
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-svh flex flex-col px-6 pt-10 pb-8">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-xs uppercase tracking-widest text-muted font-semibold mb-4"
      >
        ← Foto ändern
      </button>

      <div className="flex items-center gap-4 mb-6">
        <TeamAvatar photo={teamPhoto} size={72} />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted font-semibold">
            Team
          </p>
          <h1 className="font-display text-2xl font-black leading-tight truncate">
            {teamName}
          </h1>
        </div>
      </div>

      {adminModeEnabled ? (
        <section className="rounded-2xl bg-paper-dim dark:bg-white/5 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display text-sm font-black tracking-wide uppercase">
              Admin-Modus · Live-Tabelle
            </p>
            {boardLoading ? (
              <span className="text-[10px] uppercase tracking-widest text-muted animate-pulse">
                Lädt…
              </span>
            ) : liveEntries.length > 0 ? (
              <span className="text-[10px] uppercase tracking-widest text-muted font-bold">
                {liveEntries.length} Team{liveEntries.length !== 1 ? 's' : ''}
              </span>
            ) : null}
          </div>
          {boardLoading ? (
            <p className="text-sm text-muted text-center py-4">Teams werden geladen…</p>
          ) : liveEntries.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">
              Noch keine Teams in der Tabelle.
            </p>
          ) : (
            <Leaderboard
              entries={mapFirebaseEntries(liveEntries, null)}
              total={6}
              variant="full"
              teamPhoto={teamPhoto}
            />
          )}
        </section>
      ) : !started ? (
        <section className="rounded-2xl bg-gradient-to-br from-tomato to-tomato-deep text-white p-6 mb-6 shadow-[0_10px_0_-2px_rgba(0,0,0,0.3)]">
          <p className="font-sans uppercase tracking-[0.25em] text-xs font-bold opacity-90 mb-2">
            Start in
          </p>
          <Countdown target={raceStartAt} />
          <p className="mt-4 text-sm opacity-95">
            Die Mission beginnt um {RACE_TIME} Uhr. Trefft euch am Bierbrunnen.
          </p>
        </section>
      ) : (
        <section className="rounded-2xl bg-success text-white p-6 mb-6 shadow-[0_10px_0_-2px_rgba(0,0,0,0.3)] solve-burst">
          <p className="font-sans uppercase tracking-[0.25em] text-xs font-bold opacity-90 mb-1">
            Die Jagd hat begonnen
          </p>
          <p className="font-display text-3xl font-black leading-tight">
            Bereit zum Start?
          </p>
          <p className="text-sm opacity-95 mt-2">
            Tippt unten auf GO — ein 10-Sekunden-Countdown läuft, dann startet
            euer Timer.
          </p>
        </section>
      )}

      <ul className="space-y-2 text-sm text-muted mb-6">
        <BulletItem>6 Stationen · auto-freischaltend per GPS</BulletItem>
        <BulletItem>Höchste Punktzahl gewinnt</BulletItem>
        <BulletItem>Live-Tabelle mit allen Teams</BulletItem>
      </ul>

      <div className="mt-auto">
        {adminModeEnabled ? (
          <>
            <p className="text-center text-xs text-muted mb-3">
              Nur-Lese-Ansicht · Keine Spielsteuerung
            </p>
            <button
              type="button"
              onClick={() => {
                try { localStorage.removeItem(ADMIN_MODE_KEY) } catch {}
                setAdminModeEnabled(false)
              }}
              className="w-full px-4 py-3 rounded-xl font-display font-black bg-paper-dim text-ink active:scale-[0.99] transition shadow-[0_4px_0_-2px_rgba(0,0,0,0.3)]"
            >
              Admin-Modus verlassen
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setShowRules(true)}
              className="w-full px-4 py-3 rounded-xl font-display font-black bg-paper-dim text-ink mb-3 active:scale-[0.99] transition shadow-[0_4px_0_-2px_rgba(0,0,0,0.3)]"
            >
              Spielregeln
            </button>
            <button
              type="button"
              onClick={() => setLaunching(true)}
              disabled={!started}
              className={`w-full px-4 py-5 rounded-xl font-display text-2xl font-black tracking-wider uppercase transition active:scale-[0.99] shadow-[0_8px_0_-2px_rgba(0,0,0,0.4)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed ${
                started
                  ? 'bg-tomato text-white pop'
                  : 'bg-night text-paper'
              }`}
            >
              {started ? 'GO · Mission starten' : `Wartet auf ${RACE_TIME}`}
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              Erlaubt den Standortzugriff, wenn euer Browser fragt.
            </p>
            {!started && (
              <button
                type="button"
                onClick={() => setShowAdminPrompt(true)}
                className="mt-4 w-full text-center text-xs text-muted underline underline-offset-4"
              >
                Admin-Modus
              </button>
            )}
          </>
        )}
      </div>
    </main>
  )
}

/* --------------------------- launch countdown -------------------------- */

function LaunchCountdown({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(10)
  const [phase, setPhase] = useState<'counting' | 'go'>('counting')

  useEffect(() => {
    if (phase !== 'counting') return
    if (n <= 1) {
      const id = window.setTimeout(() => setPhase('go'), 1000)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setN((v) => v - 1), 1000)
    return () => window.clearTimeout(id)
  }, [n, phase])

  useEffect(() => {
    if (phase !== 'go') return
    const id = window.setTimeout(onDone, 700)
    return () => window.clearTimeout(id)
  }, [phase, onDone])

  return (
    <main className="min-h-svh flex flex-col items-center justify-center bg-ink text-paper">
      <p className="uppercase tracking-[0.3em] text-sm font-bold opacity-60 mb-4">
        {phase === 'counting' ? 'Start in' : 'Los geht’s'}
      </p>
      <p
        key={phase === 'counting' ? n : 'go'}
        className="font-display text-[6rem] sm:text-[8rem] leading-none font-black tabular-nums text-tomato pop"
      >
        {phase === 'counting' ? n : 'GO!'}
      </p>
    </main>
  )
}

/* ----------------------------- shared bits ---------------------------- */

function PrimaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="w-full px-4 py-4 rounded-xl font-display text-xl font-black tracking-wide bg-ink text-paper disabled:opacity-30 active:scale-[0.99] transition shadow-[0_6px_0_-2px_rgba(0,0,0,0.5)] disabled:shadow-none"
    >
      {children}
    </button>
  )
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 size-1.5 rounded-full bg-tomato shrink-0" />
      <span>{children}</span>
    </li>
  )
}

export function TeamAvatar({
  photo,
  size = 56,
  ringClass,
}: {
  photo: string | null
  size?: number
  ringClass?: string
}) {
  const className = `rounded-full overflow-hidden bg-paper-dim dark:bg-white/10 border-2 ${
    ringClass ?? 'border-ink dark:border-paper'
  } shrink-0`
  if (photo) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
      >
        <img src={photo} alt="Teamfoto" className="h-full w-full object-cover" />
      </div>
    )
  }
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
    >
      <div className="h-full w-full flex items-center justify-center text-muted">
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5 20a7 7 0 0114 0" />
        </svg>
      </div>
    </div>
  )
}
