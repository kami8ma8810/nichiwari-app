---
title: 単体テストガイド
category: testing
dependencies: [../03-development/tdd-guide.md, ../02-architecture/overview.md]
phase: 1
last-updated: 2024-11-22
---

# 単体テストガイド

## 1. テスト方針

### 1.1 テストピラミッド

```yaml
テスト配分:
  単体テスト: 70%
    - 高速実行
    - 詳細な検証
    - TDD実践

  統合テスト: 20%
    - APIとの連携
    - Store統合
    - Composables

  E2Eテスト: 10%
    - クリティカルパス
    - ユーザーシナリオ
    - リグレッション防止
```

### 1.2 カバレッジ目標

```yaml
全体目標: 80%以上

詳細目標:
  ドメイン層: 100%
    - ビジネスロジックの完全保護
    - エッジケースの網羅

  ユースケース層: 90%以上
    - アプリケーションロジック検証
    - エラーハンドリング確認

  プレゼンテーション層: 70%以上
    - コンポーネント動作確認
    - ユーザーインタラクション

  インフラ層: 60%以上
    - 外部連携のモック化
    - エラー処理の確認
```

## 2. Vitest設定

### 2.1 基本設定

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '*.config.ts',
        '.nuxt/',
        '.output/'
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    includeSource: ['src/**/*.{js,ts}'],
    mockReset: true,
    restoreMocks: true,
    testTimeout: 10000
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### 2.2 セットアップファイル

```typescript
// test/setup.ts
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// グローバルモック
vi.mock('@/composables/useSupabase', () => ({
  useSupabase: vi.fn(() => ({
    supabase: {
      from: vi.fn(),
      auth: {
        getSession: vi.fn()
      }
    }
  }))
}))

// Vue Test Utils設定
config.global.stubs = {
  NuxtLink: true,
  ClientOnly: true
}

// グローバルプロパティ
config.global.mocks = {
  $t: (key: string) => key,
  $route: {
    params: {},
    query: {}
  }
}

// Nuxt auto-imports
vi.stubGlobal('useState', vi.fn((key, init) => {
  const state = ref(typeof init === 'function' ? init() : init)
  return state
}))

vi.stubGlobal('useRuntimeConfig', vi.fn(() => ({
  public: {
    supabaseUrl: 'http://localhost:54321',
    supabaseAnonKey: 'test-key'
  }
})))

// LocalStorageモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
vi.stubGlobal('localStorage', localStorageMock)
```

## 3. ドメイン層テスト

### 3.1 エンティティテスト

```typescript
// domain/entities/Product.test.ts
import { describe, it, expect } from 'vitest'
import { Product } from '@/domain/entities/Product'
import { Money } from '@/domain/value-objects/Money'
import { Years } from '@/domain/value-objects/Years'

describe('Product', () => {
  describe('コンストラクタ', () => {
    it('正常な値で作成できる', () => {
      const product = new Product(
        'ガジェット',
        new Money(150000),
        new Years(3)
      )

      expect(product.name).toBe('ガジェット')
      expect(product.price.value).toBe(150000)
      expect(product.usageYears.value).toBe(3)
    })

    it('空の名前は拒否される', () => {
      expect(() => new Product(
        '',
        new Money(150000),
        new Years(3)
      )).toThrow('商品名は必須です')
    })

    it('100文字を超える名前は拒否される', () => {
      const longName = 'あ'.repeat(101)
      expect(() => new Product(
        longName,
        new Money(150000),
        new Years(3)
      )).toThrow('商品名は100文字以内で入力してください')
    })
  })

  describe('calculateDailyCost', () => {
    it('1日あたりのコストを正しく計算する', () => {
      const product = new Product(
        'ガジェット',
        new Money(150000),
        new Years(3)
      )

      const dailyCost = product.calculateDailyCost()

      expect(dailyCost.value).toBe(137) // 150000 / (3 * 365)
    })

    it('小数点以下は切り捨てられる', () => {
      const product = new Product(
        'ガジェット',
        new Money(100),
        new Years(1)
      )

      const dailyCost = product.calculateDailyCost()

      expect(dailyCost.value).toBe(0) // 100 / 365 = 0.27...
    })
  })
})
```

### 3.2 値オブジェクトテスト

```typescript
// domain/value-objects/Money.test.ts
import { describe, it, expect } from 'vitest'
import { Money } from '@/domain/value-objects/Money'

describe('Money', () => {
  describe('作成', () => {
    it('正の整数で作成できる', () => {
      const money = new Money(150000)
      expect(money.value).toBe(150000)
    })

    it('0円で作成できる', () => {
      const money = new Money(0)
      expect(money.value).toBe(0)
    })

    it('負の値は拒否される', () => {
      expect(() => new Money(-1)).toThrow('金額は0以上である必要があります')
    })

    it('小数は拒否される', () => {
      expect(() => new Money(100.5)).toThrow('金額は整数である必要があります')
    })

    it('10億円を超える値は拒否される', () => {
      expect(() => new Money(1000000001)).toThrow('金額は10億円以下である必要があります')
    })
  })

  describe('演算', () => {
    it('加算できる', () => {
      const money1 = new Money(100)
      const money2 = new Money(200)

      const result = money1.add(money2)

      expect(result.value).toBe(300)
    })

    it('減算できる', () => {
      const money1 = new Money(300)
      const money2 = new Money(100)

      const result = money1.subtract(money2)

      expect(result.value).toBe(200)
    })

    it('減算結果が負になる場合はエラー', () => {
      const money1 = new Money(100)
      const money2 = new Money(200)

      expect(() => money1.subtract(money2))
        .toThrow('減算結果が負の値になります')
    })

    it('等価性を判定できる', () => {
      const money1 = new Money(100)
      const money2 = new Money(100)
      const money3 = new Money(200)

      expect(money1.equals(money2)).toBe(true)
      expect(money1.equals(money3)).toBe(false)
    })
  })

  describe('フォーマット', () => {
    it('通貨形式でフォーマットできる', () => {
      const money = new Money(150000)

      expect(money.format()).toBe('¥150,000')
    })

    it('0円も正しくフォーマットされる', () => {
      const money = new Money(0)

      expect(money.format()).toBe('¥0')
    })
  })
})
```

## 4. ユースケース層テスト

### 4.1 ユースケーステスト

```typescript
// application/use-cases/CalculateDailyCostUseCase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CalculateDailyCostUseCase } from '@/application/use-cases/CalculateDailyCostUseCase'
import { CalculationRepository } from '@/domain/repositories/CalculationRepository'

describe('CalculateDailyCostUseCase', () => {
  let useCase: CalculateDailyCostUseCase
  let mockRepository: CalculationRepository

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      deleteById: vi.fn()
    }
    useCase = new CalculateDailyCostUseCase(mockRepository)
  })

  describe('execute', () => {
    it('計算を実行して結果を保存する', async () => {
      const input = {
        name: 'ガジェット',
        price: 150000,
        years: 3
      }

      const result = await useCase.execute(input)

      expect(result.dailyCost).toBe(137)
      expect(result.product.name).toBe('ガジェット')
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })

    it('バリデーションエラーを適切に処理する', async () => {
      const input = {
        name: '',
        price: 150000,
        years: 3
      }

      await expect(useCase.execute(input))
        .rejects.toThrow('商品名は必須です')

      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('リポジトリエラーを伝播する', async () => {
      mockRepository.save.mockRejectedValue(
        new Error('Database error')
      )

      const input = {
        name: 'ガジェット',
        price: 150000,
        years: 3
      }

      await expect(useCase.execute(input))
        .rejects.toThrow('Database error')
    })
  })
})
```

### 4.2 サービステスト

```typescript
// application/services/ComparisonService.test.ts
import { describe, it, expect, vi } from 'vitest'
import { ComparisonService } from '@/application/services/ComparisonService'
import { DailyCost } from '@/domain/value-objects/DailyCost'

describe('ComparisonService', () => {
  let service: ComparisonService

  beforeEach(() => {
    service = new ComparisonService()
  })

  describe('getComparisons', () => {
    it('適切な比較アイテムを返す', () => {
      const dailyCost = new DailyCost(137)

      const comparisons = service.getComparisons(dailyCost)

      expect(comparisons).toHaveLength(5)
      expect(comparisons[0].name).toBe('コンビニコーヒー')
    })

    it('価格帯に応じた比較を返す', () => {
      const cheapCost = new DailyCost(50)
      const expensiveCost = new DailyCost(500)

      const cheapComparisons = service.getComparisons(cheapCost)
      const expensiveComparisons = service.getComparisons(expensiveCost)

      expect(cheapComparisons[0].price).toBeLessThan(100)
      expect(expensiveComparisons[0].price).toBeGreaterThan(300)
    })

    it('キャッシュされた結果を返す', () => {
      const dailyCost = new DailyCost(137)

      const result1 = service.getComparisons(dailyCost)
      const result2 = service.getComparisons(dailyCost)

      expect(result1).toBe(result2) // 同じ参照
    })
  })
})
```

## 5. プレゼンテーション層テスト

### 5.1 Composableテスト

```typescript
// composables/useCalculator.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useCalculator } from '@/composables/useCalculator'

describe('useCalculator', () => {
  let calculator: ReturnType<typeof useCalculator>

  beforeEach(() => {
    calculator = useCalculator()
  })

  describe('初期状態', () => {
    it('初期値が設定されている', () => {
      expect(calculator.price.value).toBe('')
      expect(calculator.years.value).toBe('')
      expect(calculator.result.value).toBeNull()
      expect(calculator.isCalculating.value).toBe(false)
    })
  })

  describe('calculate', () => {
    it('正常に計算できる', async () => {
      calculator.price.value = '150000'
      calculator.years.value = '3'

      await calculator.calculate()

      expect(calculator.result.value).not.toBeNull()
      expect(calculator.result.value?.dailyCost).toBe(137)
    })

    it('バリデーションエラーを処理する', async () => {
      calculator.price.value = '0'
      calculator.years.value = '3'

      await calculator.calculate()

      expect(calculator.errors.value.price).toBe('1円以上で入力してください')
      expect(calculator.result.value).toBeNull()
    })

    it('計算中フラグが適切に管理される', async () => {
      calculator.price.value = '150000'
      calculator.years.value = '3'

      const promise = calculator.calculate()

      expect(calculator.isCalculating.value).toBe(true)

      await promise

      expect(calculator.isCalculating.value).toBe(false)
    })
  })

  describe('reset', () => {
    it('すべての値をリセットする', async () => {
      calculator.price.value = '150000'
      calculator.years.value = '3'
      await calculator.calculate()

      calculator.reset()

      expect(calculator.price.value).toBe('')
      expect(calculator.years.value).toBe('')
      expect(calculator.result.value).toBeNull()
      expect(calculator.errors.value).toEqual({})
    })
  })
})
```

### 5.2 コンポーネントテスト

```typescript
// components/domain/Calculator/CalculatorInput.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CalculatorInput from '@/components/domain/Calculator/CalculatorInput.vue'

describe('CalculatorInput', () => {
  describe('レンダリング', () => {
    it('正しくレンダリングされる', () => {
      const wrapper = mount(CalculatorInput, {
        props: {
          modelValue: '',
          label: '購入価格',
          type: 'number'
        }
      })

      expect(wrapper.find('label').text()).toBe('購入価格')
      expect(wrapper.find('input').attributes('type')).toBe('number')
    })

    it('エラーメッセージが表示される', () => {
      const wrapper = mount(CalculatorInput, {
        props: {
          modelValue: '',
          label: '購入価格',
          error: '必須項目です'
        }
      })

      const error = wrapper.find('[role="alert"]')
      expect(error.exists()).toBe(true)
      expect(error.text()).toBe('必須項目です')
    })
  })

  describe('インタラクション', () => {
    it('入力値が更新される', async () => {
      const wrapper = mount(CalculatorInput, {
        props: {
          modelValue: '',
          label: '購入価格',
          'onUpdate:modelValue': vi.fn()
        }
      })

      const input = wrapper.find('input')
      await input.setValue('150000')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['150000'])
    })

    it('バリデーションが実行される', async () => {
      const onValidate = vi.fn()
      const wrapper = mount(CalculatorInput, {
        props: {
          modelValue: '150000',
          label: '購入価格',
          onValidate
        }
      })

      const input = wrapper.find('input')
      await input.trigger('blur')

      expect(onValidate).toHaveBeenCalled()
    })

    it('無効状態でインタラクションできない', async () => {
      const wrapper = mount(CalculatorInput, {
        props: {
          modelValue: '',
          label: '購入価格',
          disabled: true,
          'onUpdate:modelValue': vi.fn()
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()

      await input.setValue('150000')
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('アクセシビリティ', () => {
    it('適切なARIA属性を持つ', () => {
      const wrapper = mount(CalculatorInput, {
        props: {
          modelValue: '',
          label: '購入価格',
          error: 'エラーメッセージ',
          required: true
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('aria-required')).toBe('true')
      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toContain('error')
    })
  })
})
```

## 6. Storeテスト

### 6.1 Piniaストアテスト

```typescript
// stores/calculator.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalculatorStore } from '@/stores/calculator'

describe('useCalculatorStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('初期状態', () => {
    it('履歴が空である', () => {
      const store = useCalculatorStore()

      expect(store.history).toEqual([])
      expect(store.historyCount).toBe(0)
    })
  })

  describe('addCalculation', () => {
    it('計算結果を履歴に追加する', () => {
      const store = useCalculatorStore()

      const calculation = {
        id: '1',
        product: { name: 'ガジェット', price: 150000, years: 3 },
        dailyCost: 137,
        createdAt: new Date()
      }

      store.addCalculation(calculation)

      expect(store.history).toHaveLength(1)
      expect(store.history[0]).toEqual(calculation)
    })

    it('最大100件まで保持する', () => {
      const store = useCalculatorStore()

      for (let i = 0; i < 110; i++) {
        store.addCalculation({
          id: `${i}`,
          product: { name: `Item ${i}`, price: 100, years: 1 },
          dailyCost: 1,
          createdAt: new Date()
        })
      }

      expect(store.history).toHaveLength(100)
      expect(store.history[0].id).toBe('109') // 最新
      expect(store.history[99].id).toBe('10') // 最古
    })

    it('ローカルストレージに保存する', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      const store = useCalculatorStore()

      const calculation = {
        id: '1',
        product: { name: 'ガジェット', price: 150000, years: 3 },
        dailyCost: 137,
        createdAt: new Date()
      }

      store.addCalculation(calculation)

      expect(setItemSpy).toHaveBeenCalledWith(
        'calculator-history',
        expect.any(String)
      )
    })
  })

  describe('removeCalculation', () => {
    it('指定したIDの計算を削除する', () => {
      const store = useCalculatorStore()

      store.addCalculation({
        id: '1',
        product: { name: 'Item 1', price: 100, years: 1 },
        dailyCost: 1,
        createdAt: new Date()
      })

      store.addCalculation({
        id: '2',
        product: { name: 'Item 2', price: 200, years: 2 },
        dailyCost: 2,
        createdAt: new Date()
      })

      store.removeCalculation('1')

      expect(store.history).toHaveLength(1)
      expect(store.history[0].id).toBe('2')
    })
  })

  describe('clearHistory', () => {
    it('すべての履歴を削除する', () => {
      const store = useCalculatorStore()

      store.addCalculation({
        id: '1',
        product: { name: 'Item 1', price: 100, years: 1 },
        dailyCost: 1,
        createdAt: new Date()
      })

      store.clearHistory()

      expect(store.history).toEqual([])
      expect(localStorage.getItem('calculator-history')).toBeNull()
    })
  })

  describe('recentCalculations', () => {
    it('最新10件を返す', () => {
      const store = useCalculatorStore()

      for (let i = 0; i < 20; i++) {
        store.addCalculation({
          id: `${i}`,
          product: { name: `Item ${i}`, price: 100, years: 1 },
          dailyCost: 1,
          createdAt: new Date()
        })
      }

      const recent = store.recentCalculations

      expect(recent).toHaveLength(10)
      expect(recent[0].id).toBe('19')
      expect(recent[9].id).toBe('10')
    })
  })
})
```

## 7. テストユーティリティ

### 7.1 テストヘルパー

```typescript
// test/helpers/factories.ts
import { Product } from '@/domain/entities/Product'
import { Money } from '@/domain/value-objects/Money'
import { Years } from '@/domain/value-objects/Years'

export const createProduct = (overrides = {}) => {
  return new Product(
    overrides.name || 'テスト商品',
    new Money(overrides.price || 100000),
    new Years(overrides.years || 3)
  )
}

export const createCalculation = (overrides = {}) => {
  return {
    id: overrides.id || '1',
    product: createProduct(overrides.product),
    dailyCost: overrides.dailyCost || 91,
    createdAt: overrides.createdAt || new Date('2024-01-01')
  }
}
```

### 7.2 カスタムマッチャー

```typescript
// test/helpers/matchers.ts
import { expect } from 'vitest'

expect.extend({
  toBeValidMoney(received) {
    const isValid =
      typeof received.value === 'number' &&
      received.value >= 0 &&
      Number.isInteger(received.value)

    return {
      pass: isValid,
      message: () =>
        `expected ${received} to be a valid Money object`
    }
  },

  toHaveValidationError(received, field) {
    const hasError =
      received.errors &&
      received.errors[field] &&
      received.errors[field].length > 0

    return {
      pass: hasError,
      message: () =>
        `expected validation error for field "${field}"`
    }
  }
})
```

## 8. テスト実行とレポート

### 8.1 実行コマンド

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:debug": "vitest --inspect-brk --single-thread"
  }
}
```

### 8.2 CI設定

```yaml
# .github/workflows/test.yml
name: Unit Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Check coverage thresholds
        run: |
          coverage=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$coverage < 80" | bc -l) )); then
            echo "Coverage is below 80%"
            exit 1
          fi
```

## 9. ベストプラクティス

### 9.1 テスト設計原則

```yaml
FIRST原則:
  Fast: 高速に実行できる
  Independent: 独立して実行可能
  Repeatable: 何度でも同じ結果
  Self-Validating: 成功/失敗が明確
  Timely: コードと同時に書く

AAA パターン:
  Arrange: テストデータの準備
  Act: テスト対象の実行
  Assert: 結果の検証
```

### 9.2 アンチパターンの回避

```typescript
// ❌ 悪い例：テストが実装に依存
it('内部実装をテストする', () => {
  const store = useStore()

  // プライベートメソッドを直接呼ぶ
  store._internalMethod()

  expect(store._privateState).toBe(true)
})

// ✅ 良い例：公開インターフェースをテスト
it('公開された振る舞いをテストする', () => {
  const store = useStore()

  // パブリックメソッドを呼ぶ
  store.performAction()

  // 観測可能な結果を検証
  expect(store.visibleState).toBe(true)
})
```

## 関連ドキュメント

- [TDDガイド](../03-development/tdd-guide.md)
- [E2Eテストガイド](./e2e-testing.md)
- [テストデータ管理](./test-data.md)
- [コーディング規約](../03-development/coding-standards.md)