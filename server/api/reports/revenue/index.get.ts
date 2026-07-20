import { count, desc, sql } from 'drizzle-orm'
import { donDoanhThu, soDoanhThu } from '../../../db/schema'
import { db } from '../../../utils/drizzle'
import { toErrorResponse, throwValidationError } from '../../../utils/api-response'
import { validatePaginationQuery } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const validationErrors = validatePaginationQuery(query)
    if (validationErrors.length > 0) {
      throwValidationError('Invalid revenue report query', validationErrors)
    }

    const limit = Number(query.limit) || 20
    const offset = Number(query.offset) || 0

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
      )`.as('entries_count'),
    })
      .from(soDoanhThu)
      .orderBy(desc(soDoanhThu.ngayBatDau))
      .limit(limit)
      .offset(offset)

    const totalResult = await db.select({ total: count() }).from(soDoanhThu)
    const total = totalResult[0]?.total || 0

    return {
      success: true,
      data: revenueBooks,
      count: total,
      message: 'Revenue reports retrieved successfully',
    }
  } catch (error) {
    console.error('Error fetching revenue reports:', error)
    return toErrorResponse(event, error, 'Failed to fetch revenue reports')
  }
})
