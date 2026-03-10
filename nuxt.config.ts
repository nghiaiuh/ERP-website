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
    jwtSecret: process.env.JWT_SECRET
  },

  modules: ["@nuxt/image"]
})