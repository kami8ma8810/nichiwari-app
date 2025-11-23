---
title: Phase 4 - 機能改善と最適化
category: implementation
dependencies: [phase-3-backend.md, ../01-requirements/non-functional.md]
phase: 4
last-updated: 2024-11-22
---

# Phase 4 - 機能改善と最適化

## 1. 概要

### 1.1 Phase 4の目標

```yaml
目標:
  - パフォーマンス最適化
  - UX改善
  - アクセシビリティ強化
  - PWA機能実装

期間: 2日

成果物:
  - 最適化されたバンドル
  - PWA機能
  - 改善されたUX
  - A11y対応
```

## 2. パフォーマンス最適化

### 2.1 バンドルサイズ削減

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', '@vue/runtime-dom'],
            'vendor-ui': ['@primevue/core', '@primevue/volt'],
            'vendor-utils': ['valibot', '@vueuse/core']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', '@primevue/core']
    }
  },

  // Tree shaking
  imports: {
    transform: {
      exclude: [/\bBadRequestError\b/]
    }
  },

  // 画像最適化
  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  }
})
```

### 2.2 コード分割

```vue
<!-- 動的インポート -->
<script setup lang="ts">
// 重いコンポーネントは遅延読み込み
const HeavyChart = defineAsyncComponent(() =>
  import('@/components/analytics/HeavyChart.vue')
)

// 条件付き読み込み
const { isAnalyticsEnabled } = useFeatureFlags()

const AnalyticsPanel = isAnalyticsEnabled.value
  ? defineAsyncComponent(() =>
      import('@/components/analytics/AnalyticsPanel.vue')
    )
  : null
</script>
```

### 2.3 メモリ最適化

```typescript
// composables/useMemoryOptimized.ts
export function useMemoryOptimized() {
  // WeakMapでメモリリーク防止
  const cache = new WeakMap()

  // 大量データの仮想スクロール
  const virtualList = ref<VirtualList>()

  // 不要なリスナーの削除
  const cleanup = () => {
    window.removeEventListener('resize', handleResize)
    observer?.disconnect()
  }

  onUnmounted(cleanup)

  // メモリ使用量監視
  const monitorMemory = () => {
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize
      const limit = performance.memory.jsHeapSizeLimit

      if (used / limit > 0.9) {
        console.warn('Memory usage high:', `${(used / 1024 / 1024).toFixed(2)}MB`)
        // キャッシュクリア
        cache.clear()
      }
    }
  }

  return {
    cache,
    virtualList,
    cleanup,
    monitorMemory
  }
}
```

## 3. UX改善

### 3.1 ローディング状態

```vue
<!-- components/common/LoadingState.vue -->
<script setup lang="ts">
defineProps<{
  type?: 'skeleton' | 'progress' | 'spinner'
  progress?: number
  progressText?: string
}>()
</script>

<template>
  <div class="loading-container">
    <!-- スケルトンスクリーン -->
    <div v-if="type === 'skeleton'" class="animate-pulse">
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      <div class="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div class="h-4 bg-gray-200 rounded w-5/6" />
    </div>

    <!-- プログレスバー -->
    <div v-else-if="type === 'progress'" class="w-full">
      <div class="bg-gray-200 rounded-full h-2">
        <div
          class="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
          :style="{ width: `${progress}%` }"
        />
      </div>
      <p class="text-center mt-2 text-sm text-gray-600">
        {{ progressText }}
      </p>
    </div>

    <!-- スピナー -->
    <div v-else class="flex justify-center items-center">
      <svg class="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  </div>
</template>
```

### 3.2 エラー処理UI

```vue
<!-- components/common/ErrorBoundary.vue -->
<script setup lang="ts">
const error = ref<Error | null>(null)
const errorMessage = computed(() =>
  error.value?.message || '予期せぬエラーが発生しました'
)

function retry() {
  error.value = null
  window.location.reload()
}

onErrorCaptured((err) => {
  error.value = err
  return false
})
</script>

<template>
  <div v-if="error" class="error-boundary">
    <div class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            エラーが発生しました
          </h3>
          <p class="mt-2 text-sm text-red-700">
            {{ errorMessage }}
          </p>
          <div class="mt-4">
            <button
              class="text-sm font-medium text-red-600 hover:text-red-500"
              @click="retry"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <slot v-else />
</template>
```

### 3.3 トースト通知

```typescript
// composables/useToast.ts
export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  const show = (options: ToastOptions) => {
    const id = Date.now().toString()
    const toast: Toast = {
      id,
      ...options,
      createdAt: new Date()
    }

    toasts.value.push(toast)

    // 自動削除
    if (options.duration !== 0) {
      setTimeout(() => {
        remove(id)
      }, options.duration || 5000)
    }
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts: readonly(toasts),
    success: (message: string) => show({ type: 'success', message }),
    error: (message: string) => show({ type: 'error', message }),
    warning: (message: string) => show({ type: 'warning', message }),
    info: (message: string) => show({ type: 'info', message }),
    remove
  }
}
```

## 4. アクセシビリティ強化

### 4.1 フォーカス管理

```typescript
// composables/useFocusManagement.ts
export function useFocusManagement() {
  const focusTrap = ref<HTMLElement>()
  const lastFocusedElement = ref<HTMLElement>()

  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab')
        return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      }
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }

  const restoreFocus = () => {
    lastFocusedElement.value?.focus()
  }

  return {
    trapFocus,
    restoreFocus,
    saveFocus: () => {
      lastFocusedElement.value = document.activeElement as HTMLElement
    }
  }
}
```

### 4.2 ARIA実装

```vue
<!-- components/common/AccessibleModal.vue -->
<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  closeLabel?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement>()
const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`
const descriptionId = `modal-desc-${Math.random().toString(36).substr(2, 9)}`

const { trapFocus, restoreFocus, saveFocus } = useFocusManagement()

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    saveFocus()
    nextTick(() => {
      if (modalRef.value) {
        trapFocus(modalRef.value)
      }
    })
  }
  else {
    restoreFocus()
  }
})

function handleOverlayClick() {
  emit('close')
}

// ESCキーでクローズ
onMounted(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close')
    }
  }
  document.addEventListener('keydown', handleEsc)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
  })
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <div
          ref="modalRef"
          role="dialog"
          :aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="descriptionId"
          class="modal-content"
          @click.stop
        >
          <button
            class="close-button"
            :aria-label="closeLabel"
            @click="close"
          >
            <span aria-hidden="true">×</span>
          </button>

          <h2 :id="titleId" class="modal-title">
            <slot name="title" />
          </h2>

          <div :id="descriptionId" class="modal-body">
            <slot />
          </div>

          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

### 4.3 スクリーンリーダー対応

```vue
<!-- components/common/ScreenReaderOnly.vue -->
<template>
  <span class="sr-only">
    <slot />
  </span>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
```

## 5. PWA機能実装

### 5.1 マニフェスト

```json
// public/manifest.json
{
  "name": "にちわり！買い物の価値を見える化",
  "short_name": "にちわり",
  "description": "購入価格を1日あたりの金額に変換して、買い物の価値を見える化するアプリ",
  "theme_color": "#f97316",
  "background_color": "#fff7ed",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "type": "image/png",
      "sizes": "1280x720",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "type": "image/png",
      "sizes": "750x1334",
      "form_factor": "narrow"
    }
  ],
  "categories": ["productivity", "utilities"]
}
```

### 5.2 インストールプロンプト

```vue
<!-- components/common/InstallPrompt.vue -->
<script setup lang="ts">
const showPrompt = ref(false)
const deferredPrompt = ref<any>(null)

onMounted(() => {
  // インストール可能イベントをリッスン
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e

    // 既にインストール済みかチェック
    if (!localStorage.getItem('install-dismissed')) {
      showPrompt.value = true
    }
  })

  // インストール成功
  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt.value = null
  })
})

async function install() {
  if (!deferredPrompt.value)
    return

  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    console.log('App installed')
  }

  deferredPrompt.value = null
  showPrompt.value = false
}

function dismiss() {
  localStorage.setItem('install-dismissed', 'true')
  showPrompt.value = false
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="showPrompt"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl p-4 z-50"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-gray-900">
            アプリをインストール
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            ホーム画面に追加してオフラインでも使えます
          </p>
          <div class="mt-3 flex gap-2">
            <button
              class="text-sm font-medium text-white bg-orange-500 px-3 py-1.5 rounded-md hover:bg-orange-600"
              @click="install"
            >
              インストール
            </button>
            <button
              class="text-sm font-medium text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-100"
              @click="dismiss"
            >
              後で
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
```

## 6. セキュリティ強化

### 6.1 CSP設定

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ['\'self\'', 'data:', 'https:'],
        'font-src': ['\'self\'', 'https:', 'data:'],
        'script-src': ['\'self\'', '\'unsafe-inline\''],
        'style-src': ['\'self\'', '\'unsafe-inline\''],
        'connect-src': ['\'self\'', 'https://*.supabase.co']
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true
      }
    }
  }
})
```

### 6.2 入力サニタイズ

```typescript
// utils/sanitizer.ts
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // HTMLタグ削除
    .replace(/javascript:/gi, '') // JavaScript実行防止
    .trim()
}

export function sanitizeNumber(input: any): number | null {
  const num = Number(input)
  if (isNaN(num) || !isFinite(num)) {
    return null
  }
  return num
}
```

## 7. 監視とログ

```typescript
// plugins/monitoring.client.ts
export default defineNuxtPlugin(() => {
  // パフォーマンス監視
  if (performance.mark) {
    performance.mark('app-init')

    onNuxtReady(() => {
      performance.mark('app-ready')
      performance.measure('app-load', 'app-init', 'app-ready')

      const measure = performance.getEntriesByName('app-load')[0]
      console.log(`App loaded in ${measure.duration}ms`)
    })
  }

  // エラー監視
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // Sentryなどに送信
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason)
    // Sentryなどに送信
  })
})
```

## 次のフェーズ

[Phase 5 - リリース準備](./phase-5-release.md)へ進む
