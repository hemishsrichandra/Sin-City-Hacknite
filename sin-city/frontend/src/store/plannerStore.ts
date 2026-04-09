import { create } from 'zustand'
import { PlannerFormData } from '../types'

type PlannerStage = 'quiz' | 'streaming' | 'result'

interface PlannerState {
  stage: PlannerStage
  formData: PlannerFormData
  output: string
  isStreaming: boolean
  setStage: (s: PlannerStage) => void
  setFormData: (d: Partial<PlannerFormData>) => void
  setOutput: (o: string) => void
  appendOutput: (chunk: string) => void
  setIsStreaming: (v: boolean) => void
  reset: () => void
}

const defaultFormData: PlannerFormData = {
  vices: [],
  budget_per_night: 500,
  days: 3,
  vibe: 'WILD',
  party_size: 2,
}

export const usePlannerStore = create<PlannerState>((set) => ({
  stage: 'quiz',
  formData: { ...defaultFormData },
  output: '',
  isStreaming: false,
  setStage: (s) => set({ stage: s }),
  setFormData: (d) => set((state) => ({ formData: { ...state.formData, ...d } })),
  setOutput: (o) => set({ output: o }),
  appendOutput: (chunk) => set((state) => ({ output: state.output + chunk })),
  setIsStreaming: (v) => set({ isStreaming: v }),
  reset: () => set({ stage: 'quiz', formData: { ...defaultFormData }, output: '', isStreaming: false }),
}))
