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
            <h2 class="text-[20px] font-bold text-[#101828] leading-[28px]">
              SỔ CHI TIẾT DOANH THU BÁN HÀNG HOÁ, DỊCH VỤ
            </h2>
            <p class="mt-2 text-[14px] text-[#4a5565] leading-[20px]">
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

          <div>
            <label class="block text-[14px] text-[#364153] mb-2">
              Ngành nghề kinh doanh
            </label>
            <input
              v-model="formData.businessSector"
              type="text"
              placeholder="Nhập ngành nghề kinh doanh"
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
              Kỳ kê khai
            </h3>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-[14px] text-[#364153] mb-2">
                Từ ngày <span class="text-[#fb2c36]">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="formData.fromDate"
                  type="date"
                  class="w-full h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] focus:border-[#155dfc] focus:outline-none"
                />
                <img
                  src="/icon/calendar.svg"
                  alt="calendar"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-[14px] text-[#364153] mb-2">
                Đến ngày <span class="text-[#fb2c36]">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="formData.toDate"
                  type="date"
                  class="w-full h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] focus:border-[#155dfc] focus:outline-none"
                />
                <img
                  src="/icon/calendar.svg"
                  alt="calendar"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-[14px] text-[#364153] mb-2">
                Địa điểm
              </label>
              <input
                v-model="formData.location"
                type="text"
                placeholder="Nhập địa điểm"
                class="w-full h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
              />
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
              class="bg-[#f9fafb] border-b border-[#e5e7eb] px-5 py-4 grid grid-cols-[100px_90px_1fr_110px_130px_110px] gap-2"
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
              class="bg-[rgba(239,246,255,0.3)] border-b-2 border-t-2 border-[#bedbff] px-5 py-3 grid grid-cols-[100px_90px_1fr_110px_130px_110px] gap-2"
            >
              <input
                v-model="newRevenue.documentNumber"
                type="text"
                placeholder="VD: HD001"
                class="h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
              />
              <input
                v-model="newRevenue.date"
                type="text"
                placeholder="7/2/2026"
                class="h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none text-center"
              />
              <input
                v-model="newRevenue.description"
                type="text"
                placeholder="Mô tả chi phí"
                class="h-9 px-3 py-2.5 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
              />
              <input
                v-model="newRevenue.amount"
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

            <!-- Empty State or Revenue List -->
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
                class="border-b border-[#e5e7eb] px-5 py-3 grid grid-cols-[100px_90px_1fr_110px_130px_110px] gap-2 items-center hover:bg-gray-50"
              >
                <div class="text-[14px] text-[#101828]">
                  {{ revenue.documentNumber }}
                </div>
                <div class="text-[14px] text-[#101828] text-center">
                  {{ revenue.date }}
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
          Nộp báo cáo
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
  fromDate: string;
  toDate: string;
  location: string;
}

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", data: { formData: FormData; revenues: RevenueItem[] }): void;
}>();

// Form data
const formData = ref<FormData>({
  businessName: "",
  taxCode: "",
  address: "",
  businessSector: "",
  fromDate: "",
  toDate: "",
  location: "",
});

// New revenue input
const newRevenue = ref<RevenueItem>({
  documentNumber: "",
  date: "",
  description: "",
  amount: "",
  category: "",
});

// List of added revenues
const revenues = ref<RevenueItem[]>([]);

// Methods
const closeOverlay = () => {
  emit("close");
};

const addRevenue = () => {
  if (
    newRevenue.value.documentNumber &&
    newRevenue.value.date &&
    newRevenue.value.description &&
    newRevenue.value.amount
  ) {
    revenues.value.push({ ...newRevenue.value });
    // Reset form
    newRevenue.value = {
      documentNumber: "",
      date: "",
      description: "",
      amount: "",
      category: "",
    };
  }
};

const removeRevenue = (index: number) => {
  revenues.value.splice(index, 1);
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    goods: "Hàng hóa",
    service: "Dịch vụ",
    other: "Khác",
  };
  return labels[category] || category;
};

const submitReport = () => {
  // Validate required fields
  if (
    !formData.value.businessName ||
    !formData.value.taxCode ||
    !formData.value.address ||
    !formData.value.fromDate ||
    !formData.value.toDate
  ) {
    alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
    return;
  }

  if (revenues.value.length === 0) {
    alert("Vui lòng thêm ít nhất một doanh thu");
    return;
  }

  emit("submit", {
    formData: formData.value,
    revenues: revenues.value,
  });
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
  opacity: 0;
  position: absolute;
  right: 12px;
  cursor: pointer;
}
</style>
