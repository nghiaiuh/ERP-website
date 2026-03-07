CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    username VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from don_chi_phi
select * from _chi_phi
select * from so_doanh_thu
select * from don_doanh_thu
select * from doanh_nghiep
truncate table so_chi_phi cascade
create table doanh_nghiep (
	id SERIAL PRIMARY KEY,
	ten_doanh_nghiep VARCHAR(255) DEFAULT 'Cơ sở Điêu Khắc Trang Trí Vĩnh Tiến',
	ma_so_thue VARCHAR(50) DEFAULT '042179006886',
	dia_chi TEXT DEFAULT '1955, xã Bình Minh, tỉnh Đồng Nai'
);

--SỔ DOANH THU
CREATE TABLE so_doanh_thu (
	id SERIAL PRIMARY KEY,
	doanh_nghiep_id integer references doanh_nghiep(id) on delete cascade,
    mau_so VARCHAR(50) DEFAULT 'S1a-HKD TT 152/2025/TT-BTC 31/12/2025',
	ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
	tong_tien NUMERIC(18,2) DEFAULT 0,
	CHECK (ngay_ket_thuc >= ngay_bat_dau),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--SỔ CHI PHÍ
CREATE TABLE so_chi_phi (
	id SERIAL PRIMARY KEY,
	doanh_nghiep_id integer references doanh_nghiep(id) on delete cascade,
    mau_so VARCHAR(50) DEFAULT 'S2c-HKD TT 152/2025/TT-BTC 31/12/2025',
	ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
	tong_tien NUMERIC(18,2) DEFAULT 0,
	CHECK (ngay_ket_thuc >= ngay_bat_dau),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--ĐƠN DOANH THU
-- Ghi nhận các khoản doanh thu vào sổ kế toán
CREATE TABLE don_doanh_thu(
	id SERIAL PRIMARY KEY,
	revenue_book_id INTEGER NOT NULL REFERENCES so_doanh_thu(id) ON DELETE CASCADE,
	hoa_don_ban_id INTEGER REFERENCES hoa_don_ban(id) ON DELETE SET NULL,
	so_chung_tu VARCHAR(100) NOT NULL,
	ngay_ghi_nhan DATE NOT NULL,
	mo_ta TEXT,
	phan_loai VARCHAR(100), -- Phân loại khoản thu (bán hàng, dịch vụ, khác...)
	so_tien NUMERIC(18,2) DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Note: so_tien có thể được lấy từ hoa_don_ban.tong_tien khi có hoa_don_ban_id, hoặc nhập trực tiếp
--ĐƠN CHI PHÍ
-- Ghi nhận các khoản chi phí vào sổ kế toán
CREATE TABLE don_chi_phi (
    id SERIAL PRIMARY KEY,
    expense_book_id INTEGER NOT NULL REFERENCES so_chi_phi(id) ON DELETE CASCADE,
    hoa_don_mua_id INTEGER REFERENCES hoa_don_mua(id) ON DELETE SET NULL,
    so_chung_tu VARCHAR(100),
    ngay_ghi_nhan DATE NOT NULL,
    mo_ta TEXT,
    phan_loai VARCHAR(100), -- Phân loại khoản chi (mua hàng, lương, vận hành...)
    so_tien NUMERIC(18,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Note: so_tien có thể được lấy từ hoa_don_mua.tong_tien khi có hoa_don_mua_id, hoặc nhập trực tiếp

--ĐỐI TÁC (Khách hàng, nhà cung cấp)
CREATE TABLE doi_tac (
	id SERIAL PRIMARY KEY,
	ma_doi_tac VARCHAR(50) UNIQUE NOT NULL,
	ten_doi_tac VARCHAR(255) NOT NULL,
	loai_doi_tac VARCHAR(30) CHECK (loai_doi_tac IN ('khach_hang','nha_cung_cap','ca_hai')) NOT NULL,
	ma_so_thue VARCHAR(50),
    dia_chi TEXT,
    dien_thoai VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--HỢP ĐỒNG
CREATE TABLE hop_dong (
	id SERIAL PRIMARY KEY,
	ma_hop_dong VARCHAR(100) UNIQUE,
	doi_tac_id INTEGER REFERENCES doi_tac(id),
	tong_gia_tri NUMERIC(18,2) CHECK (tong_gia_tri >= 0),
	ngay_bat_dau DATE,
	ngay_ket_thuc DATE,
	CHECK (ngay_ket_thuc >= ngay_bat_dau),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--HOÁ ĐƠN
CREATE TABLE hoa_don_ban (
    id SERIAL PRIMARY KEY,
    ma_hoa_don VARCHAR(100) UNIQUE NOT NULL,
    doi_tac_id INTEGER NOT NULL REFERENCES doi_tac(id),
    hop_dong_id INTEGER REFERENCES hop_dong(id),
    ngay_hoa_don DATE NOT NULL,
    tong_tien NUMERIC(18,2) DEFAULT 0,
    trang_thai VARCHAR(30) CHECK (
        trang_thai IN ('chua_thu','da_thu','mot_phan')
    ) DEFAULT 'chua_thu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hoa_don_mua (
    id SERIAL PRIMARY KEY,
    ma_hoa_don VARCHAR(100) UNIQUE NOT NULL,
    doi_tac_id INTEGER NOT NULL REFERENCES doi_tac(id),
    ngay_hoa_don DATE NOT NULL,
    tong_tien NUMERIC(18,2) DEFAULT 0,
    trang_thai VARCHAR(30) CHECK (
        trang_thai IN ('chua_tra','da_tra','mot_phan')
    ) DEFAULT 'chua_tra',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng THUE đã bị xóa vì thông tin thuế được lưu trong:
-- - hoa_don_ban_chi_tiet.ty_le_thue
-- - hoa_don_mua_chi_tiet.ty_le_thue
-- - chi_tiet_thue (cho báo cáo thuế)

--CÔNG NỢ
CREATE TABLE cong_no (
    id SERIAL PRIMARY KEY,
    doi_tac_id INTEGER NOT NULL REFERENCES doi_tac(id),
    loai_cong_no VARCHAR(30) CHECK (
        loai_cong_no IN ('phai_thu','phai_tra')
    ) NOT NULL,
    so_tien NUMERIC(18,2) NOT NULL,
    han_thanh_toan DATE,
	hoa_don_ban_id INTEGER REFERENCES hoa_don_ban(id),
	hoa_don_mua_id INTEGER REFERENCES hoa_don_mua(id),
	CHECK (
	    (hoa_don_ban_id IS NOT NULL AND hoa_don_mua_id IS NULL)
	    OR
	    (hoa_don_ban_id IS NULL AND hoa_don_mua_id IS NOT NULL)
	),
    trang_thai VARCHAR(30) CHECK (
        trang_thai IN ('chua_thanh_toan','mot_phan','da_thanh_toan')
    ) DEFAULT 'chua_thanh_toan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--CHI TIẾT HÓA ĐƠN BÁN
CREATE TABLE hoa_don_ban_chi_tiet (
    id SERIAL PRIMARY KEY,
    hoa_don_ban_id INTEGER NOT NULL REFERENCES hoa_don_ban(id) ON DELETE CASCADE,
    ten_hang_hoa VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    so_luong NUMERIC(18,3) NOT NULL CHECK (so_luong > 0),
    don_vi VARCHAR(50),
    don_gia NUMERIC(18,2) NOT NULL CHECK (don_gia >= 0),
    ty_le_thue NUMERIC(5,2) DEFAULT 10 CHECK (ty_le_thue >= 0 AND ty_le_thue <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Note: thanh_tien = so_luong * don_gia
-- Note: tien_thue = thanh_tien * ty_le_thue / 100
-- Note: tong_tien = thanh_tien + tien_thue
-- Tính toán khi query hoặc dùng trigger để cập nhật hoa_don_ban.tong_tien

--CHI TIẾT HÓA ĐƠN MUA
CREATE TABLE hoa_don_mua_chi_tiet (
    id SERIAL PRIMARY KEY,
    hoa_don_mua_id INTEGER NOT NULL REFERENCES hoa_don_mua(id) ON DELETE CASCADE,
    ten_hang_hoa VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    so_luong NUMERIC(18,3) NOT NULL CHECK (so_luong > 0),
    don_vi VARCHAR(50),
    don_gia NUMERIC(18,2) NOT NULL CHECK (don_gia >= 0),
    ty_le_thue NUMERIC(5,2) DEFAULT 10 CHECK (ty_le_thue >= 0 AND ty_le_thue <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Note: thanh_tien = so_luong * don_gia
-- Note: tien_thue = thanh_tien * ty_le_thue / 100
-- Note: tong_tien = thanh_tien + tien_thue
-- Tính toán khi query hoặc dùng trigger để cập nhật hoa_don_mua.tong_tien

--GIAO DỊCH THANH TOÁN
CREATE TABLE giao_dich_thanh_toan (
    id SERIAL PRIMARY KEY,
    ma_giao_dich VARCHAR(100) UNIQUE NOT NULL,
    loai_giao_dich VARCHAR(30) CHECK (
        loai_giao_dich IN ('thu','chi')
    ) NOT NULL,
    doi_tac_id INTEGER REFERENCES doi_tac(id),
    hoa_don_ban_id INTEGER REFERENCES hoa_don_ban(id),
    hoa_don_mua_id INTEGER REFERENCES hoa_don_mua(id),
    cong_no_id INTEGER REFERENCES cong_no(id),
    so_tien NUMERIC(18,2) NOT NULL CHECK (so_tien > 0),
    phuong_thuc VARCHAR(50) CHECK (
        phuong_thuc IN ('tien_mat','chuyen_khoan','the','khac')
    ) DEFAULT 'tien_mat',
    ngay_giao_dich DATE NOT NULL,
    ten_ngan_hang VARCHAR(255),
    so_tai_khoan VARCHAR(50),
    ma_tham_chieu VARCHAR(255),
    ghi_chu TEXT,
    nguoi_tao_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--BÁO CÁO THUẾ
CREATE TABLE bao_cao_thue (
    id SERIAL PRIMARY KEY,
    ma_bao_cao VARCHAR(100) UNIQUE NOT NULL,
    loai_thue VARCHAR(50) NOT NULL, -- 'VAT', 'TNCN', 'TNDN'
    ky_bao_cao VARCHAR(20) NOT NULL, -- 'thang', 'quy', 'nam'
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    tong_doanh_thu NUMERIC(18,2) DEFAULT 0,
    tong_chi_phi NUMERIC(18,2) DEFAULT 0,
    so_tien_chiu_thue NUMERIC(18,2) DEFAULT 0,
    ty_le_thue NUMERIC(5,2) DEFAULT 0,
    so_tien_thue NUMERIC(18,2) DEFAULT 0, -- Tổng thuế phải nộp
    so_tien_da_tra NUMERIC(18,2) DEFAULT 0, -- Số tiền đã thanh toán
    -- so_tien_con_lai đã xóa - tính bằng: so_tien_thue - so_tien_da_tra
    trang_thai VARCHAR(30) CHECK (
        trang_thai IN ('ban_nhap','da_nop','da_tra','mot_phan')
    ) DEFAULT 'ban_nhap',
    ngay_nop TIMESTAMP,
    han_nop DATE,
    ngay_tra TIMESTAMP,
    ghi_chu TEXT,
    metadata JSONB,
    nguoi_tao_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (ngay_ket_thuc >= ngay_bat_dau)
);

--CHI TIẾT THUẾ (liên kết báo cáo thuế với hóa đơn)
CREATE TABLE chi_tiet_thue (
    id SERIAL PRIMARY KEY,
    bao_cao_thue_id INTEGER NOT NULL REFERENCES bao_cao_thue(id) ON DELETE CASCADE,
    danh_muc VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    so_tien_tinh_thue NUMERIC(18,2) NOT NULL,
    ty_le_thue NUMERIC(5,2) NOT NULL,
    tien_thue NUMERIC(18,2) NOT NULL,
    hoa_don_ban_id INTEGER REFERENCES hoa_don_ban(id),
    hoa_don_mua_id INTEGER REFERENCES hoa_don_mua(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- INDEXES FOR PERFORMANCE
-- ============================
CREATE INDEX idx_hoa_don_ban_doi_tac ON hoa_don_ban(doi_tac_id);
CREATE INDEX idx_hoa_don_ban_ngay ON hoa_don_ban(ngay_hoa_don);
CREATE INDEX idx_hoa_don_mua_doi_tac ON hoa_don_mua(doi_tac_id);
CREATE INDEX idx_hoa_don_mua_ngay ON hoa_don_mua(ngay_hoa_don);
CREATE INDEX idx_cong_no_doi_tac ON cong_no(doi_tac_id);
CREATE INDEX idx_cong_no_trang_thai ON cong_no(trang_thai);
CREATE INDEX idx_don_doanh_thu_ngay ON don_doanh_thu(ngay_ghi_nhan);
CREATE INDEX idx_don_doanh_thu_hoa_don ON don_doanh_thu(hoa_don_ban_id);
CREATE INDEX idx_don_chi_phi_ngay ON don_chi_phi(ngay_ghi_nhan);
CREATE INDEX idx_don_chi_phi_hoa_don ON don_chi_phi(hoa_don_mua_id);
CREATE INDEX idx_hoa_don_ban_chi_tiet ON hoa_don_ban_chi_tiet(hoa_don_ban_id);
CREATE INDEX idx_hoa_don_mua_chi_tiet ON hoa_don_mua_chi_tiet(hoa_don_mua_id);
CREATE INDEX idx_giao_dich_thanh_toan_ngay ON giao_dich_thanh_toan(ngay_giao_dich);
CREATE INDEX idx_giao_dich_thanh_toan_doi_tac ON giao_dich_thanh_toan(doi_tac_id);
CREATE INDEX idx_bao_cao_thue_trang_thai ON bao_cao_thue(trang_thai);
CREATE INDEX idx_bao_cao_thue_ngay ON bao_cao_thue(ngay_bat_dau, ngay_ket_thuc);
CREATE INDEX idx_chi_tiet_thue_bao_cao ON chi_tiet_thue(bao_cao_thue_id);

-- ============================
-- TRIGGERS & FUNCTIONS
-- ============================

-- Function: Tính tổng tiền hóa đơn bán từ chi tiết
CREATE OR REPLACE FUNCTION tinh_tong_hoa_don_ban()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE hoa_don_ban
    SET tong_tien = (
        SELECT COALESCE(SUM(
            so_luong * don_gia * (1 + ty_le_thue / 100)
        ), 0)
        FROM hoa_don_ban_chi_tiet
        WHERE hoa_don_ban_id = COALESCE(NEW.hoa_don_ban_id, OLD.hoa_don_ban_id)
    )
    WHERE id = COALESCE(NEW.hoa_don_ban_id, OLD.hoa_don_ban_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tinh_tong_hoa_don_ban
AFTER INSERT OR UPDATE OR DELETE ON hoa_don_ban_chi_tiet
FOR EACH ROW
EXECUTE FUNCTION tinh_tong_hoa_don_ban();

-- Function: Tính tổng tiền hóa đơn mua từ chi tiết
CREATE OR REPLACE FUNCTION tinh_tong_hoa_don_mua()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE hoa_don_mua
    SET tong_tien = (
        SELECT COALESCE(SUM(
            so_luong * don_gia * (1 + ty_le_thue / 100)
        ), 0)
        FROM hoa_don_mua_chi_tiet
        WHERE hoa_don_mua_id = COALESCE(NEW.hoa_don_mua_id, OLD.hoa_don_mua_id)
    )
    WHERE id = COALESCE(NEW.hoa_don_mua_id, OLD.hoa_don_mua_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger: Tự động tính tổng khi thêm/sửa/xóa chi tiết hóa đơn mua
CREATE TRIGGER trigger_tinh_tong_hoa_don_mua
AFTER INSERT OR UPDATE OR DELETE ON hoa_don_mua_chi_tiet
FOR EACH ROW
EXECUTE FUNCTION tinh_tong_hoa_don_mua();

-- Function: Tính tổng tiền sổ doanh thu từ các đơn doanh thu
CREATE OR REPLACE FUNCTION tinh_tong_so_doanh_thu()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE so_doanh_thu
    SET tong_tien = (
        SELECT COALESCE(SUM(CAST(so_tien AS NUMERIC(18,2))), 0)
        FROM don_doanh_thu
        WHERE revenue_book_id = COALESCE(NEW.revenue_book_id, OLD.revenue_book_id)
    )
    WHERE id = COALESCE(NEW.revenue_book_id, OLD.revenue_book_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_tinh_tong_so_doanh_thu
AFTER INSERT OR UPDATE OR DELETE ON don_doanh_thu
FOR EACH ROW
EXECUTE FUNCTION tinh_tong_so_doanh_thu();

-- Function: Tính tổng tiền sổ chi phí từ các đơn chi phí
CREATE OR REPLACE FUNCTION tinh_tong_so_chi_phi()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE so_chi_phi
    SET tong_tien = (
        SELECT COALESCE(SUM(CAST(so_tien AS NUMERIC(18,2))), 0)
        FROM don_chi_phi
        WHERE expense_book_id = COALESCE(NEW.expense_book_id, OLD.expense_book_id)
    )
    WHERE id = COALESCE(NEW.expense_book_id, OLD.expense_book_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger: Tự động tính tổng tiền sổ chi phí khi thêm/sửa/xóa đơn chi phí
CREATE TRIGGER trigger_tinh_tong_so_chi_phi
AFTER INSERT OR UPDATE OR DELETE ON don_chi_phi
FOR EACH ROW
EXECUTE FUNCTION tinh_tong_so_chi_phi();

-- Function: Cập nhật trạng thái công nợ khi có thanh toán
CREATE OR REPLACE FUNCTION cap_nhat_trang_thai_cong_no()
RETURNS TRIGGER AS $$
DECLARE
    tong_da_tra NUMERIC(18,2);
    tong_cong_no NUMERIC(18,2);
BEGIN
    IF NEW.cong_no_id IS NOT NULL THEN
        -- Tính tổng đã trả
        SELECT COALESCE(SUM(so_tien), 0) INTO tong_da_tra
        FROM giao_dich_thanh_toan
        WHERE cong_no_id = NEW.cong_no_id;
        
        -- Lấy tổng công nợ
        SELECT so_tien INTO tong_cong_no
        FROM cong_no
        WHERE id = NEW.cong_no_id;
        
        -- Cập nhật trạng thái
        UPDATE cong_no
        SET trang_thai = CASE
            WHEN tong_da_tra >= tong_cong_no THEN 'da_thanh_toan'
            WHEN tong_da_tra > 0 THEN 'mot_phan'
            ELSE 'chua_thanh_toan'
        END
        WHERE id = NEW.cong_no_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Cập nhật trạng thái công nợ khi có giao dịch thanh toán
CREATE TRIGGER trigger_cap_nhat_cong_no
AFTER INSERT OR UPDATE ON giao_dich_thanh_toan
FOR EACH ROW
EXECUTE FUNCTION cap_nhat_trang_thai_cong_no();

-- Function: Cập nhật updated_at timestamp
CREATE OR REPLACE FUNCTION cap_nhat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Tự động cập nhật updated_at cho các bảng có cột này
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION cap_nhat_updated_at();

CREATE TRIGGER trigger_doi_tac_updated_at
BEFORE UPDATE ON doi_tac
FOR EACH ROW
EXECUTE FUNCTION cap_nhat_updated_at();

CREATE TRIGGER trigger_don_doanh_thu_updated_at
BEFORE UPDATE ON don_doanh_thu
FOR EACH ROW
EXECUTE FUNCTION cap_nhat_updated_at();

CREATE TRIGGER trigger_bao_cao_thue_updated_at
BEFORE UPDATE ON bao_cao_thue
FOR EACH ROW
EXECUTE FUNCTION cap_nhat_updated_at();

-- ============================
-- VIEWS - Simplified queries
-- ============================

-- View: Chi tiết hóa đơn bán với tính toán
CREATE OR REPLACE VIEW v_hoa_don_ban_chi_tiet AS
SELECT 
    ct.*,
    (ct.so_luong * ct.don_gia) AS thanh_tien,
    (ct.so_luong * ct.don_gia * ct.ty_le_thue / 100) AS tien_thue,
    (ct.so_luong * ct.don_gia * (1 + ct.ty_le_thue / 100)) AS tong_tien
FROM hoa_don_ban_chi_tiet ct;

-- View: Chi tiết hóa đơn mua với tính toán
CREATE OR REPLACE VIEW v_hoa_don_mua_chi_tiet AS
SELECT 
    ct.*,
    (ct.so_luong * ct.don_gia) AS thanh_tien,
    (ct.so_luong * ct.don_gia * ct.ty_le_thue / 100) AS tien_thue,
    (ct.so_luong * ct.don_gia * (1 + ct.ty_le_thue / 100)) AS tong_tien
FROM hoa_don_mua_chi_tiet ct;

-- View: Hóa đơn bán với thông tin đối tác
CREATE OR REPLACE VIEW v_hoa_don_ban_full AS
SELECT 
    hd.*,
    dt.ten_doi_tac,
    dt.ma_doi_tac,
    dt.ma_so_thue,
    dt.dia_chi,
    dt.dien_thoai,
    dt.email
FROM hoa_don_ban hd
LEFT JOIN doi_tac dt ON hd.doi_tac_id = dt.id;

-- View: Hóa đơn mua với thông tin đối tác
CREATE OR REPLACE VIEW v_hoa_don_mua_full AS
SELECT 
    hd.*,
    dt.ten_doi_tac,
    dt.ma_doi_tac,
    dt.ma_so_thue,
    dt.dia_chi,
    dt.dien_thoai,
    dt.email
FROM hoa_don_mua hd
LEFT JOIN doi_tac dt ON hd.doi_tac_id = dt.id;

-- View: Công nợ với số tiền còn lại
CREATE OR REPLACE VIEW v_cong_no_full AS
SELECT 
    cn.*,
    dt.ten_doi_tac,
    dt.ma_doi_tac,
    COALESCE((
        SELECT SUM(so_tien)
        FROM giao_dich_thanh_toan
        WHERE cong_no_id = cn.id
    ), 0) AS so_tien_da_tra,
    (cn.so_tien - COALESCE((
        SELECT SUM(so_tien)
        FROM giao_dich_thanh_toan
        WHERE cong_no_id = cn.id
    ), 0)) AS so_tien_con_lai
FROM cong_no cn
LEFT JOIN doi_tac dt ON cn.doi_tac_id = dt.id;

-- View: Báo cáo thuế với số tiền còn lại
CREATE OR REPLACE VIEW v_bao_cao_thue_full AS
SELECT 
    bct.*,
    (bct.so_tien_thue - bct.so_tien_da_tra) AS so_tien_con_lai,
    u.username AS nguoi_tao
FROM bao_cao_thue bct
LEFT JOIN users u ON bct.nguoi_tao_id = u.id;

-- ============================
-- COMMENTS - Documentation
-- ============================

COMMENT ON TABLE users IS 'Bảng người dùng hệ thống';
COMMENT ON TABLE doanh_nghiep IS 'Thông tin doanh nghiệp';
COMMENT ON TABLE doi_tac IS 'Đối tác (khách hàng và nhà cung cấp)';
COMMENT ON TABLE hop_dong IS 'Hợp đồng với đối tác';
COMMENT ON TABLE hoa_don_ban IS 'Hóa đơn bán hàng - tong_tien được tính tự động từ chi tiết';
COMMENT ON TABLE hoa_don_ban_chi_tiet IS 'Chi tiết từng dòng hàng hóa/dịch vụ trong hóa đơn bán';
COMMENT ON TABLE hoa_don_mua IS 'Hóa đơn mua hàng - tong_tien được tính tự động từ chi tiết';
COMMENT ON TABLE hoa_don_mua_chi_tiet IS 'Chi tiết từng dòng hàng hóa/dịch vụ trong hóa đơn mua';
COMMENT ON TABLE so_doanh_thu IS 'Sổ doanh thu theo Thông tư 152/2025/TT-BTC';
COMMENT ON TABLE so_chi_phi IS 'Sổ chi phí theo Thông tư 152/2025/TT-BTC';
COMMENT ON TABLE don_doanh_thu IS 'Đơn ghi nhận doanh thu vào sổ kế toán';
COMMENT ON TABLE don_chi_phi IS 'Đơn ghi nhận chi phí vào sổ kế toán';
COMMENT ON TABLE cong_no IS 'Công nợ phải thu/phải trả';
COMMENT ON TABLE giao_dich_thanh_toan IS 'Lịch sử giao dịch thanh toán (thu/chi)';
COMMENT ON TABLE bao_cao_thue IS 'Báo cáo thuế (VAT, TNCN, TNDN)';
COMMENT ON TABLE chi_tiet_thue IS 'Chi tiết từng khoản thuế trong báo cáo';