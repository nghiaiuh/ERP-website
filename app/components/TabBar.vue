<template>
  <div
    class="bg-[#ececf0] rounded-[33px] h-[75px] flex items-center justify-center gap-7 mb-8 max-w-[981px] mx-auto px-1"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.key"
      :to="tab.path"
      :class="[
        'px-10 py-2 rounded-[32px] font-medium text-[19px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
        isActive(tab.path)
          ? 'bg-black text-white'
          : 'bg-white text-black hover:bg-gray-50',
      ]"
      role="tab"
      :aria-selected="isActive(tab.path)"
      :aria-current="isActive(tab.path) ? 'page' : undefined"
      @keydown.left.prevent="navigateTab('prev')"
      @keydown.right.prevent="navigateTab('next')"
    >
      {{ tab.label }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  key: string;
  label: string;
  path: string;
}

interface Props {
  tabs: Tab[];
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: "Navigation tabs",
});

const route = useRoute();

// Check if a tab is active based on current route
const isActive = (path: string): boolean => {
  return route.path === path;
};

// Keyboard navigation
const navigateTab = async (direction: "prev" | "next") => {
  const currentIndex = props.tabs.findIndex((tab) => isActive(tab.path));
  if (currentIndex === -1) return;

  let nextIndex: number;
  if (direction === "prev") {
    nextIndex = currentIndex > 0 ? currentIndex - 1 : props.tabs.length - 1;
  } else {
    nextIndex = currentIndex < props.tabs.length - 1 ? currentIndex + 1 : 0;
  }

  await navigateTo(props.tabs[nextIndex].path);
};
</script>

<style scoped>
/* Component uses Tailwind classes, no additional styles needed */
</style>
