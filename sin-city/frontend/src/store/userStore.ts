import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Booking {
  id: string
  name: string
  type: string        // "show", "escort", "cabaret", "substance"
  district: string    // "Shows", "Nightlife", "Cloud 9"
  date: string
  coins_spent: number
  status: string      // "confirmed", "completed", "cancelled"
  details?: Record<string, any>
}

export interface UserState {
  user: { username: string; avatar: string } | null
  token: string | null
  coins: number
  inventory: string[]
  bookings: Booking[]
  login: (username: string, token: string, avatar: string, initialCoins: number, initialInventory: string[], initialBookings?: Booking[]) => void
  logout: () => void
  addCoins: (amount: number) => void
  removeCoins: (amount: number) => boolean // returns false if insufficient
  addToInventory: (itemId: string) => void
  hasItem: (itemId: string) => boolean
  addBooking: (booking: Booking) => void
  syncToServer: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      coins: 0,
      inventory: [],
      bookings: [],

      login: (username: string, token: string, avatar: string, initialCoins: number, initialInventory: string[], initialBookings: Booking[] = []) => {
        set({ 
          user: { username, avatar }, 
          token, 
          coins: initialCoins, 
          inventory: initialInventory,
          bookings: initialBookings
        })
      },

      logout: () => {
        set({ user: null, token: null, coins: 0, inventory: [], bookings: [] })
      },

      addCoins: (amount: number) => {
        set((state) => ({ coins: state.coins + amount }))
        get().syncToServer()
      },

      removeCoins: (amount: number) => {
        const current = get().coins
        if (current < amount) return false
        set({ coins: current - amount })
        get().syncToServer()
        return true
      },

      addToInventory: (itemId: string) => {
        set((state) => ({
          inventory: [...state.inventory, itemId],
        }))
        get().syncToServer()
      },

      hasItem: (itemId: string) => {
        return get().inventory.includes(itemId)
      },

      addBooking: (booking: Booking) => {
        set((state) => ({
          bookings: [...state.bookings, booking],
        }))
        get().syncToServer()
      },

      syncToServer: async () => {
        const { token, coins, inventory, bookings } = get()
        if (!token) return
        
        try {
          await fetch('http://localhost:8000/api/user/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ coins, inventory, bookings })
          })
        } catch (error) {
          console.error("Failed to sync store to server", error)
        }
      }
    }),
    {
      name: 'sin-city-user',
    }
  )
)
