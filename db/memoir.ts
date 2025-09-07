import { db } from '.'
import { MemoirInsert, memoirs } from './schema'
import { eq } from 'drizzle-orm'

export async function addMemoir(memoir: MemoirInsert) {
  try {
    return await db.insert(memoirs).values(memoir)
  } catch (error) {
    console.error('Failed to add memoir:', error)
    throw error
  }
}

export async function updateMemoir(id: string, memoir: Partial<MemoirInsert>) {
  try {
    return await db.update(memoirs).set(memoir).where(eq(memoirs.id, id))
  } catch (error) {
    console.error('Failed to update memoir:', error)
    throw error
  }
}

export async function getMemoirById(id: string) {
  try {
    const result = await db.select().from(memoirs).where(eq(memoirs.id, id))
    return result.at(0) ?? null
  } catch (error) {
    console.error('Failed to get memoir:', error)
    return null
  }
}

export async function getAllMemoirs() {
  try {
    return await db.select().from(memoirs)
  } catch (error) {
    console.error('Failed to get all memoirs:', error)
    return []
  }
}

export async function deleteMemoir(id: string) {
  try {
    return await db.delete(memoirs).where(eq(memoirs.id, id))
  } catch (error) {
    console.error('Failed to delete memoir:', error)
    throw error
  }
}

export async function upsertMemoir(memoir: MemoirInsert) {
  try {
    return await db.insert(memoirs).values(memoir).onConflictDoUpdate({
      target: memoirs.id,
      set: {
        title: memoir.title,
        content: memoir.content,
        date: memoir.date,
        updatedAt: memoir.updatedAt,
        media: memoir.media,
        titleVisible: memoir.titleVisible,
        categories: memoir.categories,
      },
    })
  } catch (error) {
    console.error('Failed to upsert memoir:', error)
    throw error
  }
}