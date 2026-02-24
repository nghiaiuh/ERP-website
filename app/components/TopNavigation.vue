<template>
  <header
    :class="[
      'bg-white border-b border-[rgba(0,0,0,0.12)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.12)] h-[80px] fixed top-0 right-0 z-40 flex items-center px-6 transition-all duration-300 ease-in-out',
      sidebarCollapsed ? 'left-[80px]' : 'left-[277px]',
    ]"
  >
    <!-- Breadcrumb Navigation -->
    <Breadcrumb />

    <!-- Right group -->
    <div class="ml-auto flex items-center gap-6">
      <!-- Search -->
      <div
        class="w-[384px] h-[40px] bg-[#f7f9fb] rounded-lg flex items-center px-3 gap-2"
      >
        <img src="/icon/search.svg" alt="search" class="w-5 h-5" />

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search or type a command (Ctrl + G)"
          class="flex-1 bg-transparent outline-none text-[#969696] text-[14px]"
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- Notification -->
      <button class="relative" @click="handleNotificationClick">
        <img
          src="/icon/notifications.svg"
          alt="notification bell"
          class="w-6 h-6"
        />
        <span
          v-if="notificationCount > 0"
          class="absolute -top-1 -right-1 bg-[#e92c2c] text-white text-[10px] font-semibold rounded-full min-w-[16px] h-[16px] flex items-center justify-center"
        >
          {{ notificationCount }}
        </span>
      </button>

      <!-- User -->
      <div
        class="flex items-center gap-2 cursor-pointer"
        @click="handleUserClick"
      >
        <div
          class="w-8 h-8 rounded-full bg-[rgba(0,133,255,0.1)] flex items-center justify-center"
        >
          <span class="text-[#0085ff] text-[14px] font-medium">
            {{ userInitial }}
          </span>
        </div>

        <span class="text-[#1c1c1c] text-[16px] font-medium">
          {{ user?.username || "Admin" }}
        </span>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
// Define props
const props = defineProps<{
  user?: JwtUserInfo | null;
  sidebarCollapsed?: boolean;
}>();

// Search functionality
const searchQuery = ref("");

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log("Searching for:", searchQuery.value);
    // TODO: Implement search functionality
  }
};

// Notification functionality
const notificationCount = ref(2);

const handleNotificationClick = () => {
  console.log("Notification clicked");
  // TODO: Implement notification panel
};

// User functionality
const handleUserClick = () => {
  console.log("User profile clicked");
  // TODO: Implement user menu dropdown
};

// Get user initial for avatar
const userInitial = computed(() => {
  if (props.user?.username) {
    return props.user.username.charAt(0).toUpperCase();
  }
  if (props.user?.email) {
    return props.user.email.charAt(0).toUpperCase();
  }
  return "U";
});

// Future: Add functions for:
// - Search autocomplete
// - Notification panel
// - User dropdown menu
// - Logout functionality
// - Profile settings
</script>
