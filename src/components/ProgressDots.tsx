type Props = {
  total: number
  currentIndex: number
  solvedCount: number
}

/**
 * One dot per station. Solved = filled, current = ringed, pending = hollow.
 */
export function ProgressDots({ total, currentIndex, solvedCount }: Props) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Station ${currentIndex + 1} von ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const isSolved = i < solvedCount
        const isCurrent = i === currentIndex && !isSolved
        return (
          <span
            key={i}
            className={
              isSolved
                ? 'size-2 rounded-full bg-ink dark:bg-paper'
                : isCurrent
                  ? 'size-2.5 rounded-full border-2 border-tomato'
                  : 'size-1.5 rounded-full border border-rule/40'
            }
          />
        )
      })}
    </div>
  )
}
