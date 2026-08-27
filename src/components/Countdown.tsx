import { useEffect, useState } from 'react'

type Props = {
  target: Date
  onElapse?: () => void
}

type Parts = { days: number; hours: number; minutes: number; seconds: number; total: number }

function diff(target: Date): Parts {
  const total = Math.max(0, target.getTime() - Date.now())
  const days = Math.floor(total / 86_400_000)
  const hours = Math.floor((total % 86_400_000) / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1_000)
  return { days, hours, minutes, seconds, total }
}

export function Countdown({ target, onElapse }: Props) {
  const [parts, setParts] = useState<Parts>(() => diff(target))

  useEffect(() => {
    setParts(diff(target))
    const id = window.setInterval(() => {
      const next = diff(target)
      setParts(next)
      if (next.total <= 0) {
        window.clearInterval(id)
        onElapse?.()
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [target, onElapse])

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-3 w-full"
      role="timer"
      aria-label="Zeit bis zum Start"
    >
      <Cell label="Tage" value={parts.days} />
      <Cell label="Std" value={parts.hours} />
      <Cell label="Min" value={parts.minutes} />
      <Cell label="Sek" value={parts.seconds} />
    </div>
  )
}

function Cell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-night text-paper py-3 px-2 flex flex-col items-center shadow-[0_6px_0_-2px_rgba(0,0,0,0.4)]">
      <span className="font-sans tabular-nums text-3xl sm:text-4xl font-bold tracking-tight leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-widest text-paper/70 font-sans font-semibold">
        {label}
      </span>
    </div>
  )
}
