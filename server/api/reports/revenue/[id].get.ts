import { db } from '../../../utils/drizzle'
import { soDoanhThu, donDoanhThu, doanhNghiep } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (!id || isNaN(id)) {
      return {
        success: false,
        data: null,
        message: 'Invalid revenue report ID'
      }
    }

    // Get revenue book with business information
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
        message: 'Revenue report not found'
      }
    }

    const revenueBook = revenueBooks[0]!

    // Get all revenue entries for this book
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

    // Transform to match frontend expectations
    const startDate = new Date(revenueBook.ngayBatDau)
    const endDate = new Date(revenueBook.ngayKetThuc)
    
    const transformedReport = {
      id: revenueBook.id,
      type: 'revenue',
      title: `Báo cáo doanh thu ${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}`,
      periodStart: revenueBook.ngayBatDau,
      periodEnd: revenueBook.ngayKetThuc,
      status: 'submitted',
      submittedAt: revenueBook.createdAt,
      amount: parseFloat(revenueBook.tongTien || '0'),
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
        unit: 'lần',
        unitPrice: parseFloat(entry.soTien || '0'),
        amount: parseFloat(entry.soTien || '0'),
        taxRate: 0,
        taxAmount: 0,
        totalAmount: parseFloat(entry.soTien || '0'),
      }))
    }

    return {
      success: true,
      data: transformedReport,
      message: 'Revenue report retrieved successfully'
    }
  } catch (error: any) {
    console.error('Error fetching revenue report:', error)
    return {
      success: false,
      data: null,
      message: 'Failed to fetch revenue report',
      error: error.message
    }
  }
})
