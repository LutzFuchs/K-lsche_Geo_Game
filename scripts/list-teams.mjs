/**
 * Read-only: lists every team in the Firestore `teams` collection with its
 * score, solved count, and last update. Use it to verify state before/after
 * a wipe (see scripts/wipe-teams.sh).
 *
 *   node scripts/list-teams.mjs
 *
 * Reads are allowed by the security rules, so this needs no auth.
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// Same project config as src/lib/firebase.ts
const firebaseConfig = {
  apiKey: 'AIzaSyC5Foe51W_EuPQ7S7iti_Olt-CdgGZtky8',
  authDomain: 'kope-schnitzeljagd.firebaseapp.com',
  projectId: 'kope-schnitzeljagd',
  storageBucket: 'kope-schnitzeljagd.firebasestorage.app',
  messagingSenderId: '810075247482',
  appId: '1:810075247482:web:80f3f63c282981c59dbcc3',
  measurementId: 'G-3X489QKZRW',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const snapshot = await getDocs(collection(db, 'teams'))

console.log(`${snapshot.size} team(s) in 'teams':`)
for (const d of snapshot.docs) {
  const t = d.data()
  const when = t.lastUpdate ? new Date(t.lastUpdate).toISOString() : '—'
  console.log(
    `  • ${t.teamName ?? '(no name)'} — score ${t.score ?? 0}, solved ${t.solvedCount ?? 0}, photo ${t.photoUrl ? 'yes' : 'no'}, updated ${when}`,
  )
}
process.exit(0)
