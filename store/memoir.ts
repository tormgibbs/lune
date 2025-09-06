import { Category, Memoir, MemoirInsert } from '@/db/schema'
import { create } from 'zustand'

interface MemoirStore {
  memoirs: Memoir[]
  add: (m: MemoirInsert) => void
  update: (m: Partial<Memoir> & { id: string }) => void
  remove: (id: string) => void
  setMemoirs: (list: Memoir[]) => void

  searchQuery: string
  setSearchQuery: (q: string) => void
  searchResults: Memoir[]

  selectedCategory: Category | null
  setSelectedCategory: (cat: Category | null) => void
}

const computeSearchResults = (
  memoirs: Memoir[],
  searchQuery: string,
  category: Category | null,
): Memoir[] => {
  const q = searchQuery.toLowerCase().trim()

  if (!q && !category) return []

  return memoirs.filter((m) => {
    const matchesQuery =
      !q ||
      (m.title ?? '').toLowerCase().includes(q) ||
      (m.content ?? '').toLowerCase().includes(q) ||
      (m.date ?? '').toLowerCase().includes(q)

    const matchesCategory = !category || (m.categories ?? []).includes(category)

    return matchesQuery && matchesCategory
  })
}


export const useMemoirStore = create<MemoirStore>((set, get) => ({
  memoirs: [],
  searchQuery: '',
  searchResults: [],
  selectedCategory: null,

  add: (m) =>
    set((state) => {
      const newMemoirs = [...state.memoirs, toMemoir(m)]
      return {
        memoirs: newMemoirs,
        searchResults: computeSearchResults(
          newMemoirs,
          state.searchQuery,
          state.selectedCategory,
        ),
      }
    }),

  update: (m: Partial<Memoir> & { id: string }) =>
    set((state) => {
      const updated = state.memoirs.map((memoir) =>
        memoir.id === m.id ? { ...memoir, ...m } : memoir,
      )
      return {
        memoirs: updated,
        searchResults: computeSearchResults(
          updated,
          state.searchQuery,
          state.selectedCategory,
        ),
      }
    }),

  remove: (id) =>
    set((state) => {
      const filtered = state.memoirs.filter((memoir) => memoir.id !== id)
      return {
        memoirs: filtered,
        searchResults: computeSearchResults(
          filtered,
          state.searchQuery,
          state.selectedCategory,
        ),
      }
    }),

  setMemoirs: (list) =>
    set((state) => ({
      memoirs: list,
      searchResults: computeSearchResults(
        list,
        state.searchQuery,
        state.selectedCategory,
      ),
    })),

  setSearchQuery: (q) =>
    set((state) => ({
      searchQuery: q,
      searchResults: computeSearchResults(
        state.memoirs,
        q,
        state.selectedCategory,
      ),
    })),

  setSelectedCategory: (cat) =>
    set((state) => ({
      selectedCategory: cat,
      searchResults: computeSearchResults(
        state.memoirs,
        state.searchQuery,
        cat,
      ),
    })),
}))

function toMemoir(m: MemoirInsert): Memoir {
  return {
    id: m.id,
    date: m.date ?? null,
    title: m.title ?? null,
    content: m.content ?? null,
    createdAt: m.createdAt ?? null,
    updatedAt: m.updatedAt ?? null,
    media: (m.media ?? []).map((asset) => ({ ...asset, persisted: true })),
    titleVisible: m.titleVisible ?? true,
    categories: m.categories ?? null,
  }
}
