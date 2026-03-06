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
                {{ props.editData ? "CHỈNH SỬA" : "TẠO MỚI" }} SỔ CHI TIẾT DOANH
                THU BÁN HÀNG HOÁ, DỊCH VỤ
              </h2>
              <span
                v-if="props.editData"
                class="px-2 py-0.5 rounded-lg text-[12px] bg-orange-100 text-orange-700 border border-orange-200"
              >
                Chế độ chỉnh sửa
              </span>
            </div>
            <p class="text-[14px] text-[#4a5565] leading-[20px]">
              Mẫu số S1a-HKD | Theo Thông tư 152/2025/TT-BTC ngày 31/12/2025
            </p>
          </div>
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded opacity-70 hover:opacity-100 transition-opacity"
            @click="closeOverlay"
          >
            <img src="/icon/close.svg" alt="Close" class="w-6 h-6" />
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
                Tên doanh nghiệp <span class="text-[#fb2c36]">*</span>
              </label>
              <input
                v-model="formData.businessName"
                type="text"
                placeholder="Nhập tên doanh nghiệp"
                class="w-full h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[14px] text-[#364153] mb-2">
                Mã số thuế <span class="text-[#fb2c36]">*</span>
              </label>
              <input
                v-model="formData.taxCode"
                type="text"
                placeholder="Nhập mã số thuế"
                class="w-full h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-[14px] text-[#364153] mb-2">
              Địa chỉ <span class="text-[#fb2c36]">*</span>
            </label>
            <input
              v-model="formData.address"
              type="text"
              placeholder="Nhập địa chỉ doanh nghiệp"
              class="w-full h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
            />
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
                Mẫu số <span class="text-[#fb2c36]">*</span>
              </label>
              <select
                v-model="formData.templateCode"
                class="w-full h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] focus:border-[#155dfc] focus:outline-none appearance-none cursor-pointer"
              >
                <option
                  value="S1a-HKD | Theo Thông tư 152/2025/TT-BTC ngày 31/12/2025"
                >
                  Mẫu số S1a-HKD | Theo Thông tư 152/2025/TT-BTC ngày 31/12/2025
                </option>
              </select>
            </div>
            <div>
              <label class="block text-[14px] text-[#364153] mb-2">
                Ngày tháng <span class="text-[#fb2c36]">*</span>
              </label>
              <select
                v-model="formData.periodRange"
                class="w-full h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] focus:border-[#155dfc] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="2024-01-01|2025-01-01">
                  1/1/2024 - 1/1/2025
                </option>
                <option value="2025-01-01|2026-01-01">
                  1/1/2025 - 1/1/2026
                </option>
                <option value="2026-01-01|2027-01-01">
                  1/1/2026 - 1/1/2027
                </option>
                <option value="2027-01-01|2028-01-01">
                  1/1/2027 - 1/1/2028
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Revenue Detail Table Section -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-5 bg-[#155dfc] rounded-full"></div>
            <h3 class="text-[16px] font-bold text-[#101828] leading-[24px]">
              Bảng chi tiết chi phí
            </h3>
          </div>

          <div class="border border-[#e5e7eb] rounded-[10px] overflow-hidden">
            <!-- Table Header -->
            <div
              class="bg-[#f9fafb] border-b border-[#e5e7eb] px-5 py-4 grid grid-cols-[100px_110px_165px_110px_130px_110px] gap-2"
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
              <div
                class="text-[12px] font-bold text-[#364153] uppercase tracking-wider text-center"
              >
                Thao tác
              </div>
            </div>

            <!-- Input Row -->
            <div
              class="bg-[rgba(239,246,255,0.3)] border-b-2 border-t-2 border-[#bedbff] px-5 py-3 grid grid-cols-[100px_110px_165px_110px_130px_110px] gap-2"
            >
              <input
                v-model="newRevenue.documentNumber"
                type="text"
                placeholder="VD: HD001"
                class="h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
              />
              <input
                v-model="newRevenue.date"
                type="date"
                class="h-9 px-1 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none text-center"
              />
              <input
                v-model="newRevenue.description"
                type="text"
                placeholder="Mô tả chi phí"
                class="h-9 px-3 py-2.5 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
              />
              <input
                v-model="newRevenue.amount"
                @input="onAmountInput"
                type="text"
                placeholder="20.000.000đ"
                class="h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none text-right"
              />
              <div class="relative">
                <select
                  v-model="newRevenue.category"
                  class="w-full h-9 px-3 py-1 pr-8 border border-transparent bg-white rounded-lg text-[14px] text-[#717182] focus:border-[#155dfc] focus:outline-none appearance-none"
                >
                  <option value="">Chọn loại</option>
                  <option value="goods">Hàng hóa</option>
                  <option value="service">Dịch vụ</option>
                  <option value="other">Khác</option>
                </select>
                <svg
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <button
                type="button"
                @click="addRevenue"
                class="bg-[#155dfc] text-white px-2.5 py-1.5 rounded-lg text-[14px] flex items-center justify-center gap-2 hover:bg-[#0d4cd9] transition-colors"
              >
                <img
                  src="/icon/check.svg"
                  alt="add"
                  class="w-4 h-4 invert brightness-0"
                />
                Thêm
              </button>
            </div>

            <div v-if="revenues.length === 0" class="px-[211px] py-10">
              <p class="text-center text-[14px] text-[#6a7282] leading-[20px]">
                Chưa có doanh thu nào. Vui lòng thêm doanh thu bằng các ô trống
                phía trên.
              </p>
            </div>

            <!-- Revenue List -->
            <div v-else class="bg-white">
              <div
                v-for="(revenue, index) in revenues"
                :key="index"
                class="border-b border-[#e5e7eb] px-5 py-3 grid grid-cols-[100px_110px_165px_110px_130px_110px] gap-2 items-center hover:bg-gray-50"
              >
                <div class="text-[14px] text-[#101828]">
                  {{ revenue.documentNumber }}
                </div>
                <div class="text-[14px] text-[#101828] text-center">
                  {{ formatDate(revenue.date) }}
                </div>
                <div class="text-[14px] text-[#101828]">
                  {{ revenue.description }}
                </div>
                <div class="text-[14px] text-[#101828] text-right">
                  {{ revenue.amount }}
                </div>
                <div class="text-[14px] text-[#101828]">
                  {{ getCategoryLabel(revenue.category) }}
                </div>
                <button
                  type="button"
                  @click="removeRevenue(index)"
                  class="text-[#fb2c36] text-[14px] hover:underline"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-[#e5e7eb] px-6 py-3 flex justify-center">
        <button
          type="button"
          @click="submitReport"
          class="bg-[#155dfc] text-white px-4 py-2 rounded-lg text-[14px] hover:bg-[#0d4cd9] transition-colors"
        >
          {{ props.editData ? "Cập nhật báo cáo" : "Nộp báo cáo" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RevenueItem {
  documentNumber: string;
  date: string;
  description: string;
  amount: string;
  category: string;
}

interface FormData {
  businessName: string;
  taxCode: string;
  address: string;
  businessSector: string;
  templateCode: string;
  periodRange: string;
}

const props = defineProps<{
  isVisible: boolean;
  editData?: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", data: any): void;
}>();

// Constants
const STORAGE_KEY = "revenueReportLastOptions";

const getDefaultFormData = (): FormData => {
  // Load từ localStorage nếu có
  if (process.client) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          businessName:
            parsed.businessName || "Cơ sở Điêu Khắc Trang Trí Vĩnh Tiến",
          taxCode: parsed.taxCode || "042179006886",
          address: parsed.address || "1955, xã Bình Minh, tỉnh Đồng Nai",
          businessSector: parsed.businessSector || "",
          templateCode:
            parsed.templateCode ||
            "S1a-HKD | Theo Thông tư 152/2025/TT-BTC ngày 31/12/2025",
          periodRange: parsed.periodRange || "2025-01-01|2026-01-01",
        };
      } catch (e) {
        console.error("Error loading saved options:", e);
      }
    }
  }

  // Giá trị mặc định nếu không có trong localStorage
  return {
    businessName: "Cơ sở Điêu Khắc Trang Trí Vĩnh Tiến",
    taxCode: "042179006886",
    address: "1955, xã Bình Minh, tỉnh Đồng Nai",
    businessSector: "",
    templateCode: "S1a-HKD | Theo Thông tư 152/2025/TT-BTC ngày 31/12/2025",
    periodRange: "2025-01-01|2026-01-01",
  };
};

const EMPTY_REVENUE_ITEM: RevenueItem = {
  documentNumber: "",
  date: "",
  description: "",
  amount: "",
  category: "",
};

const CATEGORY_LABELS: Record<string, string> = {
  goods: "Hàng hóa",
  service: "Dịch vụ",
  other: "Khác",
};

// Form data
const formData = ref<FormData>(getDefaultFormData());

// New revenue input
const newRevenue = ref<RevenueItem>({ ...EMPTY_REVENUE_ITEM });

// List of added revenues
const revenues = ref<RevenueItem[]>([]);

// Helper Functions
const formatAmountInput = (value: string) => {
  const numericValue = value.replace(/[^0-9]/g, "");
  return numericValue ? parseInt(numericValue).toLocaleString("vi-VN") : "";
};

const parseAmount = (amountString: string) =>
  parseFloat(amountString.replace(/[.,đ\s]/g, "")) || 0;

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  return parts.length === 3 && parts[0] && parts[1] && parts[2]
    ? `${parts[2]}-${parts[1]}-${parts[0]}`
    : dateString;
};

const getCategoryLabel = (category: string) =>
  CATEGORY_LABELS[category] || category;

const saveToLocalStorage = (data: FormData) => {
  if (process.client) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving options:", e);
    }
  }
};

const resetForm = () => {
  formData.value = getDefaultFormData();
  revenues.value = [];
};

const createReportItem = (rev: RevenueItem) => {
  const amount = parseAmount(rev.amount);
  return {
    documentNumber: rev.documentNumber,
    documentDate: rev.date,
    category: rev.category || "other",
    itemName: rev.description,
    description: `${rev.documentNumber} - ${rev.date}`,
    quantity: 1,
    unit: "lần",
    unitPrice: amount,
    amount,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: amount,
  };
};

// Methods
const closeOverlay = () => emit("close");

const addRevenue = () => {
  const { documentNumber, date, description, amount } = newRevenue.value;
  if (documentNumber && date && description && amount) {
    revenues.value.push({ ...newRevenue.value });
    newRevenue.value = { ...EMPTY_REVENUE_ITEM };
  }
};

const onAmountInput = (event: Event) => {
  const rawValue = (event.target as HTMLInputElement).value;
  const numericValue = rawValue.replace(/[^0-9]/g, "");
  newRevenue.value.amount = numericValue ? formatAmountInput(rawValue) : "";
};

const removeRevenue = (index: number) => revenues.value.splice(index, 1);

const submitReport = () => {
  const { businessName, taxCode, address, templateCode, periodRange } =
    formData.value;

  if (!businessName || !taxCode || !address || !templateCode || !periodRange) {
    alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
    return;
  }

  if (revenues.value.length === 0) {
    alert("Vui lòng thêm ít nhất một doanh thu");
    return;
  }

  const [fromDate, toDate] = periodRange.split("|");
  if (!fromDate || !toDate) {
    alert("Vui lòng chọn kỳ báo cáo hợp lệ");
    return;
  }

  const items = revenues.value.map(createReportItem);
  const totalRevenue = items.reduce((sum, item) => sum + item.amount, 0);
  const title = `Báo cáo doanh thu ${new Date(fromDate).toLocaleDateString("vi-VN")} - ${new Date(toDate).toLocaleDateString("vi-VN")}`;

  // Lưu lựa chọn hiện tại vào localStorage (chỉ khi tạo mới)
  if (!props.editData) {
    saveToLocalStorage(formData.value);
  }

  const reportData: any = {
    title,
    periodStart: fromDate,
    periodEnd: toDate,
    totalRevenue,
    totalTax: 0,
    netRevenue: totalRevenue,
    status: "submitted",
    notes: `Doanh nghiệp: ${businessName} - MST: ${taxCode}`,
    metadata: {
      businessName,
      taxCode,
      address,
      businessSector: formData.value.businessSector,
      templateCode,
      documentType: "S1a-HKD",
      regulation: "Thông tư 152/2025/TT-BTC",
    },
    items,
  };

  // Nếu là chỉnh sửa, thêm id vào
  if (props.editData?.id) {
    reportData.id = props.editData.id;
  }

  emit("submit", reportData);
  resetForm();
};

// Check giá trị trước
watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      // Nếu có editData, load từ editData
      if (props.editData) {
        loadEditData();
      } else {
        // Nếu không có editData, load từ localStorage
        formData.value = getDefaultFormData();
        revenues.value = [];
      }
    } else {
      // Khi đóng overlay, reset form
      resetForm();
    }
  },
);

// Load data từ editData khi chỉnh sửa
const loadEditData = () => {
  if (!props.editData) return;

  const { metadata, items, periodStart, periodEnd } = props.editData;

  if (metadata) {
    formData.value = {
      businessName: metadata.businessName || "",
      taxCode: metadata.taxCode || "",
      address: metadata.address || "",
      businessSector: metadata.businessSector || "",
      templateCode: metadata.templateCode || "",
      periodRange: `${periodStart}|${periodEnd}`,
    };
  }

  if (items && Array.isArray(items)) {
    revenues.value = items.map((item: any) => ({
      documentNumber: item.documentNumber || "",
      date: item.documentDate ? item.documentDate.split("T")[0] : "",
      description: item.itemName || "",
      amount: item.amount.toLocaleString("vi-VN") || "",
      category: item.category || "",
    }));
  }
};
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

/* Date input styling */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 1;
  width: 16px;
  height: 16px;
}

input[type="date"] {
  position: relative;
}
</style>
