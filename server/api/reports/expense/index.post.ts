import { db } from '../../../utils/drizzle'
import { soChiPhi, donChiPhi, doanhNghiep } from '../../../db/schema'
import { eq, and } from 'drizzle-orm'
import { validateReportBody } from '../../../utils/validation'
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const validationErrors = validateReportBody(body, 'totalExpense')
    if (validationErrors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dữ liệu không hợp lệ',
        data: validationErrors
      })
    }
    const { periodStart, periodEnd, items, metadata, totalExpense } = body

    // Step 1: Find or create doanh_nghiep
    let doanhNghiepId: number | null = null
    
    if (metadata?.taxCode) {
      const existingBusiness = await db.select()
        .from(doanhNghiep)
        .where(eq(doanhNghiep.maSoThue, metadata.taxCode))
        .limit(1)
      
      if (existingBusiness.length > 0) {
        doanhNghiepId = existingBusiness[0]!.id
        
        // Update business info if changed
        await db.update(doanhNghiep)
          .set({
            tenDoanhNghiep: metadata.businessName || existingBusiness[0]!.tenDoanhNghiep,
            diaChi: metadata.address || existingBusiness[0]!.diaChi,
          })
          .where(eq(doanhNghiep.id, doanhNghiepId))
      } else {
        // Create new business
        const newBusiness = await db.insert(doanhNghiep)
          .values({
            tenDoanhNghiep: metadata.businessName,
            maSoThue: metadata.taxCode,
            diaChi: metadata.address,
          })
          .returning()
        
        doanhNghiepId = newBusiness[0]!.id
      }
    }

    // Step 2: Find or create expense book (so_chi_phi) for this period
    let expenseBook = await db.select()
      .from(soChiPhi)
      .where(
        and(
          eq(soChiPhi.ngayBatDau, periodStart),
          eq(soChiPhi.ngayKetThuc, periodEnd)
        )
      )
      .limit(1)

    let expenseBookId: number

    if (expenseBook.length === 0) {
      // Create new expense book with doanhNghiepId
      const newBooks = await db.insert(soChiPhi)
        .values({
          doanhNghiepId: doanhNghiepId,
          mauSo: metadata?.mauSo,
          ngayBatDau: periodStart,
          ngayKetThuc: periodEnd,
          tongTien: totalExpense?.toString() || '0',
        })
        .returning()
      
      if (!newBooks || newBooks.length === 0) {
        throw new Error('Failed to create expense book')
      }
      expenseBookId = newBooks[0]!.id
    } else {
      expenseBookId = expenseBook[0]!.id
    }

    // Step 2: Insert expense entries (don_chi_phi)
    const insertedEntries = []
    
    if (items && items.length > 0) {
      for (const item of items) {
        const [entry] = await db.insert(donChiPhi)
          .values({
            expenseBookId: expenseBookId,
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
      message: 'Expense report created successfully',
      data: {
        expenseBookId,
        entriesCount: insertedEntries.length,
        entries: insertedEntries
      }
    }
  } catch (error: any) {
    console.error('Error creating expense report:', error)
    return {
      success: false,
      message: 'Failed to create expense report',
      error: error.message
    }
  }
})
