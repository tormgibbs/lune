import { useEffect, useState } from 'react'
import { getAllMemoirs } from '@/db/memoir'
import { db } from '@/db'
import migrations from '@/drizzle/migrations'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useMemoirStore } from '@/store/memoir'

export function useDBInitialization() {
  const { success, error } = useMigrations(db, migrations)
  const setMemoirs = useMemoirStore((s) => s.setMemoirs)

  useEffect(() => {
    async function initializeData() {
      try {
        if (!success) return

        const memoirs = await getAllMemoirs()
        setMemoirs(memoirs)
      } catch (err) {
        console.error('Failed to load memoirs:', err)
      } finally {
        useMemoirStore.getState().setLoaded(true)
      }
    }

    initializeData()
  }, [success])

  if (error) {
    console.error('Database migration error:', error)
  }

  const loaded = useMemoirStore((s) => s.loaded)
  return [loaded] as const
}
