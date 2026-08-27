import { useEffect, useState } from 'react'
import { fetchLeaderboard } from '../lib/firebase'
import type { LeaderboardEntry } from '../lib/firebase'

export function useFirebaseLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const data = await fetchLeaderboard()
        if (isMounted) {
          setEntries(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return { entries, loading }
}
