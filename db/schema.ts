import { MediaAsset } from '@/types/media'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const category = ['photo', 'video', 'audio', 'text'] as const
export type Category = (typeof category)[number]

export const memoirs = sqliteTable('memoirs', {
  id: text('id').primaryKey().notNull(),
  title: text('title'),
  content: text('content'),
  date: text('date'),
  createdAt: text('createdAt'),
  updatedAt: text('updatedAt'),
  media: text('media', { mode: 'json'}).$type<MediaAsset[]>(),
  titleVisible: integer('titleVisible').notNull().default(1).$type<boolean>(),
  categories: text('features', { mode: 'json' }).$type<Category[]>()
})

export type MemoirInsert = typeof memoirs.$inferInsert
export type Memoir = typeof memoirs.$inferSelect

export const CategoryLabels: Record<Category, string> = {
  photo: 'Photos',
  video: 'Videos',
  audio: 'Recorded Audio',
  text: 'Text Only',
}
