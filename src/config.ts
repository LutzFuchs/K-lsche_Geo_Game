/**
 * Single-file customization surface for the day of the event.
 * Update the meeting point details + flag here without touching app logic.
 */
export const finalMeetingPointName = 'Augustiner Keller'
export const finalMeetingPointAddress = 'Arnulfstraße 52, 80335 München'
export const finalMeetingPointMapsUrl =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(`${finalMeetingPointName}, ${finalMeetingPointAddress}`)
/** Keep false until shortly before the race — flip to true (and redeploy) to reveal. */
export const showMeetingPoint = true  

/**
 * Password for the in-lobby "Testmodus" toggle. Entering it lets a device
 * bypass the race-start gate and hit GO immediately, any time before the
 * real start — for organizers/QA. Everyone else just waits for raceStartAt
 * like normal; there's no gate on reaching the lobby itself. Client-side
 * only (visible in the JS bundle) — a light deterrent, not real auth.
 */
export const testModePassword = 'luca1234'

/**
 * Hard race-start gate. Countdown shows until this moment, then GO
 * unlocks for everyone. 7 July 2026, 16:45 Berlin time (CEST = UTC+2) →
 * 14:45 UTC. Staggering team starts is handled manually on the day, not
 * by the app.
 */
export const raceStartAt = new Date('2026-07-07T14:45:00Z')

/** True once raceStartAt has passed, or immediately if test mode is on. */
export function teamGateOpen(testModeEnabled: boolean, now: number = Date.now()): boolean {
  if (testModeEnabled) return true
  return now >= raceStartAt.getTime()
}
