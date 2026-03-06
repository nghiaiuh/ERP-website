import { db } from '../../../utils/drizzle'
import { soChiPhi, donChiPhi, doanhNghiep } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (!id || isNaN(id)) {
      return {
        success: false,
        data: null,
        message: 'Invalid expense report ID'
      }
    }

    // Get expense book with business information
    const expenseBooks = await db.select({
      id: soChiPhi.id,
      mauSo: soChiPhi.mauSo,
      ngayBatDau: soChiPhi.ngayBatDau,
      ngayKetThuc: soChiPhi.ngayKetThuc,
      tongTien: soChiPhi.tongTien,
      createdAt: soChiPhi.createdAt,
      doanhNghiepId: soChiPhi.doanhNghiepId,
      tenDoanhNghiep: doanhNghiep.tenDoanhNghiep,
      maSoThue: doanhNghiep.maSoThue,
      diaChi: doanhNghiep.diaChi,
    })
    .from(soChiPhi)
    .leftJoin(doanhNghiep, eq(soChiPhi.doanhNghiepId, doanhNghiep.id))
    .where(eq(soChiPhi.id, id))
    .limit(1)

    if (expenseBooks.length === 0) {
      return {
        success: false,
        data: null,
        message: 'Expense report not found'
      }
    }

    const expenseBook = expenseBooks[0]!

    // Get all expense entries for this book
    const entries = await db.select({
      id: donChiPhi.id,
      soChungTu: donChiPhi.soChungTu,
      ngayGhiNhan: donChiPhi.ngayGhiNhan,
      moTa: donChiPhi.moTa,
      phanLoai: donChiPhi.phanLoai,
      soTien: donChiPhi.soTien,
      createdAt: donChiPhi.createdAt,
    })
    .from(donChiPhi)
    .where(eq(donChiPhi.expenseBookId, id))
    .orderBy(donChiPhi.ngayGhiNhan)

    // Transform to match frontend expectations
    const startDate = new Date(expenseBook.ngayBatDau)
    const endDate = new Date(expenseBook.ngayKetThuc)
    
    const transformedReport = {
      id: expenseBook.id,
      type: 'expense',
      title: `Báo cáo chi phí ${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}`,
      periodStart: expenseBook.ngayBatDau,
      periodEnd: expenseBook.ngayKetThuc,
      status: 'submitted',
      submittedAt: expenseBook.createdAt,
      amount: parseFloat(expenseBook.tongTien || '0'),
      metadata: {
        businessName: expenseBook.tenDoanhNghiep || 'Cơ sở Điêu Khắc Trang Trí Vĩnh Tiến',
        taxCode: expenseBook.maSoThue || '042179006886',
        address: expenseBook.diaChi || '1955, xã Bình Minh, tỉnh Đồng Nai',
        businessSector: '',
        location: '',
        documentType: 'S2c-HKD',
        regulation: 'Thông tư 152/2025/TT-BTC',
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
      message: 'Expense report retrieved successfully'
    }
  } catch (error: any) {
    console.error('Error fetching expense report:', error)
    return {
      success: false,
      data: null,
      message: 'Failed to fetch expense report',
      error: error.message
    }
  }
})
