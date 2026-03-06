import { db } from '../../../utils/drizzle'
import { soDoanhThu, donDoanhThu } from '../../../db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { periodStart, periodEnd, items, metadata, totalRevenue } = body

    // Step 1: Find or create revenue book (so_doanh_thu) for this period
    let revenueBook = await db.select()
      .from(soDoanhThu)
      .where(
        and(
          eq(soDoanhThu.ngayBatDau, periodStart),
          eq(soDoanhThu.ngayKetThuc, periodEnd)
        )
      )
      .limit(1)

    let revenueBookId: number

    if (revenueBook.length === 0) {
      // Create new revenue book (without doanhNghiepId to avoid FK constraint)
      const newBooks = await db.insert(soDoanhThu)
        .values({
          mauSo: metadata?.documentType || 'S1a-HKD',
          ngayBatDau: periodStart,
          ngayKetThuc: periodEnd,
          tongTien: totalRevenue?.toString() || '0',
        })
        .returning()
      
      if (!newBooks || newBooks.length === 0) {
        throw new Error('Failed to create revenue book')
      }
      revenueBookId = newBooks[0]!.id
    } else {
      revenueBookId = revenueBook[0]!.id
    }

    // Step 2: Insert revenue entries (don_doanh_thu)
    const insertedEntries = []
    
    if (items && items.length > 0) {
      for (const item of items) {
        const [entry] = await db.insert(donDoanhThu)
          .values({
            revenueBookId: revenueBookId,
            soChungTu: item.documentNumber || `DOC-${Date.now()}`,
            ngayGhiNhan: item.documentDate || periodStart,
            moTa: item.itemName || item.description,
            phanLoai: item.category || 'other',
            soTien: (item.amount || item.totalAmount || 0).toString(),
          })
          .returning()
        
        insertedEntries.push(entry)
      }
    }

    return {
      success: true,
      message: 'Revenue report created successfully',
      data: {
        revenueBookId,
        entriesCount: insertedEntries.length,
        entries: insertedEntries
      }
    }
  } catch (error: any) {
    console.error('Error creating revenue report:', error)
    return {
      success: false,
      message: 'Failed to create revenue report',
      error: error.message
    }
  }
})
