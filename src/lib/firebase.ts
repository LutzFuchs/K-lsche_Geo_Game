import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'

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
export const db = getFirestore(app)

export type LeaderboardEntry = {
  teamId: string
  teamName: string
  score: number
  solvedCount: number
  lastUpdate: number
  photoUrl?: string
}

export async function registerTeam(teamId: string, teamName: string, photoUrl?: string) {
  const teamsRef = collection(db, 'teams_koeln')
  await setDoc(doc(teamsRef, teamId), {
    teamId,
    teamName,
    score: 0,
    solvedCount: 0,
    lastUpdate: Date.now(),
    photoUrl: photoUrl || null,
  })
}

export async function updateTeamScore(teamId: string, score: number, solvedCount: number) {
  const teamsRef = collection(db, 'teams_koeln')
  await setDoc(
    doc(teamsRef, teamId),
    {
      score,
      solvedCount,
      lastUpdate: Date.now(),
    },
    { merge: true }
  )
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const teamsRef = collection(db, 'teams_koeln')
  const q = query(teamsRef, orderBy('score', 'desc'), limit(100))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data() as LeaderboardEntry)
}

export async function getTeam(teamId: string): Promise<LeaderboardEntry | null> {
  const teamsRef = collection(db, 'teams_koeln')
  const snapshot = await getDoc(doc(teamsRef, teamId))
  return snapshot.exists() ? (snapshot.data() as LeaderboardEntry) : null
}
