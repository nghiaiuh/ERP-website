import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  ignores: [
    '.nuxt/**',
    '.output/**',
    'node_modules/**',
    'coverage/**',
    'drizzle/**',
  ],
}, {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'nuxt/prefer-import-meta': 'off',
    'prefer-const': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-unused-vars': 'warn',
    'vue/valid-template-root': 'off',
  },
})
