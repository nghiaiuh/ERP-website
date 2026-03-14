import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  // https://nuxt.com/docs/api/configuration/nuxt-config
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    dbProvider: process.env.DB_PROVIDER || "drizzle",
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY
    }
  },

  modules: ["@nuxt/image"],
})