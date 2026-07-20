import { eq } from 'drizzle-orm'
import { doanhNghiep, donDoanhThu, soDoanhThu } from '../../../db/schema'
import { db } from '../../../utils/drizzle'
import { toErrorResponse, throwValidationError } from '../../../utils/api-response'
import { validatePositiveIntegerParam } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const validationErrors = validatePositiveIntegerParam(event.context.params?.id, 'id')
    if (validationErrors.length > 0) {
      throwValidationError('Invalid revenue report id', validationErrors)
    }
    const id = Number(event.context.params?.id)

    const revenueBooks = await db.select({
      id: soDoanhThu.id,
      mauSo: soDoanhThu.mauSo,
      ngayBatDau: soDoanhThu.ngayBatDau,
      ngayKetThuc: soDoanhThu.ngayKetThuc,
      tongTien: soDoanhThu.tongTien,
      createdAt: soDoanhThu.createdAt,
      doanhNghiepId: soDoanhThu.doanhNghiepId,
      tenDoanhNghiep: doanhNghiep.tenDoanhNghiep,
      maSoThue: doanhNghiep.maSoThue,
      diaChi: doanhNghiep.diaChi,
    })
      .from(soDoanhThu)
      .leftJoin(doanhNghiep, eq(soDoanhThu.doanhNghiepId, doanhNghiep.id))
      .where(eq(soDoanhThu.id, id))
      .limit(1)

    if (revenueBooks.length === 0) {
      return {
        success: false,
        data: null,
        message: 'Revenue report not found',
      }
    }

    const revenueBook = revenueBooks[0]!
    const entries = await db.select({
      id: donDoanhThu.id,
      soChungTu: donDoanhThu.soChungTu,
      ngayGhiNhan: donDoanhThu.ngayGhiNhan,
      moTa: donDoanhThu.moTa,
      phanLoai: donDoanhThu.phanLoai,
      soTien: donDoanhThu.soTien,
      createdAt: donDoanhThu.createdAt,
    })
      .from(donDoanhThu)
      .where(eq(donDoanhThu.revenueBookId, id))
      .orderBy(donDoanhThu.ngayGhiNhan)

    const startDate = new Date(revenueBook.ngayBatDau)
    const endDate = new Date(revenueBook.ngayKetThuc)

    const transformedReport = {
      id: revenueBook.id,
      type: 'revenue',
      title: `Bao cao doanh thu ${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}`,
      periodStart: revenueBook.ngayBatDau,
      periodEnd: revenueBook.ngayKetThuc,
      status: 'submitted',
      submittedAt: revenueBook.createdAt,
      amount: Number.parseFloat(revenueBook.tongTien || '0'),
      metadata: {
        businessName: revenueBook.tenDoanhNghiep,
        taxCode: revenueBook.maSoThue,
        address: revenueBook.diaChi,
        businessSector: '',
        location: '',
        mauSo: revenueBook.mauSo,
      },
      items: entries.map(entry => ({
        id: entry.id,
        category: entry.phanLoai || 'other',
        itemName: entry.moTa || '',
        description: `${entry.soChungTu} - ${entry.ngayGhiNhan}`,
        documentNumber: entry.soChungTu,
        documentDate: entry.ngayGhiNhan,
        quantity: 1,
        unit: 'lan',
        unitPrice: Number.parseFloat(entry.soTien || '0'),
        amount: Number.parseFloat(entry.soTien || '0'),
        taxRate: 0,
        taxAmount: 0,
        totalAmount: Number.parseFloat(entry.soTien || '0'),
      })),
    }

    return {
      success: true,
      data: transformedReport,
      message: 'Revenue report retrieved successfully',
    }
  } catch (error) {
    console.error('Error fetching revenue report:', error)
    return toErrorResponse(event, error, 'Failed to fetch revenue report')
  }
})
