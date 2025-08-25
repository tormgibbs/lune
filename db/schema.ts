import { MediaAsset } from '@/types/media'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const memoirs = sqliteTable('memoirs', {
  id: text('id').primaryKey().notNull(),
  title: text('title'),
  content: text('content'),
  date: text('date'),
  createdAt: text('createdAt'),
  updatedAt: text('updatedAt'),
  media: text('media', { mode: 'json'}).$type<MediaAsset[]>(),
})

export type MemoirInsert = typeof memoirs.$inferInsert
export type Memoir = typeof memoirs.$inferSelect
