<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Danh sách Users</h1>
      <p class="text-gray-600 mb-6">Dữ liệu từ bảng users trong database</p>
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
      </div>
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
      >
        <p class="text-red-800">❌ Lỗi: {{ error.message }}</p>
      </div>
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <p class="text-blue-900 font-semibold">
            Tổng số users: <span class="text-2xl">{{ usersData.length }}</span>
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Username
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày tạo
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cập nhật
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="user in usersData"
                :key="user.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ user.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.username || "-" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.updatedAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="usersData.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">Chưa có user nào trong database</p>
        </div>
      </div>
      <details class="mt-6 bg-gray-100 rounded-lg p-4">
        <summary class="cursor-pointer font-semibold text-gray-700">
          📋 Xem Raw Data (JSON)
        </summary>
        <pre class="mt-4 bg-white p-4 rounded border overflow-auto text-xs">{{
          users
        }}</pre>
      </details>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createClient } from "@supabase/supabase-js";

type AboutUser = {
  id: number;
  email: string;
  username: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const config = useRuntimeConfig();
const users = ref<AboutUser[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);

const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey,
);

const usersData = computed(() => users.value);

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  const { data, error: supabaseError } = await supabase
    .from("users")
    .select("id, email, username, created_at, updated_at")
    .order("id", { ascending: true });

  if (supabaseError) {
    error.value = new Error(supabaseError.message);
    console.error("Lỗi khi lấy dữ liệu từ Supabase:", supabaseError);
  } else {
    users.value = (data ?? []).map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));
    console.log("Dữ liệu users từ Supabase:", data);
  }

  pending.value = false;
});
</script>
