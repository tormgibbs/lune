import { router } from 'expo-router'
import { useMemoirStore } from '@/store/memoir'
import { deleteMemoir as deleteMemoirFromDb, upsertMemoir } from '@/db/memoir'
import { deleteMediaFiles } from '@/lib/media'

export function useMemoirActions() {
  const remove = useMemoirStore((s) => s.remove)
  const toggleBookmarkStore = useMemoirStore((s) => s.toggleBookmark)

  const handleEdit = (id: string) => {
    router.push(`/memoirs/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      const memoir = useMemoirStore.getState().memoirs.find((m) => m.id === id)

      await deleteMediaFiles(memoir?.media)
      await deleteMemoirFromDb(id)
      remove(id)
    } catch (err) {
      console.error('Failed to delete memoir:', err)
    }
  }

  const handleToggleBookmark = async (id: string) => {
    toggleBookmarkStore(id)

    const memoir = useMemoirStore.getState().memoirs.find((m) => m.id === id)
    if (memoir) {
      try {
        await upsertMemoir(memoir)
      } catch (err) {
        console.error('Failed to persist bookmark:', err)
      }
    }
  }

  const handleMediaPress = (id: string, mediaIndex: number) => {
    router.push({
      pathname: '/memoirs/[id]/media',
      params: { id, mediaIndex },
    })
  }

  return { handleEdit, handleDelete, handleToggleBookmark, handleMediaPress }
}
