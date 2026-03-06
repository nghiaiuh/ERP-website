import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ERP_database'
})

pool.on('error', (err) => {
  console.error('Database pool error:', err)
})

export const db = drizzle(pool, { schema })
export const useDrizzle = () => db

// Export all tables for easy access
export const { 
  users,
  doanhNghiep,
  doiTac,
  hopDong,
  hoaDonBan,
  hoaDonMua,
  hoaDonBanChiTiet,
  hoaDonMuaChiTiet,
  soDoanhThu,
  soChiPhi,
  donDoanhThu,
  donChiPhi,
  congNo,
  giaoDichThanhToan,
  baoCaoThue,
  chiTietThue
} = schema