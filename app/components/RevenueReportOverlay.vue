<template>
  <!-- =========================== -->
  <!-- KHUNG OVERLAY CHÍNH -->
  <!-- =========================== -->
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    role="dialog"
    aria-modal="true"
    @click.self="closeOverlay"
  >
    <!-- Container chính của overlay -->
    <div
      class="relative w-full max-w-[864px] rounded-[10px] border border-black/10 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
    >
      <!-- =========================== -->
      <!-- PHẦN HEADER (TIÊU ĐỀ) -->
      <!-- =========================== -->
      <div
        class="border-b border-[#e5e7eb] bg-white px-6 pt-6 pb-[25px] rounded-t-[10px]"
      >
        <div class="flex items-start justify-between">
          <!-- Phần tiêu đề và nhãn trạng thái -->
          <div>
            <div class="flex items-center gap-2 mb-1">
              <!-- Tiêu đề động (tạo mới hoặc chỉnh sửa) -->
              <h2 class="text-[20px] font-bold text-[#101828] leading-[28px]">
                {{ props.editData ? "CHỈNH SỬA" : "TẠO MỚI" }} SỔ CHI TIẾT DOANH
                THU BÁN HÀNG HOÁ, DỊCH VỤ
              </h2>
              <!-- Badge chế độ chỉnh sửa -->
              <span
                v-if="props.editData"
                class="px-2 py-0.5 rounded-lg text-[12px] bg-orange-100 text-orange-700 border border-orange-200"
              >
                Chế độ chỉnh sửa
              </span>
            </div>
            <!-- Thông tin mẫu số -->
            <p class="text-[14px] text-[#4a5565] leading-[20px]">
              Mẫu số {{ formData.templateCode }}
            </p>
          </div>
          <!-- Nút đóng overlay -->
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded opacity-70 hover:opacity-100 transition-opacity"
            @click="closeOverlay"
          >
            <img src="/icon/close.svg" alt="Close" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- =========================== -->
      <!-- PHẦN NỘI DUNG CHÍNH -->
      <!-- =========================== -->
      <div class="px-6 py-[23px] max-h-[calc(100vh-200px)] overflow-y-auto">
        <!-- ============================================ -->
        <!-- KHUNG 1: THÔNG TIN DOANH NGHIỆP -->
        <!-- ============================================ -->
        <div
          class="bg-[rgba(239,246,255,0.5)] border border-[#dbeafe] rounded-[10px] p-6 mb-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-5 bg-[#155dfc] rounded-full"></div>
            <h3 class="text-[16px] font-bold text-[#101828] leading-[24px]">
              Thông tin doanh nghiệp
            </h3>
          </div>

          <!-- Lưới 2 cột: Tên doanh nghiệp và Mã số thuế -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Cột 1: Tên doanh nghiệp -->
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
            <!-- Cột 2: Mã số thuế -->
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

          <!-- Trường địa chỉ (full width) -->
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

        <!-- ============================================ -->
        <!-- KHUNG 2: SỔ KÊ KHAI -->
        <!-- ============================================ -->
        <div
          class="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] p-6 mb-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-5 bg-[#155dfc] rounded-full"></div>
            <h3 class="text-[16px] font-bold text-[#101828] leading-[24px]">
              Sổ kê khai
            </h3>
          </div>

          <!-- Lưới 2 cột: Mẫu số và Ngày tháng -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Cột 1: Mẫu số -->
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
            <!-- Cột 2: Ngày tháng (kỳ báo cáo) -->
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

        <!-- ============================================ -->
        <!-- KHUNG 3: BẢNG CHI TIẾT DOANH THU -->
        <!-- ============================================ -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-5 bg-[#155dfc] rounded-full"></div>
            <h3 class="text-[16px] font-bold text-[#101828] leading-[24px]">
              Bảng chi tiết doanh thu
            </h3>
          </div>

          <!-- Container bảng doanh thu -->
          <div class="border border-[#e5e7eb] rounded-[10px] overflow-hidden">
            <!-- Header của bảng (các cột tiêu đề) -->
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

            <!-- Dòng nhập liệu (để thêm doanh thu mới) -->
            <div
              class="bg-[rgba(239,246,255,0.3)] border-b-2 border-t-2 border-[#bedbff] px-5 py-3 grid grid-cols-[100px_110px_165px_110px_130px_110px] gap-2"
            >
              <!-- Ô nhập số chứng từ -->
              <input
                v-model="newRevenue.documentNumber"
                type="text"
                placeholder="VD: HD001"
                class="h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
              />
              <!-- Ô chọn ngày -->
              <input
                v-model="newRevenue.date"
                type="date"
                class="h-9 px-1 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none text-center"
              />
              <!-- Ô nhập diễn giải -->
              <input
                v-model="newRevenue.description"
                type="text"
                placeholder="Mô tả chi phí"
                class="h-9 px-3 py-2.5 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none"
              />
              <!-- Ô nhập số tiền -->
              <input
                v-model="newRevenue.amount"
                @input="onAmountInput"
                type="text"
                placeholder="20.000.000đ"
                class="h-9 px-3 py-1 border border-transparent bg-white rounded-lg text-[14px] text-[#101828] placeholder:text-[#717182] focus:border-[#155dfc] focus:outline-none text-right"
              />
              <!-- Dropdown phân loại doanh thu -->
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
              <!-- Nút Thêm doanh thu -->
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

            <!-- Trạng thái rỗng (khi chưa có doanh thu nào) -->
            <div v-if="revenues.length === 0" class="px-[211px] py-10">
              <p class="text-center text-[14px] text-[#6a7282] leading-[20px]">
                Chưa có doanh thu nào. Vui lòng thêm doanh thu bằng các ô trống
                phía trên.
              </p>
            </div>

            <!-- Danh sách doanh thu (hiển thị khi đã có dữ liệu) -->
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

      <!-- =========================== -->
      <!-- PHẦN FOOTER (NÚT BẤM) -->
      <!-- =========================== -->
      <div class="border-t border-[#e5e7eb] px-6 py-3 flex justify-center">
        <!-- Nút Nộp báo cáo / Cập nhật báo cáo -->
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
// ====================================
// INTERFACES & TYPES
// ====================================

/** Interface cho một mục doanh thu */
interface RevenueItem {
  documentNumber: string; // Số chứng từ
  date: string; // Ngày tháng
  description: string; // Diễn giải
  amount: string; // Số tiền
  category: string; // Phân loại (hàng hóa, dịch vụ, khác)
}

/** Interface cho dữ liệu form */
interface FormData {
  businessName: string; // Tên doanh nghiệp
  taxCode: string; // Mã số thuế
  address: string; // Địa chỉ
  businessSector: string; // Ngành nghề kinh doanh
  templateCode: string; // Mẫu số
  periodRange: string; // Kỳ báo cáo (fromDate|toDate)
}

// ====================================
// PROPS & EMITS
// ====================================

/** Props nhận từ component cha */
const props = defineProps<{
  isVisible: boolean; // Hiển thị overlay hay không
  editData?: any; // Dữ liệu báo cáo để chỉnh sửa (nếu có)
}>();

/** Events emit về component cha */
const emit = defineEmits<{
  (e: "close"): void; // Đóng overlay
  (e: "submit", data: any): void; // Nộp báo cáo (tạo mới hoặc cập nhật)
}>();

// ====================================
// CONSTANTS (HẰNG SỐ)
// ====================================

/** Key để lưu trữ dữ liệu form trong localStorage */
const STORAGE_KEY = "revenueReportLastOptions";

/**
 * Lấy dữ liệu form mặc định từ localStorage hoặc giá trị cố định
 * @returns Dữ liệu form mặc định
 */
const getDefaultFormData = (): FormData => {
  // Tải từ localStorage nếu có
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

/** Template cho một mục doanh thu rỗng */
const EMPTY_REVENUE_ITEM: RevenueItem = {
  documentNumber: "",
  date: "",
  description: "",
  amount: "",
  category: "",
};

/** Danh sách nhãn phân loại doanh thu */
const CATEGORY_LABELS: Record<string, string> = {
  goods: "Hàng hóa",
  service: "Dịch vụ",
  other: "Khác",
};

// ====================================
// REACTIVE DATA (DỮ LIỆU PHẢN ỨNG)
// ====================================

/** Dữ liệu form (thông tin doanh nghiệp, kỳ báo cáo) */
const formData = ref<FormData>(getDefaultFormData());

/** Dữ liệu doanh thu mới đang nhập */
const newRevenue = ref<RevenueItem>({ ...EMPTY_REVENUE_ITEM });

/** Danh sách các doanh thu đã thêm */
const revenues = ref<RevenueItem[]>([]);

// ====================================
// HELPER FUNCTIONS (HÀM HỖ TRỢ)
// ====================================

/**
 * Format số tiền thành định dạng Việt Nam
 * @param value - Giá trị số cần format
 * @returns Chuỗi đã được format (không có đơn vị đ)
 */
const formatAmountInput = (value: string) => {
  const numericValue = value.replace(/[^0-9]/g, "");
  return numericValue ? parseInt(numericValue).toLocaleString("vi-VN") : "";
};

/**
 * Chuyển chuỗi số tiền đã format thành số
 * @param amountString - Chuỗi số tiền (có dấu phân cách)
 * @returns Giá trị số
 */
const parseAmount = (amountString: string) =>
  parseFloat(amountString.replace(/[.,đ\s]/g, "")) || 0;

/**
 * Format ngày tháng từ yyyy-mm-dd sang dd-mm-yyyy
 * @param dateString - Chuỗi ngày tháng dạng yyyy-mm-dd
 * @returns Chuỗi ngày tháng dạng dd-mm-yyyy
 */
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  return parts.length === 3 && parts[0] && parts[1] && parts[2]
    ? `${parts[2]}-${parts[1]}-${parts[0]}`
    : dateString;
};

/**
 * Lấy nhãn phân loại doanh thu từ mã phân loại
 * @param category - Mã phân loại
 * @returns Nhãn phân loại tiếng Việt
 */
const getCategoryLabel = (category: string) =>
  CATEGORY_LABELS[category] || category;

/**
 * Lưu dữ liệu form vào localStorage
 * @param data - Dữ liệu form cần lưu
 */
const saveToLocalStorage = (data: FormData) => {
  if (process.client) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving options:", e);
    }
  }
};

/**
 * Reset form về trạng thái mặc định
 */
const resetForm = () => {
  formData.value = getDefaultFormData();
  revenues.value = [];
};

/**
 * Tạo đối tượng mục báo cáo từ dữ liệu doanh thu
 * @param rev - Dữ liệu doanh thu
 * @returns Đối tượng mục báo cáo
 */
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

// ====================================
// METHODS (PHƯƠNG THỨC)
// ====================================

/** Đóng overlay */
const closeOverlay = () => emit("close");

/**
 * Thêm doanh thu mới vào danh sách
 */
const addRevenue = () => {
  const { documentNumber, date, description, amount } = newRevenue.value;
  if (documentNumber && date && description && amount) {
    revenues.value.push({ ...newRevenue.value });
    newRevenue.value = { ...EMPTY_REVENUE_ITEM };
  }
};

/**
 * Xử lý sự kiện nhập số tiền (format tự động)
 * @param event - Sự kiện input
 */
const onAmountInput = (event: Event) => {
  const rawValue = (event.target as HTMLInputElement).value;
  const numericValue = rawValue.replace(/[^0-9]/g, "");
  newRevenue.value.amount = numericValue ? formatAmountInput(rawValue) : "";
};

/**
 * Xóa doanh thu khỏi danh sách
 * @param index - Chỉ số của doanh thu cần xóa
 */
const removeRevenue = (index: number) => revenues.value.splice(index, 1);

/**
 * Xử lý nộp báo cáo (tạo mới hoặc cập nhật)
 */
const submitReport = () => {
  const { businessName, taxCode, address, templateCode, periodRange } =
    formData.value;

  // Validate các trường bắt buộc
  if (!businessName || !taxCode || !address || !templateCode || !periodRange) {
    alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
    return;
  }

  // Validate danh sách doanh thu
  if (revenues.value.length === 0) {
    alert("Vui lòng thêm ít nhất một doanh thu");
    return;
  }

  // Tách kỳ báo cáo
  const [fromDate, toDate] = periodRange.split("|");
  if (!fromDate || !toDate) {
    alert("Vui lòng chọn kỳ báo cáo hợp lệ");
    return;
  }

  // Tạo danh sách items và tính tổng doanh thu
  const items = revenues.value.map(createReportItem);
  const totalRevenue = items.reduce((sum, item) => sum + item.amount, 0);
  const title = `Báo cáo doanh thu ${new Date(fromDate).toLocaleDateString("vi-VN")} - ${new Date(toDate).toLocaleDateString("vi-VN")}`;

  // Lưu lựa chọn hiện tại vào localStorage (chỉ khi tạo mới)
  if (!props.editData) {
    saveToLocalStorage(formData.value);
  }

  // Tạo đối tượng báo cáo
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
      mauSo: templateCode,
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

// ====================================
// WATCHERS (THEO DÕI SỰ THAY ĐỔI)
// ====================================

/**
 * Theo dõi sự thay đổi của isVisible để load dữ liệu
 * hoặc reset form khi mở/đóng overlay
 */
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

/**
 * Load dữ liệu từ editData vào form (khi chỉnh sửa báo cáo)
 */
const loadEditData = () => {
  if (!props.editData) return;

  const { metadata, items, periodStart, periodEnd } = props.editData;

  if (metadata) {
    formData.value = {
      businessName: metadata.businessName || "",
      taxCode: metadata.taxCode || "",
      address: metadata.address || "",
      businessSector: metadata.businessSector || "",
      templateCode: metadata.mauSo || metadata.templateCode || "",
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
/* ====================================
   CUSTOM SCROLLBAR (THANH CUỘN TÙY CHỈNH)
   ==================================== */

/* Chiều rộng thanh cuộn */
::-webkit-scrollbar {
  width: 8px;
}

/* Track (đường ray) của thanh cuộn */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

/* Thumb (thanh kéo) của thanh cuộn */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

/* Thumb khi hover (di chuột qua) */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* ====================================
   DATE INPUT STYLING (ĐỊNH DẠNG Ô NHẬP NGÀY)
   ==================================== */

/* Icon lịch trong ô nhập ngày */
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
