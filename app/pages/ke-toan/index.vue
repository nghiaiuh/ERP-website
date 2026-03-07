<template>
  <NavigationBar sidebar-title="Kế toán"> </NavigationBar>
</template>

<script lang="ts" setup>
// Xác thực user
await useCheckUser();

// Cấu hình trang
definePageMeta({
  layout: false,
});
</script>
