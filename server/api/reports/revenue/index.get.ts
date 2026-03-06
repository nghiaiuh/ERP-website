import { db } from '../../../utils/drizzle'
import { soDoanhThu, donDoanhThu } from '../../../db/schema'
import { desc, count, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 20
    const offset = Number(query.offset) || 0

    // Get revenue books with entry counts
    const revenueBooks = await db.select({
      id: soDoanhThu.id,
      mauSo: soDoanhThu.mauSo,
      ngayBatDau: soDoanhThu.ngayBatDau,
      ngayKetThuc: soDoanhThu.ngayKetThuc,
      createdAt: soDoanhThu.createdAt,
      entriesCount: sql<number>`(
        SELECT COUNT(*) 
        FROM ${donDoanhThu} 
        WHERE ${donDoanhThu.revenueBookId} = ${soDoanhThu.id}
      )`.as('entries_count')
    })
    .from(soDoanhThu)
    .orderBy(desc(soDoanhThu.ngayBatDau))
    .limit(limit)
    .offset(offset)

    // Get total count
    const totalResult = await db.select({ total: count() })
      .from(soDoanhThu)
    const total = totalResult[0]?.total || 0

    return {
      success: true,
      data: revenueBooks,
      count: total,
      message: 'Revenue reports retrieved successfully'
    }
  } catch (error: any) {
    console.error('Error fetching revenue reports:', error)
    return {
      success: false,
      data: [],
      count: 0,
      message: 'Failed to fetch revenue reports',
      error: error.message
    }
  }
})
