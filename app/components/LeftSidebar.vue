<template>
  <aside
    :class="[
      'bg-white fixed left-0 top-0 h-screen shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)] overflow-y-auto z-50 transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-[80px]' : 'w-[277px]',
    ]"
  >
    <div
      :class="[
        'gap-2 flex items-center pt-[26px] pb-[44px] transition-all duration-300',
        isCollapsed ? 'px-4' : 'px-9',
      ]"
    >
      <div
        :class="[
          'h-[42px] w-[54px] relative flex-shrink-0 transition-[transform,opacity] duration-300 ease-in-out',
          isCollapsed ? 'scale-90' : 'scale-100',
        ]"
      >
        <img
          src="/img/logo.png"
          alt="Logo"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        :class="[
          'overflow-hidden transition-[opacity,transform,max-width] duration-300 ease-in-out',
          isCollapsed
            ? 'opacity-0 max-w-0 -translate-x-2 pointer-events-none'
            : 'opacity-100 max-w-[180px] translate-x-0',
        ]"
        :aria-hidden="isCollapsed ? 'true' : 'false'"
      >
        <p
          class="font-bold text-[16px] text-[#1c1c1c] leading-[24px] whitespace-nowrap"
        >
          VĨNH TIẾN ERP
        </p>
      </div>
    </div>

    <!-- Sidebar Header -->
    <div
      :class="[
        'flex items-center mb-[14px] transition-all duration-300',
        isCollapsed ? 'justify-center px-4' : 'px-[46px] gap-4',
      ]"
    >
      <!-- ✨ Hamburger button with click handler -->
      <button
        @click="toggleSidebar"
        :class="[
          'flex-shrink-0 hover:opacity-70 transition-all duration-300',
          isCollapsed ? 'w-[24px] h-[24px] flex items-center justify-center' : '',
        ]"
        :title="isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'"
      >
        <img
          src="/icon/hamburger-menu.svg"
          alt="hamburger menu"
          :class="[
            'transition-all duration-300',
            isCollapsed ? 'w-[24px] h-[24px]' : 'w-[20px] h-[20px]',
          ]"
        />
      </button>

      <!-- Title (responsive size based on text length) -->
      <h2
        :class="[
          'font-semibold text-[#130101] whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out',
          isCollapsed
            ? 'opacity-0 max-w-0 -translate-x-2 pointer-events-none'
            : 'opacity-100 max-w-[180px] translate-x-0',
          titleSizeClass,
        ]"
        :aria-hidden="isCollapsed ? 'true' : 'false'"
        v-text="title"
      />
    </div>

    <!-- Menu Items -->
    <nav
      :class="[
        'space-y-2 py-8 transition-all duration-300',
        isCollapsed ? 'px-4' : 'px-[24px]',
      ]"
    >
      <a
        v-for="item in menuItems"
        :key="item.label"
        :href="item.href"
        :class="[
          'flex items-center rounded-lg transition-all duration-300',
          isCollapsed ? 'justify-center px-4 py-3' : 'gap-3 px-6 py-3',
          item.active ? 'bg-[#ebeef0]' : 'hover:bg-[#ebeef0]',
        ]"
        :title="isCollapsed ? item.label : ''"
      >
        <!-- Icon (always visible) -->
        <img
          :src="item.icon"
          :alt="item.label"
          :class="[
            'flex-shrink-0 transition-all duration-300',
            item.active ? 'w-[16.67px] h-[16.67px]' : 'w-4 h-4',
          ]"
        />

        <!-- Text (hidden when collapsed) -->
        <span
          v-show="!isCollapsed"
          class="text-[16px] font-medium text-[#111] whitespace-nowrap transition-opacity duration-300"
        >
          {{ item.label }}
        </span>
      </a>
    </nav>
  </aside>
</template>

<script lang="ts" setup>

const props = defineProps<{
  title?: string;
}>();

const title = computed(() => props.title || "Trang Chủ");

const titleSizeClass = computed(() => {
  const length = title.value.length;
  if (length <= 10) return "text-[24px]";
  if (length <= 15) return "text-[20px]";
  if (length <= 20) return "text-[17px]";
  return "text-[14px]";
});

// Define emits
const emit = defineEmits<{
  "sidebar-toggled": [collapsed: boolean];
}>();

// Sidebar collapse state
const isCollapsed = ref(false);

// Toggle function with emit
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  emit("sidebar-toggled", isCollapsed.value);
};

// Get current route
const route = useRoute();

// Menu items configuration
const menuItems = computed(() => [
  {
    label: "Trang chủ",
    icon: "/icon/trang_chu.svg",
    href: "/",
    active: route.path === "/" || route.path === "/",
  },
  {
    label: "Bán hàng",
    icon: "/icon/ban_hang.svg",
    href: "#",
    active: false,
  },
  {
    label: "Marketing",
    icon: "/icon/marketing.svg",
    href: "#",
    active: false,
  },
  {
    label: "Dự án thi công",
    icon: "/icon/du_an_thi_cong.svg",
    href: "#",
    active: false,
  },
  {
    label: "Quản lý kho",
    icon: "/icon/quan_ly_kho.svg",
    href: "#",
    active: false,
  },
  {
    label: "Kế toán & tài chính",
    icon: "/icon/ke_toan.svg",
    href: "/ke-toan/thu-chi",
    active: route.path.startsWith("/ke-toan"),
  },
  {
    label: "Nhân sự",
    icon: "/icon/nhan_su.svg",
    href: "#",
    active: false,
  },
  {
    label: "Tiến độ & sản xuất",
    icon: "/icon/tien_do.svg",
    href: "#",
    active: false,
  },
  {
    label: "Tài liệu",
    icon: "/icon/document.svg",
    href: "#",
    active: false,
  },
]);
</script>
