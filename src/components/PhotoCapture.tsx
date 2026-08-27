import { useRef, useState } from 'react'
import { fileToDownscaledDataUrl } from '../lib/photo'

type Props = {
  value: string | null
  onChange: (dataUrl: string | null) => void
}

export function PhotoCapture({ value, onChange }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    try {
      const url = await fileToDownscaledDataUrl(file)
      onChange(url)
    } catch {
      // Silent failure — user can retry; we never block the start flow on a
      // missing photo, only nudge them to take one.
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative">
          <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-ink dark:border-paper shadow-[0_10px_0_-2px_rgba(10,10,10,0.85)]">
            <img
              src={value}
              alt="Teamfoto"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="px-3 py-3 rounded-xl border border-rule/30 text-sm font-semibold tracking-wide uppercase"
            >
              Neu aufnehmen
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-3 rounded-xl border border-rule/30 text-sm font-semibold tracking-wide uppercase"
            >
              Entfernen
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          disabled={busy}
          className="aspect-square w-full rounded-2xl border-2 border-dashed border-ink/40 dark:border-paper/40 flex flex-col items-center justify-center gap-3 hover:border-tomato active:scale-[0.99] transition disabled:opacity-50"
        >
          <CameraIcon />
          <span className="font-sans uppercase tracking-widest text-sm font-semibold">
            {busy ? 'Lade…' : 'Teamfoto aufnehmen'}
          </span>
          <span className="text-xs text-muted">
            Tippen für Kamera
          </span>
        </button>
      )}

      {!value && (
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="mt-2 w-full text-xs text-muted underline underline-offset-4"
        >
          Oder aus der Galerie wählen
        </button>
      )}
    </div>
  )
}

function CameraIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 22h8l4-6h20l4 6h8a4 4 0 014 4v22a4 4 0 01-4 4H10a4 4 0 01-4-4V26a4 4 0 014-4z" />
      <circle cx="32" cy="36" r="9" />
      <circle cx="32" cy="36" r="4" />
      <path d="M48 26h2" />
    </svg>
  )
}
