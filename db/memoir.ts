import { db } from '.'
import { MemoirInsert, memoirs } from './schema'
import { eq } from 'drizzle-orm'

// Insert
export async function addMemoir(memoir: MemoirInsert) {
  try {
    return await db.insert(memoirs).values(memoir)
  } catch (error) {
    console.error('Failed to add memoir:', error)
    throw error
  }
}

// Update
export async function updateMemoir(id: string, memoir: Partial<MemoirInsert>) {
  try {
    return await db.update(memoirs).set(memoir).where(eq(memoirs.id, id))
  } catch (error) {
    console.error('Failed to update memoir:', error)
    throw error
  }
}

// Select one
export async function getMemoirById(id: string) {
  try {
    const result = await db.select().from(memoirs).where(eq(memoirs.id, id))
    return result.at(0) ?? null
  } catch (error) {
    console.error('Failed to get memoir:', error)
    return null
  }
}

// Select all
export async function getAllMemoirs() {
  try {
    return await db.select().from(memoirs)
  } catch (error) {
    console.error('Failed to get all memoirs:', error)
    return []
  }
}

// Delete
export async function deleteMemoir(id: string) {
  try {
    return await db.delete(memoirs).where(eq(memoirs.id, id))
  } catch (error) {
    console.error('Failed to delete memoir:', error)
    throw error
  }
}