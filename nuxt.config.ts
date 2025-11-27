import { resolve } from 'node:path'
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

const rootDir = resolve(__dirname)

export default defineNuxtConfig({
  compatibilityDate: '2024-11-22',
  devtools: { enabled: true },

  alias: {
    '#root': rootDir,
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
    '@primevue/nuxt-module',
  ],

  primevue: {
    usePrimeVue: true,
    options: {
      unstyled: true, // Tailwind CSS でスタイリングするため
    },
    components: {
      include: ['ConfirmDialog', 'Button'],
    },
    composables: {
      include: ['useConfirm'],
    },
    directives: {
      include: [],
    },
    autoImport: true,
  },

  css: [
    '@/assets/css/main.css',
  ],

  typescript: {
    strict: true,
    typeCheck: false, // 手動で実行（pnpm typecheck）
    shim: false,
  },

  nitro: {
    preset: 'vercel',
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  },

  experimental: {
    payloadExtraction: false, // SSG最適化
  },

  vite: {
    plugins: [tailwindcss()],
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },

  app: {
    head: {
      title: 'にちわり！ - 買い物の価値を見える化',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '購入価格を1日あたりの金額に変換して、買い物の価値を見える化するアプリ' },
        // Open Graph
        { property: 'og:title', content: 'にちわり！ - 買い物の価値を見える化' },
        { property: 'og:description', content: '高い買い物も1日あたりで考えれば意外とお得かも？購入価格を日割り計算して、買い物の価値を見える化するアプリです。' },
        { property: 'og:image', content: 'https://nichiwari-app.vercel.app/ogp-image.png' },
        { property: 'og:url', content: 'https://nichiwari-app.vercel.app/' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ja_JP' },
        { property: 'og:site_name', content: 'にちわり！' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'にちわり！ - 買い物の価値を見える化' },
        { name: 'twitter:description', content: '高い買い物も1日あたりで考えれば意外とお得かも？' },
        { name: 'twitter:image', content: 'https://nichiwari-app.vercel.app/ogp-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    },
  },

  ssr: false, // SPAモード（オフライン対応のため）

  imports: {
    dirs: [
      resolve(rootDir, 'stores'),
      resolve(rootDir, 'domain/**'),
      resolve(rootDir, 'application/**'),
      resolve(rootDir, 'presentation/composables'),
      resolve(rootDir, 'presentation/stores'),
    ],
  },

  components: [
    {
      path: resolve(rootDir, 'presentation/components'),
      pathPrefix: false,
    },
  ],
})
