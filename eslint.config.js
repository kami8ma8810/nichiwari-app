import process from 'node:process'
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  formatters: {
    css: true,
    html: true,
    markdown: true,
  },
  rules: {
    // TypeScript規約
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',

    // Vue規約
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',

    // 一般規約
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}, {
  // テストファイル専用の設定
  files: ['**/*.test.ts', '**/*.spec.ts'],
  rules: {
    'no-new': 'off', // テストファイルでは new の副作用使用を許可
  },
})
