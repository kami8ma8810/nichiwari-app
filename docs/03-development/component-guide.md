---
title: コンポーネント開発ガイド
category: development
dependencies: [coding-standards.md, ../02-architecture/tech-stack.md]
phase: 1
last-updated: 2024-11-22
---

# コンポーネント開発ガイド

## 1. Voltコンポーネント活用方針

### 1.1 Voltとは

```yaml
概要:
  名称: Volt
  定義: PrimeVue + Tailwind CSSの統合UIライブラリ
  特徴: コードオーナーシップによる完全制御

利点:
  - WCAGアクセシビリティ準拠
  - 軽量なバンドルサイズ
  - カスタマイズ性の高さ
  - TypeScript完全対応
```

### 1.2 コンポーネント選択基準

| コンポーネント | Volt使用 | 自作 | 理由 |
|--------------|---------|------|------|
| ボタン | ✅ | - | アクセシビリティ保証 |
| インプット | ✅ | - | バリデーション統合 |
| カード | ✅ | - | 一貫性のあるレイアウト |
| モーダル | ✅ | - | フォーカストラップ実装済み |
| 計算結果表示 | - | ✅ | ドメイン固有のUI |
| グラフ | - | ✅ | Chart.js使用 |

## 2. コンポーネント構成

### 2.1 ディレクトリ構造

```
components/
├── common/          # 共通コンポーネント
│   ├── VButton/
│   │   ├── VButton.vue
│   │   ├── VButton.stories.ts
│   │   └── VButton.test.ts
│   └── VCard/
├── domain/          # ドメイン固有コンポーネント
│   ├── Calculator/
│   │   ├── CalculatorInput.vue
│   │   ├── CalculatorResult.vue
│   │   └── CalculatorHistory.vue
│   └── HappinessScore/
└── layout/          # レイアウトコンポーネント
    ├── AppHeader.vue
    └── AppFooter.vue
```

### 2.2 コンポーネント設計原則

```typescript
// ✅ 良い例：単一責任の原則
// CalculatorInput.vue
<template>
  <div class="calculator-input">
    <VInput
      v-model="price"
      type="number"
      :label="$t('calculator.price')"
      :error="errors.price"
      @blur="validatePrice"
    />
  </div>
</template>

<script setup lang="ts">
// プレゼンテーション層に専念
const props = defineProps<{
  modelValue: Money
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Money]
  'validate': [field: string]
}>()
</script>
```

## 3. Voltコンポーネントのカスタマイズ

### 3.1 デザイントークンによるカスタマイズ

```scss
// assets/styles/volt-overrides.scss
// Voltのデフォルトトークンを上書き

:root {
  // カラー
  --volt-primary-color: #ff6b6b;
  --volt-primary-color-hover: #ff5252;
  --volt-primary-color-active: #ff3838;

  // スペーシング
  --volt-spacing-unit: 0.25rem;
  --volt-spacing-xs: calc(var(--volt-spacing-unit) * 2);
  --volt-spacing-sm: calc(var(--volt-spacing-unit) * 3);

  // タイポグラフィ
  --volt-font-size-base: 16px;
  --volt-line-height-base: 1.5;

  // 影
  --volt-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --volt-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 3.2 Tailwindによる拡張

```vue
<!-- VButtonの拡張例 -->
<template>
  <VButton
    class="
      custom-button
      hover:shadow-lg
      transition-all
      duration-200
      bg-gradient-to-r
      from-pink-500
      to-orange-500
    "
    :loading="isCalculating"
    @click="calculate"
  >
    <template #icon>
      <CalculatorIcon class="w-5 h-5" />
    </template>
    計算する
  </VButton>
</template>

<style scoped>
.custom-button {
  @apply rounded-full px-8 py-3;
}

/* Volt内部クラスの上書き */
.custom-button :deep(.v-button-label) {
  @apply font-bold tracking-wider;
}
</style>
```

### 3.3 コンポーネントラッパー

```vue
<!-- components/common/AppButton.vue -->
<!-- Voltコンポーネントをラップして統一インターフェース提供 -->
<template>
  <VButton
    :variant="variant"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot />
  </VButton>
</template>

<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => ({
  'w-full': props.fullWidth,
  'opacity-75 cursor-not-allowed': props.disabled
}))

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
```

## 4. ドメインコンポーネント実装

### 4.1 計算結果コンポーネント

```vue
<!-- components/domain/Calculator/CalculatorResult.vue -->
<template>
  <VCard class="calculator-result">
    <template #header>
      <h2 class="text-2xl font-bold">
        計算結果
      </h2>
    </template>

    <div class="space-y-4">
      <!-- 1日あたりの金額 -->
      <div class="result-item">
        <span class="result-label">1日あたり</span>
        <span class="result-value text-4xl font-bold text-primary">
          {{ formatCurrency(dailyCost) }}
        </span>
      </div>

      <!-- 比較アイテム -->
      <div class="comparison-grid">
        <ComparisonItem
          v-for="item in comparisons"
          :key="item.id"
          :item="item"
          :daily-cost="dailyCost"
        />
      </div>

      <!-- アクション -->
      <div class="flex gap-4">
        <AppButton
          variant="secondary"
          @click="share"
        >
          <template #icon>
            <ShareIcon />
          </template>
          シェア
        </AppButton>

        <AppButton
          variant="primary"
          @click="save"
        >
          <template #icon>
            <SaveIcon />
          </template>
          保存
        </AppButton>
      </div>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import type { DailyCost, ComparisonItem } from '@/domain/types'

interface Props {
  dailyCost: DailyCost
  comparisons: ComparisonItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  share: []
  save: []
}>()

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<style scoped>
.calculator-result {
  @apply bg-white rounded-2xl shadow-xl p-6;
}

.result-item {
  @apply flex justify-between items-center p-4 bg-gray-50 rounded-lg;
}

.comparison-grid {
  @apply grid grid-cols-2 gap-4 md:grid-cols-3;
}
</style>
```

### 4.2 幸福度スコアコンポーネント

```vue
<!-- components/domain/HappinessScore/HappinessScoreDisplay.vue -->
<template>
  <div class="happiness-score">
    <div class="score-circle">
      <svg class="score-svg" viewBox="0 0 100 100">
        <!-- 背景円 -->
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="5"
        />

        <!-- スコア円 -->
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          :stroke="scoreColor"
          stroke-width="5"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="offset"
          stroke-linecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>

      <div class="score-text">
        <span class="score-value">{{ score }}</span>
        <span class="score-label">幸福度</span>
      </div>
    </div>

    <p class="score-message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  score: number // 0-100
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: ''
})

const radius = 45
const circumference = 2 * Math.PI * radius

const offset = computed(() => {
  const progress = props.score / 100
  return circumference * (1 - progress)
})

const scoreColor = computed(() => {
  if (props.score >= 80) return '#10b981' // green
  if (props.score >= 60) return '#3b82f6' // blue
  if (props.score >= 40) return '#f59e0b' // yellow
  return '#ef4444' // red
})
</script>
```

## 5. Storybook設定

### 5.1 ストーリー作成

```typescript
// components/common/VButton/VButton.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
import VButton from './VButton.vue'

const meta: Meta<typeof VButton> = {
  title: 'Common/VButton',
  component: VButton,
  parameters: {
    docs: {
      description: {
        component: 'Voltベースのボタンコンポーネント'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    loading: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// デフォルト
export const Default: Story = {
  args: {
    default: '計算する'
  }
}

// バリエーション
export const Primary: Story = {
  args: {
    variant: 'primary',
    default: 'プライマリボタン'
  }
}

// ローディング状態
export const Loading: Story = {
  args: {
    loading: true,
    default: '計算中...'
  }
}

// 全パターン
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-4">
        <div class="flex gap-4">
          <VButton variant="primary">Primary</VButton>
          <VButton variant="secondary">Secondary</VButton>
          <VButton variant="danger">Danger</VButton>
          <VButton variant="ghost">Ghost</VButton>
        </div>
      </div>
    `
  })
}
```

### 5.2 インタラクションテスト

```typescript
// components/domain/Calculator/Calculator.stories.ts
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

export const CalculatorInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 価格入力
    const priceInput = await canvas.getByLabelText('購入価格')
    await userEvent.type(priceInput, '150000')

    // 使用年数入力
    const yearsInput = await canvas.getByLabelText('使用年数')
    await userEvent.type(yearsInput, '3')

    // 計算ボタンクリック
    const calculateButton = await canvas.getByRole('button', {
      name: '計算する'
    })
    await userEvent.click(calculateButton)

    // 結果確認
    const result = await canvas.findByText(/137円/)
    expect(result).toBeInTheDocument()
  }
}
```

## 6. コンポーネントテスト

### 6.1 単体テスト

```typescript
// components/common/VButton/VButton.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VButton from './VButton.vue'

describe('VButton', () => {
  it('クリックイベントが発火する', async () => {
    const onClick = vi.fn()
    const wrapper = mount(VButton, {
      props: { onClick }
    })

    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('ローディング中はクリックできない', async () => {
    const onClick = vi.fn()
    const wrapper = mount(VButton, {
      props: {
        loading: true,
        onClick
      }
    })

    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('無効状態では適切なARIA属性を持つ', () => {
    const wrapper = mount(VButton, {
      props: { disabled: true }
    })

    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })
})
```

### 6.2 ビジュアルリグレッションテスト

```typescript
// .storybook/test-runner.ts
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

export const postRender = async (page, context) => {
  // スクリーンショット取得
  const screenshot = await page.screenshot()

  // 比較
  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: '.storybook/image-snapshots',
    customDiffConfig: {
      threshold: 0.01
    }
  })
}
```

## 7. アクセシビリティ対応

### 7.1 キーボードナビゲーション

```vue
<template>
  <div
    class="calculator-form"
    @keydown="handleKeydown"
  >
    <VInput
      ref="priceInput"
      v-model="price"
      label="購入価格"
      :aria-describedby="priceError ? 'price-error' : undefined"
    />

    <VInput
      ref="yearsInput"
      v-model="years"
      label="使用年数"
      :aria-describedby="yearsError ? 'years-error' : undefined"
    />

    <VButton
      ref="submitButton"
      type="submit"
      :aria-busy="isCalculating"
    >
      計算する
    </VButton>
  </div>
</template>

<script setup lang="ts">
const handleKeydown = (event: KeyboardEvent) => {
  // Enterキーでフォーカス移動
  if (event.key === 'Enter' && !event.shiftKey) {
    const target = event.target as HTMLElement

    if (target === priceInput.value?.$el) {
      yearsInput.value?.$el.focus()
      event.preventDefault()
    } else if (target === yearsInput.value?.$el) {
      submitButton.value?.$el.focus()
      event.preventDefault()
    }
  }

  // Escapeキーでフォームリセット
  if (event.key === 'Escape') {
    resetForm()
  }
}
</script>
```

### 7.2 スクリーンリーダー対応

```vue
<template>
  <div role="region" aria-labelledby="calculator-title">
    <h1 id="calculator-title" class="sr-only">
      にちわり計算機
    </h1>

    <!-- ライブリージョン -->
    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      {{ statusMessage }}
    </div>

    <!-- エラーメッセージ -->
    <div
      v-if="hasErrors"
      role="alert"
      aria-live="assertive"
    >
      <ul>
        <li v-for="error in errors" :key="error.field">
          {{ error.message }}
        </li>
      </ul>
    </div>

    <!-- 結果 -->
    <div
      v-if="result"
      role="status"
      aria-label="計算結果"
    >
      1日あたり{{ result.dailyCost }}円です
    </div>
  </div>
</template>
```

## 8. パフォーマンス最適化

### 8.1 遅延読み込み

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  components: {
    dirs: [
      {
        path: '~/components/common',
        extensions: ['vue'],
        prefix: 'V'
      },
      {
        path: '~/components/domain',
        extensions: ['vue'],
        prefix: 'Domain',
        // 大きいコンポーネントは遅延読み込み
        global: false
      }
    ]
  }
})
```

### 8.2 メモ化と最適化

```vue
<script setup lang="ts">
// 重い計算はメモ化
const expensiveCalculation = computed(() => {
  return useMemo(() => {
    // 重い処理
    return calculateComplexValue(props.data)
  }, [props.data])
})

// v-onceで静的コンテンツ最適化
</script>

<template>
  <!-- 一度だけレンダリング -->
  <div v-once>
    <h1>{{ staticTitle }}</h1>
    <p>{{ staticDescription }}</p>
  </div>

  <!-- v-memoで条件付きメモ化 -->
  <ExpensiveComponent
    v-memo="[item.id, item.updatedAt]"
    :item="item"
  />
</template>
```

## 9. ベストプラクティス

### 9.1 コンポーネント設計チェックリスト

```yaml
設計前:
  ✓ 単一責任の原則を満たすか
  ✓ Voltコンポーネントで代替できないか
  ✓ 再利用可能な設計か
  ✓ Props/Emitsが明確か

実装時:
  ✓ TypeScript型定義が完全か
  ✓ バリデーションが適切か
  ✓ エラーハンドリングがあるか
  ✓ アクセシビリティ対応しているか

テスト:
  ✓ 単体テストがあるか
  ✓ Storybookストーリーがあるか
  ✓ エッジケースをカバーしているか
  ✓ ビジュアルテストが必要か
```

### 9.2 よくある間違いと対策

```typescript
// ❌ 悪い例：propsの直接変更
const props = defineProps<{ value: number }>()
props.value++ // エラー

// ✅ 良い例：v-modelパターン
const props = defineProps<{ modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [number] }>()

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
```

## 関連ドキュメント

- [コーディング規約](./coding-standards.md)
- [TDDガイド](./tdd-guide.md)
- [技術スタック](../02-architecture/tech-stack.md)
- [Phase 2: UIコンポーネント](../05-implementation/phase-2-ui.md)