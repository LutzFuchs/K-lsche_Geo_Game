import { useEffect, useRef, useState } from 'react'
import type { GeoStatus } from '../types'

/**
 * Subscribes to navigator.geolocation.watchPosition and exposes a normalized
 * status. We rely on the browser's own polling rather than spinning a
 * setInterval — modern UAs deliver updates every few seconds when accuracy
 * permits, which matches the "5–10s" cadence the brief asks for. As a backstop
 * for stale fixes, we restart the watcher if no update lands for ~20s.
 */
export function useGeolocation(active: boolean): GeoStatus {
  const [status, setStatus] = useState<GeoStatus>({ kind: 'idle' })
  const watchIdRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    if (!active) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      return
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus({
        kind: 'unavailable',
        message: 'Dieses Gerät bietet keinen Standort-Zugriff.',
      })
      return
    }

    setStatus({ kind: 'requesting' })

    const start = () => {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          lastUpdateRef.current = Date.now()
          setStatus({
            kind: 'tracking',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            updatedAt: lastUpdateRef.current,
          })
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setStatus({
              kind: 'denied',
              message:
                'Standortzugriff wurde verweigert. Aktiviert ihn in den Browser-Einstellungen und ladet die Seite neu.',
            })
          } else {
            setStatus({
              kind: 'unavailable',
              message:
                err.message || 'Standort konnte nicht ermittelt werden.',
            })
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5_000,
          timeout: 15_000,
        },
      )
      watchIdRef.current = id
    }

    start()

    const stalenessTimer = window.setInterval(() => {
      const sinceLast = Date.now() - lastUpdateRef.current
      if (lastUpdateRef.current > 0 && sinceLast > 20_000) {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current)
        }
        start()
      }
    }, 10_000)

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      window.clearInterval(stalenessTimer)
    }
  }, [active])

  return status
}
