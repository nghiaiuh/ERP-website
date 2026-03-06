import { db } from '../../utils/drizzle'
import { soDoanhThu, soChiPhi, donDoanhThu, donChiPhi } from '../../db/schema'
import { desc, count, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 20
    const offset = Number(query.offset) || 0

    // Get revenue books with calculated amounts
    const revenueBooks = await db.select({
      id: soDoanhThu.id,
      type: sql<string>`'revenue'`.as('type'),
      mauSo: soDoanhThu.mauSo,
      periodStart: soDoanhThu.ngayBatDau,
      periodEnd: soDoanhThu.ngayKetThuc,
      tongTien: soDoanhThu.tongTien,
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

    // Get expense books with calculated amounts
    const expenseBooks = await db.select({
      id: soChiPhi.id,
      type: sql<string>`'expense'`.as('type'),
      mauSo: soChiPhi.mauSo,
      periodStart: soChiPhi.ngayBatDau,
      periodEnd: soChiPhi.ngayKetThuc,
      tongTien: soChiPhi.tongTien,
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

    // Transform data to match frontend expectations
    const transformedRevenue = revenueBooks.map(book => {
      const startDate = new Date(book.periodStart)
      const endDate = new Date(book.periodEnd)
      return {
        id: book.id,
        type: 'revenue',
        title: `Báo cáo doanh thu ${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}`,
        periodStart: book.periodStart,
        periodEnd: book.periodEnd,
        status: 'submitted',
        submittedAt: book.createdAt,
        amount: parseFloat(book.tongTien || '0'),
        mauSo: book.mauSo,
        entriesCount: book.entriesCount
      }
    })

    const transformedExpense = expenseBooks.map(book => {
      const startDate = new Date(book.periodStart)
      const endDate = new Date(book.periodEnd)
      return {
        id: book.id,
        type: 'expense',
        title: `Báo cáo chi phí ${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}`,
        periodStart: book.periodStart,
        periodEnd: book.periodEnd,
        status: 'submitted',
        submittedAt: book.createdAt,
        amount: parseFloat(book.tongTien || '0'),
        mauSo: book.mauSo,
        entriesCount: book.entriesCount
      }
    })

    // Combine and sort by date
    const combined = [...transformedRevenue, ...transformedExpense]
      .sort((a, b) => new Date(b.periodStart).getTime() - new Date(a.periodStart).getTime())
      .slice(offset, offset + limit)

    // Get total count
    const revenueCountResult = await db.select({ revenueTotal: count() }).from(soDoanhThu)
    const expenseCountResult = await db.select({ expenseTotal: count() }).from(soChiPhi)
    const revenueTotal = revenueCountResult[0]?.revenueTotal || 0
    const expenseTotal = expenseCountResult[0]?.expenseTotal || 0

    return {
      success: true,
      data: combined,
      count: revenueTotal + expenseTotal,
      message: 'Combined reports retrieved successfully'
    }
  } catch (error: any) {
    console.error('Error fetching combined reports:', error)
    return {
      success: false,
      data: [],
      count: 0,
      message: 'Failed to fetch combined reports',
      error: error.message
    }
  }
})
