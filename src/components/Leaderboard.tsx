import type { LeaderboardEntry } from '../lib/leaderboard'

type Props = {
  entries: LeaderboardEntry[]
  total: number
  variant?: 'compact' | 'full'
  teamPhoto?: string | null
}

const medalColor = (rank: number) =>
  rank === 1
    ? 'text-gold'
    : rank === 2
      ? 'text-silver'
      : rank === 3
        ? 'text-bronze'
        : 'text-muted'

export function Leaderboard({
  entries,
  total,
  variant = 'compact',
  teamPhoto,
}: Props) {
  const list = variant === 'compact' ? entries.slice(0, 4) : entries

  return (
    <ol className="space-y-1.5">
      {list.map((entry, i) => {
        const rank = i + 1
        const photo = entry.photoUrl ?? (entry.isYou ? teamPhoto : null)
        return (
          <li
            key={entry.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
              entry.isYou
                ? 'bg-ink text-paper dark:bg-paper dark:text-ink'
                : 'bg-paper-dim dark:bg-white/5'
            }`}
          >
            <span
              className={`font-display font-black text-lg w-6 text-center tabular-nums ${
                entry.isYou ? 'text-gold' : medalColor(rank)
              }`}
            >
              {rank}
            </span>
            {photo ? (
              <span className="size-7 rounded-full overflow-hidden border border-current/40 shrink-0">
                <img
                  src={photo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
            ) : (
              <span className="size-7 rounded-full bg-current/10 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold opacity-70 shrink-0">
                {entry.name.slice(0, 2)}
              </span>
            )}
            <span className="flex-1 min-w-0 font-sans font-semibold truncate">
              {entry.name}
              {entry.isYou && (
                <span className="ml-2 text-[10px] uppercase tracking-widest opacity-70">
                  Ihr
                </span>
              )}
            </span>
            <span className="font-sans tabular-nums text-sm opacity-80">
              {entry.solved}/{total}
            </span>
            <span className="font-display tabular-nums font-black text-base w-12 text-right">
              {entry.score}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
