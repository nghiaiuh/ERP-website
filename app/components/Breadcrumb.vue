<template>
  <nav v-if="breadcrumbs.length > 0" class="flex items-center gap-2">
    <template v-for="(item, index) in breadcrumbs" :key="index">
      <!-- parent -->
      <NuxtLink
        v-if="index === 0"
        :to="item.path"
        class="bg-[#1e0202] text-white px-2 py-1.5 rounded text-[16px] font-medium hover:bg-[#2e0303] transition-colors"
        :style="{ letterSpacing: '0.64px' }"
      >
        {{ item.label }}
      </NuxtLink>

      <template v-else>
        <!-- arrow -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5 text-gray-400"
        >
          <path
            fill-rule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clip-rule="evenodd"
          />
        </svg>
        <!-- children -->
        <NuxtLink
          :to="item.path"
          class="text-[#130101] text-[16px] font-medium hover:text-[#2a0202] transition-colors"
          :style="{ letterSpacing: '0.64px' }"
        >
          {{ item.label }}
        </NuxtLink>
      </template>
    </template>
  </nav>
</template>

<script setup lang="ts">

interface BreadcrumbItem {
  label: string;
  path: string;
}

const route = useRoute();

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  return (route.meta.breadcrumb as BreadcrumbItem[]) || [];
});
</script>
