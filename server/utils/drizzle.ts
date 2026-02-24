import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { teams, users } from '../db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!
})

export const db = drizzle(pool)
export const useDrizzle = () => db
export { teams, users }