---
title: オフライン対応戦略
category: architecture
dependencies: [functional.md, non-functional.md]
phase: 2, 4
last-updated: 2024-11-22
---

# オフライン対応戦略

## 1. オフライン対応の基本方針

### 1.1 対応レベル

```yaml
完全オフライン対応（Priority 1）:
  減価償却計算:
    - すべてクライアントサイドで実行
    - 外部API依存なし
    - 計算ロジックは純粋関数

  幸福度診断:
    - チェックリストはローカル定義
    - スコア計算はクライアント実装
    - 結果保存はlocalStorage

  基本UI/UX:
    - 全画面遷移可能
    - エラー表示対応
    - オフライン通知

オンライン時のみ（Priority 2）:
  データ収集:
    - 検索ログ送信
    - 使用統計記録
    - エラー報告

  トレンド機能:
    - リアルタイムランキング
    - 人気商品表示
    - 統計データ取得

ハイブリッド対応（Priority 3）:
  参考データベース:
    - 人気商品TOP30を事前バンドル
    - オンライン時に最新データ取得
    - キャッシュ有効期限: 7日間

  商品サジェスト:
    - オフライン: プリセットデータから提案
    - オンライン: リアルタイムサジェスト
    - フォールバック機構
```

## 2. Service Worker実装

### 2.1 Service Worker設定

```typescript
// public/sw.ts
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

const CACHE_VERSION = 'v1'
const STATIC_CACHE = `static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`
const DATA_CACHE = `data-${CACHE_VERSION}`

// キャッシュする静的ファイル
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/assets/styles.css',
  '/assets/app.js',
  '/data/presets.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
]

// インストールイベント
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static files')
      return cache.addAll(STATIC_FILES)
    })
  )
  self.skipWaiting()
})

// アクティベートイベント
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})
```

### 2.2 キャッシュ戦略

```typescript
// キャッシュ戦略の定義
interface CacheStrategy {
  pattern: RegExp
  strategy: 'CacheFirst' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate'
  cacheName: string
  expiration?: number
}

const cacheStrategies: CacheStrategy[] = [
  {
    pattern: /\.(js|css|png|jpg|jpeg|svg|gif|webp)$/,
    strategy: 'CacheFirst',
    cacheName: STATIC_CACHE,
    expiration: 30 * 24 * 60 * 60 * 1000 // 30日
  },
  {
    pattern: /^\/api\/products/,
    strategy: 'NetworkFirst',
    cacheName: DATA_CACHE,
    expiration: 5 * 60 * 1000 // 5分
  },
  {
    pattern: /^\/api\/trends/,
    strategy: 'NetworkOnly',
    cacheName: DYNAMIC_CACHE
  },
  {
    pattern: /\/data\/presets\.json$/,
    strategy: 'StaleWhileRevalidate',
    cacheName: DATA_CACHE,
    expiration: 7 * 24 * 60 * 60 * 1000 // 7日
  }
]

// フェッチイベント
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 適切な戦略を選択
  const strategy = getStrategy(url.pathname)

  if (strategy) {
    event.respondWith(handleRequest(request, strategy))
  }
})

async function handleRequest(
  request: Request,
  strategy: CacheStrategy
): Promise<Response> {
  switch (strategy.strategy) {
    case 'CacheFirst':
      return cacheFirst(request, strategy)
    case 'NetworkFirst':
      return networkFirst(request, strategy)
    case 'NetworkOnly':
      return networkOnly(request)
    case 'StaleWhileRevalidate':
      return staleWhileRevalidate(request, strategy)
    default:
      return fetch(request)
  }
}
```

### 2.3 キャッシュ戦略実装

```typescript
// Cache First戦略
async function cacheFirst(
  request: Request,
  strategy: CacheStrategy
): Promise<Response> {
  const cache = await caches.open(strategy.cacheName)
  const cached = await cache.match(request)

  if (cached) {
    // キャッシュ有効期限チェック
    const cachedDate = new Date(cached.headers.get('date') || 0)
    const now = new Date()
    const age = now.getTime() - cachedDate.getTime()

    if (!strategy.expiration || age < strategy.expiration) {
      return cached
    }
  }

  // キャッシュがない、または期限切れ
  try {
    const response = await fetch(request)
    if (response.status === 200) {
      await cache.put(request, response.clone())
    }
    return response
  }
  catch (error) {
    // オフライン時はキャッシュを返す
    if (cached)
      return cached
    throw error
  }
}

// Network First戦略
async function networkFirst(
  request: Request,
  strategy: CacheStrategy
): Promise<Response> {
  const cache = await caches.open(strategy.cacheName)

  try {
    const response = await fetch(request)
    if (response.status === 200) {
      await cache.put(request, response.clone())
    }
    return response
  }
  catch (error) {
    // ネットワークエラー時はキャッシュを使用
    const cached = await cache.match(request)
    if (cached)
      return cached

    // キャッシュもない場合はオフライン応答
    return new Response(
      JSON.stringify({ error: 'Offline', message: 'データを取得できません' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Stale While Revalidate戦略
async function staleWhileRevalidate(
  request: Request,
  strategy: CacheStrategy
): Promise<Response> {
  const cache = await caches.open(strategy.cacheName)
  const cached = await cache.match(request)

  // キャッシュがあれば即座に返す
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  })

  return cached || fetchPromise
}
```

## 3. プリセットデータ設計

### 3.1 プリセットデータ構造

```typescript
// public/data/presets.json
{
  "version": "1.0.0",
  "lastUpdated": "2024-11-22",
  "products": [
    {
      "id": "preset-001",
      "name": "iPhone 15 Pro",
      "price": 159800,
      "years": 3,
      "category": "ガジェット",
      "icon": "📱",
      "popularity": 95
    },
    // ... 他29商品
  ],
  "categories": {
    "家電": {
      "count": 10,
      "avgPrice": 192000,
      "avgYears": 9.8
    },
    // ... 他カテゴリ
  },
  "tips": [
    {
      "id": "tip-001",
      "title": "経験 vs 物質",
      "content": "経験への投資は物質的な購入より長期的な幸福度向上につながります。",
      "source": "Gilovich & Kumar, 2015"
    }
    // ... 他Tips
  ]
}
```

### 3.2 プリセットデータ管理

```typescript
// src/infrastructure/services/PresetDataService.ts
export class PresetDataService {
  private static instance: PresetDataService
  private presetData: PresetData | null = null
  private lastFetch: Date | null = null

  static getInstance(): PresetDataService {
    if (!PresetDataService.instance) {
      PresetDataService.instance = new PresetDataService()
    }
    return PresetDataService.instance
  }

  async loadPresetData(): Promise<PresetData> {
    // キャッシュチェック（1時間有効）
    if (this.presetData && this.lastFetch) {
      const age = Date.now() - this.lastFetch.getTime()
      if (age < 60 * 60 * 1000) {
        return this.presetData
      }
    }

    try {
      const response = await fetch('/data/presets.json')
      this.presetData = await response.json()
      this.lastFetch = new Date()
      return this.presetData
    }
    catch (error) {
      // フォールバック: ハードコードされたデータ
      return this.getFallbackData()
    }
  }

  private getFallbackData(): PresetData {
    return {
      version: '1.0.0',
      lastUpdated: '2024-11-22',
      products: [
        {
          id: 'fallback-001',
          name: 'ノートパソコン',
          price: 150000,
          years: 5,
          category: '家電',
          icon: '💻',
          popularity: 80
        }
        // 最小限のデータ
      ],
      categories: {},
      tips: []
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    const data = await this.loadPresetData()
    const normalizedQuery = query.toLowerCase()

    return data.products
      .filter(p =>
        p.name.toLowerCase().includes(normalizedQuery)
        || p.category.toLowerCase().includes(normalizedQuery)
      )
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10)
  }

  async getPopularProducts(limit: number = 10): Promise<Product[]> {
    const data = await this.loadPresetData()
    return data.products
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
  }
}
```

## 4. オフラインモード検出と管理

### 4.1 オフライン状態管理

```typescript
// src/presentation/composables/useOfflineMode.ts
export function useOfflineMode() {
  const isOffline = ref(false)
  const offlineSince = ref<Date | null>(null)
  const pendingActions = ref<PendingAction[]>([])

  // オフライン状態の検出
  const detectOffline = () => {
    isOffline.value = !navigator.onLine
    if (isOffline.value && !offlineSince.value) {
      offlineSince.value = new Date()
    }
    else if (!isOffline.value) {
      offlineSince.value = null
    }
  }

  // イベントリスナー設定
  onMounted(() => {
    detectOffline()
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  // オンライン復帰時の処理
  const handleOnline = async () => {
    isOffline.value = false
    offlineSince.value = null

    // 保留中のアクションを実行
    await syncPendingActions()

    // トースト通知
    showToast({
      type: 'success',
      message: 'オンラインに復帰しました',
      duration: 3000
    })
  }

  // オフライン移行時の処理
  const handleOffline = () => {
    isOffline.value = true
    offlineSince.value = new Date()

    // トースト通知
    showToast({
      type: 'warning',
      message: 'オフラインモードで動作中',
      duration: 5000
    })
  }

  // 保留アクションの同期
  const syncPendingActions = async () => {
    const actions = [...pendingActions.value]
    pendingActions.value = []

    for (const action of actions) {
      try {
        await executeAction(action)
      }
      catch (error) {
        console.error('Failed to sync action:', error)
        // 失敗したアクションは再度保留
        pendingActions.value.push(action)
      }
    }
  }

  // アクションの保留
  const queueAction = (action: PendingAction) => {
    pendingActions.value.push({
      ...action,
      timestamp: new Date()
    })

    // localStorageに保存
    localStorage.setItem(
      'pendingActions',
      JSON.stringify(pendingActions.value)
    )
  }

  return {
    isOffline: readonly(isOffline),
    offlineSince: readonly(offlineSince),
    pendingActions: readonly(pendingActions),
    queueAction,
    syncPendingActions
  }
}
```

### 4.2 オフラインUI通知

```vue
<!-- src/presentation/components/common/OfflineNotice.vue -->
<script setup lang="ts">
import { useOfflineMode } from '@/presentation/composables/useOfflineMode'

const { isOffline } = useOfflineMode()
const showDetails = ref(false)

function dismiss() {
  showDetails.value = false
}
</script>

<template>
  <Transition
    name="slide-down"
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="-translate-y-full opacity-0"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="isOffline"
      class="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-3 z-50 shadow-lg"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M3.707 2.293a1 1 0 00-1.414 1.414l6.921 6.922c.05.062.105.118.168.167l6.91 6.911a1 1 0 001.415-1.414l-.675-.675a9.001 9.001 0 00-.668-11.982A1 1 0 1014.95 5.05a7.002 7.002 0 01.657 9.143l-1.435-1.435a5.002 5.002 0 00-.596-6.342A1 1 0 0012.18 7.8a3 3 0 01.604 3.365l-1.474-1.474A1.002 1.002 0 0010 8.5a1 1 0 00-1.5 1.5l-1.396-1.396a2.999 2.999 0 00-3.396-3.396L3.707 2.293zM10 18a8 8 0 01-5.292-14.292l1.435 1.435a6 6 0 108.469 8.468l1.436 1.436A8 8 0 0110 18z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">
            オフラインモードで動作中
          </span>
          <span class="text-sm opacity-90">
            一部の機能が制限されています
          </span>
        </div>
        <button
          class="text-white hover:text-yellow-200 transition-colors"
          aria-label="通知を閉じる"
          @click="dismiss"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div
        v-if="showDetails"
        class="container mx-auto mt-2 text-sm opacity-90"
      >
        <ul class="list-disc list-inside">
          <li>計算機能は通常通り利用できます</li>
          <li>検索データの送信は再接続時に行われます</li>
          <li>最新のトレンド情報は表示されません</li>
        </ul>
      </div>
    </div>
  </Transition>
</template>
```

## 5. データ同期戦略

### 5.1 ローカルストレージ管理

```typescript
// src/infrastructure/services/LocalStorageService.ts
export class LocalStorageService {
  private readonly prefix = 'nichiwari_'

  // 計算履歴の保存
  saveCalculationHistory(calculation: CalculationResult): void {
    const key = `${this.prefix}history`
    const existing = this.getCalculationHistory()
    existing.unshift(calculation)

    // 最大100件まで保持
    if (existing.length > 100) {
      existing.pop()
    }

    localStorage.setItem(key, JSON.stringify(existing))
  }

  getCalculationHistory(): CalculationResult[] {
    const key = `${this.prefix}history`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  // 幸福度診断結果の保存
  saveHappinessScore(score: EvaluationResult): void {
    const key = `${this.prefix}happiness_${Date.now()}`
    localStorage.setItem(key, JSON.stringify(score))

    // 古い結果を削除（30日以上前）
    this.cleanOldHappinessScores()
  }

  private cleanOldHappinessScores(): void {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const keys = Object.keys(localStorage)

    keys
      .filter(key => key.startsWith(`${this.prefix}happiness_`))
      .forEach((key) => {
        const timestamp = Number.parseInt(key.split('_')[2])
        if (timestamp < thirtyDaysAgo) {
          localStorage.removeItem(key)
        }
      })
  }

  // 設定の保存
  saveSettings(settings: AppSettings): void {
    const key = `${this.prefix}settings`
    localStorage.setItem(key, JSON.stringify(settings))
  }

  getSettings(): AppSettings | null {
    const key = `${this.prefix}settings`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
}
```

### 5.2 データ同期サービス

```typescript
// src/infrastructure/services/SyncService.ts
export class SyncService {
  constructor(
    private localStorage: LocalStorageService,
    private supabase: SupabaseClient
  ) {}

  async syncData(): Promise<SyncResult> {
    const result: SyncResult = {
      synced: 0,
      failed: 0,
      errors: []
    }

    // オフライン中に蓄積されたデータを取得
    const pendingData = this.getPendingData()

    for (const item of pendingData) {
      try {
        await this.syncItem(item)
        result.synced++
        this.markAsSynced(item.id)
      }
      catch (error) {
        result.failed++
        result.errors.push({
          itemId: item.id,
          error: error.message
        })
      }
    }

    return result
  }

  private async syncItem(item: PendingItem): Promise<void> {
    switch (item.type) {
      case 'search_log':
        await this.syncSearchLog(item.data)
        break
      case 'calculation':
        await this.syncCalculation(item.data)
        break
      case 'happiness_score':
        await this.syncHappinessScore(item.data)
        break
      default:
        throw new Error(`Unknown sync type: ${item.type}`)
    }
  }

  private async syncSearchLog(data: any): Promise<void> {
    const { error } = await this.supabase
      .from('search_logs')
      .insert(data)

    if (error)
      throw error
  }

  private async syncCalculation(data: any): Promise<void> {
    const { error } = await this.supabase
      .from('calculation_history')
      .insert(data)

    if (error)
      throw error
  }

  private getPendingData(): PendingItem[] {
    const key = 'nichiwari_pending_sync'
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  private markAsSynced(itemId: string): void {
    const pending = this.getPendingData()
    const updated = pending.filter(item => item.id !== itemId)
    localStorage.setItem('nichiwari_pending_sync', JSON.stringify(updated))
  }
}
```

## 関連ドキュメント

- [非機能要件](../01-requirements/non-functional.md) - オフライン要件
- [アーキテクチャ概要](./overview.md) - 全体設計
- [Phase 4: 拡張機能](../05-implementation/phase-4-features.md) - PWA実装
- [サンプルデータ](../07-reference/sample-data.md) - プリセットデータ詳細
