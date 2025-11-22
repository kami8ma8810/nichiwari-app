---
title: Phase 2 - UIコンポーネント実装
category: implementation
dependencies: [phase-1-setup.md, ../03-development/component-guide.md]
phase: 2
last-updated: 2024-11-22
---

# Phase 2 - UIコンポーネント実装

## 1. 概要

### 1.1 Phase 2の目標

```yaml
目標:
  - 計算機能のUI実装
  - レスポンシブデザイン
  - アクセシビリティ対応
  - インタラクション実装

期間: 3日

成果物:
  - 計算フォーム
  - 結果表示
  - 比較表示
  - アニメーション
```

## 2. ページレイアウト実装

### 2.1 メインレイアウト

```vue
<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
    <AppHeader />

    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
```

### 2.2 ヘッダーコンポーネント

```vue
<!-- components/layout/AppHeader.vue -->
<template>
  <header class="bg-white/80 backdrop-blur-lg border-b border-gray-200">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
            <span class="text-white text-xl">¥</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">
            にちわり！
          </h1>
        </NuxtLink>

        <nav class="flex gap-4">
          <NuxtLink to="/history" class="text-gray-600 hover:text-gray-900">
            履歴
          </NuxtLink>
          <NuxtLink to="/about" class="text-gray-600 hover:text-gray-900">
            使い方
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>
```

## 3. 計算機能UI実装

### 3.1 計算フォームコンポーネント

```vue
<!-- components/domain/Calculator/CalculatorForm.vue -->
<template>
  <div class="bg-white rounded-2xl shadow-xl p-8">
    <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">
      買い物の価値を計算する
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 商品名入力 -->
      <div>
        <label for="product-name" class="block text-sm font-medium text-gray-700 mb-2">
          商品名（任意）
        </label>
        <input
          id="product-name"
          v-model="formData.name"
          type="text"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="例：iPhone 15 Pro"
          :aria-invalid="!!errors.name"
          :aria-describedby="errors.name ? 'name-error' : undefined"
        />
        <p v-if="errors.name" id="name-error" class="mt-2 text-sm text-red-600" role="alert">
          {{ errors.name }}
        </p>
      </div>

      <!-- 価格入力 -->
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
          購入価格 <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            ¥
          </span>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            required
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="150000"
            min="1"
            max="1000000000"
            :aria-invalid="!!errors.price"
            :aria-describedby="errors.price ? 'price-error' : undefined"
          />
        </div>
        <p v-if="errors.price" id="price-error" class="mt-2 text-sm text-red-600" role="alert">
          {{ errors.price }}
        </p>
      </div>

      <!-- 使用年数入力 -->
      <div>
        <label for="years" class="block text-sm font-medium text-gray-700 mb-2">
          使用予定年数 <span class="text-red-500">*</span>
        </label>
        <div class="flex items-center gap-4">
          <input
            id="years"
            v-model.number="formData.years"
            type="number"
            required
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="3"
            min="0.5"
            max="100"
            step="0.5"
            :aria-invalid="!!errors.years"
            :aria-describedby="errors.years ? 'years-error' : undefined"
          />
          <span class="text-gray-500">年</span>
        </div>
        <p v-if="errors.years" id="years-error" class="mt-2 text-sm text-red-600" role="alert">
          {{ errors.years }}
        </p>
      </div>

      <!-- プリセット -->
      <div class="border-t pt-6">
        <p class="text-sm text-gray-600 mb-3">よく使う商品から選択：</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            v-for="preset in presets"
            :key="preset.id"
            type="button"
            @click="applyPreset(preset)"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>

      <!-- ボタン -->
      <div class="flex gap-4 pt-6">
        <button
          type="button"
          @click="reset"
          class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          リセット
        </button>
        <button
          type="submit"
          :disabled="isCalculating"
          class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-lg disabled:opacity-50"
        >
          <span v-if="!isCalculating">計算する</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            計算中...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as v from 'valibot'

// バリデーションスキーマ
const FormSchema = v.object({
  name: v.optional(v.pipe(
    v.string(),
    v.maxLength(100, '100文字以内で入力してください')
  )),
  price: v.pipe(
    v.number(),
    v.minValue(1, '1円以上で入力してください'),
    v.maxValue(1000000000, '10億円以下で入力してください')
  ),
  years: v.pipe(
    v.number(),
    v.minValue(0.5, '0.5年以上で入力してください'),
    v.maxValue(100, '100年以下で入力してください'),
    v.multipleOf(0.5, '0.5年単位で入力してください')
  )
})

const emit = defineEmits<{
  calculate: [data: { name?: string; price: number; years: number }]
}>()

const formData = reactive({
  name: '',
  price: null as number | null,
  years: null as number | null
})

const errors = reactive<Record<string, string>>({})
const isCalculating = ref(false)

// プリセットデータ
const presets = [
  { id: 1, name: 'スマホ', price: 150000, years: 2 },
  { id: 2, name: 'PC', price: 200000, years: 4 },
  { id: 3, name: '洗濯機', price: 100000, years: 10 },
  { id: 4, name: 'テレビ', price: 80000, years: 7 }
]

const applyPreset = (preset: typeof presets[0]) => {
  formData.name = preset.name
  formData.price = preset.price
  formData.years = preset.years
}

const validate = () => {
  try {
    const parsed = v.parse(FormSchema, {
      name: formData.name,
      price: formData.price,
      years: formData.years
    })
    Object.keys(errors).forEach(key => delete errors[key])
    return parsed
  } catch (error) {
    if (v.isValiError(error)) {
      error.issues.forEach(issue => {
        if (issue.path) {
          errors[issue.path[0].toString()] = issue.message
        }
      })
    }
    return null
  }
}

const handleSubmit = async () => {
  const validated = validate()
  if (!validated) return

  isCalculating.value = true

  // 計算処理をエミット
  emit('calculate', {
    name: validated.name,
    price: validated.price,
    years: validated.years
  })

  setTimeout(() => {
    isCalculating.value = false
  }, 500)
}

const reset = () => {
  formData.name = ''
  formData.price = null
  formData.years = null
  Object.keys(errors).forEach(key => delete errors[key])
}
</script>
```

### 3.2 計算結果表示コンポーネント

```vue
<!-- components/domain/Calculator/CalculatorResult.vue -->
<template>
  <Transition name="slide-up">
    <div v-if="result" class="bg-white rounded-2xl shadow-xl p-8 mt-8">
      <!-- メイン結果 -->
      <div class="text-center mb-8">
        <p class="text-gray-600 mb-2">1日あたり</p>
        <div class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
          {{ formatCurrency(result.dailyCost) }}
        </div>
        <p v-if="result.productName" class="mt-4 text-gray-700">
          「{{ result.productName }}」の1日あたりの価値
        </p>
      </div>

      <!-- 比較 -->
      <div class="border-t pt-8">
        <h3 class="text-lg font-semibold mb-4">身近なものと比較すると...</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ComparisonCard
            v-for="item in comparisons"
            :key="item.id"
            :item="item"
            :daily-cost="result.dailyCost"
          />
        </div>
      </div>

      <!-- アクション -->
      <div class="flex gap-4 mt-8">
        <button
          @click="saveToHistory"
          class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <Icon name="save" class="inline w-5 h-5 mr-2" />
          保存する
        </button>
        <button
          @click="share"
          class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <Icon name="share" class="inline w-5 h-5 mr-2" />
          シェアする
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { CalculationResult } from '@/types'

const props = defineProps<{
  result: CalculationResult | null
}>()

const emit = defineEmits<{
  save: []
  share: []
}>()

const formatCurrency = (value: number) => {
  return `${value.toLocaleString()}円`
}

const comparisons = computed(() => {
  if (!props.result) return []

  const dailyCost = props.result.dailyCost

  return [
    {
      id: 1,
      name: 'コンビニコーヒー',
      price: 150,
      quantity: (dailyCost / 150).toFixed(1)
    },
    {
      id: 2,
      name: 'ペットボトル',
      price: 150,
      quantity: (dailyCost / 150).toFixed(1)
    },
    {
      id: 3,
      name: '電車運賃',
      price: 200,
      quantity: (dailyCost / 200).toFixed(1)
    }
  ]
})

const saveToHistory = () => {
  emit('save')
}

const share = async () => {
  if (navigator.share) {
    await navigator.share({
      title: 'にちわり！計算結果',
      text: `1日あたり${props.result?.dailyCost}円でした！`,
      url: window.location.href
    })
  } else {
    emit('share')
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
```

### 3.3 比較カードコンポーネント

```vue
<!-- components/domain/Calculator/ComparisonCard.vue -->
<template>
  <div class="bg-gray-50 rounded-lg p-4 text-center hover:bg-orange-50 transition-colors">
    <div class="text-3xl mb-2">{{ getEmoji(item.name) }}</div>
    <p class="text-sm text-gray-600 mb-1">{{ item.name }}</p>
    <p class="font-bold text-lg">
      約{{ item.quantity }}{{ getUnit(item.name) }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface ComparisonItem {
  id: number
  name: string
  price: number
  quantity: string
}

defineProps<{
  item: ComparisonItem
  dailyCost: number
}>()

const getEmoji = (name: string): string => {
  const emojiMap: Record<string, string> = {
    'コンビニコーヒー': '☕',
    'ペットボトル': '🥤',
    '電車運賃': '🚃',
    '映画チケット': '🎬',
    'ランチ': '🍱'
  }
  return emojiMap[name] || '💰'
}

const getUnit = (name: string): string => {
  const unitMap: Record<string, string> = {
    'コンビニコーヒー': '杯',
    'ペットボトル': '本',
    '電車運賃': '回',
    '映画チケット': '回',
    'ランチ': '食'
  }
  return unitMap[name] || '個'
}
</script>
```

## 4. ページ実装

### 4.1 トップページ

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <!-- ヒーローセクション -->
    <section class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        買い物の価値を
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
          見える化
        </span>
      </h1>
      <p class="text-xl text-gray-600">
        高い買い物も、1日あたりで考えれば意外とお得かも？
      </p>
    </section>

    <!-- 計算機能 -->
    <CalculatorForm @calculate="handleCalculate" />
    <CalculatorResult
      :result="calculationResult"
      @save="saveCalculation"
      @share="shareResult"
    />

    <!-- 説明セクション -->
    <section class="mt-16 text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-8">
        使い方はカンタン3ステップ
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white rounded-xl p-6 shadow-lg">
          <div class="text-4xl mb-4">💰</div>
          <h3 class="font-bold mb-2">1. 価格を入力</h3>
          <p class="text-gray-600">購入価格を入力します</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-lg">
          <div class="text-4xl mb-4">📅</div>
          <h3 class="font-bold mb-2">2. 使用年数を入力</h3>
          <p class="text-gray-600">何年使う予定か入力</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-lg">
          <div class="text-4xl mb-4">✨</div>
          <h3 class="font-bold mb-2">3. 結果を確認</h3>
          <p class="text-gray-600">1日あたりの価値が分かる！</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCalculator } from '@/composables/useCalculator'
import { useCalculatorStore } from '@/stores/calculator'

const { calculate, calculationResult } = useCalculator()
const store = useCalculatorStore()

const handleCalculate = async (data: any) => {
  await calculate(data)
}

const saveCalculation = () => {
  if (calculationResult.value) {
    store.addCalculation(calculationResult.value)
    // トースト表示など
  }
}

const shareResult = () => {
  // シェア処理
}
</script>
```

## 5. レスポンシブ対応

### 5.1 ブレークポイント設定

```css
/* Tailwind設定済み */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

### 5.2 モバイルファースト実装

```vue
<!-- レスポンシブ例 -->
<div class="
  px-4 sm:px-6 lg:px-8
  py-4 sm:py-6 lg:py-8
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
">
  <!-- コンテンツ -->
</div>
```

## 6. アニメーション実装

### 6.1 Vue Transition

```vue
<style>
/* フェードイン */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* スライド */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* スケール */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
}
</style>
```

## 7. Storybookストーリー

```typescript
// components/domain/Calculator/CalculatorForm.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
import CalculatorForm from './CalculatorForm.vue'

const meta: Meta<typeof CalculatorForm> = {
  title: 'Domain/Calculator/Form',
  component: CalculatorForm
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithPreset: Story = {
  play: async ({ canvasElement }) => {
    // プリセットボタンをクリック
    const preset = canvasElement.querySelector('[data-preset="1"]')
    preset?.click()
  }
}

export const WithErrors: Story = {
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form')
    form?.submit()
  }
}
```

## 次のフェーズ

[Phase 3 - バックエンド連携](./phase-3-backend.md)へ進む