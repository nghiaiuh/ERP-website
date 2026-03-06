# 📊 ERP System - Project Overview & Context

> **Tài liệu tổng quan dự án - Cập nhật lần cuối: 05/03/2026**
>
> File này chứa toàn bộ context của project để AI/Developer không cần phải quét lại nhiều lần.

---

## 📋 Table of Contents

1. [Project Information](#project-information)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Architecture](#database-architecture)
5. [API Endpoints](#api-endpoints)
6. [Authentication System](#authentication-system)
7. [Frontend Pages & Components](#frontend-pages--components)
8. [Composables & Utilities](#composables--utilities)
9. [Environment Configuration](#environment-configuration)
10. [Development Workflow](#development-workflow)
11. [Key Features](#key-features)

---

## 🎯 Project Information

### Overview

Hệ thống ERP (Enterprise Resource Planning) quản lý kế toán và tài chính cho doanh nghiệp. Tuân thủ theo **Thông tư 152/2025/TT-BTC ngày 31/12/2025** của Bộ Tài chính Việt Nam.

### Business Context

- **Tên doanh nghiệp mẫu:** Cơ sở Điêu Khắc Trang Trí Vĩnh Tiến
- **Mã số thuế:** 042179006886
- **Địa chỉ:** xã Bình Minh, tỉnh Đồng Nai
- **Mẫu sổ:** S1a-HKD, S2c-HKD (Thông tư 152/2025/TT-BTC)

### Core Modules

1. **Quản lý Hóa đơn** (Invoices Management)
2. **Thu Chi** (Revenue & Expense Tracking)
3. **Công nợ** (Accounts Receivable & Payable)
4. **Thuế** (Tax Management & Declarations)
5. **Báo cáo** (Financial Reporting)

---

## 🛠 Technology Stack

### Backend

- **Framework:** Nuxt 4.2.2 (Full-stack framework with server API routes)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM 0.45.1 + Drizzle Kit 0.31.8
- **Driver:** node-postgres (pg 8.17.2)

### Frontend

- **Framework:** Vue 3.5.27 + Nuxt 4
- **Router:** Vue Router 4.6.4
- **Styling:** Tailwind CSS 4.1.18 + @tailwindcss/vite
- **Images:** @nuxt/image 2.0.0

### Authentication & Security

- **Password Hashing:** bcryptjs 3.0.3
- **JWT:** jsonwebtoken 9.0.3
- **Secret Management:** Environment variables

### Development

- **Language:** TypeScript
- **Package Manager:** npm
- **Build Tool:** Vite (via Nuxt)

---

## 📁 Project Structure

```
NuxtJS/ERP/nuxt-app/
│
├── .env                          # Environment variables (DATABASE_URL, JWT_SECRET)
├── .nuxt/                        # Auto-generated Nuxt files
├── node_modules/                 # Dependencies
│
├── package.json                  # Dependencies & scripts
├── nuxt.config.ts               # Nuxt configuration
├── drizzle.config.ts            # Drizzle ORM configuration
├── tsconfig.json                # TypeScript configuration
│
├── README.md                     # Basic readme
├── AUTH_README.md               # Authentication documentation
├── DATABASE_USAGE.md            # How to use database in pages
├── PROJECT_OVERVIEW.md          # This file
│
├── app/                         # Frontend application
│   ├── app.vue                 # Root app component
│   │
│   ├── assets/
│   │   └── css/
│   │       └── main.css        # Global styles
│   │
│   ├── layouts/
│   │   └── default.vue         # Default layout
│   │
│   ├── pages/                  # File-based routing
│   │   ├── index.vue          # Homepage
│   │   ├── about.vue          # About page
│   │   ├── login.vue          # Login page
│   │   ├── register.vue       # Registration page
│   │   │
│   │   ├── ke-toan/           # Accounting pages
│   │   │   ├── index.vue     # Accounting dashboard
│   │   │   ├── hoa-don.vue   # Invoices management
│   │   │   ├── thu-chi.vue   # Revenue & Expense
│   │   │   ├── cong-no.vue   # Debts management
│   │   │   └── thue.vue      # Tax management
│   │   │
│   │   └── profiles/
│   │       └── [profileId].vue # Dynamic profile page
│   │
│   ├── components/             # Reusable components
│   │   ├── NavigationBar.vue  # Main navigation wrapper
│   │   ├── TopNavigation.vue  # Top nav bar
│   │   ├── LeftSidebar.vue    # Left sidebar menu
│   │   ├── TabBar.vue         # Tab navigation
│   │   ├── Breadcrumb.vue     # Breadcrumb navigation
│   │   ├── InvoiceDetailsOverlay.vue
│   │   ├── RevenueReportOverlay.vue
│   │   └── ExpenseReportOverlay.vue
│   │
│   └── composables/            # Composable functions
│       ├── useAccountingTabs.ts  # Tabs configuration
│       └── useERP.ts          # Main ERP composable (API + utilities)
│
├── server/                     # Backend API
│   ├── api/                   # API routes
│   │   ├── hello.ts          # Test endpoint
│   │   │
│   │   ├── auth/             # Authentication endpoints
│   │   │   ├── login.post.ts
│   │   │   ├── register.post.ts
│   │   │   └── verifyToken.post.ts
│   │   │
│   │   ├── invoices/         # Invoice endpoints
│   │   │   ├── index.get.ts  # GET all invoices
│   │   │   ├── index.post.ts # POST create invoice
│   │   │   └── [id].get.ts   # GET invoice by ID
│   │   │
│   │   ├── suppliers/        # Supplier endpoints
│   │   │   ├── index.get.ts  # GET all suppliers
│   │   │   └── index.post.ts # POST create supplier
│   │   │
│   │   └── debts/            # Debts endpoints
│   │       └── index.get.ts  # GET receivables/payables
│   │
│   ├── middleware/           # Server middleware
│   │   └── auth.ts          # Auth middleware (not fully implemented)
│   │
│   ├── db/                  # Database related files
│   │   ├── schema.ts       # Drizzle schema definitions
│   │   ├── relations.ts    # Table relations
│   │   ├── ERP_postgres.sql # Raw SQL schema
│   │   │
│   │   └── meta/           # Migration metadata
│   │       ├── _journal.json
│   │       └── 0000_snapshot.json
│   │
│   └── utils/              # Server utilities
│       └── drizzle.ts     # Drizzle DB connection & exports
│
├── shared/                 # Shared types (client + server)
│   └── types/
│       └── JwtUserInfo.ts # JWT user info type
│
├── drizzle/               # Drizzle migrations
│   ├── 0000_medical_victor_mancha.sql
│   ├── 0001_stale_paibok.sql
│   │
│   └── meta/
│       ├── _journal.json
│       ├── 0000_snapshot.json
│       └── 0001_snapshot.json
│
└── public/                # Static assets
    ├── robots.txt
    ├── icon/             # Icon assets
    └── img/              # Image assets
```

---

## 🗄 Database Architecture

### Connection

- **Type:** PostgreSQL
- **Database:** `ERP_database`
- **Connection String:** `postgresql://postgres:postgres123@localhost:5432/ERP_database`
- **Port:** 5432

### Schema Tables (13 main tables)

#### 1. **users** - Người dùng

```typescript
{
  id: SERIAL PRIMARY KEY,
  email: VARCHAR(255) UNIQUE NOT NULL,
  password: TEXT NOT NULL,      // bcrypt hashed
  username: VARCHAR(100),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 2. **suppliers** - Nhà cung cấp

```typescript
{
  id: SERIAL PRIMARY KEY,
  name: VARCHAR(255) NOT NULL,
  tax_code: VARCHAR(50),
  address: TEXT,
  phone: VARCHAR(20),
  email: VARCHAR(255),
  bank_name: VARCHAR(255),
  bank_account: VARCHAR(50),
  contact_person: VARCHAR(100),
  notes: TEXT,
  is_active: BOOLEAN DEFAULT true,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

**Indexes:**

- `idx_suppliers_tax_code` on tax_code
- `idx_suppliers_is_active` on is_active

#### 3. **invoices** - Hóa đơn

```typescript
{
  id: SERIAL PRIMARY KEY,
  invoice_number: VARCHAR(100) UNIQUE NOT NULL,
  supplier_id: INTEGER REFERENCES suppliers(id),
  invoice_type: VARCHAR(20) NOT NULL,  // 'paper' | 'electronic'
  issue_date: TIMESTAMP NOT NULL,
  tax_rate: DOUBLE PRECISION DEFAULT 0,     // VAT %
  subtotal: DOUBLE PRECISION DEFAULT 0,     // Chưa thuế
  tax_amount: DOUBLE PRECISION DEFAULT 0,   // Tiền thuế
  total_amount: DOUBLE PRECISION DEFAULT 0, // Có thuế
  status: VARCHAR(20) DEFAULT 'processing', // 'processing'|'processed'|'rejected'
  ocr_status: VARCHAR(20) DEFAULT 'pending', // OCR processing status
  ocr_data: JSONB,                          // OCR extracted data
  file_url: TEXT,                           // Original invoice file
  notes: TEXT,
  created_by: INTEGER REFERENCES users(id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

**Indexes:**

- `idx_invoices_status` on status
- `idx_invoices_issue_date` on issue_date DESC
- `idx_invoices_supplier` on supplier_id

#### 4. **invoice_items** - Chi tiết hóa đơn

```typescript
{
  id: SERIAL PRIMARY KEY,
  invoice_id: INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
  item_name: VARCHAR(255) NOT NULL,
  description: TEXT,
  quantity: DOUBLE PRECISION NOT NULL,
  unit: VARCHAR(50),                    // Đơn vị tính
  unit_price: DOUBLE PRECISION NOT NULL,
  amount: DOUBLE PRECISION NOT NULL,
  tax_rate: DOUBLE PRECISION DEFAULT 0,
  tax_amount: DOUBLE PRECISION DEFAULT 0,
  total_amount: DOUBLE PRECISION NOT NULL,
  created_at: TIMESTAMP
}
```

#### 5. **revenue_reports** - Báo cáo doanh thu

```typescript
{
  id: SERIAL PRIMARY KEY,
  title: VARCHAR(255) NOT NULL,
  report_code: VARCHAR(100) UNIQUE NOT NULL,
  period_start: TIMESTAMP NOT NULL,
  period_end: TIMESTAMP NOT NULL,
  total_revenue: DOUBLE PRECISION DEFAULT 0,
  total_tax: DOUBLE PRECISION DEFAULT 0,
  net_revenue: DOUBLE PRECISION DEFAULT 0,
  status: VARCHAR(20) DEFAULT 'draft',  // 'draft'|'submitted'|'approved'
  submitted_at: TIMESTAMP,
  approved_at: TIMESTAMP,
  notes: TEXT,
  metadata: JSONB,                      // Theo TT 152/2025/TT-BTC
  created_by: INTEGER REFERENCES users(id),
  approved_by: INTEGER REFERENCES users(id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 6. **expense_reports** - Báo cáo chi phí

```typescript
{
  id: SERIAL PRIMARY KEY,
  title: VARCHAR(255) NOT NULL,
  report_code: VARCHAR(100) UNIQUE NOT NULL,
  period_start: TIMESTAMP NOT NULL,
  period_end: TIMESTAMP NOT NULL,
  total_expense: DOUBLE PRECISION DEFAULT 0,
  total_tax: DOUBLE PRECISION DEFAULT 0,
  net_expense: DOUBLE PRECISION DEFAULT 0,
  status: VARCHAR(20) DEFAULT 'draft',
  submitted_at: TIMESTAMP,
  approved_at: TIMESTAMP,
  notes: TEXT,
  metadata: JSONB,
  created_by: INTEGER REFERENCES users(id),
  approved_by: INTEGER REFERENCES users(id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 7. **report_items** - Chi tiết báo cáo (revenue & expense)

```typescript
{
  id: SERIAL PRIMARY KEY,
  report_type: VARCHAR(20) NOT NULL,     // 'revenue' | 'expense'
  report_id: INTEGER NOT NULL,           // revenue_reports.id or expense_reports.id
  category: VARCHAR(100) NOT NULL,       // Danh mục
  item_name: VARCHAR(255) NOT NULL,
  description: TEXT,
  quantity: DOUBLE PRECISION,
  unit: VARCHAR(50),
  unit_price: DOUBLE PRECISION,
  amount: DOUBLE PRECISION NOT NULL,
  tax_rate: DOUBLE PRECISION DEFAULT 0,
  tax_amount: DOUBLE PRECISION DEFAULT 0,
  total_amount: DOUBLE PRECISION NOT NULL,
  invoice_id: INTEGER REFERENCES invoices(id),
  created_at: TIMESTAMP
}
```

#### 8. **receivables** - Công nợ phải thu

```typescript
{
  id: SERIAL PRIMARY KEY,
  customer_id: INTEGER,
  customer_name: VARCHAR(255) NOT NULL,
  tax_code: VARCHAR(50),
  invoice_number: VARCHAR(100),
  invoice_date: TIMESTAMP NOT NULL,
  due_date: TIMESTAMP NOT NULL,
  total_amount: DOUBLE PRECISION NOT NULL,
  paid_amount: DOUBLE PRECISION DEFAULT 0,
  remaining_amount: DOUBLE PRECISION NOT NULL,
  status: VARCHAR(20) DEFAULT 'pending', // 'pending'|'partial'|'paid'|'overdue'
  notes: TEXT,
  created_by: INTEGER REFERENCES users(id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 9. **payables** - Công nợ phải trả

```typescript
{
  id: SERIAL PRIMARY KEY,
  supplier_id: INTEGER REFERENCES suppliers(id),
  invoice_id: INTEGER REFERENCES invoices(id),
  invoice_number: VARCHAR(100),
  invoice_date: TIMESTAMP NOT NULL,
  due_date: TIMESTAMP NOT NULL,
  total_amount: DOUBLE PRECISION NOT NULL,
  paid_amount: DOUBLE PRECISION DEFAULT 0,
  remaining_amount: DOUBLE PRECISION NOT NULL,
  status: VARCHAR(20) DEFAULT 'pending',
  notes: TEXT,
  created_by: INTEGER REFERENCES users(id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 10. **tax_declarations** - Khai báo thuế

```typescript
{
  id: SERIAL PRIMARY KEY,
  declaration_code: VARCHAR(100) UNIQUE NOT NULL,
  tax_type: VARCHAR(50) NOT NULL,       // 'VAT'|'CIT'|'PIT'
  period_type: VARCHAR(20) NOT NULL,    // 'monthly'|'quarterly'|'yearly'
  period_start: TIMESTAMP NOT NULL,
  period_end: TIMESTAMP NOT NULL,
  total_revenue: DOUBLE PRECISION DEFAULT 0,
  total_expense: DOUBLE PRECISION DEFAULT 0,
  taxable_amount: DOUBLE PRECISION DEFAULT 0,  // Số tiền chịu thuế
  tax_rate: DOUBLE PRECISION DEFAULT 0,
  tax_amount: DOUBLE PRECISION DEFAULT 0,      // Thuế phải nộp
  paid_amount: DOUBLE PRECISION DEFAULT 0,
  remaining_amount: DOUBLE PRECISION DEFAULT 0,
  status: VARCHAR(20) DEFAULT 'draft',
  submitted_at: TIMESTAMP,
  due_date: TIMESTAMP,
  paid_at: TIMESTAMP,
  notes: TEXT,
  metadata: JSONB,
  created_by: INTEGER REFERENCES users(id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 11. **tax_items** - Chi tiết thuế

```typescript
{
  id: SERIAL PRIMARY KEY,
  declaration_id: INTEGER REFERENCES tax_declarations(id) ON DELETE CASCADE,
  category: VARCHAR(100) NOT NULL,
  description: TEXT,
  base_amount: DOUBLE PRECISION NOT NULL,  // Số tiền tính thuế
  tax_rate: DOUBLE PRECISION NOT NULL,
  tax_amount: DOUBLE PRECISION NOT NULL,
  invoice_id: INTEGER REFERENCES invoices(id),
  created_at: TIMESTAMP
}
```

#### 12. **payment_transactions** - Giao dịch thanh toán

```typescript
{
  id: SERIAL PRIMARY KEY,
  transaction_code: VARCHAR(100) UNIQUE NOT NULL,
  transaction_type: VARCHAR(20) NOT NULL,  // 'receivable'|'payable'|'tax'
  reference_id: INTEGER NOT NULL,          // ID of receivables/payables/tax_declarations
  amount: DOUBLE PRECISION NOT NULL,
  payment_method: VARCHAR(50) NOT NULL,    // 'cash'|'bank_transfer'|'credit_card'
  payment_date: TIMESTAMP NOT NULL,
  bank_name: VARCHAR(255),
  bank_account: VARCHAR(50),
  transaction_reference: VARCHAR(255),     // Mã GD ngân hàng
  notes: TEXT,
  created_by: INTEGER REFERENCES users(id),
  created_at: TIMESTAMP
}
```

#### 13. **alembic_version** - Migration version tracker

```typescript
{
  version_num: VARCHAR(32) PRIMARY KEY
}
```

### Database Export Configuration

**File:** `server/utils/drizzle.ts`

```typescript
export const db = drizzle(pool, { schema });
export const useDrizzle = () => db;

// Exported tables:
export {
  users,
  suppliers,
  invoices,
  invoiceItems,
  revenueReports,
  expenseReports,
  reportItems,
  receivables,
  payables,
  taxDeclarations,
  taxItems,
  paymentTransactions,
};
```

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Authentication APIs

#### 1. Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response 200:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "John Doe",
    "createdAt": "2026-03-05T12:00:00.000Z"
  }
}
```

#### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "user@example.com",  // email or username
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "John Doe",
    "createdAt": "2026-03-05T12:00:00.000Z"
  }
}
```

#### 3. Verify Token

```http
POST /api/auth/verifyToken
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Response 200:
{
  "success": true,
  "user": {
    "userId": 1,
    "email": "user@example.com"
  }
}
```

### Invoice APIs

#### 1. Get All Invoices

```http
GET /api/invoices?status=processed&limit=10&offset=0&search=HD001

Query Parameters:
- status (optional): 'processing' | 'processed' | 'rejected'
- startDate (optional): ISO date string
- endDate (optional): ISO date string
- search (optional): Search in invoice number or notes
- limit (optional): Default 50
- offset (optional): Default 0

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "invoiceNumber": "HD001-2025",
      "invoiceType": "electronic",
      "issueDate": "2025-01-15T00:00:00.000Z",
      "taxRate": 10,
      "subtotal": 10000000,
      "taxAmount": 1000000,
      "totalAmount": 11000000,
      "status": "processed",
      "ocrStatus": "completed",
      "fileUrl": "/uploads/invoice-001.pdf",
      "notes": "Hóa đơn tháng 1",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "supplier": {
        "id": 5,
        "name": "Công ty TNHH ABC",
        "taxCode": "0123456789"
      }
    }
  ],
  "count": 1
}
```

#### 2. Get Invoice by ID

```http
GET /api/invoices/1

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceNumber": "HD001-2025",
    "invoiceType": "electronic",
    "issueDate": "2025-01-15T00:00:00.000Z",
    "taxRate": 10,
    "subtotal": 10000000,
    "taxAmount": 1000000,
    "totalAmount": 11000000,
    "status": "processed",
    "ocrStatus": "completed",
    "ocrData": { /* OCR extracted data */ },
    "fileUrl": "/uploads/invoice-001.pdf",
    "notes": "Hóa đơn tháng 1",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z",
    "supplier": {
      "id": 5,
      "name": "Công ty TNHH ABC",
      "taxCode": "0123456789",
      "address": "Hà Nội",
      "phone": "0123456789",
      "email": "abc@example.com"
    },
    "items": [
      {
        "id": 1,
        "invoiceId": 1,
        "itemName": "Sản phẩm A",
        "description": "Mô tả chi tiết",
        "quantity": 10,
        "unit": "cái",
        "unitPrice": 1000000,
        "amount": 10000000,
        "taxRate": 10,
        "taxAmount": 1000000,
        "totalAmount": 11000000,
        "createdAt": "2025-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

#### 3. Create Invoice

```http
POST /api/invoices
Content-Type: application/json

{
  "invoiceNumber": "HD001-2025",
  "supplierId": 5,
  "invoiceType": "electronic",
  "issueDate": "2025-01-15",
  "subtotal": 10000000,
  "taxRate": 10,
  "taxAmount": 1000000,
  "totalAmount": 11000000,
  "status": "processing",
  "ocrStatus": "pending",
  "notes": "Hóa đơn tháng 1",
  "items": [
    {
      "itemName": "Sản phẩm A",
      "description": "Mô tả",
      "quantity": 10,
      "unit": "cái",
      "unitPrice": 1000000,
      "amount": 10000000,
      "taxRate": 10,
      "taxAmount": 1000000,
      "totalAmount": 11000000
    }
  ]
}

Response 200:
{
  "success": true,
  "message": "Invoice created successfully",
  "data": { /* created invoice */ }
}
```

### Supplier APIs

#### 1. Get All Suppliers

```http
GET /api/suppliers?search=ABC&isActive=true&limit=100&offset=0

Query Parameters:
- search (optional): Search in name, tax code, email
- isActive (optional): Filter by active status
- limit (optional): Default 100
- offset (optional): Default 0

Response 200:
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Công ty TNHH ABC",
      "taxCode": "0123456789",
      "address": "Hà Nội",
      "phone": "0123456789",
      "email": "abc@example.com",
      "bankName": "Vietcombank",
      "bankAccount": "1234567890",
      "contactPerson": "Nguyễn Văn A",
      "notes": "Nhà cung cấp uy tín",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### 2. Create Supplier

```http
POST /api/suppliers
Content-Type: application/json

{
  "name": "Công ty TNHH ABC",
  "taxCode": "0123456789",
  "address": "Hà Nội",
  "phone": "0123456789",
  "email": "abc@example.com",
  "bankName": "Vietcombank",
  "bankAccount": "1234567890",
  "contactPerson": "Nguyễn Văn A",
  "notes": "Ghi chú",
  "isActive": true
}

Response 200:
{
  "success": true,
  "message": "Supplier created successfully",
  "data": { /* created supplier */ }
}
```

### Debt APIs

#### 1. Get Receivables or Payables

```http
GET /api/debts?type=receivables&status=pending&limit=50&offset=0

Query Parameters:
- type (required): 'receivables' | 'payables' | 'all'
- status (optional): 'pending' | 'partial' | 'paid' | 'overdue'
- limit (optional): Default 50
- offset (optional): Default 0

Response 200 (type=receivables):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "receivable",
      "customerName": "Công ty XYZ",
      "taxCode": "9876543210",
      "invoiceNumber": "HD001-2025",
      "invoiceDate": "2025-01-15T00:00:00.000Z",
      "dueDate": "2025-02-15T00:00:00.000Z",
      "totalAmount": 50000000,
      "paidAmount": 20000000,
      "remainingAmount": 30000000,
      "status": "partial",
      "notes": "",
      "createdAt": "2025-01-15T00:00:00.000Z"
    }
  ],
  "count": 1
}

Response 200 (type=payables):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "payable",
      "supplier": {
        "id": 5,
        "name": "Công ty TNHH ABC",
        "taxCode": "0123456789"
      },
      "invoiceNumber": "HD002-2025",
      "invoiceDate": "2025-01-20T00:00:00.000Z",
      "dueDate": "2025-02-20T00:00:00.000Z",
      "totalAmount": 30000000,
      "paidAmount": 0,
      "remainingAmount": 30000000,
      "status": "pending",
      "notes": "",
      "createdAt": "2025-01-20T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Test API

#### Hello Endpoint

```http
GET /api/hello

Response 200:
{
  "message": "ERP Database connected successfully",
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "username": "John Doe",
      "password": "$2a$10$...",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 🔐 Authentication System

### Implementation

- **Library:** jsonwebtoken + bcryptjs
- **Storage:** JWT token (expires in 7 days)
- **Password:** bcrypt hashed with 10 salt rounds
- **Middleware:** `server/middleware/auth.ts` (not fully implemented yet)

### JWT Payload

```typescript
{
  userId: number,
  email: string,
  iat: number,    // issued at
  exp: number     // expires at (7 days)
}
```

### Environment Variables

```env
JWT_SECRET=589863  # Change in production!
```

### Usage in Pages

```typescript
// Store token after login
const { token } = await $fetch("/api/auth/login", {
  method: "POST",
  body: { identifier, password },
});
localStorage.setItem("token", token);

// Verify token
const { user } = await $fetch("/api/auth/verifyToken", {
  method: "POST",
  body: { token },
});
```

---

## 🎨 Frontend Pages & Components

### Pages Structure

#### 1. **Auth Pages**

```
/login                  - Login page (app/pages/login.vue)
/register              - Registration page (app/pages/register.vue)
```

#### 2. **General Pages**

```
/                      - Homepage (app/pages/index.vue)
/about                 - About page (app/pages/about.vue)
/profiles/[profileId]  - Dynamic profile page (app/pages/profiles/[profileId].vue)
```

#### 3. **Accounting Pages** (`/ke-toan/*`)

```
/ke-toan              - Accounting dashboard (ke-toan/index.vue)
/ke-toan/hoa-don      - Invoice management (ke-toan/hoa-don.vue) ✅ ACTIVE
/ke-toan/thu-chi      - Revenue & Expense (ke-toan/thu-chi.vue)
/ke-toan/cong-no      - Debts management (ke-toan/cong-no.vue) ✅ ACTIVE
/ke-toan/thue         - Tax management (ke-toan/thue.vue)
```

### Key Components

#### **NavigationBar.vue**

Main wrapper component for pages with sidebar navigation.

- Props: `sidebar-title` (string)
- Slots: Default slot for page content
- Usage: Wraps all accounting pages

#### **TopNavigation.vue**

Top navigation bar with breadcrumb and user menu.

#### **LeftSidebar.vue**

Left sidebar with menu items for accounting modules.

#### **TabBar.vue**

Tab navigation component.

- Props: `tabs` (array of tab objects), `aria-label` (string)
- Usage: Used in accounting pages for module switching

#### **Breadcrumb.vue**

Breadcrumb navigation trail.

- Uses: `definePageMeta({ breadcrumb: [...] })`

#### **InvoiceDetailsOverlay.vue**

Modal overlay for viewing invoice details.

- Props: `is-open` (boolean)
- Events: `@close`

#### **RevenueReportOverlay.vue**

Modal overlay for revenue reports.

#### **ExpenseReportOverlay.vue**

Modal overlay for expense reports.

### Page Features

#### **hoa-don.vue (Invoice Management)** ✅

**Features:**

- Real-time statistics (total, processed, processing, total value)
- Invoice list with supplier info, status badges
- Upload overlay for new invoices (with OCR info)
- Invoice details modal
- Loading & empty states
- Fetch data from `/api/invoices` using `useERP()` composable

**Statistics Computed:**

- Total invoices count
- Processed invoices count & percentage
- Processing invoices count
- Total value (in billions VND)

**Status Display:**

- `processed` → Green badge "Đã xử lý"
- `processing` → Yellow badge "Đang xử lý"
- `rejected` → Red badge "Từ chối"

#### **cong-no.vue (Debt Management)** ✅

**Features:**

- Summary cards (receivables, payables, overdue, pending counts)
- Tab switching between receivables & payables
- Data table with customer/supplier info
- Status color coding
- Fetch data from `/api/debts` using `useERP()` composable

**Table Columns:**

- Customer/Supplier name
- Invoice number
- Invoice date & due date
- Total amount, paid amount, remaining amount
- Status badge

**Status Colors:**

- `pending` → Yellow
- `partial` → Blue
- `paid` → Green
- `overdue` → Red

### Layout System

```
app.vue (root)
  └─ default.vue (layout)
      └─ Page component
```

---

## 🧩 Composables & Utilities

### **useERP()** - Main ERP Composable

**Location:** `app/composables/useERP.ts`

**Purpose:** Centralized composable for all ERP operations (API calls + utility functions)

#### API Methods

##### Invoices

```typescript
// Get all invoices with filters
const { data, pending, refresh } = await getInvoices({
  status?: string,
  startDate?: string,
  endDate?: string,
  search?: string,
  limit?: number,
  offset?: number
})

// Get invoice by ID (includes items)
const { data } = await getInvoiceById(id: number)

// Create new invoice
await createInvoice(invoiceData: any)
```

##### Suppliers

```typescript
// Get all suppliers
const { data } = await getSuppliers({
  search?: string,
  isActive?: boolean,
  limit?: number,
  offset?: number
})

// Create new supplier
await createSupplier(supplierData: any)
```

##### Debts

```typescript
// Get receivables
const { data } = await getReceivables({
  status?: string,
  limit?: number,
  offset?: number
})

// Get payables
const { data } = await getPayables({
  status?: string,
  limit?: number,
  offset?: number
})

// Get both
const { data } = await getDebts({
  type?: 'receivables' | 'payables' | 'all',
  status?: string,
  limit?: number,
  offset?: number
})
```

#### Utility Functions

```typescript
// Format currency (Vietnamese Dong)
formatCurrency(1000000); // → "1.000.000 ₫"

// Format number with thousands separator
formatNumber(1234567); // → "1,234,567"

// Format date
formatDate("2025-01-15"); // → "15/01/2025"
formatDate("2025-01-15", "long"); // → "15 tháng 1, 2025"

// Get status text in Vietnamese
getStatusText("processing"); // → "Đang xử lý"
getStatusText("processed"); // → "Đã xử lý"
getStatusText("paid"); // → "Đã thanh toán"

// Get status CSS color classes
getStatusColor("processed"); // → "bg-[#dcfce7] text-[#008236]"
getStatusColor("pending"); // → "bg-[#fef9c2] text-[#a65f00]"
```

#### Usage Example

```vue
<script setup lang="ts">
const {
  getInvoices,
  formatCurrency,
  formatNumber,
  getStatusText,
  getStatusColor,
} = useERP();

const { data: invoices, pending } = await getInvoices({ limit: 10 });

const total = computed(
  () =>
    invoices.value?.data?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0,
);
</script>

<template>
  <div v-if="!pending">
    <div v-for="invoice in invoices.data" :key="invoice.id">
      <h3>{{ invoice.invoiceNumber }}</h3>
      <p>{{ formatCurrency(invoice.totalAmount) }}</p>
      <span :class="getStatusColor(invoice.status)">
        {{ getStatusText(invoice.status) }}
      </span>
    </div>

    <p>Total: {{ formatCurrency(total) }}</p>
  </div>
</template>
```

### **useAccountingTabs()** - Tab Configuration

**Location:** `app/composables/useAccountingTabs.ts`

**Purpose:** Provides consistent tab configuration for accounting pages

```typescript
const tabs =
  useAccountingTabs()[
    // Returns:
    ({
      key: "revenue-expense",
      label: "Quản lý Thu - Chi",
      path: "/ke-toan/thu-chi",
    },
    {
      key: "invoice",
      label: "Hoá Đơn",
      path: "/ke-toan/hoa-don",
    },
    {
      key: "debt",
      label: "Công nợ",
      path: "/ke-toan/cong-no",
    },
    {
      key: "tax",
      label: "Thuế",
      path: "/ke-toan/thue",
    })
  ];
```

**With Permissions:**

```typescript
const tabs = useFilteredAccountingTabs({
  canViewRevenue: true,
  canViewInvoice: true,
  canViewDebt: false,
  canViewTax: true,
});
```

---

## ⚙️ Environment Configuration

### **.env File**

```env
# Database Connection
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/ERP_database

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=589863
```

### **nuxt.config.ts**

```typescript
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    jwtSecret:
      process.env.JWT_SECRET || "your-secret-key-change-this-in-production",
  },

  modules: ["@nuxt/image"],
});
```

### **drizzle.config.ts**

```typescript
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### **tsconfig.json**

```json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

---

## 🚀 Development Workflow

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
# → http://localhost:3000
```

### Database Migration

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Push changes to database
npx drizzle-kit push

# Open Drizzle Studio (DB GUI)
npx drizzle-kit studio
```

### Build for Production

```bash
npm run build
npm run preview
```

### Project Commands

```json
{
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  }
}
```

### Auto-Generated Files (Don't Edit)

- `.nuxt/` - Nuxt auto-generated files
- `node_modules/` - Dependencies
- Auto-imports are generated from `app/composables/*.ts`

---

## ✨ Key Features

### ✅ Implemented Features

#### Authentication

- ✅ User registration with email validation
- ✅ Login with email/username
- ✅ Password hashing (bcrypt)
- ✅ JWT token generation & verification
- ✅ Token expiry (7 days)

#### Invoice Management

- ✅ View all invoices with filtering
- ✅ Search invoices by number/notes
- ✅ Filter by status, date range
- ✅ View invoice details with items
- ✅ Create new invoice with items
- ✅ OCR data storage support
- ✅ File upload support (fileUrl field)
- ✅ Invoice status tracking
- ✅ Supplier relationship

#### Supplier Management

- ✅ View all suppliers
- ✅ Create new supplier
- ✅ Search by name, tax code, email
- ✅ Filter active/inactive
- ✅ Full contact information
- ✅ Bank account details

#### Debt Management

- ✅ View receivables (công nợ phải thu)
- ✅ View payables (công nợ phải trả)
- ✅ Filter by status
- ✅ Track payment progress
- ✅ Due date tracking
- ✅ Status indicators

#### UI/UX

- ✅ Modern responsive design
- ✅ Tailwind CSS styling
- ✅ Loading states
- ✅ Empty states
- ✅ Modal overlays
- ✅ Tab navigation
- ✅ Breadcrumb navigation
- ✅ Status badges with colors
- ✅ Sidebar navigation
- ✅ Statistics cards

#### Database

- ✅ PostgreSQL connection
- ✅ Drizzle ORM integration
- ✅ Type-safe queries
- ✅ Foreign key relationships
- ✅ Indexes for performance
- ✅ Migration system

#### Developer Experience

- ✅ TypeScript throughout
- ✅ Auto-imports for composables
- ✅ File-based routing
- ✅ Hot module replacement
- ✅ API route handlers
- ✅ Environment variables

### 🚧 Partially Implemented

- 🚧 Auth middleware (exists but not enforced)
- 🚧 OCR processing (fields exist, no implementation)
- 🚧 File upload handling (fileUrl field exists)
- 🚧 Revenue reports (schema exists, no UI)
- 🚧 Expense reports (schema exists, no UI)
- 🚧 Tax declarations (schema exists, no UI)
- 🚧 Payment transactions (schema exists, no API)

### 📝 TODO / Not Implemented

- ⏳ Update invoice endpoint
- ⏳ Delete invoice endpoint
- ⏳ Update supplier endpoint
- ⏳ Delete supplier endpoint
- ⏳ Create receivable/payable endpoints
- ⏳ Payment recording
- ⏳ Tax declaration UI & APIs
- ⏳ Revenue report UI & APIs
- ⏳ Expense report UI & APIs
- ⏳ User profile management
- ⏳ User roles & permissions
- ⏳ Dashboard with charts
- ⏳ Export to Excel/PDF
- ⏳ Email notifications
- ⏳ Audit logs
- ⏳ Full OCR integration
- ⏳ File upload service
- ⏳ Real-time updates (WebSocket)

---

## 📖 Important Notes & Best Practices

### Database Access

1. Always use `useERP()` composable in pages
2. Never use `useDrizzle()` directly in pages
3. Use server API routes for database operations
4. Handle errors properly with try-catch

### API Response Format

All API responses should follow this format:

```typescript
// Success
{
  success: true,
  data?: any,
  message?: string,
  count?: number
}

// Error
{
  success: false,
  statusCode: number,
  statusMessage: string
}
```

### TypeScript

- Use `any` type sparingly
- Add type assertions when needed: `(data as any)`
- Define interfaces for complex objects

### Vue Composition API

- Use `<script setup>` syntax
- Define reactive data with `ref()` or `reactive()`
- Use `computed()` for derived state
- Use `watch()` for side effects

### Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme
- Responsive design: test on mobile & desktop
- Keep consistent spacing & sizing

### Status Values

**Invoice Status:**

- `processing` - Đang xử lý
- `processed` - Đã xử lý
- `rejected` - Từ chối

**Debt Status:**

- `pending` - Chờ thanh toán
- `partial` - Thanh toán một phần
- `paid` - Đã thanh toán
- `overdue` - Quá hạn

**Report Status:**

- `draft` - Nháp
- `submitted` - Đã nộp
- `approved` - Đã duyệt

**OCR Status:**

- `pending` - Chờ xử lý
- `processing` - Đang xử lý
- `completed` - Hoàn thành
- `failed` - Thất bại

### Security Reminders

- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Validate all user inputs
- ⚠️ Sanitize data before DB insertion
- ⚠️ Implement rate limiting
- ⚠️ Add CORS configuration
- ⚠️ Enable auth middleware on protected routes

---

## 🎓 Learning Resources

### Official Docs

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/introduction.html)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Project-Specific Docs

- `AUTH_README.md` - Authentication guide
- `DATABASE_USAGE.md` - How to use database in pages
- `PROJECT_OVERVIEW.md` - This file

---

## 📞 Support & Contact

### For Issues

1. Check this documentation first
2. Review error messages in terminal
3. Check browser console for frontend errors
4. Review API responses in Network tab

### Database Issues

- Ensure PostgreSQL is running
- Check connection string in `.env`
- Run migrations: `npx drizzle-kit push`
- Check Drizzle Studio: `npx drizzle-kit studio`

### Development Server Issues

- Clear `.nuxt` folder: `rm -rf .nuxt`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Restart dev server: `npm run dev`

---

## 📅 Version History

- **v1.0 (05/03/2026)** - Initial project setup
  - Authentication system
  - Invoice management
  - Supplier management
  - Debt management
  - Basic UI components
  - Database schema
  - API endpoints

---

## 🎯 Next Development Priorities

1. **Complete Auth Middleware** - Protect routes
2. **Payment Recording** - Complete debt lifecycle
3. **Tax Management UI** - Implement tax declaration pages
4. **Reports** - Revenue & expense reporting
5. **Dashboard** - Add charts & analytics
6. **Export Features** - PDF/Excel generation
7. **OCR Integration** - Auto-extract invoice data
8. **File Upload** - Handle invoice scans/photos

---

**End of Project Overview**

_Keep this file updated when making significant changes to the project structure or adding new features._
