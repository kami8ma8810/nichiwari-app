---
title: Phase 3 - バックエンド連携
category: implementation
dependencies: [phase-2-ui.md, ../02-architecture/data-model.md]
phase: 3
last-updated: 2024-11-22
---

# Phase 3 - バックエンド連携

## 1. 概要

### 1.1 Phase 3の目標

```yaml
目標:
  - Supabase連携
  - データ永続化
  - リアルタイム機能
  - オフライン対応

期間: 2日

成果物:
  - Supabaseクライアント
  - リポジトリ実装
  - キャッシュ戦略
  - Service Worker
```

## 2. Supabaseクライアント設定

### 2.1 クライアント初期化

```typescript
import type { Database } from '@/types/database'
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    },
    global: {
      headers: {
        'x-application-name': 'nichiwari'
      }
    }
  }
)
```

### 2.2 Composable

```typescript
// composables/useSupabase.ts
export function useSupabase() {
  const supabase = useNuxtData('supabase')

  if (!supabase.value) {
    throw new Error('Supabase client not initialized')
  }

  return {
    supabase: supabase.value,
    user: useState('supabase-user', () => null)
  }
}
```

### 2.3 プラグイン

```typescript
// plugins/supabase.client.ts
export default defineNuxtPlugin(async () => {
  const { supabase } = useSupabase()

  // 匿名認証
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('Anonymous auth failed:', error)
    }
  }

  // セッション監視
  supabase.auth.onAuthStateChange((event, session) => {
    useState('supabase-user').value = session?.user || null
  })
})
```

## 3. リポジトリ実装

### 3.1 基底リポジトリ

```typescript
// infrastructure/repositories/BaseRepository.ts
import type { SupabaseClient } from '@supabase/supabase-js'

export abstract class BaseRepository<T> {
  constructor(
    protected supabase: SupabaseClient,
    protected tableName: string
  ) {}

  protected handleError(error: any): never {
    console.error(`Repository error in ${this.tableName}:`, error)
    throw new Error(error.message || 'Database operation failed')
  }

  async findAll(): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error)
      this.handleError(error)
    return data || []
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116')
        return null
      this.handleError(error)
    }
    return data
  }

  async create(item: Omit<T, 'id' | 'created_at'>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single()

    if (error)
      this.handleError(error)
    return data!
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(item)
      .eq('id', id)
      .select()
      .single()

    if (error)
      this.handleError(error)
    return data!
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)

    if (error)
      this.handleError(error)
  }
}
```

### 3.2 計算履歴リポジトリ

```typescript
import type { Calculation, CalculationDTO } from '@/types'
// infrastructure/repositories/CalculationRepository.ts
import { BaseRepository } from './BaseRepository'

export class CalculationRepository extends BaseRepository<CalculationDTO> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'calculations')
  }

  async saveCalculation(calculation: Calculation): Promise<CalculationDTO> {
    const dto: Omit<CalculationDTO, 'id' | 'created_at'> = {
      product_name: calculation.product.name,
      product_price: calculation.product.price.value,
      product_years: calculation.product.usageYears.value,
      daily_cost: calculation.dailyCost.value,
      user_id: calculation.userId
    }

    return await this.create(dto)
  }

  async getUserCalculations(userId: string, limit = 100): Promise<CalculationDTO[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error)
      this.handleError(error)
    return data || []
  }

  async getRecentCalculations(limit = 10): Promise<CalculationDTO[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error)
      this.handleError(error)
    return data || []
  }

  // リアルタイム購読
  subscribeToChanges(
    callback: (payload: any) => void
  ): RealtimeChannel {
    return this.supabase
      .channel('calculations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.tableName
        },
        callback
      )
      .subscribe()
  }
}
```

### 3.3 幸福度スコアリポジトリ

```typescript
// infrastructure/repositories/HappinessScoreRepository.ts
export class HappinessScoreRepository extends BaseRepository<HappinessScoreDTO> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'happiness_scores')
  }

  async saveScore(score: HappinessScore): Promise<HappinessScoreDTO> {
    const dto: Omit<HappinessScoreDTO, 'id' | 'created_at'> = {
      calculation_id: score.calculationId,
      score: score.score,
      frequency: score.factors.frequency,
      satisfaction: score.factors.satisfaction,
      necessity: score.factors.necessity,
      message: score.message
    }

    return await this.create(dto)
  }

  async getScoreByCalculationId(
    calculationId: string
  ): Promise<HappinessScoreDTO | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('calculation_id', calculationId)
      .single()

    if (error) {
      if (error.code === 'PGRST116')
        return null
      this.handleError(error)
    }
    return data
  }

  async getAverageScore(): Promise<number> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('score')

    if (error)
      this.handleError(error)

    if (!data || data.length === 0)
      return 0

    const sum = data.reduce((acc, item) => acc + item.score, 0)
    return Math.round(sum / data.length)
  }
}
```

## 4. ユースケース実装

### 4.1 計算保存ユースケース

```typescript
// application/use-cases/SaveCalculationUseCase.ts
export class SaveCalculationUseCase {
  constructor(
    private calculationRepo: CalculationRepository,
    private scoreRepo: HappinessScoreRepository
  ) {}

  async execute(input: {
    product: Product
    dailyCost: DailyCost
    happinessFactors?: HappinessFactors
    userId?: string
  }): Promise<SaveCalculationResult> {
    try {
      // 計算結果を保存
      const calculation = await this.calculationRepo.saveCalculation({
        product: input.product,
        dailyCost: input.dailyCost,
        userId: input.userId || 'anonymous',
        createdAt: new Date()
      })

      // 幸福度スコアを計算・保存
      if (input.happinessFactors) {
        const score = this.calculateHappinessScore(input.happinessFactors)

        await this.scoreRepo.saveScore({
          calculationId: calculation.id,
          score: score.value,
          factors: input.happinessFactors,
          message: this.generateMessage(score.value),
          createdAt: new Date()
        })
      }

      // ローカルストレージにも保存
      this.saveToLocalStorage(calculation)

      return {
        success: true,
        calculationId: calculation.id
      }
    }
    catch (error) {
      console.error('Failed to save calculation:', error)

      // オフライン時はローカルストレージのみ
      if (this.isOfflineError(error)) {
        this.saveToLocalStorageOffline(input)
        return {
          success: true,
          offline: true
        }
      }

      throw error
    }
  }

  private calculateHappinessScore(factors: HappinessFactors): HappinessScore {
    const weights = {
      frequency: 0.4,
      satisfaction: 0.4,
      necessity: 0.2
    }

    const score = Math.round(
      factors.frequency * weights.frequency * 20
      + factors.satisfaction * weights.satisfaction * 20
      + factors.necessity * weights.necessity * 20
    )

    return new HappinessScore(score)
  }

  private generateMessage(score: number): string {
    if (score >= 80)
      return 'とても良い買い物です！'
    if (score >= 60)
      return '満足度の高い買い物です'
    if (score >= 40)
      return '適度に活用されています'
    return '使用頻度を上げると良いかも'
  }

  private isOfflineError(error: any): boolean {
    return !navigator.onLine || error.code === 'NETWORK_ERROR'
  }

  private saveToLocalStorage(calculation: any): void {
    const stored = localStorage.getItem('calculations') || '[]'
    const calculations = JSON.parse(stored)
    calculations.unshift(calculation)

    // 最大100件保持
    if (calculations.length > 100) {
      calculations.pop()
    }

    localStorage.setItem('calculations', JSON.stringify(calculations))
  }

  private saveToLocalStorageOffline(input: any): void {
    const pendingQueue = localStorage.getItem('pending-calculations') || '[]'
    const pending = JSON.parse(pendingQueue)
    pending.push({
      ...input,
      timestamp: Date.now()
    })
    localStorage.setItem('pending-calculations', JSON.stringify(pending))
  }
}
```

## 5. オフライン対応

### 5.1 Service Worker

```typescript
// public/sw.js
const CACHE_NAME = 'nichiwari-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html'
]

// インストール
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// アクティベート
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// フェッチ
self.addEventListener('fetch', (event) => {
  // APIリクエスト
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone)
          })
          return response
        })
        .catch(() => {
          return caches.match(event.request)
        })
    )
    return
  }

  // 静的アセット
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone())
          return fetchResponse
        })
      })
    }).catch(() => {
      return caches.match('/offline.html')
    })
  )
})

// バックグラウンド同期
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-calculations') {
    event.waitUntil(syncPendingCalculations())
  }
})

async function syncPendingCalculations() {
  const cache = await caches.open(CACHE_NAME)
  const pendingData = await cache.match('pending-calculations')

  if (pendingData) {
    const pending = await pendingData.json()

    for (const item of pending) {
      try {
        await fetch('/api/calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
      }
      catch (error) {
        console.error('Sync failed:', error)
      }
    }

    await cache.delete('pending-calculations')
  }
}
```

### 5.2 オフライン検出

```typescript
// composables/useOffline.ts
export function useOffline() {
  const isOffline = ref(!navigator.onLine)
  const isPending = ref(false)

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  const handleOnline = async () => {
    isOffline.value = false
    await syncPendingData()
  }

  const handleOffline = () => {
    isOffline.value = true
  }

  const syncPendingData = async () => {
    isPending.value = true

    try {
      // Service Workerに同期をリクエスト
      if ('serviceWorker' in navigator && 'sync' in registration) {
        await registration.sync.register('sync-calculations')
      }
      else {
        // 手動同期
        await manualSync()
      }
    }
    finally {
      isPending.value = false
    }
  }

  const manualSync = async () => {
    const pending = localStorage.getItem('pending-calculations')
    if (!pending)
      return

    const items = JSON.parse(pending)
    const { supabase } = useSupabase()

    for (const item of items) {
      try {
        await supabase.from('calculations').insert(item)
      }
      catch (error) {
        console.error('Manual sync failed:', error)
      }
    }

    localStorage.removeItem('pending-calculations')
  }

  return {
    isOffline: readonly(isOffline),
    isPending: readonly(isPending),
    syncPendingData
  }
}
```

## 6. キャッシュ戦略

### 6.1 Piniaストアとの統合

```typescript
// stores/calculator.ts
export const useCalculatorStore = defineStore('calculator', () => {
  const { supabase } = useSupabase()
  const repository = new CalculationRepository(supabase)

  const calculations = ref<Calculation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // キャッシュ有効期限（5分）
  const CACHE_TTL = 5 * 60 * 1000
  const lastFetched = ref<number>(0)

  const fetchCalculations = async (force = false) => {
    // キャッシュが有効な場合はスキップ
    if (!force && Date.now() - lastFetched.value < CACHE_TTL) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await repository.getRecentCalculations(50)
      calculations.value = data.map(toCalculationEntity)
      lastFetched.value = Date.now()

      // ローカルストレージに保存
      localStorage.setItem('calculations-cache', JSON.stringify({
        data: calculations.value,
        timestamp: lastFetched.value
      }))
    }
    catch (err) {
      error.value = 'データの取得に失敗しました'

      // オフライン時はローカルストレージから復元
      const cached = localStorage.getItem('calculations-cache')
      if (cached) {
        const { data } = JSON.parse(cached)
        calculations.value = data
      }
    }
    finally {
      isLoading.value = false
    }
  }

  // リアルタイム更新
  const subscription = repository.subscribeToChanges((payload) => {
    if (payload.eventType === 'INSERT') {
      calculations.value.unshift(toCalculationEntity(payload.new))
    }
    else if (payload.eventType === 'DELETE') {
      calculations.value = calculations.value.filter(
        c => c.id !== payload.old.id
      )
    }
  })

  onUnmounted(() => {
    subscription.unsubscribe()
  })

  return {
    calculations: readonly(calculations),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchCalculations
  }
})
```

## 7. エラーハンドリング

```typescript
// composables/useErrorHandler.ts
export function useErrorHandler() {
  const toast = useToast()

  const handleError = (error: any, context?: string) => {
    console.error(`Error in ${context}:`, error)

    // ネットワークエラー
    if (!navigator.onLine) {
      toast.warning('オフラインモードで動作中')
      return
    }

    // Supabaseエラー
    if (error.code) {
      const messages: Record<string, string> = {
        23505: 'データが重複しています',
        23503: '関連データが見つかりません',
        42501: 'アクセス権限がありません',
        PGRST116: 'データが見つかりません'
      }

      toast.error(messages[error.code] || 'エラーが発生しました')
      return
    }

    // 一般的なエラー
    toast.error('予期せぬエラーが発生しました')
  }

  return { handleError }
}
```

## 次のフェーズ

[Phase 4 - 機能改善と最適化](./phase-4-polish.md)へ進む
