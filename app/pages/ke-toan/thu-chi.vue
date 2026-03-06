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
          <p class="text-[#ebeef0] text-[14px] mb-1">Thống kê thu - chi</p>
          <p class="text-[24px] font-bold mb-1">{{ statistics.total }}</p>
          <p class="text-[#d8d8d8] text-[12px]">
            +{{ statistics.monthlyIncrease }} tháng này
          </p>
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

            <button
              @click="applyFilters"
              class="bg-white border border-[rgba(0,0,0,0.1)] px-4 py-2 rounded-lg text-[14px] text-[#0a0a0a] flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <img src="/icon/filter.svg" alt="filter" class="w-4 h-4" />
              Lọc
            </button>
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
  </NavigationBar>
</template>

<!-- ============================================================
     SCRIPT - LOGIC & XỬ LÝ DỮ LIỆU
     ============================================================ -->
<script setup lang="ts">
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
  getRevenueReports,
  getExpenseReports,
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

// ===== 3. STATE - TRẠNG THÁI =====
// Overlays
const showRevenueOverlay = ref(false);
const showExpenseOverlay = ref(false);
const showRevenueDetailOverlay = ref(false);
const showExpenseDetailOverlay = ref(false);
const selectedReport = ref<any>(null);
const revenueEditData = ref<any>(null);
const expenseEditData = ref<any>(null);

// Bộ lọc
const searchQuery = ref("");
const filterType = ref("");
const filterStatus = ref("");

// ===== 4. FETCH DATA - LẤY DỮ LIỆU =====
const {
  data: reportsData,
  pending: loadingReports,
  refresh: refreshReports,
} = await getCombinedReports({ limit: 10 });
const { data: revenueData } = await getRevenueReports({ limit: 100 });
const { data: expenseData } = await getExpenseReports({ limit: 100 });

// ===== 5. COMPUTED - TÍNH TOÁN TỰ ĐỘNG =====
// Thống kê
const statistics = computed(() => {
  const revenueReports = (revenueData.value as any)?.data || [];
  const expenseReports = (expenseData.value as any)?.data || [];
  const allReports = [...revenueReports, ...expenseReports];
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );

  const totalReports = allReports.length;
  const submittedCount = allReports.filter(
    (r: any) => r.status === "submitted" || r.status === "approved",
  ).length;
  const draftCount = allReports.filter((r: any) => r.status === "draft").length;
  const monthReports = allReports.filter(
    (r: any) => new Date(r.createdAt) >= monthStart,
  ).length;

  return {
    total: totalReports,
    submitted: submittedCount,
    draft: draftCount,
    monthlyIncrease: monthReports,
  };
});

// Format báo cáo
const recentReports = computed(() => {
  const reports = (reportsData.value as any)?.data || [];

  return reports.map((report: any) => {
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
const filteredReports = computed(() => {
  let filtered = recentReports.value;
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (report: any) =>
        report.title.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query),
    );
  }
  if (filterType.value) {
    filtered = filtered.filter(
      (report: any) => report.type === filterType.value,
    );
  }
  if (filterStatus.value) {
    filtered = filtered.filter(
      (report: any) => report.status === filterStatus.value,
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

const openReportDetails = async (report: any) => {
  try {
    let detailedData;
    if (report.type === "revenue") {
      const { data } = await getRevenueReportById(report.id);
      detailedData = (data.value as any)?.data;
      if (detailedData) {
        selectedReport.value = detailedData;
        showRevenueDetailOverlay.value = true;
      }
    } else {
      const { data } = await getExpenseReportById(report.id);
      detailedData = (data.value as any)?.data;
      if (detailedData) {
        selectedReport.value = detailedData;
        showExpenseDetailOverlay.value = true;
      }
    }
  } catch (error) {
    console.error("Failed to fetch report details:", error);
    selectedReport.value = report;
    if (report.type === "revenue") {
      showRevenueDetailOverlay.value = true;
    } else {
      showExpenseDetailOverlay.value = true;
    }
  }
};

const handleRevenueEdit = (reportData: any) => {
  revenueEditData.value = reportData;
  showRevenueDetailOverlay.value = false;
  showRevenueOverlay.value = true;
};

const handleExpenseEdit = (reportData: any) => {
  expenseEditData.value = reportData;
  showExpenseDetailOverlay.value = false;
  showExpenseOverlay.value = true;
};

const handleRevenueDelete = async (reportId: string) => {
  try {
    const id = Number(reportId);
    if (isNaN(id)) {
      console.error("Invalid report ID:", reportId);
      return;
    }

    const result = await deleteRevenueReport(id);

    if (result.success) {
      showRevenueDetailOverlay.value = false;
      await refreshReports();
      console.log("Báo cáo doanh thu đã được xóa thành công");
    } else {
      console.error("Failed to delete revenue report:", result.message);
      alert(
        "Không thể xóa báo cáo: " + (result.message || "Lỗi không xác định"),
      );
    }
  } catch (error) {
    console.error("Failed to delete revenue report:", error);
    alert("Có lỗi xảy ra khi xóa báo cáo");
  }
};

const handleExpenseDelete = async (reportId: string) => {
  try {
    const id = Number(reportId);
    if (isNaN(id)) {
      console.error("Invalid report ID:", reportId);
      return;
    }

    const result = await deleteExpenseReport(id);

    if (result.success) {
      showExpenseDetailOverlay.value = false;
      await refreshReports();
      console.log("Báo cáo chi phí đã được xóa thành công");
    } else {
      console.error("Failed to delete expense report:", result.message);
      alert(
        "Không thể xóa báo cáo: " + (result.message || "Lỗi không xác định"),
      );
    }
  } catch (error) {
    console.error("Failed to delete expense report:", error);
    alert("Có lỗi xảy ra khi xóa báo cáo");
  }
};

const handleRevenueSubmit = async (data: any) => {
  try {
    if (data.id) {
      // Chế độ chỉnh sửa: Cập nhật báo cáo hiện tại vào database
      await updateRevenueReport(data.id, {
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        totalRevenue: data.totalRevenue || 0,
        totalTax: data.totalTax || 0,
        netRevenue: data.netRevenue || 0,
        status: data.status || "draft",
        notes: data.notes,
        metadata: data.metadata,
        items: data.items || [],
      });
      console.log("Revenue report updated successfully", data);
      revenueEditData.value = null;
    } else {
      // Chế độ tạo mới: Tạo báo cáo mới
      const reportCode = `REV-${Date.now()}`;

      await createRevenueReport({
        title: data.title,
        reportCode: reportCode,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        totalRevenue: data.totalRevenue || 0,
        totalTax: data.totalTax || 0,
        netRevenue: data.netRevenue || 0,
        status: data.status || "draft",
        notes: data.notes,
        metadata: data.metadata,
        items: data.items || [],
      });
      console.log("Revenue report created successfully");
    }
    showRevenueOverlay.value = false;
    await refreshReports();
  } catch (error) {
    console.error("Failed to submit revenue report:", error);
  }
};

const handleExpenseSubmit = async (data: any) => {
  try {
    if (data.id) {
      // Chế độ chỉnh sửa: Cập nhật báo cáo hiện tại vào database
      await updateExpenseReport(data.id, {
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        totalExpense: data.totalExpense || 0,
        totalTax: data.totalTax || 0,
        netExpense: data.netExpense || 0,
        status: data.status || "draft",
        notes: data.notes,
        metadata: data.metadata,
        items: data.items || [],
      });
      console.log("Expense report updated successfully", data);
      expenseEditData.value = null;
    } else {
      // Chế độ tạo mới: Tạo báo cáo mới
      const reportCode = `EXP-${Date.now()}`;

      await createExpenseReport({
        title: data.title,
        reportCode: reportCode,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        totalExpense: data.totalExpense || 0,
        totalTax: data.totalTax || 0,
        netExpense: data.netExpense || 0,
        status: data.status || "draft",
        notes: data.notes,
        metadata: data.metadata,
        items: data.items || [],
      });
      console.log("Expense report created successfully");
    }
    showExpenseOverlay.value = false;
    await refreshReports();
  } catch (error) {
    console.error("Failed to submit expense report:", error);
  }
};

const applyFilters = () => {
  console.log("Filters applied:", {
    searchQuery: searchQuery.value,
    filterType: filterType.value,
    filterStatus: filterStatus.value,
    resultCount: filteredReports.value.length,
  });
};
</script>

<style scoped></style>
