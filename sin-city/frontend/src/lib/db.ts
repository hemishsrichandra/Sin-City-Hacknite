// ─── Firestore Database Utilities ─────────────────────────────────────────────
// All reads/writes to Firestore go through these helpers.
// User document shape:  /users/{uid}  →  { coins, inventory, bookings, createdAt }

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Types ──────────────────────────────────────────────────────────────────────
export interface UserData {
  coins:     number
  inventory: string[]
  bookings:  BookingData[]
  createdAt?: unknown
}

export interface BookingData {
  id:          string
  name:        string
  type:        string
  district:    string
  date:        string
  coins_spent: number
  status:      string
  details?:    Record<string, unknown>
}

// ── getUserDoc ─────────────────────────────────────────────────────────────────
/**
 * Fetch (or create) the Firestore document for a given UID.
 * First-time Google sign-ins automatically receive 1,000 coins.
 */
export async function getUserDoc(uid: string): Promise<UserData> {
  const ref  = doc(db, 'users', uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    return snap.data() as UserData
  }

  // First login — provision the account
  const fresh: UserData = {
    coins:     1000,
    inventory: [],
    bookings:  [],
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, fresh)
  return fresh
}

// ── updateUserDoc ──────────────────────────────────────────────────────────────
/**
 * Partial-merge update. Pass only the fields you want to change.
 * Example:  updateUserDoc(uid, { coins: 850 })
 */
export async function updateUserDoc(
  uid:  string,
  data: Partial<UserData>,
): Promise<void> {
  const ref = doc(db, 'users', uid)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateDoc(ref, data as any)
}

// ── subscribeUserDoc ───────────────────────────────────────────────────────────
/**
 * Real-time listener. The callback fires immediately with current data and then
 * on every subsequent write — enabling seamless cross-device sync.
 *
 * Returns an `unsubscribe` function; call it on component unmount.
 */
export function subscribeUserDoc(
  uid:      string,
  callback: (data: UserData) => void,
): Unsubscribe {
  const ref = doc(db, 'users', uid)
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as UserData)
    }
  })
}
