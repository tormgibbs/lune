import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as SQLite from 'expo-sqlite'

const expo = SQLite.openDatabaseSync('memoirs.db')

const db = drizzle(expo)

export { db }