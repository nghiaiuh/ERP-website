<!-- ============================================================
     TRANG QUẢN LÝ BÁO CÁO THU - CHI
     - Thống kê tổng quan | Tạo báo cáo | Tìm kiếm & lọc | Danh sách
     ============================================================ -->
<template>
  <NavigationBar sidebar-title="Kế toán & Tài chính">
    <div class="p-12 bg-[#f9fafb]">
      <TabBar :tabs="tabs" aria-label="Kế toán navigation" />
      <div class="mb-8">
        <h1 class="text-[#101828] text-[24px] font-bold mb-2">
          Báo Cáo Tổng Quan
        </h1>
        <p class="text-[#4a5565] text-[16px]">
          Quản lý và theo dõi các báo cáo thu - chi của doanh nghiệp
        </p>
      </div>

      <!-- Thống kê: 4 thẻ (Tổng quan đen | Tổng báo cáo | Đã nộp | Bản nháp) -->
      <div class="grid grid-cols-4 gap-5 mb-8">
        <div
          class="bg-black text-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)]"
        >
          <p class="text-[#ebeef0] text-[14px] mb-1">Tháng này</p>
          <p class="text-[24px] font-bold mb-1">
            {{ statistics.monthlyIncrease }}
          </p>
          <p class="text-[#d8d8d8] text-[12px]">báo cáo mới trong tháng</p>
        </div>

        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative"
        >
          <div
            class="absolute top-6 right-6 w-12 h-12 bg-[rgba(43,127,255,0.1)] rounded-[10px] flex items-center justify-center"
          >
            <img src="/icon/chart-blue.svg" alt="chart" class="w-5 h-5" />
          </div>
          <p class="text-[#4a5565] text-[14px] mb-1">Tổng báo cáo</p>
          <p class="text-[#101828] text-[24px] font-bold mb-1">
            {{ statistics.total }}
          </p>
          <p class="text-[#6a7282] text-[12px]">
            +{{ statistics.monthlyIncrease }} tháng này
          </p>
        </div>

        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative"
        >
          <div
            class="absolute top-6 right-6 w-12 h-12 bg-[rgba(0,201,80,0.1)] rounded-[10px] flex items-center justify-center"
          >
            <img src="/icon/check.svg" alt="check" class="w-5 h-5" />
          </div>
          <p class="text-[#4a5565] text-[14px] mb-1">Đã nộp</p>
          <p class="text-[#101828] text-[24px] font-bold mb-1">
            {{ statistics.submitted }}
          </p>
          <p class="text-[#6a7282] text-[12px]">
            {{
              statistics.total > 0
                ? Math.round((statistics.submitted / statistics.total) * 100)
                : 0
            }}% hoàn thành
          </p>
        </div>

        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] relative"
        >
          <div
            class="absolute top-6 right-6 w-12 h-12 bg-[rgba(240,177,0,0.1)] rounded-[10px] flex items-center justify-center"
          >
            <img src="/icon/draft-yellow.svg" alt="draft" class="w-5 h-5" />
          </div>
          <p class="text-[#4a5565] text-[14px] mb-1">Bản nháp</p>
          <p class="text-[#101828] text-[24px] font-bold mb-1">
            {{ statistics.draft }}
          </p>
          <p class="text-[#6a7282] text-[12px]">Cần xem xét</p>
        </div>
      </div>

      <!-- Tạo báo cáo doanh thu -->
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
            @click="createRevenueReportHandler"
            class="bg-[#155dfc] text-white px-6 py-3 rounded-lg text-[16px] flex items-center gap-2 hover:bg-[#0d4cd9] transition-colors"
          >
            <img src="/icon/plus.svg" alt="plus" class="w-5 h-5" />
            Tạo báo cáo
          </button>
        </div>
      </div>

      <!-- Tạo báo cáo chi phí -->
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
            @click="createExpenseReportHandler"
            class="bg-[#155dfc] text-white px-6 py-3 rounded-lg text-[16px] flex items-center gap-2 hover:bg-[#0d4cd9] transition-colors"
          >
            <img src="/icon/plus.svg" alt="plus" class="w-5 h-5" />
            Tạo báo cáo
          </button>
        </div>
      </div>

      <!-- Tìm kiếm & lọc: Search | Loại | Trạng thái | Nút lọc -->
      <div
        class="bg-white rounded-[10px] border border-[rgba(0,0,0,0.1)] shadow-sm p-4 mb-6"
      >
        <div class="flex items-center justify-between">
          <div class="relative flex-1 max-w-[480px]">
            <img
              src="/icon/search.svg"
              alt="search"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo tiêu đề báo cáo, mã báo cáo..."
              class="w-full pl-10 pr-3 py-2 bg-[#f3f3f5] border-0 rounded-lg text-[14px] text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
            />
          </div>

          <div class="flex items-center gap-3">
            <select
              v-model="filterType"
              class="px-3 py-2 bg-[#f3f3f5] border-0 rounded-lg text-[14px] text-[#0a0a0a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
            >
              <option value="">Tất cả loại</option>
              <option value="revenue">Doanh thu</option>
              <option value="expense">Chi phí</option>
            </select>

            <select
              v-model="filterStatus"
              class="px-3 py-2 bg-[#f3f3f5] border-0 rounded-lg text-[14px] text-[#0a0a0a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="draft">Bản nháp</option>
              <option value="submitted">Đã nộp</option>
              <option value="approved">Đã duyệt</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Danh sách báo cáo (đã lọc) -->
      <div class="bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-6">
        <div class="mb-6">
          <h3 class="text-[#0a0a0a] text-[16px] font-normal mb-2">
            Báo cáo gần đây
          </h3>
          <p class="text-[#717182] text-[16px]">
            Danh sách các báo cáo quản lý thu - chi gần đây
          </p>
        </div>

        <!-- Loading -->
        <div
          v-if="loadingReports"
          class="flex justify-center items-center py-12"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155dfc]"
          ></div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredReports.length === 0" class="text-center py-12">
          <img
            src="/icon/document-blue.svg"
            alt="no reports"
            class="w-16 h-16 mx-auto mb-4 opacity-50"
          />
          <p class="text-[#4a5565] text-[16px] mb-2">
            {{
              recentReports.length === 0
                ? "Chưa có báo cáo nào"
                : "Không tìm thấy kết quả"
            }}
          </p>
          <p class="text-[#717182] text-[14px]">
            {{
              recentReports.length === 0
                ? "Tạo báo cáo doanh thu hoặc chi phí để bắt đầu"
                : "Thử thay đổi điều kiện lọc"
            }}
          </p>
        </div>

        <!-- Danh sách -->
        <div v-else class="space-y-4">
          <div
            v-for="report in filteredReports"
            :key="report.id"
            class="border border-[#e5e7eb] rounded-[10px] p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
            @click="openReportDetails(report)"
          >
            <div class="flex items-start gap-4 flex-1">
              <div
                :class="[
                  'w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0',
                  report.type === 'revenue' ? 'bg-[#dcfce7]' : 'bg-[#dbeafe]',
                ]"
              >
                <img
                  :src="
                    report.type === 'revenue'
                      ? '/icon/chart-blue.svg'
                      : '/icon/document-blue.svg'
                  "
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
                      getStatusColor(report.status),
                    ]"
                  >
                    {{ report.statusText }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-lg text-[12px]',
                      report.type === 'revenue'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700',
                    ]"
                  >
                    {{ report.type === "revenue" ? "Doanh thu" : "Chi phí" }}
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
              <p class="text-[#6a7282] text-[12px]">
                {{
                  report.type === "revenue" ? "Tổng doanh thu" : "Tổng chi phí"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlays: Tạo & xem chi tiết báo cáo -->
    <RevenueReportOverlay
      :is-visible="showRevenueOverlay"
      :edit-data="revenueEditData"
      @close="showRevenueOverlay = false"
      @submit="handleRevenueSubmit"
    />
    <ExpenseReportOverlay
      :is-visible="showExpenseOverlay"
      :edit-data="expenseEditData"
      @close="showExpenseOverlay = false"
      @submit="handleExpenseSubmit"
    />
    <RevenueReportDetailOverlay
      :is-visible="showRevenueDetailOverlay"
      :report-data="selectedReport"
      @close="showRevenueDetailOverlay = false"
      @edit="handleRevenueEdit"
      @delete="handleRevenueDelete"
    />
    <ExpenseReportDetailOverlay
      :is-visible="showExpenseDetailOverlay"
      :report-data="selectedReport"
      @close="showExpenseDetailOverlay = false"
      @edit="handleExpenseEdit"
      @delete="handleExpenseDelete"
    />
    <!-- Toast notification -->
    <div
      v-if="toast"
      :class="[
        'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-[14px] font-medium',
        toast.type === 'success' ? 'bg-[#16a34a]' : 'bg-[#dc2626]',
      ]"
    >
      {{ toast.message }}
    </div>
  </NavigationBar>
</template>

<!-- ============================================================
     SCRIPT - LOGIC & XỬ LÝ DỮ LIỆU
     ============================================================ -->
<script setup lang="ts">
// ===== 0. XÁC THỰC USER =====
await useCheckUser();

// ===== 1. CẤU HÌNH TRANG =====
definePageMeta({
  breadcrumb: [
    { label: "Kế toán & Tài chính", path: "/ke-toan" },
    { label: "Quản lý thu - chi", path: "/ke-toan/thu-chi" },
  ],
});

// ===== 2. COMPOSABLES =====
const tabs = useAccountingTabs();
const {
  getCombinedReports,
  getRevenueReportById,
  getExpenseReportById,
  createRevenueReport,
  updateRevenueReport,
  createExpenseReport,
  updateExpenseReport,
  deleteRevenueReport,
  deleteExpenseReport,
  formatNumber,
  formatDate,
  getStatusText,
  getStatusColor,
} = useERP();

// ===== INTERFACES =====
interface ApiReportRow {
  id: number;
  type: "revenue" | "expense";
  title: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  submittedAt: string | null;
  amount: number;
}

interface ReportListItem {
  id: number;
  title: string;
  status: string;
  statusText: string;
  period: string;
  date: string;
  amount: number;
  type: "revenue" | "expense";
}

interface ReportEntry {
  id: number;
  soChungTu: string;
  ngayGhiNhan: string;
  moTa: string | null;
  phanLoai: string | null;
  soTien: string;
}

interface ReportDetailData {
  id: number;
  type: "revenue" | "expense";
  title: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  submittedAt: string | null;
  amount: number;
  mauSo: string | null;
  tenDoanhNghiep: string | null;
  maSoThue: string | null;
  diaChi: string | null;
  entries: ReportEntry[];
}

interface RevenueSubmitData {
  id?: number;
  title: string;
  periodStart: string;
  periodEnd: string;
  totalRevenue?: number;
  totalTax?: number;
  netRevenue?: number;
  status?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  items?: unknown[];
}

interface ExpenseSubmitData {
  id?: number;
  title: string;
  periodStart: string;
  periodEnd: string;
  totalExpense?: number;
  totalTax?: number;
  netExpense?: number;
  status?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  items?: unknown[];
}

// ===== 3. STATE - TRẠNG THÁI =====
// Overlays
const showRevenueOverlay = ref(false);
const showExpenseOverlay = ref(false);
const showRevenueDetailOverlay = ref(false);
const showExpenseDetailOverlay = ref(false);
const selectedReport = ref<ReportDetailData | null>(null);
const revenueEditData = ref<ReportDetailData | null>(null);
const expenseEditData = ref<ReportDetailData | null>(null);

// Bộ lọc
const searchQuery = ref("");
const filterType = ref("");
const filterStatus = ref("");
const toast = ref<{ type: "success" | "error"; message: string } | null>(null);
const showToast = (type: "success" | "error", message: string) => {
  toast.value = { type, message };
  setTimeout(() => {
    toast.value = null;
  }, 3000);
};

// ===== 4. FETCH DATA - LẤY DỮ LIỆU =====
const {
  data: reportsData,
  pending: loadingReports,
  refresh: refreshReports,
} = await getCombinedReports({ limit: 10 });

// ===== 5. COMPUTED - TÍNH TOÁN TỰ ĐỘNG =====
// Thống kê — trả về từ server, không cần fetch riêng
const statistics = computed(() => {
  const s = (reportsData.value as any)?.statistics;
  return {
    total: s?.total ?? 0,
    submitted: s?.submitted ?? 0,
    draft: s?.draft ?? 0,
    monthlyIncrease: s?.monthlyIncrease ?? 0,
  };
});

// Format báo cáo
const recentReports = computed((): ReportListItem[] => {
  const reports: ApiReportRow[] = (reportsData.value as any)?.data || [];

  return reports.map((report): ReportListItem => {
    const periodStart = new Date(report.periodStart);
    const periodEnd = new Date(report.periodEnd);
    const submittedDate = report.submittedAt
      ? new Date(report.submittedAt)
      : null;

    return {
      id: report.id,
      title: report.title,
      status: report.status,
      statusText: getStatusText(report.status),
      period: `${periodStart.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })} - ${periodEnd.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })}`,
      date: submittedDate
        ? `Nộp ngày: ${formatDate(submittedDate)}`
        : "Chưa nộp",
      amount: report.amount || 0,
      type: report.type,
    };
  });
});

// Lọc báo cáo
const filteredReports = computed((): ReportListItem[] => {
  let filtered = recentReports.value;
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.id.toString().toLowerCase().includes(query),
    );
  }
  if (filterType.value) {
    filtered = filtered.filter((report) => report.type === filterType.value);
  }
  if (filterStatus.value) {
    filtered = filtered.filter(
      (report) => report.status === filterStatus.value,
    );
  }
  return filtered;
});

// ===== 6. METHODS - XỬ LÝ SỰ KIỆN =====
const createRevenueReportHandler = () => {
  revenueEditData.value = null;
  selectedReport.value = null;
  showRevenueOverlay.value = true;
};

const createExpenseReportHandler = () => {
  expenseEditData.value = null;
  selectedReport.value = null;
  showExpenseOverlay.value = true;
};

const openReportDetails = async (report: ReportListItem) => {
  try {
    let detailedData;
    if (report.type === "revenue") {
      const { data } = await getRevenueReportById(Number(report.id));
      detailedData = (data.value as any)?.data;
      if (detailedData) {
        selectedReport.value = detailedData;
        showRevenueDetailOverlay.value = true;
      }
    } else {
      const { data } = await getExpenseReportById(Number(report.id));
      detailedData = (data.value as any)?.data;
      if (detailedData) {
        selectedReport.value = detailedData;
        showExpenseDetailOverlay.value = true;
      }
    }
  } catch (error) {
    console.error("Failed to fetch report details:", error);
    selectedReport.value = null;
    if (report.type === "revenue") {
      showRevenueDetailOverlay.value = true;
    } else {
      showExpenseDetailOverlay.value = true;
    }
  }
};

const handleRevenueEdit = (reportData: ReportDetailData) => {
  revenueEditData.value = reportData;
  showRevenueDetailOverlay.value = false;
  showRevenueOverlay.value = true;
};

const handleExpenseEdit = (reportData: ReportDetailData) => {
  expenseEditData.value = reportData;
  showExpenseDetailOverlay.value = false;
  showExpenseOverlay.value = true;
};

const handleRevenueDelete = async (reportId: string) => {
  try {
    const id = Number(reportId);
    if (isNaN(id)) return;

    await deleteRevenueReport(id);
    showRevenueDetailOverlay.value = false;
    await refreshReports();
    showToast("success", "Đã xóa báo cáo doanh thu thành công");
  } catch (error) {
    console.error("Failed to delete revenue report:", error);
    showToast("error", "Có lỗi xảy ra khi xóa báo cáo");
  }
};

const handleExpenseDelete = async (reportId: string) => {
  try {
    const id = Number(reportId);
    if (isNaN(id)) return;

    await deleteExpenseReport(id);
    showExpenseDetailOverlay.value = false;
    await refreshReports();
    showToast("success", "Đã xóa báo cáo chi phí thành công");
  } catch (error) {
    console.error("Failed to delete expense report:", error);
    showToast("error", "Có lỗi xảy ra khi xóa báo cáo");
  }
};

const handleRevenueSubmit = async (data: RevenueSubmitData) => {
  const {
    id,
    title,
    periodStart,
    periodEnd,
    totalRevenue,
    totalTax,
    netRevenue,
    status,
    notes,
    metadata,
    items,
  } = data;
  const common = {
    periodStart,
    periodEnd,
    totalRevenue: totalRevenue || 0,
    totalTax: totalTax || 0,
    netRevenue: netRevenue || 0,
    status: status || "draft",
    notes,
    metadata,
    items: items || [],
  };
  try {
    if (id) {
      await updateRevenueReport(id, common);
      showToast("success", "Đã cập nhật báo cáo doanh thu thành công");
      revenueEditData.value = null;
    } else {
      await createRevenueReport({
        title,
        reportCode: `REV-${Date.now()}`,
        ...common,
      });
      showToast("success", "Đã tạo báo cáo doanh thu thành công");
    }
    showRevenueOverlay.value = false;
    await refreshReports();
  } catch (error) {
    console.error("Failed to submit revenue report:", error);
    showToast("error", "Có lỗi xảy ra khi lưu báo cáo doanh thu");
  }
};

const handleExpenseSubmit = async (data: ExpenseSubmitData) => {
  const {
    id,
    title,
    periodStart,
    periodEnd,
    totalExpense,
    totalTax,
    netExpense,
    status,
    notes,
    metadata,
    items,
  } = data;
  const common = {
    periodStart,
    periodEnd,
    totalExpense: totalExpense || 0,
    totalTax: totalTax || 0,
    netExpense: netExpense || 0,
    status: status || "draft",
    notes,
    metadata,
    items: items || [],
  };
  try {
    if (id) {
      await updateExpenseReport(id, common);
      showToast("success", "Đã cập nhật báo cáo chi phí thành công");
      expenseEditData.value = null;
    } else {
      await createExpenseReport({
        title,
        reportCode: `EXP-${Date.now()}`,
        ...common,
      });
      showToast("success", "Đã tạo báo cáo chi phí thành công");
    }
    showExpenseOverlay.value = false;
    await refreshReports();
  } catch (error) {
    console.error("Failed to submit expense report:", error);
    showToast("error", "Có lỗi xảy ra khi lưu báo cáo chi phí");
  }
};
</script>
