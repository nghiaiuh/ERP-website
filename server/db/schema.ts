import { boolean, date, index, integer, jsonb, numeric, pgTable, serial, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// ============================
// USERS - Supabase Auth profile. Credentials live only in auth.users.
// ============================

export const users = pgTable("users", {
	id: uuid("id").primaryKey(),
	username: varchar("username", { length: 100 }),
	displayName: varchar("display_name", { length: 255 }),
	avatarUrl: text("avatar_url"),
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
	nguoiTaoId: uuid("nguoi_tao_id").references(() => users.id),
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
	nguoiTaoId: uuid("nguoi_tao_id").references(() => users.id),
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

// ============================
// ERP FOUNDATION - Supabase-ready modular schema
// ============================

export const tenants = pgTable("tenants", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull(),
	status: varchar("status", { length: 30 }).notNull().default("active"),
	timezone: varchar("timezone", { length: 100 }).notNull().default("Asia/Ho_Chi_Minh"),
	metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	slugUnique: uniqueIndex("ux_tenants_slug").on(table.slug),
	statusIdx: index("idx_tenants_status").on(table.status),
}));

export const userTenantMemberships = pgTable("user_tenant_memberships", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
	role: varchar("role", { length: 50 }).notNull().default("member"),
	status: varchar("status", { length: 30 }).notNull().default("active"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	tenantUserUnique: uniqueIndex("ux_user_tenant_memberships_tenant_user").on(table.tenantId, table.userId),
	userIdx: index("idx_user_tenant_memberships_user").on(table.userId),
}));

export const roles = pgTable("roles", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").references(() => tenants.id, { onDelete: 'cascade' }),
	code: varchar("code", { length: 100 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	permissions: jsonb("permissions").notNull().default(sql`'[]'::jsonb`),
	isSystem: boolean("is_system").notNull().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	codeUnique: uniqueIndex("ux_roles_tenant_code").on(table.tenantId, table.code),
}));

export const telegramIdentities = pgTable("telegram_identities", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	userId: uuid("user_id").references(() => users.id, { onDelete: 'set null' }),
	telegramUserId: varchar("telegram_user_id", { length: 100 }).notNull(),
	username: varchar("username", { length: 255 }),
	displayName: varchar("display_name", { length: 255 }),
	status: varchar("status", { length: 30 }).notNull().default("linked"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	tenantTelegramUnique: uniqueIndex("ux_telegram_identities_tenant_user").on(table.tenantId, table.telegramUserId),
	userIdx: index("idx_telegram_identities_user").on(table.userId),
}));

export const conversations = pgTable("conversations", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	channel: varchar("channel", { length: 50 }).notNull(),
	externalConversationId: varchar("external_conversation_id", { length: 255 }).notNull(),
	status: varchar("status", { length: 30 }).notNull().default("active"),
	metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	externalUnique: uniqueIndex("ux_conversations_tenant_channel_external").on(table.tenantId, table.channel, table.externalConversationId),
	statusIdx: index("idx_conversations_status").on(table.tenantId, table.status),
}));

export const inboundMessages = pgTable("inbound_messages", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: 'cascade' }),
	channel: varchar("channel", { length: 50 }).notNull(),
	externalMessageId: varchar("external_message_id", { length: 255 }),
	telegramUpdateId: varchar("telegram_update_id", { length: 100 }),
	senderUserId: uuid("sender_user_id").references(() => users.id, { onDelete: 'set null' }),
	messageType: varchar("message_type", { length: 50 }).notNull().default("text"),
	bodyText: text("body_text"),
	payload: jsonb("payload").notNull().default(sql`'{}'::jsonb`),
	receivedAt: timestamp("received_at", { mode: 'string' }).notNull().defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	telegramUpdateUnique: uniqueIndex("ux_inbound_messages_channel_update").on(table.channel, table.telegramUpdateId),
	conversationIdx: index("idx_inbound_messages_conversation").on(table.conversationId, table.receivedAt),
}));

export const outboundMessages = pgTable("outbound_messages", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	conversationId: integer("conversation_id").references(() => conversations.id, { onDelete: 'set null' }),
	channel: varchar("channel", { length: 50 }).notNull(),
	recipientExternalId: varchar("recipient_external_id", { length: 255 }).notNull(),
	bodyText: text("body_text"),
	payload: jsonb("payload").notNull().default(sql`'{}'::jsonb`),
	status: varchar("status", { length: 30 }).notNull().default("pending"),
	idempotencyKey: varchar("idempotency_key", { length: 255 }),
	sentAt: timestamp("sent_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idempotencyUnique: uniqueIndex("ux_outbound_messages_idempotency").on(table.tenantId, table.idempotencyKey),
	statusIdx: index("idx_outbound_messages_status").on(table.tenantId, table.status),
}));

export const documents = pgTable("documents", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	ownerUserId: uuid("owner_user_id").references(() => users.id, { onDelete: 'set null' }),
	source: varchar("source", { length: 50 }).notNull().default("web"),
	objectKey: text("object_key").notNull(),
	fileName: varchar("file_name", { length: 500 }),
	mimeType: varchar("mime_type", { length: 255 }).notNull(),
	sizeBytes: integer("size_bytes").notNull(),
	checksumSha256: varchar("checksum_sha256", { length: 64 }).notNull(),
	status: varchar("status", { length: 30 }).notNull().default("stored"),
	metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	objectKeyUnique: uniqueIndex("ux_documents_object_key").on(table.objectKey),
	checksumIdx: index("idx_documents_tenant_checksum").on(table.tenantId, table.checksumSha256),
	statusIdx: index("idx_documents_status").on(table.tenantId, table.status),
}));

export const submissions = pgTable("submissions", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: 'set null' }),
	conversationId: integer("conversation_id").references(() => conversations.id, { onDelete: 'set null' }),
	status: varchar("status", { length: 50 }).notNull().default("received"),
	title: varchar("title", { length: 255 }),
	description: text("description"),
	idempotencyKey: varchar("idempotency_key", { length: 255 }),
	metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idempotencyUnique: uniqueIndex("ux_submissions_tenant_idempotency").on(table.tenantId, table.idempotencyKey),
	statusIdx: index("idx_submissions_status").on(table.tenantId, table.status),
}));

export const submissionMessages = pgTable("submission_messages", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	submissionId: integer("submission_id").notNull().references(() => submissions.id, { onDelete: 'cascade' }),
	inboundMessageId: integer("inbound_message_id").notNull().references(() => inboundMessages.id, { onDelete: 'cascade' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	messageUnique: uniqueIndex("ux_submission_messages_message").on(table.inboundMessageId),
	submissionIdx: index("idx_submission_messages_submission").on(table.submissionId),
}));

export const submissionDocuments = pgTable("submission_documents", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	submissionId: integer("submission_id").notNull().references(() => submissions.id, { onDelete: 'cascade' }),
	documentId: integer("document_id").notNull().references(() => documents.id, { onDelete: 'cascade' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	documentUnique: uniqueIndex("ux_submission_documents_submission_document").on(table.submissionId, table.documentId),
	documentIdx: index("idx_submission_documents_document").on(table.documentId),
}));

export const extractionRuns = pgTable("extraction_runs", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	submissionId: integer("submission_id").notNull().references(() => submissions.id, { onDelete: 'cascade' }),
	status: varchar("status", { length: 50 }).notNull().default("queued"),
	pipelineVersion: varchar("pipeline_version", { length: 100 }).notNull(),
	modelName: varchar("model_name", { length: 255 }),
	promptVersion: varchar("prompt_version", { length: 100 }),
	startedAt: timestamp("started_at", { mode: 'string' }),
	finishedAt: timestamp("finished_at", { mode: 'string' }),
	errorMessage: text("error_message"),
	metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	submissionPipelineIdx: index("idx_extraction_runs_submission_pipeline").on(table.submissionId, table.pipelineVersion),
	statusIdx: index("idx_extraction_runs_status").on(table.tenantId, table.status),
}));

export const extractionResults = pgTable("extraction_results", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	extractionRunId: integer("extraction_run_id").notNull().references(() => extractionRuns.id, { onDelete: 'cascade' }),
	schemaVersion: varchar("schema_version", { length: 100 }).notNull(),
	result: jsonb("result").notNull().default(sql`'{}'::jsonb`),
	overallConfidence: numeric("overall_confidence", { precision: 5, scale: 4 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	runUnique: uniqueIndex("ux_extraction_results_run").on(table.extractionRunId),
}));

export const extractionFields = pgTable("extraction_fields", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	extractionResultId: integer("extraction_result_id").notNull().references(() => extractionResults.id, { onDelete: 'cascade' }),
	fieldPath: varchar("field_path", { length: 255 }).notNull(),
	value: jsonb("value"),
	confidence: numeric("confidence", { precision: 5, scale: 4 }),
	evidence: jsonb("evidence").default(sql`'{}'::jsonb`),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	fieldUnique: uniqueIndex("ux_extraction_fields_result_path").on(table.extractionResultId, table.fieldPath),
}));

export const reviewTasks = pgTable("review_tasks", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	submissionId: integer("submission_id").notNull().references(() => submissions.id, { onDelete: 'cascade' }),
	extractionResultId: integer("extraction_result_id").references(() => extractionResults.id, { onDelete: 'set null' }),
	assignedToUserId: uuid("assigned_to_user_id").references(() => users.id, { onDelete: 'set null' }),
	status: varchar("status", { length: 50 }).notNull().default("pending"),
	priority: integer("priority").notNull().default(0),
	dueAt: timestamp("due_at", { mode: 'string' }),
	lockedAt: timestamp("locked_at", { mode: 'string' }),
	lockedByUserId: uuid("locked_by_user_id").references(() => users.id, { onDelete: 'set null' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	statusIdx: index("idx_review_tasks_status").on(table.tenantId, table.status, table.priority),
	assigneeIdx: index("idx_review_tasks_assignee").on(table.assignedToUserId, table.status),
}));

export const reviewChanges = pgTable("review_changes", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	reviewTaskId: integer("review_task_id").notNull().references(() => reviewTasks.id, { onDelete: 'cascade' }),
	changedByUserId: uuid("changed_by_user_id").references(() => users.id, { onDelete: 'set null' }),
	fieldPath: varchar("field_path", { length: 255 }).notNull(),
	proposedValue: jsonb("proposed_value"),
	confirmedValue: jsonb("confirmed_value"),
	reason: text("reason"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	taskIdx: index("idx_review_changes_task").on(table.reviewTaskId),
}));

export const businessDocuments = pgTable("business_documents", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	sourceReviewTaskId: integer("source_review_task_id").references(() => reviewTasks.id, { onDelete: 'set null' }),
	documentType: varchar("document_type", { length: 50 }).notNull(),
	documentNumber: varchar("document_number", { length: 100 }),
	documentDate: date("document_date").notNull(),
	partnerName: varchar("partner_name", { length: 255 }),
	partnerTaxCode: varchar("partner_tax_code", { length: 50 }),
	currency: varchar("currency", { length: 3 }).notNull().default("VND"),
	subtotalAmount: numeric("subtotal_amount", { precision: 18, scale: 2 }).notNull().default("0"),
	taxAmount: numeric("tax_amount", { precision: 18, scale: 2 }).notNull().default("0"),
	totalAmount: numeric("total_amount", { precision: 18, scale: 2 }).notNull().default("0"),
	status: varchar("status", { length: 50 }).notNull().default("draft"),
	idempotencyKey: varchar("idempotency_key", { length: 255 }),
	metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idempotencyUnique: uniqueIndex("ux_business_documents_tenant_idempotency").on(table.tenantId, table.idempotencyKey),
	duplicateIdx: index("idx_business_documents_duplicate").on(table.tenantId, table.partnerTaxCode, table.documentNumber, table.documentDate),
	statusIdx: index("idx_business_documents_status").on(table.tenantId, table.status),
}));

export const businessDocumentLines = pgTable("business_document_lines", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	businessDocumentId: integer("business_document_id").notNull().references(() => businessDocuments.id, { onDelete: 'cascade' }),
	lineNo: integer("line_no").notNull(),
	description: text("description"),
	quantity: numeric("quantity", { precision: 18, scale: 3 }).notNull().default("1"),
	unitPrice: numeric("unit_price", { precision: 18, scale: 2 }).notNull().default("0"),
	taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).notNull().default("0"),
	lineAmount: numeric("line_amount", { precision: 18, scale: 2 }).notNull().default("0"),
	metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	lineUnique: uniqueIndex("ux_business_document_lines_doc_line").on(table.businessDocumentId, table.lineNo),
}));

export const chartOfAccounts = pgTable("chart_of_accounts", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	code: varchar("code", { length: 50 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	accountType: varchar("account_type", { length: 50 }).notNull(),
	parentAccountId: integer("parent_account_id"),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	codeUnique: uniqueIndex("ux_chart_of_accounts_tenant_code").on(table.tenantId, table.code),
	typeIdx: index("idx_chart_of_accounts_type").on(table.tenantId, table.accountType),
}));

export const accountingPeriods = pgTable("accounting_periods", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	name: varchar("name", { length: 100 }).notNull(),
	periodStart: date("period_start").notNull(),
	periodEnd: date("period_end").notNull(),
	status: varchar("status", { length: 30 }).notNull().default("open"),
	closedAt: timestamp("closed_at", { mode: 'string' }),
	closedByUserId: uuid("closed_by_user_id").references(() => users.id, { onDelete: 'set null' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	periodUnique: uniqueIndex("ux_accounting_periods_tenant_range").on(table.tenantId, table.periodStart, table.periodEnd),
	statusIdx: index("idx_accounting_periods_status").on(table.tenantId, table.status),
}));

export const journalEntries = pgTable("journal_entries", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	accountingPeriodId: integer("accounting_period_id").notNull().references(() => accountingPeriods.id, { onDelete: 'restrict' }),
	sourceDocumentId: integer("source_document_id").references(() => businessDocuments.id, { onDelete: 'restrict' }),
	entryNumber: varchar("entry_number", { length: 100 }).notNull(),
	entryDate: date("entry_date").notNull(),
	description: text("description"),
	status: varchar("status", { length: 30 }).notNull().default("posted"),
	sourceVersion: integer("source_version").notNull().default(1),
	idempotencyKey: varchar("idempotency_key", { length: 255 }),
	postedAt: timestamp("posted_at", { mode: 'string' }).defaultNow(),
	postedByUserId: uuid("posted_by_user_id").references(() => users.id, { onDelete: 'set null' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	entryNumberUnique: uniqueIndex("ux_journal_entries_tenant_number").on(table.tenantId, table.entryNumber),
	sourceUnique: uniqueIndex("ux_journal_entries_source_version").on(table.tenantId, table.sourceDocumentId, table.sourceVersion),
	idempotencyUnique: uniqueIndex("ux_journal_entries_idempotency").on(table.tenantId, table.idempotencyKey),
	periodIdx: index("idx_journal_entries_period").on(table.accountingPeriodId),
}));

export const journalLines = pgTable("journal_lines", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	journalEntryId: integer("journal_entry_id").notNull().references(() => journalEntries.id, { onDelete: 'cascade' }),
	accountId: integer("account_id").notNull().references(() => chartOfAccounts.id, { onDelete: 'restrict' }),
	lineNo: integer("line_no").notNull(),
	description: text("description"),
	debit: numeric("debit", { precision: 18, scale: 2 }).notNull().default("0"),
	credit: numeric("credit", { precision: 18, scale: 2 }).notNull().default("0"),
	currency: varchar("currency", { length: 3 }).notNull().default("VND"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	lineUnique: uniqueIndex("ux_journal_lines_entry_line").on(table.journalEntryId, table.lineNo),
	accountIdx: index("idx_journal_lines_account").on(table.tenantId, table.accountId),
}));

export const payments = pgTable("payments", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	paymentNumber: varchar("payment_number", { length: 100 }).notNull(),
	paymentType: varchar("payment_type", { length: 50 }).notNull(),
	paymentDate: date("payment_date").notNull(),
	amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
	currency: varchar("currency", { length: 3 }).notNull().default("VND"),
	method: varchar("method", { length: 50 }).notNull().default("cash"),
	reference: varchar("reference", { length: 255 }),
	status: varchar("status", { length: 30 }).notNull().default("recorded"),
	metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	numberUnique: uniqueIndex("ux_payments_tenant_number").on(table.tenantId, table.paymentNumber),
	statusIdx: index("idx_payments_status").on(table.tenantId, table.status),
}));

export const paymentAllocations = pgTable("payment_allocations", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	paymentId: integer("payment_id").notNull().references(() => payments.id, { onDelete: 'cascade' }),
	businessDocumentId: integer("business_document_id").notNull().references(() => businessDocuments.id, { onDelete: 'restrict' }),
	allocatedAmount: numeric("allocated_amount", { precision: 18, scale: 2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	allocationUnique: uniqueIndex("ux_payment_allocations_payment_document").on(table.paymentId, table.businessDocumentId),
	documentIdx: index("idx_payment_allocations_document").on(table.businessDocumentId),
}));

export const auditEvents = pgTable("audit_events", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").references(() => tenants.id, { onDelete: 'cascade' }),
	actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: 'set null' }),
	action: varchar("action", { length: 100 }).notNull(),
	entityType: varchar("entity_type", { length: 100 }).notNull(),
	entityId: varchar("entity_id", { length: 100 }),
	requestId: varchar("request_id", { length: 128 }),
	correlationId: varchar("correlation_id", { length: 128 }),
	before: jsonb("before"),
	after: jsonb("after"),
	metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	entityIdx: index("idx_audit_events_entity").on(table.tenantId, table.entityType, table.entityId),
	correlationIdx: index("idx_audit_events_correlation").on(table.correlationId),
}));

export const outboxEvents = pgTable("outbox_events", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").references(() => tenants.id, { onDelete: 'cascade' }),
	eventType: varchar("event_type", { length: 150 }).notNull(),
	aggregateType: varchar("aggregate_type", { length: 100 }).notNull(),
	aggregateId: varchar("aggregate_id", { length: 100 }).notNull(),
	payload: jsonb("payload").notNull().default(sql`'{}'::jsonb`),
	status: varchar("status", { length: 30 }).notNull().default("pending"),
	attemptCount: integer("attempt_count").notNull().default(0),
	idempotencyKey: varchar("idempotency_key", { length: 255 }),
	availableAt: timestamp("available_at", { mode: 'string' }).defaultNow(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	lastError: text("last_error"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idempotencyUnique: uniqueIndex("ux_outbox_events_idempotency").on(table.tenantId, table.idempotencyKey),
	statusIdx: index("idx_outbox_events_status").on(table.status, table.availableAt),
	aggregateIdx: index("idx_outbox_events_aggregate").on(table.aggregateType, table.aggregateId),
}));

export const integrationRuns = pgTable("integration_runs", {
	id: serial("id").primaryKey(),
	tenantId: integer("tenant_id").references(() => tenants.id, { onDelete: 'cascade' }),
	provider: varchar("provider", { length: 100 }).notNull(),
	workflowKey: varchar("workflow_key", { length: 150 }).notNull(),
	status: varchar("status", { length: 30 }).notNull().default("queued"),
	requestPayload: jsonb("request_payload").default(sql`'{}'::jsonb`),
	responsePayload: jsonb("response_payload").default(sql`'{}'::jsonb`),
	idempotencyKey: varchar("idempotency_key", { length: 255 }),
	startedAt: timestamp("started_at", { mode: 'string' }),
	finishedAt: timestamp("finished_at", { mode: 'string' }),
	lastError: text("last_error"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => ({
	idempotencyUnique: uniqueIndex("ux_integration_runs_idempotency").on(table.tenantId, table.provider, table.idempotencyKey),
	statusIdx: index("idx_integration_runs_status").on(table.tenantId, table.provider, table.status),
}));
