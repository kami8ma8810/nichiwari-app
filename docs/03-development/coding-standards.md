---
title: コーディング規約
category: development
dependencies: [tech-stack.md]
phase: 1
last-updated: 2024-11-22
---

# コーディング規約

## 1. TypeScript規約

### 1.1 基本設定

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 1.2 型定義の原則

```typescript
// ✅ 良い例: interface を使用（オブジェクトの形状）
interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: Date
}

interface PageProps<T extends AppRoute> {
  route: T
  params: Record<string, string>
  query?: Record<string, string>
}

// ✅ 良い例: type を使用（合併型・交差型）
type Status = 'idle' | 'loading' | 'success' | 'error'
type Theme = 'light' | 'dark' | 'auto'

// プリミティブの別名
type UserId = string
type Timestamp = number

// ❌ 悪い例: I プレフィックス
interface IUser { // Iプレフィックスは使わない
  name: string
}

// ❌ 悪い例: any の使用
function processData(data: any) { // any は避ける
  return data
}

// ✅ 良い例: unknown と型ガード
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data
  }
  throw new Error('Invalid data type')
}
```

### 1.3 型安全性の確保

```typescript
// ❌ 悪い例: as によるキャスト
const user = {} as UserProfile // 危険なキャスト

// ✅ 良い例: 型ガードを使用
function isUserProfile(obj: unknown): obj is UserProfile {
  return (
    typeof obj === 'object'
    && obj !== null
    && 'id' in obj
    && 'name' in obj
    && 'email' in obj
  )
}

// ❌ 悪い例: ダブルキャスト
const value = (data as unknown) as string // 絶対禁止

// ✅ 良い例: 適切な型変換
function toString(value: unknown): string {
  if (typeof value === 'string')
    return value
  if (typeof value === 'number')
    return value.toString()
  throw new Error('Cannot convert to string')
}
```

### 1.4 ジェネリクス

```typescript
// ✅ 良い例: 制約付きジェネリクス
interface Repository<T extends { id: string }> {
  findById: (id: string) => Promise<T | null>
  save: (entity: T) => Promise<void>
  delete: (id: string) => Promise<void>
}

// ✅ 良い例: ユーティリティ型の活用
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
}

type PartialUser = Partial<UserProfile>
type RequiredUser = Required<UserProfile>
type UserWithoutEmail = Omit<UserProfile, 'email'>
```

## 2. Vue 3 / Nuxt 3規約

### 2.1 コンポーネント設計

```vue
<!-- ✅ 良い例: Composition API + TypeScript -->
<script setup lang="ts">
import type { CalculationInput, ValidationErrors } from '@/types'
import { computed, ref, watch } from 'vue'

// Props定義（型安全）
interface Props {
  initialData?: Partial<CalculationInput>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<Emits>()

// Emits定義（型安全）
interface Emits {
  (e: 'submit', value: CalculationInput): void
  (e: 'cancel'): void
}

// リアクティブな状態
const formData = ref<CalculationInput>({
  productName: '',
  price: 0,
  years: 1
})

const errors = ref<ValidationErrors>({})

// 算出プロパティ
const isValid = computed(() => {
  return Object.keys(errors.value).length === 0
})

// メソッド
function validateField(field: keyof CalculationInput) {
  // バリデーションロジック
}

// ウォッチャー
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(formData.value, newData)
  }
}, { immediate: true })
</script>

<template>
  <div class="calculator-form">
    <VInput
      v-model="formData.productName"
      label="商品名"
      :error="errors.productName"
      @blur="validateField('productName')"
    />
  </div>
</template>
```

### 2.2 Composables規約

```typescript
// ✅ 良い例: 明確な責務と型定義
// src/presentation/composables/useCalculation.ts
export function useCalculation() {
  const result = ref<CalculationResult | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const calculate = async (input: CalculationInput): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const useCase = new CalculateDailyCostUseCase()
      result.value = await useCase.execute(input)
    }
    catch (e) {
      error.value = e instanceof Error ? e : new Error('Unknown error')
    }
    finally {
      loading.value = false
    }
  }

  const reset = () => {
    result.value = null
    error.value = null
    loading.value = false
  }

  return {
    // readonly で外部からの変更を防ぐ
    result: readonly(result),
    loading: readonly(loading),
    error: readonly(error),
    // メソッドは変更可能
    calculate,
    reset
  }
}
```

### 2.3 ディレクティブとv-model

```vue
<!-- ✅ 良い例: 適切なディレクティブの使用 -->
<template>
  <!-- v-if と v-for を同じ要素で使わない -->
  <template v-for="item in filteredItems" :key="item.id">
    <div v-if="item.visible">
      {{ item.name }}
    </div>
  </template>

  <!-- カスタムv-model -->
  <CustomInput
    :model-value="value"
    @update:model-value="value = $event"
  />

  <!-- 複数のv-model -->
  <UserForm
    v-model:name="user.name"
    v-model:email="user.email"
  />
</template>
```

## 3. CSS / Tailwind CSS規約

### 3.1 クラス命名規則

```vue
<!-- ✅ 良い例: Tailwind クラスの整理された順序 -->
<div class="
  /* レイアウト */
  flex flex-col gap-4
  /* サイジング */
  w-full max-w-md
  /* スペーシング */
  p-6 mx-auto
  /* 背景・ボーダー */
  bg-white rounded-lg shadow-md
  /* テキスト */
  text-gray-800
  /* インタラクション */
  hover:shadow-lg transition-shadow
  /* レスポンシブ */
  md:max-w-lg lg:max-w-xl
"
>
  コンテンツ
</div>

<!-- ❌ 悪い例: 無秩序なクラス -->
<div class="shadow-md p-6 flex hover:shadow-lg w-full text-gray-800 md:max-w-lg bg-white rounded-lg">
  コンテンツ
</div>
```

### 3.2 カスタムCSSの使用

```scss
// ✅ 良い例: Tailwindと協調するカスタムCSS
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-md
           hover:bg-blue-600 transition-colors
           focus:outline-none focus:ring-2 focus:ring-blue-500;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}

// ❌ 悪い例: Tailwindと競合するCSS
.button {
  padding: 10px 20px; // Tailwindのスペーシングシステムと競合
  background: blue; // カラーパレットと不一致
}
```

## 4. 命名規則

### 4.1 変数・関数命名

```typescript
// 定数: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3
const API_TIMEOUT = 5000

// 変数: camelCase
const userName = 'John'
const calculateResult = compute()

// 関数: camelCase（動詞で始める）
function calculateDailyCost(price: number, years: number): number {
  return price / (years * 365)
}

// クラス: PascalCase
class ProductRepository {
  findById(id: string): Product | null {
    // ...
  }
}

// インターフェース: PascalCase（Iプレフィックスなし）
interface UserProfile {
  id: string
  name: string
}

// 型エイリアス: PascalCase
type Status = 'idle' | 'loading' | 'success' | 'error'

// Enum: PascalCase（値はUPPER_SNAKE_CASE）
enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}
```

### 4.2 ファイル命名

```bash
# コンポーネント: PascalCase
CalculatorForm.vue
ResultDisplay.vue

# Composables: camelCase with use prefix
useCalculation.ts
useOfflineMode.ts

# ユーティリティ: camelCase
formatters.ts
validators.ts

# 定数: camelCase or kebab-case
constants.ts
reference-data.ts

# クラス: PascalCase
ProductRepository.ts
CalculationUseCase.ts
```

## 5. コメント規約

### 5.1 JSDoc / TSDoc

````typescript
/**
 * 商品の日割りコストを計算する
 *
 * @param price - 商品価格（円）
 * @param years - 使用予定年数
 * @returns 日割りコスト（円/日）
 * @throws {ValidationError} 価格または年数が無効な場合
 *
 * @example
 * ```typescript
 * const dailyCost = calculateDailyCost(150000, 3);
 * console.log(dailyCost); // 137
 * ```
 */
export function calculateDailyCost(price: number, years: number): number {
  if (price <= 0) {
    throw new ValidationError('価格は0より大きい必要があります')
  }
  if (years <= 0) {
    throw new ValidationError('年数は0より大きい必要があります')
  }

  return Math.round(price / (years * 365))
}
````

### 5.2 インラインコメント

```typescript
// ✅ 良い例: なぜそうするのかを説明
// Supabaseの無料枠制限に対応するためレート制限を実装
if (requestCount > MAX_REQUESTS_PER_MINUTE) {
  throw new RateLimitError()
}

// ❌ 悪い例: コードを読めば分かることを説明
// iを1増やす
i++

// ✅ 良い例: 複雑なロジックの説明
// 価格を365日で割り、小数点以下を四捨五入
// 月割りの場合は30日を基準とする
const dailyCost = Math.round(price / 365)
const monthlyCost = dailyCost * 30
```

## 6. エラーハンドリング

### 6.1 カスタムエラークラス

```typescript
// ✅ 良い例: 階層化されたエラークラス
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404)
  }
}
```

### 6.2 エラー処理パターン

```typescript
// ✅ 良い例: 適切なエラーハンドリング
async function fetchProduct(id: string): Promise<Product> {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new NotFoundError('Product', id)
      }
      throw new ApiError(error.message, error.response?.status)
    }
    // 予期しないエラーは再スロー
    throw error
  }
}

// ❌ 悪い例: エラーを握りつぶす
async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data
  }
  catch (error) {
    console.log(error) // ログだけで握りつぶす
    return null
  }
}
```

## 7. 非同期処理

### 7.1 async/await の使用

```typescript
// ✅ 良い例: async/await を使用
async function fetchUserData(userId: string): Promise<UserData> {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  const profile = await fetchUserProfile(userId)

  return {
    user,
    posts,
    profile
  }
}

// ✅ 良い例: 並列処理
async function fetchUserData(userId: string): Promise<UserData> {
  const [user, posts, profile] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserProfile(userId)
  ])

  return {
    user,
    posts,
    profile
  }
}

// ❌ 悪い例: コールバック地獄
fetchUser(userId, (err, user) => {
  if (err)
    return handleError(err)
  fetchUserPosts(userId, (err, posts) => {
    if (err)
      return handleError(err)
    // ...
  })
})
```

## 8. パフォーマンス考慮

### 8.1 メモ化とキャッシュ

```typescript
// ✅ 良い例: 計算結果のメモ化
const expensiveCalculation = useMemo(() => {
  return products.reduce((sum, product) => {
    return sum + product.calculateDailyCost()
  }, 0)
}, [products])

// ✅ 良い例: コンポーネントのメモ化
const MemoizedComponent = memo(ExpensiveComponent)
```

### 8.2 遅延読み込み

```typescript
// ✅ 良い例: 動的インポート
const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)

// ✅ 良い例: ルートレベルでの遅延読み込み
const routes = [
  {
    path: '/admin',
    component: () => import('@/pages/admin/index.vue')
  }
]
```

## 9. テストの規約

テストの詳細は [TDD実践ガイド](./tdd-guide.md) を参照してください。

## 10. コードレビューチェックリスト

```yaml
セキュリティ:
  ☐ XSS対策が適切か
  ☐ 入力値の検証があるか
  ☐ 機密情報が含まれていないか

パフォーマンス:
  ☐ 不要な再レンダリングがないか
  ☐ 適切なメモ化がされているか
  ☐ バンドルサイズへの影響は妥当か

型安全性:
  ☐ any/unknownの使用は適切か
  ☐ 型アサーションは必要最小限か
  ☐ nullチェックが適切か

保守性:
  ☐ 命名は明確で一貫性があるか
  ☐ 適切にコメントされているか
  ☐ テストが書かれているか

アクセシビリティ:
  ☐ ARIAラベルが適切か
  ☐ キーボード操作が可能か
  ☐ コントラスト比は十分か
```

## 関連ドキュメント

- [環境構築ガイド](./setup.md) - 開発環境セットアップ
- [TDD実践ガイド](./tdd-guide.md) - テスト駆動開発
- [コンポーネント開発](./component-guide.md) - UIコンポーネント
- [Git運用ルール](./git-workflow.md) - バージョン管理
