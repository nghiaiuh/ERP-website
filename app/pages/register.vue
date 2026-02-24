<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-center text-gray-900">
          Create Account
        </h1>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="submitForm">
        <div class="space-y-4">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              v-model="form.username"
              type="text"
              id="username"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ success }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Registering...</span>
            <span v-else>Register</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const loading = ref(false);

const form = reactive({
  username: "",
  email: "",
  password: "",
});

async function submitForm() {
  error.value = null;
  success.value = null;

  // Client-side validation
  if (!form.username || !form.email || !form.password) {
    error.value = "All fields are required";
    return;
  }

  if (form.password.length < 6) {
    error.value = "Password must be at least 6 characters long";
    return;
  }

  loading.value = true;

  try {
    const result = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: form.username,
        email: form.email,
        password: form.password,
      },
    });

    success.value = "Registration successful! Redirecting to login...";

    // Clear form
    form.username = "";
    form.email = "";
    form.password = "";

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err: any) {
    console.error("Registration error:", err);

    // Handle different error types
    if (err.statusCode === 409) {
      error.value = "An account with this email already exists";
    } else if (err.data?.statusMessage) {
      error.value = err.data.statusMessage;
    } else if (err.statusMessage) {
      error.value = err.statusMessage;
    } else {
      error.value = "Registration failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
