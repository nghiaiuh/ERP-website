import { db } from '../../../utils/drizzle'
import { soDoanhThu, donDoanhThu, doanhNghiep } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { validateReportBody } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (!id || isNaN(id)) {
      return {
        success: false,
        message: 'Invalid revenue report ID'
      }
    }

    const body = await readBody(event)
    const validationErrors = validateReportBody(body, 'totalRevenue')
    if (validationErrors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dữ liệu không hợp lệ',
        data: validationErrors
      })
    }
    const { periodStart, periodEnd, items, metadata, totalRevenue } = body

    // Step 1: Check if revenue report exists
    const existingReport = await db
      .select()
      .from(soDoanhThu)
      .where(eq(soDoanhThu.id, id))
      .limit(1)

    if (existingReport.length === 0) {
      return {
        success: false,
        message: 'Revenue report not found'
      }
    }

    // Step 2: Find or create doanh_nghiep
    let doanhNghiepId: number | null = existingReport[0]!.doanhNghiepId
    
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

    // Step 3: Update revenue book (so_doanh_thu)
    await db
      .update(soDoanhThu)
      .set({
        doanhNghiepId: doanhNghiepId,
        mauSo: metadata?.mauSo,
        ngayBatDau: periodStart,
        ngayKetThuc: periodEnd,
        tongTien: totalRevenue?.toString() || '0',
      })
      .where(eq(soDoanhThu.id, id))

    // Step 3: Delete old revenue entries
    await db.delete(donDoanhThu).where(eq(donDoanhThu.revenueBookId, id))

    // Step 4: Insert new revenue entries
    const insertedEntries = []
    
    if (items && items.length > 0) {
      for (const item of items) {
        const [entry] = await db.insert(donDoanhThu)
          .values({
            revenueBookId: id,
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
      message: 'Revenue report updated successfully',
      data: {
        revenueBookId: id,
        entriesCount: insertedEntries.length,
        entries: insertedEntries
      }
    }
  } catch (error: any) {
    console.error('Error updating revenue report:', error)
    return {
      success: false,
      message: 'Failed to update revenue report',
      error: error.message
    }
  }
})
