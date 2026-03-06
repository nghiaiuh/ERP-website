# 📊 ERP Website - Hệ thống Quản lý Doanh nghiệp

Ứng dụng quản lý kế toán cho doanh nghiệp, xây dựng với NuxtJS 3 và PostgreSQL.

---

## 🚀 Bắt đầu

### Yêu cầu hệ thống

- **Node.js**: v18 trở lên
- **npm** hoặc **pnpm**
- **PostgreSQL**: v14 trở lên

### Cài đặt

1. **Clone project về máy:**

```bash
git clone <url-repository>
cd nuxt-app
```

2. **Cài đặt dependencies:**

```bash
npm install
```

3. **Cấu hình database:**
   - Tạo file `.env` trong thư mục gốc
   - Thêm connection string PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

4. **Chạy migrations:**

```bash
npm run db:push
```

---

## 💻 Sử dụng Project

### Chạy môi trường Development

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:3000`

### Build cho Production

```bash
npm run build
npm run preview
```

### Các lệnh phổ biến

| Lệnh                | Mô tả                   |
| ------------------- | ----------------------- |
| `npm run dev`       | Chạy dev server         |
| `npm run build`     | Build production        |
| `npm run generate`  | Generate static site    |
| `npm run db:push`   | Đẩy schema lên database |
| `npm run db:studio` | Mở Drizzle Studio       |

---

## 📁 Cấu trúc Project

```
nuxt-app/
├── app/
│   ├── components/       # Vue components
│   ├── composables/      # Composable functions
│   ├── pages/           # Route pages
│   └── layouts/         # Layout templates
├── server/
│   ├── api/             # API endpoints
│   ├── db/              # Database schema
│   └── utils/           # Server utilities
└── public/              # Static files
```