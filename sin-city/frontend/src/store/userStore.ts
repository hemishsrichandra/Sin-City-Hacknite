// ─── User Store (Firebase-backed) ─────────────────────────────────────────────
// Replaces the old username/password/JWT store.
// Auth state comes from Firebase; user data lives in Firestore.
// A real-time onSnapshot listener keeps coins/inventory/bookings in sync
// across devices automatically.

import { create } from 'zustand'
import type { User } from 'firebase/auth'
import { subscribeUserDoc, updateUserDoc } from '../lib/db'
import type { BookingData as Booking, UserData } from '../lib/db'

// Re-export Booking type so other files can import it from the store as before
export type { Booking }

// ── State shape ───────────────────────────────────────────────────────────────
export interface UserState {
  // Auth
  firebaseUser: User | null
  authLoading:  boolean                    // true during initial auth state resolution

  // Game data (mirrored from Firestore + kept in sync via onSnapshot)
  coins:        number
  inventory:    string[]
  bookings:     Booking[]
  dataLoading:  boolean                    // true while first Firestore fetch is in flight

  // Actions
  setFirebaseUser: (user: User | null) => void
  setAuthLoading:  (v: boolean) => void
  setUserData:     (data: Partial<UserData>) => void

  addCoins:        (amount: number) => void
  removeCoins:     (amount: number) => boolean   // false = insufficient funds
  addToInventory:  (itemId: string) => void
  hasItem:         (itemId: string) => boolean
  addBooking:      (booking: Booking) => void
  logout:          () => void
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useUserStore = create<UserState>()((set, get) => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  firebaseUser: null,
  authLoading:  true,
  coins:        0,
  inventory:    [],
  bookings:     [],
  dataLoading:  false,

  // ── Setters ────────────────────────────────────────────────────────────────
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setAuthLoading:  (v)    => set({ authLoading: v }),
  setUserData:     (data) => set({
    ...(data.coins     !== undefined ? { coins:     data.coins }     : {}),
    ...(data.inventory !== undefined ? { inventory: data.inventory } : {}),
    ...(data.bookings  !== undefined ? { bookings:  data.bookings }  : {}),
    dataLoading: false,
  }),

  // ── Coin helpers ───────────────────────────────────────────────────────────
  addCoins: (amount) => {
    const { firebaseUser, coins } = get()
    const next = coins + amount
    set({ coins: next })
    if (firebaseUser) {
      updateUserDoc(firebaseUser.uid, { coins: next }).catch(console.error)
    }
  },

  removeCoins: (amount) => {
    const { firebaseUser, coins } = get()
    if (coins < amount) return false
    const next = coins - amount
    set({ coins: next })
    if (firebaseUser) {
      updateUserDoc(firebaseUser.uid, { coins: next }).catch(console.error)
    }
    return true
  },

  // ── Inventory helpers ─────────────────────────────────────────────────────
  addToInventory: (itemId) => {
    const { firebaseUser, inventory } = get()
    const next = [...inventory, itemId]
    set({ inventory: next })
    if (firebaseUser) {
      updateUserDoc(firebaseUser.uid, { inventory: next }).catch(console.error)
    }
  },

  hasItem: (itemId) => get().inventory.includes(itemId),

  // ── Booking helpers ────────────────────────────────────────────────────────
  addBooking: (booking) => {
    const { firebaseUser, bookings } = get()
    const next = [...bookings, booking]
    set({ bookings: next })
    if (firebaseUser) {
      updateUserDoc(firebaseUser.uid, { bookings: next }).catch(console.error)
    }
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logout: () => set({
    firebaseUser: null,
    coins:        0,
    inventory:    [],
    bookings:     [],
    dataLoading:  false,
  }),
}))

// ── Cross-device real-time sync ───────────────────────────────────────────────
// Start this once after a successful sign-in (called from App.tsx auth listener).
let _unsubscribeSnapshot: (() => void) | null = null

export function startUserDocListener(uid: string) {
  stopUserDocListener()
  _unsubscribeSnapshot = subscribeUserDoc(uid, (data) => {
    useUserStore.getState().setUserData(data)
  })
}

export function stopUserDocListener() {
  if (_unsubscribeSnapshot) {
    _unsubscribeSnapshot()
    _unsubscribeSnapshot = null
  }
}
