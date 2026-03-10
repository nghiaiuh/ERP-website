<template>
  <div class="bg-white h-screen overflow-hidden">
    <div class="flex gap-6 items-center justify-center px-8 py-6 h-full">
      <div class="flex items-center justify-center flex-1 h-full">
        <div class="flex flex-col gap-6 items-start w-[380px]">
          <div class="flex flex-col gap-4 items-start whitespace-nowrap">
            <h1
              class="text-[28px] text-[#0c1421] text-center tracking-[0.28px] font-semibold"
            >
              Vĩnh Tiến ERP 👋
            </h1>
            <p
              class="text-[16px] text-[#313957] tracking-[0.16px] leading-[1.5] whitespace-normal"
            >
              Đăng nhập để bắt đầu công việc của bạn!
            </p>
          </div>
          <form
            class="flex flex-col gap-4 items-end justify-center w-full"
            @submit.prevent="submitForm"
          >
            <div class="flex flex-col gap-1.5 items-start w-full">
              <label
                for="email"
                class="text-[14px] text-[#0c1421] tracking-[0.14px]"
              >
                Email
              </label>
              <div class="relative w-full">
                <input
                  v-model="form.identifier"
                  type="text"
                  id="email"
                  required
                  class="bg-[#f7fbff] border border-[#d4d7e3] rounded-xl h-10 w-full px-4 text-[14px] tracking-[0.14px] placeholder-[#8897ad] focus:outline-none focus:border-[#1e4ae9] focus:ring-1 focus:ring-[#1e4ae9]"
                  placeholder="Example@email.com"
                />
              </div>
            </div>
            <div class="flex flex-col gap-1.5 items-start w-full">
              <label
                for="password"
                class="text-[14px] text-[#0c1421] tracking-[0.14px]"
              >
                Password
              </label>
              <div class="relative w-full">
                <input
                  v-model="form.password"
                  type="password"
                  id="password"
                  required
                  class="bg-[#f7fbff] border border-[#d4d7e3] rounded-xl h-10 w-full px-4 text-[14px] tracking-[0.14px] placeholder-[#8897ad] focus:outline-none focus:border-[#1e4ae9] focus:ring-1 focus:ring-[#1e4ae9]"
                  placeholder="At least 8 characters"
                />
              </div>
            </div>
            <a
              href="#"
              class="text-[14px] text-[#1e4ae9] tracking-[0.14px] text-center"
            >
              Quên mật khẩu
            </a>
            <div
              v-if="error"
              class="w-full rounded-xl bg-red-50 border border-red-200 p-3"
            >
              <p class="text-xs text-red-800">{{ error }}</p>
            </div>
            <div
              v-if="success"
              class="w-full rounded-xl bg-green-50 border border-green-200 p-3"
            >
              <p class="text-xs text-green-800">{{ success }}</p>
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="bg-[#162d3a] text-white text-[16px] tracking-[0.16px] py-3 rounded-xl w-full flex items-center justify-center hover:bg-[#1a3541] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Đang đăng nhập...</span>
              <span v-else>Sign in</span>
            </button>
          </form>
          <p class="text-[14px] text-center tracking-[0.14px] w-full">
            <span class="text-[#313957]">Bạn chưa có tài khoản? </span>
            <a href="#" class="text-[#1e4ae9]">Liên hệ</a>
          </p>
        </div>
      </div>
      <div class="flex items-center flex-1 h-full">
        <div class="w-full h-[100%] rounded-2xl overflow-hidden">
          <img
            src="/img/login-art.png"
            alt="Login Art"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const router = useRouter();
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const loading = ref(false);

const form = reactive({
  identifier: "",
  password: "",
});

async function submitForm() {
  error.value = null;
  success.value = null;

  if (!form.identifier || !form.password) {
    error.value = "All fields are required";
    return;
  }

  loading.value = true;
  try {
    const result = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        identifier: form.identifier,
        password: form.password,
      },
    });
    const tokenCookie = useCookie("jwt_token", {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    tokenCookie.value = result.token;

    console.log("JWT token:", result.token);
    success.value = "Login successful! Redirecting...";

    form.identifier = "";
    form.password = "";

    setTimeout(() => {
      navigateTo("/", { external: true });
    }, 1000);
  } catch (err: any) {
    console.error("Login error:", err);
    if (err.statusCode === 401) {
      error.value = "Invalid username/email or password";
    } else if (err.data?.statusMessage) {
      error.value = err.data.statusMessage;
    } else if (err.statusMessage) {
      error.value = err.statusMessage;
    } else {
      error.value = "Login failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
}
</script>
