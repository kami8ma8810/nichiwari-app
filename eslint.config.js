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
  ignores: [
    'docs/**',
    'depreciation-calculator-requirements.md',
  ],
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
}, {
  // 設定ファイル専用の設定
  files: ['*.config.ts', '*.config.js'],
  rules: {
    'node/prefer-global/process': 'off', // 設定ファイルではprocess使用OK
    'ts/no-require-imports': 'off', // Tailwind設定等でrequire使用OK
  },
})
