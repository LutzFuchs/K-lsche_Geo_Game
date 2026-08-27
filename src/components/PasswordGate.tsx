import { useState } from 'react'

type Props = {
  password: string
  onUnlock: () => void
  onCancel: () => void
}

/** On-demand password prompt used to enable the lobby's Testmodus toggle. */
export function PasswordGate({ password, onUnlock, onCancel }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === password) {
      onUnlock()
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <main className="relative min-h-svh flex flex-col items-center justify-center px-6 bg-ink text-paper">
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-6 left-6 text-xs uppercase tracking-widest text-paper/70 font-semibold"
      >
        ← Zurück
      </button>
      <p className="uppercase tracking-[0.3em] text-xs font-bold opacity-60 mb-3">
        Testmodus
      </p>
      <h1 className="font-display text-2xl sm:text-3xl font-black leading-tight mb-6 text-center">
        Passwort eingeben
      </h1>
      <form onSubmit={submit} className="w-full max-w-xs flex flex-col gap-3">
        <input
          type="password"
          inputMode="text"
          autoComplete="off"
          autoFocus
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
          }}
          placeholder="Passwort"
          className={`w-full px-4 py-4 text-lg text-center font-sans font-semibold tracking-wide bg-white/5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-tomato/30 ${
            error ? 'border-tomato animate-pulse' : 'border-paper/40'
          }`}
        />
        <button
          type="submit"
          disabled={input.length === 0}
          className="w-full px-4 py-4 rounded-xl font-display text-xl font-black tracking-wide bg-tomato text-white disabled:opacity-30 active:scale-[0.99] transition shadow-[0_6px_0_-2px_rgba(0,0,0,0.5)] disabled:shadow-none"
        >
          Aktivieren
        </button>
        {error && (
          <p className="text-sm text-tomato font-semibold text-center">
            Falsches Passwort.
          </p>
        )}
      </form>
    </main>
  )
}
