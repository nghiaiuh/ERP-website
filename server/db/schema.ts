import { pgTable, varchar, serial, text, timestamp, integer, index, numeric, date, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// ============================
// USERS - Authentication
// ============================

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: text("password").notNull(),
	username: varchar("username", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

// ============================
// DOANH NGHIỆP
// ============================

export const doanhNghiep = pgTable("doanh_nghiep", {
	id: serial("id").primaryKey(),
	tenDoanhNghiep: varchar("ten_doanh_nghiep", { length: 255 }).default('Cơ sở Điêu Khắc Trang Trí Vĩnh Tiến'),
	maSoThue: varchar("ma_so_thue", { length: 50 }).default('042179006886'),
	diaChi: text("dia_chi").default('1955, xã Bình Minh, tỉnh Đồng Nai'),
});

// ============================
// ĐỐI TÁC - Khách hàng & Nhà cung cấp
// ============================

export const doiTac = pgTable("doi_tac", {
	id: serial("id").primaryKey(),
	maDoiTac: varchar("ma_doi_tac", { length: 50 }).notNull().unique(),
	tenDoiTac: varchar("ten_doi_tac", { length: 255 }).notNull(),
	loaiDoiTac: varchar("loai_doi_tac", { length: 30 }).notNull(), // 'khach_hang', 'nha_cung_cap', 'ca_hai'
	maSoThue: varchar("ma_so_thue", { length: 50 }),
	diaChi: text("dia_chi"),
	dienThoai: varchar("dien_thoai", { length: 20 }),
	email: varchar("email", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

// ============================
// HỢP ĐỒNG
// ============================

export const hopDong = pgTable("hop_dong", {
	id: serial("id").primaryKey(),
	maHopDong: varchar("ma_hop_dong", { length: 100 }).unique(),
	doiTacId: integer("doi_tac_id").references(() => doiTac.id),
	tongGiaTri: numeric("tong_gia_tri", { precision: 18, scale: 2 }),
	ngayBatDau: date("ngay_bat_dau"),
	ngayKetThuc: date("ngay_ket_thuc"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

// ============================
// HOÁ ĐƠN BÁN
// ============================

export const hoaDonBan = pgTable("hoa_don_ban", {
	id: serial("id").primaryKey(),
	maHoaDon: varchar("ma_hoa_don", { length: 100 }).notNull().unique(),
	doiTacId: integer("doi_tac_id").notNull().references(() => doiTac.id),
	hopDongId: integer("hop_dong_id").references(() => hopDong.id),
	ngayHoaDon: date("ngay_hoa_don").notNull(),
	tongTien: numeric("tong_tien", { precision: 18, scale: 2 }).default('0'),
	trangThai: varchar("trang_thai", { length: 30 }).default('chua_thu'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxDoiTac: index("idx_hoa_don_ban_doi_tac").on(table.doiTacId),
	idxNgay: index("idx_hoa_don_ban_ngay").on(table.ngayHoaDon),
}));

// ============================
// HOÁ ĐƠN MUA
// ============================

export const hoaDonMua = pgTable("hoa_don_mua", {
	id: serial("id").primaryKey(),
	maHoaDon: varchar("ma_hoa_don", { length: 100 }).notNull().unique(),
	doiTacId: integer("doi_tac_id").notNull().references(() => doiTac.id),
	ngayHoaDon: date("ngay_hoa_don").notNull(),
	tongTien: numeric("tong_tien", { precision: 18, scale: 2 }).default('0'),
	trangThai: varchar("trang_thai", { length: 30 }).default('chua_tra'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxDoiTac: index("idx_hoa_don_mua_doi_tac").on(table.doiTacId),
	idxNgay: index("idx_hoa_don_mua_ngay").on(table.ngayHoaDon),
}));

// ============================
// CHI TIẾT HOÁ ĐƠN BÁN
// ============================

export const hoaDonBanChiTiet = pgTable("hoa_don_ban_chi_tiet", {
	id: serial("id").primaryKey(),
	hoaDonBanId: integer("hoa_don_ban_id").notNull().references(() => hoaDonBan.id, { onDelete: 'cascade' }),
	tenHangHoa: varchar("ten_hang_hoa", { length: 255 }).notNull(),
	moTa: text("mo_ta"),
	soLuong: numeric("so_luong", { precision: 18, scale: 3 }).notNull(),
	donVi: varchar("don_vi", { length: 50 }),
	donGia: numeric("don_gia", { precision: 18, scale: 2 }).notNull(),
	tyLeThue: numeric("ty_le_thue", { precision: 5, scale: 2 }).default('10'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxHoaDon: index("idx_hoa_don_ban_chi_tiet").on(table.hoaDonBanId),
}));

// ============================
// CHI TIẾT HOÁ ĐƠN MUA
// ============================

export const hoaDonMuaChiTiet = pgTable("hoa_don_mua_chi_tiet", {
	id: serial("id").primaryKey(),
	hoaDonMuaId: integer("hoa_don_mua_id").notNull().references(() => hoaDonMua.id, { onDelete: 'cascade' }),
	tenHangHoa: varchar("ten_hang_hoa", { length: 255 }).notNull(),
	moTa: text("mo_ta"),
	soLuong: numeric("so_luong", { precision: 18, scale: 3 }).notNull(),
	donVi: varchar("don_vi", { length: 50 }),
	donGia: numeric("don_gia", { precision: 18, scale: 2 }).notNull(),
	tyLeThue: numeric("ty_le_thue", { precision: 5, scale: 2 }).default('10'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxHoaDon: index("idx_hoa_don_mua_chi_tiet").on(table.hoaDonMuaId),
}));

// ============================
// SỔ DOANH THU
// ============================

export const soDoanhThu = pgTable("so_doanh_thu", {
	id: serial("id").primaryKey(),
	doanhNghiepId: integer("doanh_nghiep_id").references(() => doanhNghiep.id, { onDelete: 'cascade' }),
	mauSo: varchar("mau_so", { length: 100 }).default('S1a-HKD TT 152/2025/TT-BTC 31/12/2025'),
	ngayBatDau: date("ngay_bat_dau").notNull(),
	ngayKetThuc: date("ngay_ket_thuc").notNull(),
	tongTien: numeric("tong_tien", { precision: 18, scale: 2 }).default('0'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

// ============================
// SỔ CHI PHÍ
// ============================

export const soChiPhi = pgTable("so_chi_phi", {
	id: serial("id").primaryKey(),
	doanhNghiepId: integer("doanh_nghiep_id").references(() => doanhNghiep.id, { onDelete: 'cascade' }),
	mauSo: varchar("mau_so", { length: 100 }).default('S2c-HKD TT 152/2025/TT-BTC 31/12/2025'),
	ngayBatDau: date("ngay_bat_dau").notNull(),
	ngayKetThuc: date("ngay_ket_thuc").notNull(),
	tongTien: numeric("tong_tien", { precision: 18, scale: 2 }).default('0'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

// ============================
// ĐƠN DOANH THU
// ============================

export const donDoanhThu = pgTable("don_doanh_thu", {
	id: serial("id").primaryKey(),
	revenueBookId: integer("revenue_book_id").notNull().references(() => soDoanhThu.id, { onDelete: 'cascade' }),
	hoaDonBanId: integer("hoa_don_ban_id").references(() => hoaDonBan.id, { onDelete: 'set null' }),
	soChungTu: varchar("so_chung_tu", { length: 100 }).notNull(),
	ngayGhiNhan: date("ngay_ghi_nhan").notNull(),
	moTa: text("mo_ta"),
	phanLoai: varchar("phan_loai", { length: 100 }),
	soTien: numeric("so_tien", { precision: 18, scale: 2 }).default('0'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxNgay: index("idx_don_doanh_thu_ngay").on(table.ngayGhiNhan),
	idxHoaDon: index("idx_don_doanh_thu_hoa_don").on(table.hoaDonBanId),
}));

// ============================
// ĐƠN CHI PHÍ
// ============================

export const donChiPhi = pgTable("don_chi_phi", {
	id: serial("id").primaryKey(),
	expenseBookId: integer("expense_book_id").notNull().references(() => soChiPhi.id, { onDelete: 'cascade' }),
	hoaDonMuaId: integer("hoa_don_mua_id").references(() => hoaDonMua.id, { onDelete: 'set null' }),
	soChungTu: varchar("so_chung_tu", { length: 100 }),
	ngayGhiNhan: date("ngay_ghi_nhan").notNull(),
	moTa: text("mo_ta"),
	phanLoai: varchar("phan_loai", { length: 100 }),
	soTien: numeric("so_tien", { precision: 18, scale: 2 }).default('0'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxNgay: index("idx_don_chi_phi_ngay").on(table.ngayGhiNhan),
	idxHoaDon: index("idx_don_chi_phi_hoa_don").on(table.hoaDonMuaId),
}));

// ============================
// CÔNG NỢ
// ============================

export const congNo = pgTable("cong_no", {
	id: serial("id").primaryKey(),
	doiTacId: integer("doi_tac_id").notNull().references(() => doiTac.id),
	loaiCongNo: varchar("loai_cong_no", { length: 30 }).notNull(),
	soTien: numeric("so_tien", { precision: 18, scale: 2 }).notNull(),
	hanThanhToan: date("han_thanh_toan"),
	hoaDonBanId: integer("hoa_don_ban_id").references(() => hoaDonBan.id),
	hoaDonMuaId: integer("hoa_don_mua_id").references(() => hoaDonMua.id),
	trangThai: varchar("trang_thai", { length: 30 }).default('chua_thanh_toan'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxDoiTac: index("idx_cong_no_doi_tac").on(table.doiTacId),
	idxTrangThai: index("idx_cong_no_trang_thai").on(table.trangThai),
}));

// ============================
// GIAO DỊCH THANH TOÁN
// ============================

export const giaoDichThanhToan = pgTable("giao_dich_thanh_toan", {
	id: serial("id").primaryKey(),
	maGiaoDich: varchar("ma_giao_dich", { length: 100 }).notNull().unique(),
	loaiGiaoDich: varchar("loai_giao_dich", { length: 30 }).notNull(),
	doiTacId: integer("doi_tac_id").references(() => doiTac.id),
	hoaDonBanId: integer("hoa_don_ban_id").references(() => hoaDonBan.id),
	hoaDonMuaId: integer("hoa_don_mua_id").references(() => hoaDonMua.id),
	congNoId: integer("cong_no_id").references(() => congNo.id),
	soTien: numeric("so_tien", { precision: 18, scale: 2 }).notNull(),
	phuongThuc: varchar("phuong_thuc", { length: 50 }).default('tien_mat'),
	ngayGiaoDich: date("ngay_giao_dich").notNull(),
	tenNganHang: varchar("ten_ngan_hang", { length: 255 }),
	soTaiKhoan: varchar("so_tai_khoan", { length: 50 }),
	maThamChieu: varchar("ma_tham_chieu", { length: 255 }),
	ghiChu: text("ghi_chu"),
	nguoiTaoId: integer("nguoi_tao_id").references(() => users.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxNgay: index("idx_giao_dich_thanh_toan_ngay").on(table.ngayGiaoDich),
	idxDoiTac: index("idx_giao_dich_thanh_toan_doi_tac").on(table.doiTacId),
}));

// ============================
// BÁO CÁO THUẾ
// ============================

export const baoCaoThue = pgTable("bao_cao_thue", {
	id: serial("id").primaryKey(),
	maBaoCao: varchar("ma_bao_cao", { length: 100 }).notNull().unique(),
	loaiThue: varchar("loai_thue", { length: 50 }).notNull(),
	kyBaoCao: varchar("ky_bao_cao", { length: 20 }).notNull(),
	ngayBatDau: date("ngay_bat_dau").notNull(),
	ngayKetThuc: date("ngay_ket_thuc").notNull(),
	tongDoanhThu: numeric("tong_doanh_thu", { precision: 18, scale: 2 }).default('0'),
	tongChiPhi: numeric("tong_chi_phi", { precision: 18, scale: 2 }).default('0'),
	soTienChiuThue: numeric("so_tien_chiu_thue", { precision: 18, scale: 2 }).default('0'),
	tyLeThue: numeric("ty_le_thue", { precision: 5, scale: 2 }).default('0'),
	soTienThue: numeric("so_tien_thue", { precision: 18, scale: 2 }).default('0'),
	soTienDaTra: numeric("so_tien_da_tra", { precision: 18, scale: 2 }).default('0'),
	trangThai: varchar("trang_thai", { length: 30 }).default('ban_nhap'),
	ngayNop: timestamp("ngay_nop", { mode: 'string' }),
	hanNop: date("han_nop"),
	ngayTra: timestamp("ngay_tra", { mode: 'string' }),
	ghiChu: text("ghi_chu"),
	metadata: jsonb("metadata"),
	nguoiTaoId: integer("nguoi_tao_id").references(() => users.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxTrangThai: index("idx_bao_cao_thue_trang_thai").on(table.trangThai),
	idxNgay: index("idx_bao_cao_thue_ngay").on(table.ngayBatDau, table.ngayKetThuc),
}));

// ============================
// CHI TIẾT THUẾ
// ============================

export const chiTietThue = pgTable("chi_tiet_thue", {
	id: serial("id").primaryKey(),
	baoCaoThueId: integer("bao_cao_thue_id").notNull().references(() => baoCaoThue.id, { onDelete: 'cascade' }),
	danhMuc: varchar("danh_muc", { length: 100 }).notNull(),
	moTa: text("mo_ta"),
	soTienTinhThue: numeric("so_tien_tinh_thue", { precision: 18, scale: 2 }).notNull(),
	tyLeThue: numeric("ty_le_thue", { precision: 5, scale: 2 }).notNull(),
	tienThue: numeric("tien_thue", { precision: 18, scale: 2 }).notNull(),
	hoaDonBanId: integer("hoa_don_ban_id").references(() => hoaDonBan.id),
	hoaDonMuaId: integer("hoa_don_mua_id").references(() => hoaDonMua.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idxBaoCao: index("idx_chi_tiet_thue_bao_cao").on(table.baoCaoThueId),
}));
