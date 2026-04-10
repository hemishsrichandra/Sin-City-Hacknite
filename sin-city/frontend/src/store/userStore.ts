import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const AVATARS = ['🎭', '🃏', '👑', '💀', '🐍', '🦊', '🎲', '🔮', '💎', '🌙', '🍸', '🎯']

export interface UserState {
  user: { username: string; avatar: string } | null
  coins: number
  inventory: string[]
  login: (username: string) => void
  logout: () => void
  addCoins: (amount: number) => void
  removeCoins: (amount: number) => boolean // returns false if insufficient
  addToInventory: (itemId: string) => void
  hasItem: (itemId: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      coins: 0,
      inventory: [],

      login: (username: string) => {
        const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)]
        const existing = get().user
        if (existing) {
          // Re-login: keep coins & inventory
          set({ user: { username, avatar } })
        } else {
          // New user: start with 1000 coins
          set({ user: { username, avatar }, coins: 1000, inventory: [] })
        }
      },

      logout: () => {
        set({ user: null })
        // Keep coins & inventory so they persist on re-login
      },

      addCoins: (amount: number) => {
        set((state) => ({ coins: state.coins + amount }))
      },

      removeCoins: (amount: number) => {
        const current = get().coins
        if (current < amount) return false
        set({ coins: current - amount })
        return true
      },

      addToInventory: (itemId: string) => {
        set((state) => ({
          inventory: [...state.inventory, itemId],
        }))
      },

      hasItem: (itemId: string) => {
        return get().inventory.includes(itemId)
      },
    }),
    {
      name: 'sin-city-user',
    }
  )
)
