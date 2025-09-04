import { create } from 'zustand'

export type Scores = { cozy:number; adventure:number; foodie:number; culture:number }

type State = {
  step: number
  scales: number
  scores: Scores
  prefs: Record<string,string>
  setStep: (n:number)=>void
  addScale: ()=>void
  bump: (k:keyof Scores)=>void
  setPref: (k:string, v:string)=>void
}

export const useStore = create<State>((set)=> ({
  step: 0, scales: 0, scores: { cozy:0, adventure:0, foodie:0, culture:0 }, prefs:{},
  setStep: (n)=> set((s)=> ({ step: Math.max(s.step, n) })),
  addScale: ()=> set((s)=> ({ scales: s.scales + 1 })),
  bump: (k)=> set((s)=> ({ scores: { ...s.scores, [k]: s.scores[k]+1 } })),
  setPref: (k,v)=> set((s)=> ({ prefs: { ...s.prefs, [k]: v } }))
}))
