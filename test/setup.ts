import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Nuxt auto-imports モック
vi.stubGlobal('defineNuxtPlugin', vi.fn())
vi.stubGlobal('useState', vi.fn())
vi.stubGlobal('useRuntimeConfig', vi.fn(() => ({
  public: {
    supabaseUrl: 'http://localhost:54321',
    supabaseAnonKey: 'test-key',
    appUrl: 'http://localhost:3000',
  },
})))

// Vue Test Utils設定
config.global.mocks = {
  $t: (key: string) => key,
}
