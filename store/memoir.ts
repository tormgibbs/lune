import { Memoir, MemoirInsert } from '@/db/schema'
import { create } from 'zustand'

interface MemoirStore {
  memoirs: Memoir[]
  add: (m: MemoirInsert) => void
  update: (m: Partial<Memoir> & { id: string }) => void
  remove: (id: string) => void
  setMemoirs: (list: Memoir[]) => void
  selectedDate: string
  setSelectedDate: (date: string) => void
}

export const useMemoirStore = create<MemoirStore>((set) => ({
  memoirs: [],
  add: (m) => set((state) => ({ memoirs: [...state.memoirs, toMemoir(m)] })),
  update: (m: Partial<Memoir> & { id: string }) =>
    set((state) => ({
      memoirs: state.memoirs.map((memoir) =>
        memoir.id === m.id ? { ...memoir, ...m } : memoir,
      ),
    })),
  remove: (id) =>
    set((state) => ({
      memoirs: state.memoirs.filter((memoir) => memoir.id !== id),
    })),
  setMemoirs: (list) => set({ memoirs: list }),
  selectedDate: new Date().toISOString(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}))

function toMemoir(m: MemoirInsert): Memoir {
  return {
    id: m.id,
    date: m.date ?? null,
    title: m.title ?? null,
    content: m.content ?? null,
    createdAt: m.createdAt ?? null,
    updatedAt: m.updatedAt ?? null,
  }
}
