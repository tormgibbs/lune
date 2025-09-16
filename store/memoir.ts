import { Category, Memoir, MemoirInsert } from '@/db/schema'
import { persistMediaAsset } from '@/lib/media'
import { MediaAsset } from '@/types/media'
import { create } from 'zustand'

interface MemoirStore {
  memoirs: Memoir[]
  loaded: boolean
  add: (m: MemoirInsert) => void
  update: (m: Partial<Memoir> & { id: string }) => void
  remove: (id: string) => void
  setMemoirs: (list: Memoir[]) => void
  setLoaded: (val: boolean) => void

  searchQuery: string
  setSearchQuery: (q: string) => void
  searchResults: Memoir[]

  selectedCategory: Category | null
  setSelectedCategory: (cat: Category | null) => void

  toggleBookmark: (id: string) => void
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

    const matchesCategory =
      !category ||
      (category === 'bookmark'
        ? m.bookmark === true
        : (m.categories ?? []).includes(category))

    return matchesQuery && matchesCategory
  })
}

export const useMemoirStore = create<MemoirStore>((set, get) => ({
  memoirs: [],
  loaded: false,
  setLoaded: (val) => set({ loaded: val }),
  searchQuery: '',
  searchResults: [],
  selectedCategory: null,

  add: async (m) => {
    const finalMedia = await persistAllMedia(m.media ?? [])
    const withPersisted = { ...m, media: finalMedia }

    set((state) => {
      const newMemoirs = [...state.memoirs, toMemoir(withPersisted)]
      return {
        memoirs: newMemoirs,
        searchResults: computeSearchResults(
          newMemoirs,
          state.searchQuery,
          state.selectedCategory,
        ),
      }
    })
  },

  update: async (m: Partial<Memoir> & { id: string }) => {
    let media = m.media
    if (media) {
      media = await persistAllMedia(media)
    }
    set((state) => {
      const updated = state.memoirs.map((memoir) =>
        memoir.id === m.id ? { ...memoir, ...m, ...(media ? { media } : {}) } : memoir,
      )
      return {
        memoirs: updated,
        searchResults: computeSearchResults(
          updated,
          state.searchQuery,
          state.selectedCategory,
        ),
      }
    })
  },

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

  toggleBookmark: (id) =>
    set((state) => {
      const updated = state.memoirs.map((memoir) =>
        memoir.id === id ? { ...memoir, bookmark: !memoir.bookmark } : memoir,
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
    bookmark: m.bookmark ?? false,
  }
}

export function createBlankMemoir(id: string, date: string): MemoirInsert {
  return {
    id,
    title: '',
    content: '',
    media: [],
    date,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    titleVisible: true,
    categories: [],
    bookmark: false,
  }
}

async function persistAllMedia(media: MediaAsset[]): Promise<MediaAsset[]> {
  const { newMedia, persistedMedia } = media.reduce(
    (acc, m) => {
      if (m.persisted) acc.persistedMedia.push(m)
      else acc.newMedia.push(m)
      return acc
    },
    { newMedia: [] as MediaAsset[], persistedMedia: [] as MediaAsset[] },
  )

  const savedNewMedia = await Promise.all(newMedia.map(persistMediaAsset))

  return [
    ...persistedMedia,
    ...savedNewMedia.map((m) => ({ ...m, persisted: true })),
  ]
}
