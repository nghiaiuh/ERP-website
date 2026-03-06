<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    role="dialog"
    aria-modal="true"
    @click.self="closeOverlay"
  >
    <div
      class="relative w-full max-w-[864px] rounded-[10px] border border-black/10 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
    >
      <!-- Header -->
      <div
        class="border-b border-[#e5e7eb] bg-white px-6 pt-6 pb-[25px] rounded-t-[10px]"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h2 class="text-[20px] font-bold text-[#101828] leading-[28px]">
                SỔ CHI TIẾT CHI PHÍ HÀNG HOÁ, DỊCH VỤ
              </h2>
              <span
                class="px-2 py-0.5 rounded-lg text-[12px] bg-blue-100 text-blue-700 border border-blue-200"
              >
                Xem chi tiết
              </span>
            </div>
            <p class="text-[14px] text-[#4a5565] leading-[20px]">
              Mẫu số S2c-HKD | Theo Thông tư 152/2025/TT-BTC ngày 31/12/2025
            </p>
          </div>
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded opacity-70 hover:opacity-100 transition-opacity"
            @click="closeOverlay"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-[23px] max-h-[calc(100vh-200px)] overflow-y-auto">
        <!-- Business Information Section -->
        <div
          class="bg-[rgba(239,246,255,0.5)] border border-[#dbeafe] rounded-[10px] p-6 mb-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-5 bg-[#155dfc] rounded-full"></div>
            <h3 class="text-[16px] font-bold text-[#101828] leading-[24px]">
              Thông tin doanh nghiệp
            </h3>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-[14px] text-[#364153] mb-2">
                Tên doanh nghiệp
              </label>
              <div
                class="w-full h-9 px-3 py-1 bg-gray-50 rounded-lg text-[14px] text-[#101828] flex items-center"
              >
                {{ reportData?.metadata?.businessName || "N/A" }}
              </div>
            </div>
            <div>
              <label class="block text-[14px] text-[#364153] mb-2">
                Mã số thuế
              </label>
              <div
                class="w-full h-9 px-3 py-1 bg-gray-50 rounded-lg text-[14px] text-[#101828] flex items-center"
              >
                {{ reportData?.metadata?.taxCode || "N/A" }}
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-[14px] text-[#364153] mb-2">
              Địa chỉ
            </label>
            <div
              class="w-full h-9 px-3 py-1 bg-gray-50 rounded-lg text-[14px] text-[#101828] flex items-center"
            >
              {{ reportData?.metadata?.address || "N/A" }}
            </div>
          </div>
        </div>

        <!-- Declaration Period Section -->
        <div
          class="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] p-6 mb-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-5 bg-[#155dfc] rounded-full"></div>
            <h3 class="text-[16px] font-bold text-[#101828] leading-[24px]">
              Sổ kê khai
            </h3>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[14px] text-[#364153] mb-2">
                Mẫu số
              </label>
              <div
                class="w-full h-9 px-3 py-1 bg-gray-50 rounded-lg text-[14px] text-[#101828] flex items-center"
              >
                {{ reportData?.metadata?.templateCode || "N/A" }}
              </div>
            </div>
            <div>
              <label class="block text-[14px] text-[#364153] mb-2">
                Ngày tháng
              </label>
              <div
                class="w-full h-9 px-3 py-1 bg-gray-50 rounded-lg text-[14px] text-[#101828] flex items-center"
              >
                {{ formatPeriodRange }}
              </div>
            </div>
          </div>
        </div>

        <!-- Expense Detail Table Section -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-5 bg-[#155dfc] rounded-full"></div>
            <h3 class="text-[16px] font-bold text-[#101828] leading-[24px]">
              Bảng chi tiết chi phí
            </h3>
          </div>

          <div
            class="border border-[#e5e7eb] rounded-[10px] overflow-hidden mb-4"
          >
            <!-- Table Header -->
            <div
              class="bg-[#f9fafb] border-b border-[#e5e7eb] px-5 py-4 grid grid-cols-[100px_110px_165px_110px_130px] gap-2"
            >
              <div
                class="text-[12px] font-bold text-[#364153] uppercase tracking-wider text-center"
              >
                Số chứng từ
              </div>
              <div
                class="text-[12px] font-bold text-[#364153] uppercase tracking-wider text-center"
              >
                Ngày
              </div>
              <div
                class="text-[12px] font-bold text-[#364153] uppercase tracking-wider text-center"
              >
                Diễn giải
              </div>
              <div
                class="text-[12px] font-bold text-[#364153] uppercase tracking-wider text-center"
              >
                Số tiền
              </div>
              <div
                class="text-[12px] font-bold text-[#364153] uppercase tracking-wider text-center"
              >
                Phân loại
              </div>
            </div>

            <!-- Empty State or Expense List -->
            <div v-if="expenses.length === 0" class="px-[211px] py-10">
              <p class="text-center text-[14px] text-[#6a7282] leading-[20px]">
                Không có dữ liệu chi phí.
              </p>
            </div>

            <!-- Expense List -->
            <div v-else class="bg-white">
              <div
                v-for="(expense, index) in expenses"
                :key="index"
                class="border-b border-[#e5e7eb] px-5 py-3 grid grid-cols-[100px_110px_165px_110px_130px] gap-2 items-center"
              >
                <div class="text-[14px] text-[#101828]">
                  {{ expense.documentNumber }}
                </div>
                <div class="text-[14px] text-[#101828] text-center">
                  {{ formatDate(expense.date) }}
                </div>
                <div class="text-[14px] text-[#101828]">
                  {{ expense.description }}
                </div>
                <div class="text-[14px] text-[#101828] text-right">
                  {{ expense.amount }}
                </div>
                <div class="text-[14px] text-[#101828]">
                  {{ getCategoryLabel(expense.category) }}
                </div>
              </div>
            </div>

            <!-- Total Row -->
            <div
              class="bg-[#f9fafb] border-t-2 border-[#e5e7eb] px-5 py-3 grid grid-cols-[100px_110px_165px_110px_130px] gap-2 items-center"
            >
              <div></div>
              <div></div>
              <div class="text-[14px] font-bold text-[#101828]">Tổng cộng:</div>
              <div class="text-[14px] font-bold text-[#101828] text-right">
                {{ totalAmountFormatted }}
              </div>
              <div></div>
            </div>
          </div>

          <!-- Expense Categories Information -->
          <div class="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] p-4">
            <h4
              class="text-[14px] font-bold text-[#101828] mb-3 leading-[20px]"
            >
              Phân loại chi phí:
            </h4>
            <div class="grid grid-cols-3 gap-x-[107px] gap-y-3">
              <div class="flex items-start gap-2">
                <span class="text-[#155dfc] text-[14px] leading-[20px]">•</span>
                <span class="text-[#364153] text-[14px] leading-[20px]"
                  >a) Nguyên vật liệu, nhiên liệu</span
                >
              </div>
              <div class="flex items-start gap-2">
                <span class="text-[#155dfc] text-[14px] leading-[20px]">•</span>
                <span class="text-[#364153] text-[14px] leading-[20px]"
                  >b) Lương, phụ cấp, bảo hiểm</span
                >
              </div>
              <div class="flex items-start gap-2">
                <span class="text-[#155dfc] text-[14px] leading-[20px]">•</span>
                <span class="text-[#364153] text-[14px] leading-[20px]"
                  >c) Khấu hao tài sản</span
                >
              </div>
              <div class="flex items-start gap-2">
                <span class="text-[#155dfc] text-[14px] leading-[20px]">•</span>
                <span class="text-[#364153] text-[14px] leading-[20px]"
                  >d) Dịch vụ thuê ngoài (Điện, nước, Internet)</span
                >
              </div>
              <div class="flex items-start gap-2">
                <span class="text-[#155dfc] text-[14px] leading-[20px]">•</span>
                <span class="text-[#364153] text-[14px] leading-[20px]"
                  >đ) Lãi vay</span
                >
              </div>
              <div class="flex items-start gap-2">
                <span class="text-[#155dfc] text-[14px] leading-[20px]">•</span>
                <span class="text-[#364153] text-[14px] leading-[20px]"
                  >e) Chi phí khác</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="border-t border-[#e5e7eb] px-6 py-3 flex justify-between items-center"
      >
        <button
          type="button"
          @click="handleDelete"
          class="bg-[#fb2c36] text-white px-4 py-2 rounded-lg text-[14px] flex items-center gap-2 hover:bg-[#e02531] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            ></path>
          </svg>
          Xóa báo cáo
        </button>
        <div class="flex gap-3">
          <button
            type="button"
            @click="handleEdit"
            class="bg-[#155dfc] text-white px-4 py-2 rounded-lg text-[14px] flex items-center gap-2 hover:bg-[#0d4cd9] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              ></path>
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              ></path>
            </svg>
            Chỉnh sửa
          </button>
          <button
            type="button"
            @click="closeOverlay"
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-[14px] hover:bg-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ExpenseItem {
  documentNumber: string;
  date: string;
  description: string;
  amount: string;
  category: string;
}

const props = defineProps<{
  isVisible: boolean;
  reportData: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "edit", reportData: any): void;
  (e: "delete", reportId: string): void;
}>();

// Constants
const CATEGORY_LABELS: Record<string, string> = {
  materials: "Nguyên vật liệu, nhiên liệu",
  salary: "Lương, phụ cấp, bảo hiểm",
  depreciation: "Khấu hao tài sản",
  outsource: "Dịch vụ thuê ngoài",
  interest: "Lãi vay",
  other: "Chi phí khác",
};

// Reactive data
const expenses = ref<ExpenseItem[]>([]);

// Helper Functions
const formatAmountInput = (value: string) => {
  const numericValue = value.replace(/[^0-9]/g, "");
  return numericValue
    ? parseInt(numericValue).toLocaleString("vi-VN") + "đ"
    : "";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  return parts.length === 3 && parts[0] && parts[1] && parts[2]
    ? `${parts[2]}-${parts[1]}-${parts[0]}`
    : dateString;
};

const getCategoryLabel = (category: string) =>
  CATEGORY_LABELS[category] || category;

const loadReportData = (data: any) => {
  if (data?.items && Array.isArray(data.items)) {
    expenses.value = data.items.map((item: any) => ({
      documentNumber: item.documentNumber || "",
      date: item.documentDate ? item.documentDate.split("T")[0] : "",
      description: item.itemName || item.description || "",
      amount: formatAmountInput(item.amount?.toString() || "0"),
      category: item.category || "other",
    }));
  } else {
    expenses.value = [];
  }
};

// Computed
const formatPeriodRange = computed(() => {
  if (props.reportData?.periodStart && props.reportData?.periodEnd) {
    const start = new Date(props.reportData.periodStart).toLocaleDateString(
      "vi-VN",
    );
    const end = new Date(props.reportData.periodEnd).toLocaleDateString(
      "vi-VN",
    );
    return `${start} - ${end}`;
  }
  return "N/A";
});

const totalAmountFormatted = computed(() => {
  const total = expenses.value.reduce((sum, exp) => {
    const amount = parseFloat(exp.amount.replace(/[.,đ\s]/g, "")) || 0;
    return sum + amount;
  }, 0);
  return total.toLocaleString("vi-VN") + "đ";
});

// Methods
const closeOverlay = () => emit("close");

const handleEdit = () => {
  emit("edit", props.reportData);
};

const handleDelete = () => {
  if (confirm("Bạn có chắc chắn muốn xóa báo cáo này không?")) {
    emit("delete", props.reportData?.id);
  }
};

// Watch for reportData changes
watch(
  () => props.reportData,
  (newData) => {
    if (newData) {
      loadReportData(newData);
    }
  },
  { immediate: true },
);
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
