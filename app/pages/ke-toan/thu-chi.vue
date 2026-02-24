<template>
  <NavigationBar sidebar-title="Kế toán & Tài chính">
    <!-- Main Content -->
    <div class="p-12 bg-[#f9fafb]">
      <!-- Tabs -->
      <TabBar :tabs="tabs" aria-label="Kế toán navigation" />

      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-[#101828] text-[24px] font-bold mb-2">
          Báo Cáo Tổng Quan
        </h1>
        <p class="text-[#4a5565] text-[16px]">
          Quản lý và theo dõi các báo cáo thu - chi của doanh nghiệp
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-4 gap-5 mb-8">
        <!-- Card 1: Thống kê thu - chi (Black) -->
        <div
          class="bg-black text-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)]"
        >
          <p class="text-[#ebeef0] text-[14px] mb-1">Thống kê thu - chi</p>
          <p class="text-[24px] font-bold mb-1">24</p>
          <p class="text-[#d8d8d8] text-[12px]">+3 tháng này</p>
        </div>

        <!-- Card 2: Tổng báo cáo -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative"
        >
          <div
            class="absolute top-6 right-6 w-12 h-12 bg-[rgba(43,127,255,0.1)] rounded-[10px] flex items-center justify-center"
          >
            <img src="/icon/chart-blue.svg" alt="chart" class="w-5 h-5" />
          </div>
          <p class="text-[#4a5565] text-[14px] mb-1">Tổng báo cáo</p>
          <p class="text-[#101828] text-[24px] font-bold mb-1">24</p>
          <p class="text-[#6a7282] text-[12px]">+3 tháng này</p>
        </div>

        <!-- Card 3: Đã nộp -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative"
        >
          <div
            class="absolute top-6 right-6 w-12 h-12 bg-[rgba(0,201,80,0.1)] rounded-[10px] flex items-center justify-center"
          >
            <img src="/icon/check.svg" alt="check" class="w-5 h-5" />
          </div>
          <p class="text-[#4a5565] text-[14px] mb-1">Đã nộp</p>
          <p class="text-[#101828] text-[24px] font-bold mb-1">18</p>
          <p class="text-[#6a7282] text-[12px]">75% hoàn thành</p>
        </div>

        <!-- Card 4: Bản nháp -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative"
        >
          <div
            class="absolute top-6 right-6 w-12 h-12 bg-[rgba(240,177,0,0.1)] rounded-[10px] flex items-center justify-center"
          >
            <img src="/icon/draft-yellow.svg" alt="draft" class="w-5 h-5" />
          </div>
          <p class="text-[#4a5565] text-[14px] mb-1">Bản nháp</p>
          <p class="text-[#101828] text-[24px] font-bold mb-1">4</p>
          <p class="text-[#6a7282] text-[12px]">Cần xem xét</p>
        </div>
      </div>

      <!-- Create Revenue Report Card -->
      <div
        class="bg-[rgba(239,246,255,0.5)] border-2 border-[#dbeafe] rounded-[14px] p-6 mb-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-[#101828] text-[16px] font-bold mb-1">
              Tạo báo cáo doanh thu mới
            </h3>
            <p class="text-[#4a5565] text-[14px]">
              Sổ chi tiết chi phí hàng hóa, dịch vụ theo Thông tư
              152/2025/TT-BTC
            </p>
          </div>
          <button
            @click="createRevenueReport"
            class="bg-[#155dfc] text-white px-6 py-3 rounded-lg text-[16px] flex items-center gap-2 hover:bg-[#0d4cd9] transition-colors"
          >
            <img src="/icon/plus.svg" alt="plus" class="w-5 h-5" />
            Tạo báo cáo
          </button>
        </div>
      </div>

      <!-- Create Expense Report Card -->
      <div
        class="bg-[rgba(239,246,255,0.5)] border-2 border-[#dbeafe] rounded-[14px] p-6 mb-8"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-[#101828] text-[16px] font-bold mb-1">
              Tạo báo cáo chi phí mới
            </h3>
            <p class="text-[#4a5565] text-[14px]">
              Sổ chi tiết chi phí hàng hóa, dịch vụ theo Thông tư
              152/2025/TT-BTC
            </p>
          </div>
          <button
            @click="createExpenseReport"
            class="bg-[#155dfc] text-white px-6 py-3 rounded-lg text-[16px] flex items-center gap-2 hover:bg-[#0d4cd9] transition-colors"
          >
            <img src="/icon/plus.svg" alt="plus" class="w-5 h-5" />
            Tạo báo cáo
          </button>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-6">
        <div class="mb-6">
          <h3 class="text-[#0a0a0a] text-[16px] font-normal mb-2">
            Báo cáo gần đây
          </h3>
          <p class="text-[#717182] text-[16px]">
            Danh sách các báo cáo quản lý thu - chi gần đây
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="report in recentReports"
            :key="report.id"
            class="border border-[#e5e7eb] rounded-[10px] p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                  <h4 class="text-[#101828] text-[16px]">{{ report.title }}</h4>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-lg text-[12px] border border-transparent',
                      report.status === 'submitted'
                        ? 'bg-[#dcfce7] text-[#008236]'
                        : 'bg-[#dbeafe] text-[#1447e6]',
                    ]"
                  >
                    {{ report.statusText }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-[#4a5565] text-[14px]">
                  <div class="flex items-center gap-1">
                    <img
                      src="/icon/calendar.svg"
                      alt="calendar"
                      class="w-3 h-3"
                    />
                    <span>{{ report.period }}</span>
                  </div>
                  <span>•</span>
                  <span>{{ report.date }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[#101828] text-[16px] font-bold">
                ₫{{ formatNumber(report.amount) }}
              </p>
              <p class="text-[#6a7282] text-[12px]">Tổng chi phí</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue Report Overlay -->
    <RevenueReportOverlay
      :is-visible="showRevenueOverlay"
      @close="showRevenueOverlay = false"
      @submit="handleRevenueSubmit"
    />

    <!-- Expense Report Overlay -->
    <ExpenseReportOverlay
      :is-visible="showExpenseOverlay"
      @close="showExpenseOverlay = false"
      @submit="handleExpenseSubmit"
    />
  </NavigationBar>
</template>

<script setup lang="ts">
// Breadcrumb
definePageMeta({
  breadcrumb: [
    { label: "Kế toán & Tài chính", path: "/ke-toan" },
    { label: "Quản lý thu - chi", path: "/ke-toan/thu-chi" },
  ],
});

// Tabs configuration using composable
const tabs = useAccountingTabs();

// Overlay state
const showRevenueOverlay = ref(false);
const showExpenseOverlay = ref(false);

// Recent reports data
const recentReports = ref([
  {
    id: 1,
    title: "Chi phí hàng hóa Q4 2024",
    status: "submitted",
    statusText: "Đã nộp",
    period: "10/2024 - 12/2024",
    date: "Nộp ngày: 15/01/2025",
    amount: 450000000,
  },
]);

// Methods
const createRevenueReport = () => {
  showRevenueOverlay.value = true;
};

const createExpenseReport = () => {
  showExpenseOverlay.value = true;
};

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const handleRevenueSubmit = (data: any) => {
  console.log("Revenue report submitted:", data);
  // TODO: Send data to backend API
  showRevenueOverlay.value = false;
  // TODO: Refresh the reports list or show success message
};

const handleExpenseSubmit = (data: any) => {
  console.log("Expense report submitted:", data);
  // TODO: Send data to backend API
  showExpenseOverlay.value = false;
  // TODO: Refresh the reports list or show success message
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
