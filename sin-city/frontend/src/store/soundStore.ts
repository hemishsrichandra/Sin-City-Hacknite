import { create } from 'zustand'

interface SoundState {
  isPlaying: boolean
  volume: number
  toggle: () => void
  setVolume: (v: number) => void
}

export const useSoundStore = create<SoundState>((set) => ({
  isPlaying: false,
  volume: 0.15,
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (v: number) => set({ volume: v }),
}))
