// src/store/index.ts
import { create } from 'zustand'

export type Scale = { id: string; value: number }

export type Store = {
  step: number
  setStep: (n: number) => void

  // NEW: collectibles + quest results
  scales: Scale[]
  addScale: (id: string, value?: number) => void

  results: {
    unblurCorrect?: number
    quizIdeaTitle?: string
    chefCompleted?: boolean
  }
  setResults: (patch: Partial<Store['results']>) => void

  reset: () => void
}

export const useStore = create<Store>((set) => ({
  step: 0,
  setStep: (n) => set({ step: n }),

  // minimal impl
  scales: [],
  addScale: (id, value = 1) =>
    set((s) => {
      const i = s.scales.findIndex((x) => x.id === id)
      if (i >= 0) {
        const next = [...s.scales]
        next[i] = { id, value }
        return { scales: next }
      }
      return { scales: [...s.scales, { id, value }] }
    }),

  results: {},
  setResults: (patch) =>
    set((s) => ({ results: { ...s.results, ...patch } })),

  reset: () =>
    set({
      step: 0,
      scales: [],
      results: {},
    }),
}))
