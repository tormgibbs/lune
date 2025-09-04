import { router } from 'expo-router'
import { useMemoirStore } from '@/store/memoir'
import { deleteMemoir as deleteMemoirFromDb } from '@/db/memoir'
import { deleteMediaFiles } from '@/lib/media'

export function useMemoirActions() {
  const remove = useMemoirStore((s) => s.remove)

  const handleEdit = (id: string) => {
    router.push(`/memoirs/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      const memoir = useMemoirStore
        .getState()
        .memoirs.find((m) => m.id === id)

      await deleteMediaFiles(memoir?.media)
      await deleteMemoirFromDb(id)
      remove(id)
    } catch (err) {
      console.error('Failed to delete memoir:', err)
    }
  }

  return { handleEdit, handleDelete }
}
