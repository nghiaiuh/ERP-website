<template>
  <NavigationBar sidebar-title="Kế toán & Tài chính">
    <div class="p-12 bg-[#f9fafb]">
      <TabBar :tabs="tabs" aria-label="Kế toán navigation" />
      <div class="mb-8">
        <h1 class="text-[#101828] text-[24px] font-bold mb-2">Quản lý Thuế</h1>
        <p class="text-[#4a5565] text-[16px]">
          Theo dõi và quản lý các khoản thuế của doanh nghiệp
        </p>
      </div>
    </div>
  </NavigationBar>
</template>

<script lang="ts" setup>
// Xác thực user
await useCheckUser();

// Tabs configuration
const tabs = useAccountingTabs();

// Cấu hình trang
definePageMeta({
  breadcrumb: [
    { label: "Kế toán & Tài chính", path: "/ke-toan" },
    { label: "Thuế", path: "/ke-toan/thue" },
  ],
  layout: false,
});
</script>
