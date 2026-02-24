<template>
  <div class="bg-[#f7f9fb] min-h-screen relative">
    <!-- Left Sidebar -->
    <LeftSidebar :title="sidebarTitle" @sidebar-toggled="handleSidebarToggle" />

    <!-- Top Navigation Header -->
    <TopNavigation :user="user" :sidebar-collapsed="isSidebarCollapsed" />

    <!-- Main Content Area (Slot for page content) -->
    <main
      :class="[
        'pt-[78px] flex-1 overflow-hidden transition-all duration-300 ease-in-out',
        isSidebarCollapsed ? 'ml-[80px]' : 'ml-[277px]',
      ]"
    >
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
// Define props for sidebar title
const props = defineProps<{
  sidebarTitle?: string;
}>();

// Set default sidebar title
const sidebarTitle = computed(() => props.sidebarTitle || "Trang Chủ");

// Track sidebar state
const isSidebarCollapsed = ref(false);

// Handle sidebar toggle event
const handleSidebarToggle = (collapsed: boolean) => {
  isSidebarCollapsed.value = collapsed;
};

// Authentication logic
const token = useCookie("jwt_token");
const { data: user, refresh } = await useAsyncData<JwtUserInfo | null>(
  "navbar-user",
  async () => {
    if (!token.value) return null;

    try {
      const result = await $fetch<{ success: boolean; user: JwtUserInfo }>(
        "/api/auth/verifyToken",
        {
          method: "POST",
          body: { token: token.value },
        },
      );

      return result.success ? result.user : null;
    } catch {
      return null;
    }
  },
);

// Watch token changes
watch(token, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    refresh();
  }
});
</script>
