import { db } from '../../../utils/drizzle'
import { soChiPhi, donChiPhi, doanhNghiep } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (!id || isNaN(id)) {
      return {
        success: false,
        message: 'Invalid expense report ID'
      }
    }

    const body = await readBody(event)
    const { periodStart, periodEnd, items, metadata, totalExpense } = body

    // Step 1: Check if expense report exists
    const existingReport = await db
      .select()
      .from(soChiPhi)
      .where(eq(soChiPhi.id, id))
      .limit(1)

    if (existingReport.length === 0) {
      return {
        success: false,
        message: 'Expense report not found'
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
            tenDoanhNghiep: metadata.businessName || 'Cơ sở Điêu Khắc Trang Trí Vĩnh Tiến',
            maSoThue: metadata.taxCode,
            diaChi: metadata.address || '1955, xã Bình Minh, tỉnh Đồng Nai',
          })
          .returning()
        
        doanhNghiepId = newBusiness[0]!.id
      }
    }

    // Step 3: Update expense book (so_chi_phi)
    await db
      .update(soChiPhi)
      .set({
        doanhNghiepId: doanhNghiepId,
        mauSo: metadata?.mauSo || 'S2c-HKD | Theo Thông tư 152/2025/TT-BTC ngày 31/12/2025',
        ngayBatDau: periodStart,
        ngayKetThuc: periodEnd,
        tongTien: totalExpense?.toString() || '0',
      })
      .where(eq(soChiPhi.id, id))

    // Step 3: Delete old expense entries
    await db.delete(donChiPhi).where(eq(donChiPhi.expenseBookId, id))

    // Step 4: Insert new expense entries
    const insertedEntries = []
    
    if (items && items.length > 0) {
      for (const item of items) {
        const [entry] = await db.insert(donChiPhi)
          .values({
            expenseBookId: id,
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
      message: 'Expense report updated successfully',
      data: {
        expenseBookId: id,
        entriesCount: insertedEntries.length,
        entries: insertedEntries
      }
    }
  } catch (error: any) {
    console.error('Error updating expense report:', error)
    return {
      success: false,
      message: 'Failed to update expense report',
      error: error.message
    }
  }
})
