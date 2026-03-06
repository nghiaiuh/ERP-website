# Hướng dẫn sử dụng Database trong ERP System

## Kết nối Database

Database đã được cấu hình và kết nối sẵn tới **ERP_database** (PostgreSQL).

### Cấu hình (.env)

```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/ERP_database
JWT_SECRET=589863
```

## Sử dụng Database trong Vue Pages

### 1. Sử dụng Composable `useERP()`

Composable `useERP()` cung cấp các phương thức để truy xuất dữ liệu từ database:

```vue
<script setup lang="ts">
// Import composable
const {
  getInvoices,
  getSuppliers,
  getReceivables,
  getPayables,
  formatCurrency,
  formatDate,
  getStatusText,
  getStatusColor,
} = useERP();

// Fetch data
const { data, pending, refresh } = await getInvoices({ limit: 10 });
</script>
```

### 2. Các API Methods có sẵn

#### Invoices (Hóa đơn)

```typescript
// Lấy danh sách hóa đơn
const { data } = await getInvoices({
  status?: string,      // 'processing', 'processed', 'rejected'
  startDate?: string,   // Filter by date range
  endDate?: string,
  search?: string,      // Search by invoice number or notes
  limit?: number,       // Default: 50
  offset?: number       // For pagination
});

// Lấy chi tiết 1 hóa đơn (bao gồm items)
const { data } = await getInvoiceById(id);

// Tạo hóa đơn mới
await createInvoice({
  invoiceNumber: 'HD001-2025',
  supplierId: 1,
  invoiceType: 'electronic', // or 'paper'
  issueDate: '2025-01-15',
  subtotal: 10000000,
  taxRate: 10,
  taxAmount: 1000000,
  totalAmount: 11000000,
  items: [
    {
      itemName: 'Item 1',
      quantity: 10,
      unitPrice: 1000000,
      amount: 10000000
    }
  ]
});
```

#### Suppliers (Nhà cung cấp)

```typescript
// Lấy danh sách nhà cung cấp
const { data } = await getSuppliers({
  search?: string,      // Search by name, tax code, email
  isActive?: boolean,   // Filter active/inactive
  limit?: number,
  offset?: number
});

// Tạo nhà cung cấp mới
await createSupplier({
  name: 'Công ty ABC',
  taxCode: '0123456789',
  address: 'Hà Nội',
  phone: '0123456789',
  email: 'contact@abc.com'
});
```

#### Debts (Công nợ)

```typescript
// Lấy công nợ phải thu
const { data } = await getReceivables({
  status?: string,      // 'pending', 'partial', 'paid', 'overdue'
  limit?: number,
  offset?: number
});

// Lấy công nợ phải trả
const { data } = await getPayables({
  status?: string,
  limit?: number,
  offset?: number
});
```

### 3. Utility Functions

```typescript
// Format tiền tệ VNĐ
const formatted = formatCurrency(1000000); // "1.000.000 ₫"

// Format số
const formatted = formatNumber(1234567); // "1,234,567"

// Format ngày
const formatted = formatDate("2025-01-15"); // "15/01/2025"
const formatted = formatDate("2025-01-15", "long"); // "15 tháng 1, 2025"

// Lấy text trạng thái
const text = getStatusText("processing"); // "Đang xử lý"

// Lấy màu CSS cho trạng thái
const color = getStatusColor("processed"); // "bg-[#dcfce7] text-[#008236]"
```

## Ví dụ Thực tế

### Ví dụ 1: Hiển thị danh sách hóa đơn

```vue
<template>
  <div>
    <h1>Danh sách hóa đơn</h1>

    <!-- Loading -->
    <div v-if="pending">Đang tải...</div>

    <!-- Data -->
    <div v-else>
      <div v-for="invoice in invoices" :key="invoice.id">
        <h3>{{ invoice.invoiceNumber }}</h3>
        <p>{{ formatCurrency(invoice.totalAmount) }}</p>
        <span :class="getStatusColor(invoice.status)">
          {{ getStatusText(invoice.status) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getInvoices, formatCurrency, getStatusText, getStatusColor } = useERP();

const { data: invoicesData, pending } = await getInvoices({ limit: 20 });

const invoices = computed(() => invoicesData.value?.data || []);
</script>
```

### Ví dụ 2: Thống kê từ database

```vue
<template>
  <div class="stats">
    <div>Tổng hóa đơn: {{ totalInvoices }}</div>
    <div>Đã xử lý: {{ processedInvoices }}</div>
    <div>Tổng giá trị: {{ formatCurrency(totalValue) }}</div>
  </div>
</template>

<script setup lang="ts">
const { getInvoices, formatCurrency } = useERP();

const { data } = await getInvoices();

const totalInvoices = computed(() => data.value?.data?.length || 0);

const processedInvoices = computed(
  () =>
    data.value?.data?.filter((inv) => inv.status === "processed").length || 0,
);

const totalValue = computed(
  () => data.value?.data?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0,
);
</script>
```

## Schema Database

### Các bảng chính:

1. **users** - Người dùng
2. **suppliers** - Nhà cung cấp
3. **invoices** - Hóa đơn
4. **invoice_items** - Chi tiết hóa đơn
5. **receivables** - Công nợ phải thu
6. **payables** - Công nợ phải trả
7. **tax_declarations** - Khai báo thuế
8. **tax_items** - Chi tiết thuế
9. **revenue_reports** - Báo cáo doanh thu
10. **expense_reports** - Báo cáo chi phí
11. **payment_transactions** - Giao dịch thanh toán

Chi tiết schema xem tại: `server/db/schema.ts`

## API Endpoints

Tất cả API endpoints đã được tạo sẵn:

- `GET /api/invoices` - Danh sách hóa đơn
- `POST /api/invoices` - Tạo hóa đơn mới
- `GET /api/invoices/[id]` - Chi tiết hóa đơn
- `GET /api/suppliers` - Danh sách nhà cung cấp
- `POST /api/suppliers` - Tạo nhà cung cấp
- `GET /api/debts` - Công nợ (phải thu & phải trả)

## Testing

### Chạy dev server:

```bash
npm run dev
```

### Truy cập:

- App: http://localhost:3000
- Trang hóa đơn: http://localhost:3000/ke-toan/hoa-don
- Trang công nợ: http://localhost:3000/ke-toan/cong-no

## Lưu ý

1. Database phải được khởi tạo trước (chạy migrations)
2. Đảm bảo PostgreSQL đang chạy
3. Kiểm tra connection string trong `.env`
4. Sử dụng `await` khi gọi các composable methods
5. Dữ liệu được tự động reactive với Vue

## Tham khảo

- Ví dụ hoàn chỉnh: `app/pages/ke-toan/hoa-don.vue`
- Ví dụ công nợ: `app/pages/ke-toan/cong-no.vue`
- Composable: `app/composables/useERP.ts`
- API: `server/api/`
- Schema: `server/db/schema.ts`
