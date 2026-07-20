import { eq } from 'drizzle-orm'
import { doanhNghiep, donDoanhThu, soDoanhThu } from '../../../db/schema'
import { db } from '../../../utils/drizzle'
import { toErrorResponse, throwValidationError } from '../../../utils/api-response'
import { validatePositiveIntegerParam, validateReportBody } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const paramErrors = validatePositiveIntegerParam(event.context.params?.id, 'id')
    if (paramErrors.length > 0) {
      throwValidationError('Invalid revenue report id', paramErrors)
    }
    const id = Number(event.context.params?.id)

    const body = await readBody(event)
    const validationErrors = validateReportBody(body, 'totalRevenue')
    if (validationErrors.length > 0) {
      throwValidationError('Invalid revenue report payload', validationErrors)
    }
    const { periodStart, periodEnd, items, metadata, totalRevenue } = body

    const existingReport = await db
      .select()
      .from(soDoanhThu)
      .where(eq(soDoanhThu.id, id))
      .limit(1)

    if (existingReport.length === 0) {
      setResponseStatus(event, 404)
      return {
        success: false,
        message: 'Revenue report not found',
      }
    }

    let doanhNghiepId: number | null = existingReport[0]!.doanhNghiepId

    if (metadata?.taxCode) {
      const existingBusiness = await db.select()
        .from(doanhNghiep)
        .where(eq(doanhNghiep.maSoThue, metadata.taxCode))
        .limit(1)

      if (existingBusiness.length > 0) {
        doanhNghiepId = existingBusiness[0]!.id

        await db.update(doanhNghiep)
          .set({
            tenDoanhNghiep: metadata.businessName || existingBusiness[0]!.tenDoanhNghiep,
            diaChi: metadata.address || existingBusiness[0]!.diaChi,
          })
          .where(eq(doanhNghiep.id, doanhNghiepId))
      } else {
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

    await db
      .update(soDoanhThu)
      .set({
        doanhNghiepId,
        mauSo: metadata?.mauSo,
        ngayBatDau: periodStart,
        ngayKetThuc: periodEnd,
        tongTien: totalRevenue?.toString() || '0',
      })
      .where(eq(soDoanhThu.id, id))

    await db.delete(donDoanhThu).where(eq(donDoanhThu.revenueBookId, id))

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
        entries: insertedEntries,
      },
    }
  } catch (error) {
    console.error('Error updating revenue report:', error)
    return toErrorResponse(event, error, 'Failed to update revenue report')
  }
})
