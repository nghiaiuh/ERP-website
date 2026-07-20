import { and, eq } from 'drizzle-orm'
import { doanhNghiep, donDoanhThu, soDoanhThu } from '../../../db/schema'
import { db } from '../../../utils/drizzle'
import { toErrorResponse, throwValidationError } from '../../../utils/api-response'
import { validateReportBody } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const validationErrors = validateReportBody(body, 'totalRevenue')
    if (validationErrors.length > 0) {
      throwValidationError('Invalid revenue report payload', validationErrors)
    }

    const { periodStart, periodEnd, items, metadata, totalRevenue } = body
    let doanhNghiepId: number | null = null

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

    const revenueBook = await db.select()
      .from(soDoanhThu)
      .where(and(
        eq(soDoanhThu.ngayBatDau, periodStart),
        eq(soDoanhThu.ngayKetThuc, periodEnd),
      ))
      .limit(1)

    let revenueBookId: number

    if (revenueBook.length === 0) {
      const newBooks = await db.insert(soDoanhThu)
        .values({
          doanhNghiepId,
          mauSo: metadata?.mauSo,
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

    const insertedEntries = []

    if (items && items.length > 0) {
      for (const item of items) {
        const [entry] = await db.insert(donDoanhThu)
          .values({
            revenueBookId,
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
        entries: insertedEntries,
      },
    }
  } catch (error) {
    console.error('Error creating revenue report:', error)
    return toErrorResponse(event, error, 'Failed to create revenue report')
  }
})
