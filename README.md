<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Nuxt][Nuxt-shield]][Nuxt-url]
[![Vue][Vue-shield]][Vue-url]
[![TypeScript][TypeScript-shield]][TypeScript-url]
[![Tailwind][Tailwind-shield]][Tailwind-url]
[![PostgreSQL][PostgreSQL-shield]][PostgreSQL-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="#">
    <img src="public/img/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ERP Web Application</h3>

  <p align="center">
    Hệ thống quản lý doanh nghiệp toàn diện — kế toán, hóa đơn, công nợ & thuế
    <br />
  </p>
</div>

---

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Mục lục</summary>
  <ol>
    <li>
      <a href="#giới-thiệu-dự-án">Giới thiệu dự án</a>
      <ul>
        <li><a href="#công-nghệ-sử-dụng">Công nghệ sử dụng</a></li>
      </ul>
    </li>
    <li>
      <a href="#bắt-đầu">Bắt đầu</a>
      <ul>
        <li><a href="#yêu-cầu">Yêu cầu</a></li>
        <li><a href="#cài-đặt">Cài đặt</a></li>
      </ul>
    </li>
    <li><a href="#sử-dụng">Sử dụng</a></li>
    <li><a href="#cấu-trúc-dự-án">Cấu trúc dự án</a></li>
    <li><a href="#api-endpoints">API Endpoints</a></li>
    <li><a href="#lộ-trình-phát-triển">Lộ trình phát triển</a></li>
  </ol>
</details>

---

<!-- ABOUT THE PROJECT -->

## Giới thiệu dự án

Hệ thống ERP (Enterprise Resource Planning) xây dựng trên nền tảng **Nuxt 4 + Vue 3**, phục vụ quản lý kế toán và tài chính cho doanh nghiệp.
  <a href="#">
    <img src="public/img/introduce.png" alt="introduce">
  </a>
**Các module chính:**

- **Hóa đơn** — Quản lý hóa đơn đầu vào/đầu ra, tra cứu theo khách hàng, nhà cung cấp
- **Thu Chi** — Theo dõi doanh thu và chi phí theo kỳ, xuất báo cáo chi tiết
- **Công nợ** — Quản lý khoản phải thu / phải trả, cảnh báo hạn thanh toán
- **Thuế** — Khai báo thuế, tổng hợp thuế GTGT đầu vào/đầu ra
- **Báo cáo tài chính** — Báo cáo tổng hợp, chi tiết theo Thông tư 152

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

### Công nghệ sử dụng

| Lớp      | Công nghệ                                  |
| -------- | ------------------------------------------ |
| Frontend | Nuxt 4.2.2 · Vue 3.5.27 · Vue Router 4.6.4 |
| Styling  | Tailwind CSS 4.1.18                        |
| Backend  | Nuxt Server API Routes (H3)                |
| ORM      | Drizzle ORM 0.45.1 + Drizzle Kit 0.31.8    |
| Database | PostgreSQL (node-postgres pg 8.17.2)       |
| Auth     | bcryptjs 3.0.3 · jsonwebtoken 9.0.3        |
| Language | TypeScript                                 |
| Build    | Vite (via Nuxt)                            |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- GETTING STARTED -->

## Bắt đầu

### Yêu cầu

- **Node.js** ≥ 18
- **PostgreSQL** đang chạy cục bộ hoặc trên cloud
- **npm** (hoặc pnpm / yarn)

### Cài đặt

1. **Clone repository:**

   ```bash
   git clone https://github.com/your-username/erp-nuxt-app.git
   cd erp-nuxt-app
   ```

2. **Cài đặt dependencies:**

   ```bash
   npm install
   ```

3. **Tạo file `.env` tại thư mục gốc:**

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ERP_database"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

4. **Đồng bộ schema lên database:**

   ```bash
   npm run db:push
   ```

5. **Khởi chạy server phát triển:**

   ```bash
   npm run dev
   ```

   Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- USAGE -->

## Sử dụng

**Đăng ký / Đăng nhập:**

Truy cập `/register` để tạo tài khoản mới hoặc `/login` để đăng nhập. Token JWT được lưu tại cookie và tự động gắn vào mọi request API.

**Scripts có sẵn:**

| Lệnh                | Mô tả                              |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Khởi chạy server phát triển        |
| `npm run build`     | Build production                   |
| `npm run generate`  | Tạo static site                    |
| `npm run preview`   | Xem trước bản production           |
| `npm run db:push`   | Đẩy schema lên database            |
| `npm run db:studio` | Mở Drizzle Studio (trình duyệt DB) |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- PROJECT STRUCTURE -->

## Cấu trúc dự án

```
nuxt-app/
├── app/
│   ├── assets/css/         # Global styles (Tailwind)
│   ├── components/         # UI components dùng chung
│   │   ├── NavigationBar.vue
│   │   ├── LeftSidebar.vue
│   │   ├── TabBar.vue
│   │   ├── Breadcrumb.vue
│   │   ├── InvoiceDetailsOverlay.vue
│   │   ├── RevenueReportOverlay.vue
│   │   └── ExpenseReportOverlay.vue
│   ├── composables/        # Logic tái sử dụng (useERP, useAuth, useAccountingTabs)
│   ├── layouts/            # Layout mặc định
│   └── pages/
│       ├── index.vue       # Trang chủ / Dashboard
│       ├── login.vue       # Đăng nhập
│       ├── register.vue    # Đăng ký
│       ├── ke-toan/        # Phân hệ kế toán
│       │   ├── index.vue   # Tổng quan kế toán
│       │   ├── hoa-don.vue # Quản lý hóa đơn
│       │   ├── thu-chi.vue # Thu chi
│       │   ├── cong-no.vue # Công nợ
│       │   └── thue.vue    # Thuế
│       └── marketing/      # Phân hệ marketing
├── server/
│   ├── api/                # REST API endpoints
│   │   ├── auth/           # Đăng nhập / Đăng ký / Xác thực token
│   │   ├── invoices/       # CRUD hóa đơn
│   │   ├── reports/
│   │   │   ├── revenue/    # CRUD báo cáo doanh thu
│   │   │   └── expense/    # CRUD báo cáo chi phí
│   │   ├── debts/          # Công nợ
│   │   └── users/          # Người dùng
│   ├── db/
│   │   ├── schema.ts       # Drizzle schema
│   │   └── ERP_postgres.sql
│   ├── middleware/auth.ts  # Xác thực JWT
│   └── utils/drizzle.ts    # Kết nối database
├── shared/types/           # Kiểu dùng chung (client + server)
├── drizzle/                # Migration files
├── public/                 # Tài sản tĩnh (icon, hình ảnh)
├── nuxt.config.ts
├── drizzle.config.ts
└── tsconfig.json
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- API ENDPOINTS -->

## API Endpoints

| Method | Endpoint                   | Mô tả                       |
| ------ | -------------------------- | --------------------------- |
| POST   | `/api/auth/register`       | Đăng ký tài khoản           |
| POST   | `/api/auth/login`          | Đăng nhập, nhận JWT         |
| POST   | `/api/auth/verifyToken`    | Xác minh token              |
| GET    | `/api/invoices`            | Lấy danh sách hóa đơn       |
| GET    | `/api/reports/revenue`     | Danh sách báo cáo doanh thu |
| POST   | `/api/reports/revenue`     | Tạo báo cáo doanh thu       |
| PUT    | `/api/reports/revenue/:id` | Cập nhật báo cáo doanh thu  |
| DELETE | `/api/reports/revenue/:id` | Xóa báo cáo doanh thu       |
| GET    | `/api/reports/expense`     | Danh sách báo cáo chi phí   |
| POST   | `/api/reports/expense`     | Tạo báo cáo chi phí         |
| PUT    | `/api/reports/expense/:id` | Cập nhật báo cáo chi phí    |
| DELETE | `/api/reports/expense/:id` | Xóa báo cáo chi phí         |
| GET    | `/api/debts`               | Danh sách công nợ           |
| GET    | `/api/users`               | Danh sách người dùng        |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- ROADMAP -->

## Lộ trình phát triển

- [x] Xác thực người dùng (JWT + bcrypt)
- [x] Báo cáo thu chi (CRUD đầy đủ)
- [x] Quản lý hóa đơn
- [x] Quản lý công nợ
- [ ] Phân hệ thuế
- [ ] Quản lý kho hàng
- [ ] Phân hệ marketing & phân tích
- [ ] Xuất báo cáo PDF / Excel
- [ ] Phân quyền người dùng (RBAC)
- [ ] Thông báo hạn thanh toán công nợ

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- SHIELDS DEFINITIONS -->

[Nuxt-shield]: https://img.shields.io/badge/Nuxt-4.2-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white
[Nuxt-url]: https://nuxt.com
[Vue-shield]: https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white
[Vue-url]: https://vuejs.org
[TypeScript-shield]: https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org
[Tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com
[PostgreSQL-shield]: https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org
