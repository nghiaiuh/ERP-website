<template>
  <NavigationBar sidebar-title="Kế toán & Tài chính">
    <!-- Main Content -->
    <div class="p-12 bg-[#f9fafb]">
      <!-- Tabs -->
      <TabBar :tabs="tabs" aria-label="Kế toán navigation" />

      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-[#101828] text-[24px] font-bold mb-2">
          Quản lý hóa đơn
        </h1>
        <p class="text-[#4a5565] text-[16px]">
          Lưu trữ và quản lý hóa đơn điện tử & giấy với công nghệ OCR tự động
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-4 gap-5 mb-8">
        <!-- Card 1: Tổng hóa đơn (Black) -->
        <div
          class="bg-black text-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)]"
        >
          <p class="text-[#ebeef0] text-[14px] mb-1">Tổng hóa đơn</p>
          <p class="text-[24px] font-bold mb-1">156</p>
          <p class="text-[#d8d8d8] text-[12px]">+12 tháng này</p>
        </div>

        <!-- Card 2: Đã xử lý -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative"
        >
          <div
            class="absolute top-6 right-6 w-12 h-12 bg-[rgba(0,201,80,0.1)] rounded-[10px] flex items-center justify-center"
          >
            <img src="/icon/check.svg" alt="check" class="w-5 h-5" />
          </div>
          <p class="text-[#4a5565] text-[14px] mb-1">Đã xử lý</p>
          <p class="text-[#101828] text-[24px] font-bold mb-1">142</p>
          <p class="text-[#6a7282] text-[12px]">91% hoàn thành</p>
        </div>

        <!-- Card 3: Đang xử lý -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative"
        >
          <div
            class="absolute top-6 right-6 w-12 h-12 bg-[rgba(240,177,0,0.1)] rounded-[10px] flex items-center justify-center"
          >
            <img src="/icon/clock.svg" alt="clock" class="w-5 h-5" />
          </div>
          <p class="text-[#4a5565] text-[14px] mb-1">Đang xử lý</p>
          <p class="text-[#101828] text-[24px] font-bold mb-1">14</p>
          <p class="text-[#6a7282] text-[12px]">OCR tự động</p>
        </div>

        <!-- Card 4: Tổng giá trị -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative"
        >
          <div
            class="absolute top-6 right-6 w-12 h-12 bg-[rgba(43,127,255,0.1)] rounded-[10px] flex items-center justify-center"
          >
            <img src="/icon/chart-blue.svg" alt="chart" class="w-5 h-5" />
          </div>
          <p class="text-[#4a5565] text-[14px] mb-1">Tổng giá trị</p>
          <p class="text-[#101828] text-[24px] font-bold mb-1">₫2.8B</p>
          <p class="text-[#6a7282] text-[12px]">Đã trích xuất</p>
        </div>
      </div>

      <!-- Upload Invoice Card -->
      <div
        class="bg-[rgba(239,246,255,0.5)] border-2 border-[#dbeafe] rounded-[14px] p-6 mb-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-[#101828] text-[16px] font-bold mb-1">
              Tải lên hóa đơn mới
            </h3>
            <p class="text-[#4a5565] text-[14px]">
              Hỗ trợ ảnh (JPG, PNG) và PDF. Hệ thống sẽ tự động trích xuất thông
              tin bằng OCR
            </p>
          </div>
          <button
            @click="showUpload = true"
            class="bg-[#155dfc] text-white px-6 py-3 rounded-lg text-[16px] flex items-center gap-2 hover:bg-[#0d4cd9] transition-colors"
          >
            <img src="/icon/upload.svg" alt="upload" class="w-5 h-5" />
            Tải lên
          </button>
        </div>
      </div>

      <!-- Recent Invoices -->
      <div class="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-6">
        <div class="mb-6">
          <h3 class="text-[#0a0a0a] text-[16px] font-normal mb-2">
            Hóa đơn gần đây
          </h3>
          <p class="text-[#717182] text-[16px]">
            Danh sách các hóa đơn được xử lý gần đây
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="invoice in recentInvoices"
            :key="invoice.id"
            class="border border-[#e5e7eb] rounded-[10px] p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
            @click="openInvoiceDetails(invoice)"
          >
            <div class="flex items-start gap-4 flex-1">
              <div
                class="w-10 h-10 bg-[#dbeafe] rounded-[10px] flex items-center justify-center flex-shrink-0"
              >
                <img
                  src="/icon/document-blue.svg"
                  alt="document"
                  class="w-5 h-5"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-[#101828] text-[16px]">
                    {{ invoice.number }}
                  </h4>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-lg text-[12px] border border-transparent',
                      invoice.status === 'processed'
                        ? 'bg-[#dcfce7] text-[#008236]'
                        : 'bg-[#fef9c2] text-[#a65f00]',
                    ]"
                  >
                    {{ invoice.statusText }}
                  </span>
                  <span
                    class="px-2 py-0.5 rounded-lg text-[12px] bg-[#f3f4f6] text-[#364153]"
                  >
                    {{ invoice.type }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-[#4a5565] text-[14px]">
                  <div class="flex items-center gap-1">
                    <img
                      src="/icon/calendar.svg"
                      alt="calendar"
                      class="w-3 h-3"
                    />
                    <span>{{ invoice.date }}</span>
                  </div>
                  <span>•</span>
                  <span>{{ invoice.supplier }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[#101828] text-[16px] font-bold">
                ₫{{ formatNumber(invoice.amount) }}
              </p>
              <p class="text-[#6a7282] text-[12px]">Tổng giá trị</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Overlay -->
    <div
      v-if="showUpload"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      @click.self="showUpload = false"
    >
      <div
        class="relative w-full max-w-[660px] rounded-[13px] border border-black/10 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
      >
        <!-- Header -->
        <div class="border-b border-[#e5e7eb] px-6 pt-6 pb-5">
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-[26px] font-bold text-[#101828]">
                Tải lên hóa đơn
              </h2>
              <p class="mt-2 text-[18px] text-[#4a5565]">
                Hỗ trợ ảnh (JPG, PNG) và PDF. Hệ thống sẽ tự động trích xuất
                thông tin
              </p>
            </div>
            <button
              type="button"
              class="flex h-6 w-6 items-center justify-center rounded opacity-70 hover:opacity-100 transition-opacity"
              @click="showUpload = false"
            >
              <img src="/icon/close.svg" alt="Đóng" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div
            class="rounded-[13px] border-2 border-dashed border-[#d1d5dc] px-11 py-11"
          >
            <div class="flex flex-col items-center">
              <div
                class="flex h-[83px] w-[83px] items-center justify-center rounded-full bg-[#dbeafe]"
              >
                <img src="/icon/add.svg" alt="add" class="h-10 w-10" />
              </div>
              <p class="mt-6 text-center text-[23px] text-[#101828]">
                Kéo thả tệp vào đây
              </p>
              <p class="mt-2 text-center text-[18px] text-[#4a5565]">
                Hoặc chọn từ thiết bị của bạn
              </p>
              <div
                class="mt-5 flex flex-wrap items-center justify-center gap-4"
              >
                <button
                  type="button"
                  class="flex items-center gap-2 rounded-[10px] border border-[#8ec5ff] bg-white px-6 py-2 text-[18px] text-[#1447e6] hover:bg-[#eff6ff]"
                >
                  <img src="/icon/file.svg" alt="Chọn tệp" class="h-5 w-5" />
                  Chọn tệp
                </button>
                <button
                  type="button"
                  class="flex items-center gap-2 rounded-[10px] border border-[#8ec5ff] bg-white px-6 py-2 text-[18px] text-[#1447e6] hover:bg-[#eff6ff]"
                  @click="captureInvoice"
                >
                  <img src="/icon/camera.svg" alt="Chụp ảnh" class="h-5 w-5" />
                  Chụp ảnh
                </button>
              </div>
              <p class="mt-4 text-center text-[15px] text-[#6a7282]">
                Hỗ trợ: JPG, PNG, PDF (tối đa 10MB mỗi tệp)
              </p>
            </div>
          </div>

          <div
            class="mt-6 rounded-[14px] border border-[#bedbff] bg-[rgba(239,246,255,0.5)] px-6 py-5"
          >
            <div class="flex items-start gap-4">
              <div
                class="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#155dfc]"
              >
                <img src="/icon/check.svg" alt="OCR" class="h-6 w-6" />
              </div>
              <div>
                <p class="text-[18px] font-bold text-[#101828]">
                  OCR tự động trích xuất
                </p>
                <ul class="mt-2 space-y-1 text-[15px] text-[#364153]">
                  <li>✓ Số hóa đơn, ngày phát hành</li>
                  <li>✓ Thông tin nhà cung cấp, mã số thuế</li>
                  <li>✓ Giá trị hóa đơn, thuế VAT</li>
                  <li>✓ Các mục hàng hóa/dịch vụ chi tiết</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="border-t border-[#e5e7eb] px-6 py-4 flex items-center justify-end gap-4"
        >
          <button
            type="button"
            class="rounded-[10px] border border-black/10 bg-white px-6 py-2 text-[18px] text-[#0a0a0a] hover:bg-gray-50"
            @click="showUpload = false"
          >
            Hủy
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-[10px] bg-[#155dfc] px-6 py-2 text-[18px] text-white hover:bg-[#0d4cd9]"
            @click="handleUpload"
          >
            <img src="/icon/upload.svg" alt="Xử lý" class="h-5 w-5" />
            Xử lý
          </button>
        </div>
      </div>
    </div>

    <!-- Invoice Details Overlay -->
    <InvoiceDetailsOverlay
      :is-open="showInvoiceDetails"
      @close="showInvoiceDetails = false"
    />
  </NavigationBar>
</template>

<script setup lang="ts">
// Breadcrumb
definePageMeta({
  breadcrumb: [
    { label: "Kế toán & Tài chính", path: "/ke-toan" },
    { label: "Hoá Đơn", path: "/ke-toan/hoa-don" },
  ],
});

// Tabs configuration using composable
const tabs = useAccountingTabs();

// Overlay state
const showUpload = ref(false);
const showInvoiceDetails = ref(false);

// Recent invoices data
const recentInvoices = ref([
  {
    id: 1,
    number: "HD001-2025",
    supplier: "Công ty TNHH ABC",
    date: "15/01/2025",
    amount: 15000000,
    type: "Giấy",
    status: "processed",
    statusText: "Đã xử lý",
  },
  {
    id: 2,
    number: "HD002-2025",
    supplier: "Công ty CP XYZ",
    date: "18/01/2025",
    amount: 28000000,
    type: "Điện tử",
    status: "processed",
    statusText: "Đã xử lý",
  },
  {
    id: 3,
    number: "HD003-2025",
    supplier: "Công ty TNHH DEF",
    date: "20/01/2025",
    amount: 8500000,
    type: "Giấy",
    status: "processing",
    statusText: "Đang xử lý",
  },
]);

// Methods
const openInvoiceDetails = (invoice: any) => {
  console.log("Open invoice details for:", invoice);
  showInvoiceDetails.value = true;
};

const captureInvoice = () => {
  console.log("Capture invoice with camera");
  // TODO: Implement camera capture functionality
};

const handleUpload = () => {
  console.log("Handle file upload");
  // TODO: Implement file upload functionality
  showUpload.value = false;
};

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
