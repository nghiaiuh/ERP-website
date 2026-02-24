<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="pointer-events-auto bg-white rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-[607px] h-[calc(100vh-32px)] flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div
        class="bg-white border-b border-[#e5e7eb] flex flex-col gap-4 px-6 pt-6 pb-1"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-[#101828] text-[20px] font-bold">
                Chi tiết hóa đơn
              </h2>
              <div
                class="bg-[#dcfce7] border border-transparent rounded-[8px] px-2 py-0.5 flex items-center gap-1"
              >
                <img src="/icon/check.svg" alt="check" class="w-3 h-3" />
                <span class="text-[#008236] text-[12px]">Đã xử lý</span>
              </div>
            </div>
            <p class="text-[#4a5565] text-[14px]">
              Thông tin được trích xuất tự động bằng OCR
            </p>
          </div>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-gray-100 transition-colors"
            @click="close"
          >
            <img src="/icon/close.svg" alt="close" class="w-4 h-4" />
          </button>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-2 pb-1">
          <button
            type="button"
            class="bg-white border border-[#8ec5ff] rounded-[8px] px-3 py-2 flex items-center gap-2 text-[#1447e6] text-[14px] hover:bg-[#eff6ff] transition-colors"
          >
            <img src="/icon/edit.svg" alt="edit" class="w-4 h-4" />
            Chỉnh sửa
          </button>
          <button
            type="button"
            class="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-3 py-2 flex items-center gap-2 text-[#0a0a0a] text-[14px] hover:bg-gray-50 transition-colors"
          >
            <img src="/icon/download.svg" alt="download" class="w-4 h-4" />
            Tải xuống
          </button>
          <button
            type="button"
            class="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-3 py-2 flex items-center gap-2 text-[#0a0a0a] text-[14px] hover:bg-gray-50 transition-colors"
          >
            <img src="/icon/print.svg" alt="print" class="w-4 h-4" />
            In
          </button>
          <button
            type="button"
            class="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-3 py-2 flex items-center gap-2 text-[#e7000b] text-[14px] hover:bg-red-50 transition-colors"
          >
            <img src="/icon/trash.svg" alt="delete" class="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-6 pt-6 pb-6 space-y-6">
        <!-- Invoice Image -->
        <div
          class="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-[#0a0a0a] text-[16px]">Ảnh hóa đơn gốc</h3>
            <button
              type="button"
              class="flex items-center gap-2 text-[#0a0a0a] text-[14px] hover:text-[#155dfc] transition-colors"
            >
              <img src="/icon/zoom.svg" alt="zoom" class="w-4 h-4" />
              Phóng to
            </button>
          </div>
          <div
            class="bg-[#f3f4f6] rounded-[10px] h-[314px] flex items-center justify-center"
          >
            <p class="text-[#6a7282] text-[14px]">Invoice preview</p>
          </div>
        </div>

        <!-- Basic Information -->
        <div
          class="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6"
        >
          <div class="flex items-center gap-2 mb-6">
            <img src="/icon/document.svg" alt="document" class="w-4 h-4" />
            <h3 class="text-[#0a0a0a] text-[16px]">Thông tin cơ bản</h3>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="flex items-center gap-1 mb-2">
                  <img src="/icon/hash.svg" alt="hash" class="w-3.5 h-3.5" />
                  <label class="text-[#364153] text-[14px]">Số hóa đơn</label>
                </div>
                <div
                  class="bg-[#f9fafb] rounded-[4px] px-2 py-2 text-[#101828] text-[14px]"
                >
                  HD001-2025
                </div>
              </div>
              <div>
                <div class="flex items-center gap-1 mb-2">
                  <img
                    src="/icon/calendar.svg"
                    alt="calendar"
                    class="w-3.5 h-3.5"
                  />
                  <label class="text-[#364153] text-[14px]"
                    >Ngày phát hành</label
                  >
                </div>
                <div
                  class="bg-[#f9fafb] rounded-[4px] px-2 py-2 text-[#101828] text-[14px]"
                >
                  1/2/2025
                </div>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-1 mb-2">
                <img
                  src="/icon/building.svg"
                  alt="building"
                  class="w-3.5 h-3.5"
                />
                <label class="text-[#364153] text-[14px]">Nhà cung cấp</label>
              </div>
              <div
                class="bg-[#f9fafb] rounded-[4px] px-2 py-2 text-[#101828] text-[14px]"
              >
                Công ty TNHH ABC
              </div>
            </div>
            <div>
              <div class="flex items-center gap-1 mb-2">
                <img src="/icon/tag.svg" alt="tag" class="w-3.5 h-3.5" />
                <label class="text-[#364153] text-[14px]">Phân loại</label>
              </div>
              <div
                class="bg-[#f9fafb] rounded-[4px] px-2 py-2 text-[#101828] text-[14px]"
              >
                Vật tư văn phòng
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Information -->
        <div
          class="bg-[rgba(239,246,255,0.3)] border-2 border-[#dbeafe] rounded-[14px] p-6"
        >
          <div class="flex items-center gap-2 mb-6">
            <img src="/icon/dollar-sign.svg" alt="dollar" class="w-4 h-4" />
            <h3 class="text-[#0a0a0a] text-[16px]">Thông tin tài chính</h3>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[#364153] text-[14px] block mb-2"
                  >Giá trị trước thuế</label
                >
                <div
                  class="bg-white rounded-[4px] px-2 py-2 text-[#101828] text-[18px] font-bold"
                >
                  15.000.000 ₫
                </div>
              </div>
              <div>
                <div class="flex items-center gap-1 mb-2">
                  <img
                    src="/icon/percent.svg"
                    alt="percent"
                    class="w-3.5 h-3.5"
                  />
                  <label class="text-[#364153] text-[14px]">Thuế VAT</label>
                </div>
                <div
                  class="bg-white rounded-[4px] px-2 py-2 text-[#101828] text-[18px] font-bold"
                >
                  1.500.000 ₫
                </div>
              </div>
            </div>
            <div
              class="border-t-2 border-[#bedbff] pt-4 flex items-center justify-between"
            >
              <span class="text-[#364153] text-[14px]">Tổng giá trị:</span>
              <span class="text-[#155dfc] text-[20px] font-bold"
                >16.500.000 ₫</span
              >
            </div>
          </div>
        </div>

        <!-- OCR Results -->
        <div
          class="bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] border border-[#b9f8cf] rounded-[14px] p-5"
        >
          <div class="flex items-start gap-3">
            <div
              class="bg-[#00a63e] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0"
            >
              <img src="/icon/check.svg" alt="check" class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <h3 class="text-[#101828] text-[14px] font-bold mb-1">
                Kết quả OCR
              </h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-[#364153] text-[12px]">Độ tin cậy:</span>
                  <span class="text-[#008236] text-[12px] font-bold"
                    >98.5%</span
                  >
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[#364153] text-[12px]"
                    >Thời gian xử lý:</span
                  >
                  <span class="text-[#364153] text-[12px]">2.3 giây</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[#364153] text-[12px]"
                    >Số trường trích xuất:</span
                  >
                  <span class="text-[#364153] text-[12px]">12 trường</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Actions -->
        <div
          class="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6"
        >
          <h3 class="text-[#0a0a0a] text-[16px] mb-6">Thao tác khác</h3>
          <div class="space-y-2">
            <button
              type="button"
              class="w-full bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-3 py-2 flex items-center justify-center gap-2 text-[#0a0a0a] text-[14px] hover:bg-gray-50 transition-colors"
            >
              <img src="/icon/copy.svg" alt="copy" class="w-4 h-4" />
              Sao chép thông tin
            </button>
            <button
              type="button"
              class="w-full bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-3 py-2 flex items-center justify-center gap-2 text-[#0a0a0a] text-[14px] hover:bg-gray-50 transition-colors"
            >
              <img src="/icon/mail.svg" alt="mail" class="w-4 h-4" />
              Gửi email
            </button>
            <button
              type="button"
              class="w-full bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-3 py-2 flex items-center justify-center gap-2 text-[#0a0a0a] text-[14px] hover:bg-gray-50 transition-colors"
            >
              <img src="/icon/document.svg" alt="document" class="w-4 h-4" />
              Tạo báo cáo từ hóa đơn này
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const close = () => {
  emit("close");
};
</script>
