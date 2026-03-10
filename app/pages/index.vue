<template>
  <NavigationBar sidebar-title="Trang Chủ">
    <!-- Dashboard Content -->
    <div
      class="h-[calc(100vh-78px)] flex items-center justify-center px-4 sm:px-6 lg:px-[25px]"
    >
      <!-- White Card Container -->
      <div
        class="mt-4 sm:mt-6 lg:mt-[30px] bg-white/80 rounded-2xl sm:rounded-[20px] lg:rounded-[25px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_2px_1px_0px_rgba(0,0,0,0.06),0px_1px_4px_0px_rgba(0,0,0,0.08)] w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[85%] xl:max-w-[90%] min-h-[60vh] sm:min-h-[55vh] lg:min-h-[90%] flex flex-col items-center py-6 sm:py-8 lg:py-0"
      >
        <!-- Title -->
        <h1
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-bold text-[#313232] text-center mb-4 mt-4 sm:mb-6 lg:mb-[20px] tracking-[-0.5px] sm:tracking-[-1px] [text-shadow:_0px_4px_4px_rgba(0,0,0,0.25)] px-4"
        >
          Bạn muốn tìm kiếm?
        </h1>

        <!-- Button Grid -->
        <div
          class="w-[75%] flex-1 px-3 sm:px-4 lg:px-1.5 py-2 sm:py-2 lg:py-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-x-1 xl:gap-x-1 lg:gap-y-1 overflow-y-auto overflow-x-hidden place-items-center"
        >
          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Tin tức tượng thú, sân vườn
            </span>
          </button>

          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Khách hàng tiềm năng
            </span>
          </button>

          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Thông tin đơn bán
            </span>
          </button>

          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Thông tin đặt hàng
            </span>
          </button>

          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Báo cáo tài chính
            </span>
          </button>

          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors cursor-pointer"
            @click="navigateTo('/ke-toan/thu-chi')"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Quản lý Thu - chi
            </span>
          </button>

          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Tồn kho
            </span>
          </button>

          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Tiến độ công việc
            </span>
          </button>

          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Bảng chấm công
            </span>
          </button>

          <button
            class="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-4 sm:py-4 lg:py-5 bg-[#313232] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] inline-flex justify-center items-center hover:bg-gray-800 transition-colors"
          >
            <span
              class="text-center justify-center text-zinc-100 text-lg sm:text-xl lg:text-2xl font-medium capitalize leading-5 sm:leading-4"
            >
              Nghiệm thu dự án
            </span>
          </button>
        </div>
      </div>
    </div>
  </NavigationBar>
</template>

<script lang="ts" setup>
await useCheckUser();
definePageMeta({
  layout: false,
});
</script>
