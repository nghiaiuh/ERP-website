import { db } from '../../../utils/drizzle'
import { soChiPhi, donChiPhi } from '../../../db/schema'
import { desc, count, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 20
    const offset = Number(query.offset) || 0

    // Get expense books with entry counts
    const expenseBooks = await db.select({
      id: soChiPhi.id,
      mauSo: soChiPhi.mauSo,
      ngayBatDau: soChiPhi.ngayBatDau,
      ngayKetThuc: soChiPhi.ngayKetThuc,
      createdAt: soChiPhi.createdAt,
      entriesCount: sql<number>`(
        SELECT COUNT(*) 
        FROM ${donChiPhi} 
        WHERE ${donChiPhi.expenseBookId} = ${soChiPhi.id}
      )`.as('entries_count')
    })
    .from(soChiPhi)
    .orderBy(desc(soChiPhi.ngayBatDau))
    .limit(limit)
    .offset(offset)

    // Get total count
    const totalResult = await db.select({ total: count() })
      .from(soChiPhi)
    const total = totalResult[0]?.total || 0

    return {
      success: true,
      data: expenseBooks,
      count: total,
      message: 'Expense reports retrieved successfully'
    }
  } catch (error: any) {
    console.error('Error fetching expense reports:', error)
    return {
      success: false,
      data: [],
      count: 0,
      message: 'Failed to fetch expense reports',
      error: error.message
    }
  }
})
