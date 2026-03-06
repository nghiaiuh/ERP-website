<template>
  <NavigationBar sidebar-title="Kế toán & Tài chính">
    <!-- Main Content -->
    <div class="p-12 bg-[#f9fafb]">
      <!-- Tabs -->
      <TabBar :tabs="tabs" aria-label="Kế toán navigation" />

      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-[#101828] text-[24px] font-bold mb-2">
          Quản lý công nợ
        </h1>
        <p class="text-[#6a7282] text-[16px]">
          Theo dõi công nợ phải thu và phải trả theo hợp đồng và công trình
        </p>
      </div>

      <!-- Toolbar Card -->
      <div
        class="bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] border-2 border-[#dbeafe] rounded-[14px] p-6 mb-8"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3
              class="text-[#101828] text-[16px] font-bold mb-1 flex items-center gap-2"
            >
              <img src="/icon/tools.svg" alt="tools" class="w-5 h-5" />
              Thanh công cụ
            </h3>
            <p class="text-[#4a5565] text-[14px]">
              Các công cụ tiện ích quản lý công nợ
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="handleAutoRemind"
              class="bg-white border border-[rgba(0,0,0,0.1)] text-[#0a0a0a] px-4 py-2 rounded-lg text-[14px] flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <img src="/icon/bell.svg" alt="remind" class="w-4 h-4" />
              Nhắc nợ tự động
            </button>
            <button
              @click="handleExportReport"
              class="bg-white border border-[rgba(0,0,0,0.1)] text-[#0a0a0a] px-4 py-2 rounded-lg text-[14px] flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <img src="/icon/download.svg" alt="export" class="w-4 h-4" />
              Xuất báo cáo
            </button>
            <button
              @click="handleAddDebt"
              class="bg-[#155dfc] text-white px-4 py-2 rounded-lg text-[14px] flex items-center gap-2 hover:bg-[#0d4cd9] transition-colors"
            >
              <img src="/icon/plus.svg" alt="add" class="w-4 h-4" />
              Thêm công nợ
            </button>
          </div>
        </div>
      </div>

      <!-- Internal Tabs (Phải thu / Phải trả / Tổng quan) -->
      <div class="mb-8">
        <div
          class="bg-white rounded-[11px] shadow-sm w-fit inline-flex p-1 border border-[rgba(0,0,0,0.1)]"
        >
          <button
            v-for="tab in debtTabs"
            :key="tab.key"
            @click="activeDebtTab = tab.key"
            :class="[
              'px-4 py-2 rounded-lg text-[16px] transition-colors',
              activeDebtTab === tab.key
                ? 'bg-[#155dfc] text-white'
                : 'text-[#0a0a0a] hover:bg-gray-50',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-4 gap-5 mb-8">
        <!-- Card 1: Tổng phải thu -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] shadow-sm relative"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[#6a7282] text-[14px] mb-2">Tổng phải thu</p>
              <p class="text-[#101828] text-[16px] font-normal mb-2">
                ₫{{ formatNumber(statistics.totalReceivable) }}
              </p>
              <div class="flex items-center gap-1">
                <img src="/icon/trending-up.svg" alt="up" class="w-4 h-4" />
                <span class="text-[#00a63e] text-[14px]">+8.2%</span>
              </div>
            </div>
            <div
              class="w-10 h-10 bg-[#dbeafe] rounded-[10px] flex items-center justify-center"
            >
              <img src="/icon/chart-blue.svg" alt="chart" class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- Card 2: Đã thu -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] shadow-sm relative"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[#6a7282] text-[14px] mb-2">Đã thu</p>
              <p class="text-[#101828] text-[16px] font-normal mb-2">
                ₫{{ formatNumber(statistics.collected) }}
              </p>
              <div class="flex items-center gap-1">
                <img src="/icon/trending-up.svg" alt="up" class="w-4 h-4" />
                <span class="text-[#00a63e] text-[14px]">+12.5%</span>
              </div>
            </div>
            <div
              class="w-10 h-10 bg-[#dcfce7] rounded-[10px] flex items-center justify-center"
            >
              <img src="/icon/check.svg" alt="check" class="w-4 h-4" />
            </div>
          </div>
        </div>

        <!-- Card 3: Còn lại -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] shadow-sm relative"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[#6a7282] text-[14px] mb-2">Còn lại</p>
              <p class="text-[#101828] text-[16px] font-normal mb-2">
                ₫{{ formatNumber(statistics.remaining) }}
              </p>
              <div class="flex items-center gap-1">
                <img src="/icon/trending-down.svg" alt="down" class="w-4 h-4" />
                <span class="text-[#99a1af] text-[14px]">-3.1%</span>
              </div>
            </div>
            <div
              class="w-10 h-10 bg-[#fef9c2] rounded-[10px] flex items-center justify-center"
            >
              <img src="/icon/clock.svg" alt="clock" class="w-4 h-4" />
            </div>
          </div>
        </div>

        <!-- Card 4: Quá hạn -->
        <div
          class="bg-white rounded-[14px] p-6 border border-[rgba(0,0,0,0.1)] shadow-sm relative"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[#6a7282] text-[14px] mb-2">Quá hạn</p>
              <p class="text-[#101828] text-[16px] font-normal mb-2">
                ₫{{ formatNumber(statistics.overdue) }}
              </p>
              <div class="flex items-center gap-1">
                <img src="/icon/alert.svg" alt="alert" class="w-3 h-3" />
                <span class="text-[#e7000b] text-[14px]">Cần xử lý</span>
              </div>
            </div>
            <div
              class="w-10 h-10 bg-[#ffe2e2] rounded-[10px] flex items-center justify-center"
            >
              <img src="/icon/clock.svg" alt="warning" class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div
        class="bg-white rounded-[10px] border border-[rgba(0,0,0,0.1)] shadow-sm p-4 mb-6"
      >
        <div class="flex items-center justify-between">
          <!-- Search Box -->
          <div class="relative flex-1 max-w-[480px]">
            <img
              src="/icon/search.svg"
              alt="search"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo khách hàng, công trình, mã hợp đồng..."
              class="w-full pl-10 pr-3 py-2 bg-[#f3f3f5] border-0 rounded-lg text-[14px] text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
            />
          </div>

          <!-- Filter Buttons -->
          <div class="flex items-center gap-3">
            <select
              v-model="filterCustomer"
              class="px-3 py-2 bg-[#f3f3f5] border-0 rounded-lg text-[14px] text-[#0a0a0a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
            >
              <option value="">Tất cả khách hàng</option>
              <option value="thanh-dat">Công ty TNHH Thành Đạt</option>
            </select>

            <select
              v-model="filterProject"
              class="px-3 py-2 bg-[#f3f3f5] border-0 rounded-lg text-[14px] text-[#0a0a0a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
            >
              <option value="">Tất cả công trình</option>
              <option value="vinhomes">Dự án cảnh quan KĐT Vinhomes</option>
            </select>

            <select
              v-model="filterStatus"
              class="px-3 py-2 bg-[#f3f3f5] border-0 rounded-lg text-[14px] text-[#0a0a0a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="near-due">Sắp đến hạn</option>
              <option value="overdue">Quá hạn</option>
              <option value="critical">Nghiêm trọng</option>
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

      <!-- Debts Table -->
      <div
        class="bg-white rounded-[10px] border border-[rgba(0,0,0,0.1)] shadow-sm overflow-hidden"
      >
        <!-- Loading State -->
        <div v-if="loadingDebts" class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155dfc]"
          ></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="debts.length === 0" class="text-center py-12">
          <img
            src="/icon/document-blue.svg"
            alt="no debts"
            class="w-16 h-16 mx-auto mb-4 opacity-50"
          />
          <p class="text-[#4a5565] text-[16px] mb-2">Chưa có công nợ nào</p>
          <p class="text-[#717182] text-[14px]">
            Thêm công nợ để bắt đầu theo dõi
          </p>
        </div>

        <!-- Table -->
        <div v-else>
          <!-- Table Header -->
          <div
            class="bg-[#f9fafb] border-b-2 border-[#e5e7eb] rounded-t-[9px] grid grid-cols-[163px_157px_103px_134px_110px_139px_124px_95px_118px_69px] items-center h-[66px] text-[14px] font-bold text-[#4a5565]"
          >
            <div class="text-center px-2">Khách hàng</div>
            <div class="text-center px-2">Công trình</div>
            <div class="text-center px-2">Mã HĐ</div>
            <div class="text-center px-2">Tổng giá trị HĐ</div>
            <div class="text-center px-2">Đã thanh toán</div>
            <div class="text-center px-2">Còn lại</div>
            <div class="text-center px-2">Hạn thanh toán</div>
            <div class="text-center px-2">Số ngày quá hạn</div>
            <div class="text-center px-2">Trạng thái</div>
            <div class="text-center px-2">Chỉnh sửa</div>
          </div>

          <!-- Table Body -->
          <div>
            <template v-for="(debt, index) in debts" :key="debt.id">
              <!-- Main Row -->
              <div
                :class="[
                  'border-b border-[#e5e7eb] grid grid-cols-[163px_157px_103px_134px_110px_139px_124px_95px_118px_69px] items-center min-h-[89px] text-[14px] hover:bg-gray-50 cursor-pointer transition-colors',
                  expandedRow === debt.id ? 'bg-[#f9fafb]' : '',
                ]"
                @click="toggleRow(debt.id)"
              >
                <div class="px-[18px] py-[15px] flex items-center gap-2">
                  <button
                    class="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    @click.stop="toggleRow(debt.id)"
                  >
                  </button>
                  <p class="text-[#101828] w-[95px]">{{ debt.customer }}</p>
                </div>
                <div class="px-2 py-2 text-[#4a5565]">
                  {{ debt.project }}
                </div>
                <div class="text-center px-2 text-[#101828]">
                  {{ debt.contractCode }}
                </div>
                <div class="text-center px-2 text-[#101828]">
                  ₫{{ formatNumber(debt.totalValue) }}
                </div>
                <div class="text-center px-2 text-[#00a63e]">
                  ₫{{ formatNumber(debt.paid) }}
                </div>
                <div class="text-center px-2 text-[#101828]">
                  ₫{{ formatNumber(debt.remaining) }}
                </div>
                <div class="text-center px-2 text-[#4a5565]">
                  {{ debt.dueDate }}
                </div>
                <div
                  class="text-center px-2"
                  :class="
                    debt.overdueDays > 0 ? 'text-[#e7000b]' : 'text-[#99a1af]'
                  "
                >
                  {{ debt.overdueDays > 0 ? `${debt.overdueDays} ngày` : "—" }}
                </div>
                <div class="px-3 py-8 flex items-center justify-center">
                  <span
                    :class="[
                      'px-2 py-1 rounded-lg text-[12px] inline-block',
                      getStatusClass(debt.status),
                    ]"
                  >
                    {{ debt.statusText }}
                  </span>
                </div>
                <div class="flex items-center justify-center">
                  <button
                    @click.stop="handleEditDebt(debt)"
                    class="w-4 h-4 hover:opacity-70 transition-opacity"
                  >
                    <img
                      src="/icon/edit.svg"
                      alt="edit"
                      class="w-full h-full"
                    />
                  </button>
                </div>
              </div>

              <!-- Expanded Row Details -->
              <div
                v-if="expandedRow === debt.id"
                class="bg-[#f9fafb] border-b border-[#e5e7eb] px-14 py-3"
              >
                <div class="flex items-start justify-between">
                  <!-- Left Column: Contract Info -->
                  <div class="flex flex-col gap-4 w-[541px]">
                    <h4 class="text-[#101828] text-[14px] font-normal">
                      Thông tin hợp đồng
                    </h4>
                    <div class="flex flex-col gap-2">
                      <div
                        class="flex items-center justify-between text-[14px]"
                      >
                        <span class="text-[#6a7282]">Mã hợp đồng:</span>
                        <span class="text-[#101828]">{{
                          debt.contractCode
                        }}</span>
                      </div>
                      <div
                        class="flex items-center justify-between text-[14px]"
                      >
                        <span class="text-[#6a7282]">Tổng giá trị:</span>
                        <span class="text-[#101828]"
                          >₫{{ formatNumber(debt.totalValue) }}</span
                        >
                      </div>
                      <div
                        class="flex items-center justify-between text-[14px]"
                      >
                        <span class="text-[#6a7282]">Đã thu:</span>
                        <span class="text-[#00a63e]"
                          >₫{{ formatNumber(debt.paid) }}</span
                        >
                      </div>
                      <div
                        class="flex items-center justify-between text-[14px]"
                      >
                        <span class="text-[#6a7282]">Còn lại:</span>
                        <span class="text-[#101828]"
                          >₫{{ formatNumber(debt.remaining) }}</span
                        >
                      </div>
                    </div>

                    <div class="flex flex-col gap-2">
                      <h4 class="text-[#101828] text-[14px] font-normal">
                        Ghi chú kế toán
                      </h4>
                      <p class="text-[#4a5565] text-[14px]">
                        {{ debt.notes || "Không có ghi chú" }}
                      </p>
                    </div>

                    <div class="flex items-center gap-2">
                      <button
                        @click="handleSendReminder(debt)"
                        class="bg-white border border-[rgba(0,0,0,0.1)] px-3 py-2 rounded-lg text-[14px] text-[#0a0a0a] flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src="/icon/message.svg"
                          alt="message"
                          class="w-4 h-4"
                        />
                        Gửi nhắc nợ
                      </button>
                      <button
                        @click="handleExportDebtReport(debt)"
                        class="bg-white border border-[rgba(0,0,0,0.1)] px-3 py-2 rounded-lg text-[14px] text-[#0a0a0a] flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src="/icon/download.svg"
                          alt="download"
                          class="w-4 h-4"
                        />
                        Xuất báo cáo
                      </button>
                    </div>
                  </div>

                  <!-- Right Column: Payment Schedule -->
                  <div class="flex flex-col gap-3 w-[416px]">
                    <div class="flex items-center justify-between">
                      <h4 class="text-[#101828] text-[14px] font-normal">
                        Danh sách đợt thanh toán
                      </h4>
                      <button
                        @click="handleAddPayment(debt)"
                        class="bg-white border border-[rgba(0,0,0,0.1)] px-3 py-2 rounded-lg text-[14px] text-[#0a0a0a] flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      >
                        <img src="/icon/plus.svg" alt="add" class="w-4 h-4" />
                        Thêm thanh toán
                      </button>
                    </div>

                    <div class="flex flex-col gap-3">
                      <div
                        v-for="payment in debt.payments"
                        :key="payment.id"
                        class="bg-white border border-[#e5e7eb] rounded-[10px] p-3 flex flex-col gap-2"
                      >
                        <div class="flex items-start justify-between">
                          <div>
                            <p class="text-[#101828] text-[14px] mb-1">
                              {{ payment.name }}
                            </p>
                            <p class="text-[#6a7282] text-[12px]">
                              Hạn: {{ payment.dueDate }}
                            </p>
                          </div>
                          <span
                            :class="[
                              'px-2 py-1 rounded-lg text-[12px]',
                              getPaymentStatusClass(payment.status),
                            ]"
                          >
                            {{ payment.statusText }}
                          </span>
                        </div>
                        <div
                          class="flex items-center justify-between text-[14px]"
                        >
                          <span class="text-[#4a5565]">Số tiền:</span>
                          <span class="text-[#101828]"
                            >₫{{ formatNumber(payment.amount) }}</span
                          >
                        </div>
                        <div
                          v-if="payment.paidDate"
                          class="flex items-center justify-between text-[14px]"
                        >
                          <span class="text-[#4a5565]">Ngày thu:</span>
                          <span class="text-[#00a63e]">{{
                            payment.paidDate
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </NavigationBar>
</template>

<script setup lang="ts">
// Breadcrumb
definePageMeta({
  breadcrumb: [
    { label: "Kế toán & Tài chính", path: "/ke-toan" },
    { label: "Công nợ", path: "/ke-toan/cong-no" },
  ],
});

// Tabs configuration using composable
const tabs = useAccountingTabs();

// Internal debt tabs
const debtTabs = [
  { key: "receivable", label: "Phải thu" },
  { key: "payable", label: "Phải trả" },
  { key: "overview", label: "Tổng quan" },
];

const activeDebtTab = ref("receivable");

// Filters
const searchQuery = ref("");
const filterCustomer = ref("");
const filterProject = ref("");
const filterStatus = ref("");

// Expanded row state
const expandedRow = ref<string | null>(null);

// Loading state
const loadingDebts = ref(false);

// Mock statistics data
const statistics = computed(() => ({
  totalReceivable: 1265000000,
  collected: 3765000000,
  remaining: 1265000000,
  overdue: 1010000000,
}));

// Mock debts data
const debts = ref([
  {
    id: "1",
    customer: "Công ty TNHH Thành Đạt",
    project: "Dự án cảnh quan KĐT Vinhomes",
    contractCode: "HĐ-2025-001",
    totalValue: 850000000,
    paid: 595000000,
    remaining: 255000000,
    dueDate: "15/3/2025",
    overdueDays: 0,
    status: "near-due",
    statusText: "Sắp đến hạn",
    notes: "Khách hàng uy tín, thanh toán đúng hạn",
    payments: [
      {
        id: "p1",
        name: "Đợt 1 - Tạm ứng 30%",
        amount: 255000000,
        dueDate: "10/1/2025",
        paidDate: "8/1/2025",
        status: "paid",
        statusText: "Đã thu",
      },
      {
        id: "p2",
        name: "Đợt 2 - Hoàn thành phần thô 40%",
        amount: 340000000,
        dueDate: "15/2/2025",
        paidDate: "14/2/2025",
        status: "paid",
        statusText: "Đã thu",
      },
      {
        id: "p3",
        name: "Đợt 3 - Bàn giao 30%",
        amount: 255000000,
        dueDate: "15/3/2025",
        paidDate: null,
        status: "pending",
        statusText: "Chờ thu",
      },
    ],
  },
  {
    id: "2",
    customer: "Công ty TNHH Thành Đạt",
    project: "Dự án cảnh quan KĐT Vinhomes",
    contractCode: "HĐ-2025-001",
    totalValue: 850000000,
    paid: 595000000,
    remaining: 255000000,
    dueDate: "15/3/2025",
    overdueDays: 54,
    status: "overdue",
    statusText: "Quá hạn",
    notes: "Cần nhắc nhở thanh toán",
    payments: [],
  },
  {
    id: "3",
    customer: "Công ty TNHH Thành Đạt",
    project: "Dự án cảnh quan KĐT Vinhomes",
    contractCode: "HĐ-2025-001",
    totalValue: 850000000,
    paid: 595000000,
    remaining: 255000000,
    dueDate: "15/3/2025",
    overdueDays: 0,
    status: "critical",
    statusText: "Nghiêm trọng",
    notes: "",
    payments: [],
  },
]);

// Methods
const toggleRow = (id: string) => {
  expandedRow.value = expandedRow.value === id ? null : id;
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    "near-due": "bg-[#fef9c2] text-[#894b00]",
    overdue: "bg-[#ffedd4] text-[#9f2d00]",
    critical: "bg-[#ffe2e2] text-[#9f0712]",
  };
  return classes[status] || "";
};

const getPaymentStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    paid: "bg-[#dcfce7] text-[#016630]",
    pending: "bg-[#fef9c2] text-[#894b00]",
  };
  return classes[status] || "";
};

const handleAutoRemind = () => {
  console.log("Auto remind");
};

const handleExportReport = () => {
  console.log("Export report");
};

const handleAddDebt = () => {
  console.log("Add debt");
};

const applyFilters = () => {
  console.log("Apply filters", {
    searchQuery: searchQuery.value,
    filterCustomer: filterCustomer.value,
    filterProject: filterProject.value,
    filterStatus: filterStatus.value,
  });
};

const handleEditDebt = (debt: any) => {
  console.log("Edit debt", debt);
};

const handleSendReminder = (debt: any) => {
  console.log("Send reminder", debt);
};

const handleExportDebtReport = (debt: any) => {
  console.log("Export debt report", debt);
};

const handleAddPayment = (debt: any) => {
  console.log("Add payment", debt);
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
