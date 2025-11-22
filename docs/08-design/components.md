---
title: コンポーネント設計書
category: design
dependencies: [screens.md, competitive-analysis.md, ../03-development/component-guide.md]
phase: 1
last-updated: 2024-11-22
---

# コンポーネント設計書

## 1. コンポーネント一覧

### 1.1 Phase別コンポーネント

```yaml
Phase 1 (MVP):
  Layout:
    - AppHeader
    - AppContainer
    - AppFooter

  Form:
    - TextField
    - NumberField
    - SliderField
    - PrimaryButton
    - SecondaryButton

  Display:
    - ResultCard
    - ComparisonItem
    - ComparisonList
    - HappinessScore

  Modal:
    - HappinessModal
    - ConfirmDialog

Phase 2 (拡張):
  - HistoryCard
  - StatsCard
  - BarChart
  - TabNav
  - SkeletonLoader

Phase 3 (高度機能):
  - LoginForm
  - ProfileCard
  - BadgeDisplay
```

---

## 2. Layout コンポーネント

### 2.1 AppHeader

#### 用途
全画面共通のヘッダー

#### Props

```typescript
interface AppHeaderProps {
  /** ロゴテキスト */
  title?: string
  /** 戻るボタン表示 */
  showBackButton?: boolean
  /** 戻るボタンのコールバック */
  onBack?: () => void
  /** メニューボタン表示 */
  showMenuButton?: boolean
  /** メニューボタンのコールバック */
  onMenuClick?: () => void
}
```

#### デフォルト値

```typescript
{
  title: 'にちわり！',
  showBackButton: false,
  showMenuButton: true
}
```

#### HTML構造

```vue
<template>
  <header class="app-header">
    <button
      v-if="showBackButton"
      class="back-button"
      @click="onBack"
      aria-label="戻る"
    >
      <lucide-icon name="chevron-left" :size="24" />
    </button>

    <h1 class="logo">{{ title }}</h1>

    <button
      v-if="showMenuButton"
      class="menu-button"
      @click="onMenuClick"
      aria-label="メニューを開く"
    >
      <lucide-icon name="menu" :size="24" />
    </button>
  </header>
</template>
```

#### スタイル仕様

```scss
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--color-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  position: sticky;
  top: 0;
  z-index: 100;

  .logo {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-primary);
  }

  .back-button,
  .menu-button {
    width: 44px;
    height: 44px;
    border: none;
    background: transparent;
    font-size: 24px;
    cursor: pointer;

    &:hover {
      background-color: var(--color-background);
      border-radius: 50%;
    }
  }
}
```

#### 使用例

```vue
<AppHeader
  :show-back-button="true"
  @back="router.back()"
/>
```

---

### 2.2 AppContainer

#### 用途
メインコンテンツのラッパー

#### Props

```typescript
interface AppContainerProps {
  /** 最大幅 */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  /** パディング */
  padding?: 'sm' | 'md' | 'lg'
}
```

#### HTML構造

```vue
<template>
  <div
    class="app-container"
    :class="[
      `max-width-${maxWidth}`,
      `padding-${padding}`
    ]"
  >
    <slot />
  </div>
</template>
```

#### スタイル仕様

```scss
.app-container {
  margin: 0 auto;

  &.max-width-sm { max-width: 600px; }
  &.max-width-md { max-width: 800px; }
  &.max-width-lg { max-width: 1000px; }
  &.max-width-xl { max-width: 1200px; }

  &.padding-sm { padding: 8px; }
  &.padding-md { padding: 16px; }
  &.padding-lg { padding: 24px; }
}
```

---

## 3. Form コンポーネント

### 3.1 TextField

#### 用途
テキスト入力フィールド

#### Props

```typescript
interface TextFieldProps {
  /** ラベル */
  label: string
  /** プレースホルダー */
  placeholder?: string
  /** Lucideアイコン名 */
  icon?: string
  /** 必須フラグ */
  required?: boolean
  /** 最大文字数 */
  maxLength?: number
  /** エラーメッセージ */
  error?: string
  /** v-model用 */
  modelValue: string
}
```

#### Emits

```typescript
{
  'update:modelValue': (value: string) => void
}
```

#### HTML構造

```vue
<template>
  <div class="text-field">
    <label :for="fieldId" class="label">
      <lucide-icon v-if="icon" :name="icon" :size="16" class="icon" />
      {{ label }}
      <span v-if="required" class="required">（必須）</span>
    </label>

    <input
      :id="fieldId"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :aria-required="required"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${fieldId}-error` : undefined"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input"
      :class="{ 'input--error': !!error }"
    />

    <p
      v-if="error"
      :id="`${fieldId}-error`"
      class="error-message"
      role="alert"
    >
      <lucide-icon name="alert-circle" :size="14" class="error-icon" />
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const fieldId = `text-field-${Math.random().toString(36).slice(2)}`
</script>
```

#### スタイル仕様

```scss
.text-field {
  margin-bottom: 16px;

  .label {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);

    .icon {
      color: var(--color-text-secondary);
    }

    .required {
      color: var(--color-text-secondary);
      font-size: 12px;
    }
  }

  .input {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(66, 165, 245, 0.1);
    }

    &--error {
      border-color: var(--color-error);
    }

    &::placeholder {
      color: #BDBDBD;
    }
  }

  .error-message {
    margin-top: 4px;
    font-size: 12px;
    color: var(--color-error);
  }
}
```

#### 使用例

```vue
<TextField
  label="商品名"
  icon="package"
  placeholder="例: iPhone 15 Pro"
  :max-length="100"
  v-model="productName"
  :error="productNameError"
/>
```

---

### 3.2 NumberField

#### 用途
数値入力フィールド（価格用）

#### Props

```typescript
interface NumberFieldProps {
  label: string
  icon?: string  // Lucideアイコン名
  required?: boolean
  min?: number
  max?: number
  unit?: string  // 単位（円、など）
  error?: string
  modelValue: number | null
}
```

#### 特徴

- カンマ区切り表示
- 数値キーボード（モバイル）
- 右寄せ
- 単位自動表示

#### HTML構造

```vue
<template>
  <div class="number-field">
    <label :for="fieldId" class="label">
      <span v-if="emoji" class="emoji">{{ emoji }}</span>
      {{ label }}
      <span v-if="required" class="required">（必須）</span>
    </label>

    <div class="input-wrapper">
      <input
        :id="fieldId"
        type="text"
        inputmode="numeric"
        :value="displayValue"
        :aria-required="required"
        :aria-invalid="!!error"
        @input="handleInput"
        @blur="handleBlur"
        class="input"
        :class="{ 'input--error': !!error }"
      />
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>

    <p v-if="error" class="error-message" role="alert">
      ⚠️ {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const displayValue = computed(() => {
  if (props.modelValue === null) return ''
  return props.modelValue.toLocaleString('ja-JP')
})

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value.replace(/,/g, '')
  const numValue = parseInt(value, 10)

  if (isNaN(numValue)) {
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', numValue)
  }
}
</script>
```

#### スタイル仕様

```scss
.number-field {
  .input-wrapper {
    position: relative;

    .input {
      text-align: right;
      padding-right: 40px; // 単位分のスペース
      font-size: 18px;
      font-weight: 500;
    }

    .unit {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      color: var(--color-text-secondary);
      pointer-events: none;
    }
  }
}
```

---

### 3.3 SliderField

#### 用途
スライダー + 数値入力（使用年数用）

#### Props

```typescript
interface SliderFieldProps {
  label: string
  emoji?: string
  required?: boolean
  min: number
  max: number
  step: number
  unit?: string
  modelValue: number
}
```

#### HTML構造

```vue
<template>
  <div class="slider-field">
    <label class="label">
      <span v-if="emoji" class="emoji">{{ emoji }}</span>
      {{ label }}
      <span v-if="required" class="required">（必須）</span>
    </label>

    <div class="slider-container">
      <!-- 数値入力 -->
      <input
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        @input="handleNumberInput"
        class="number-input"
      />
      <span v-if="unit" class="unit">{{ unit }}</span>

      <!-- スライダー -->
      <input
        type="range"
        :value="modelValue"
        :min="min"
        :max="displayMax"
        :step="step"
        @input="handleSliderInput"
        class="slider"
      />

      <!-- 範囲ラベル -->
      <div class="range-labels">
        <span>{{ min }}{{ unit }}</span>
        <span>{{ displayMax }}{{ unit }}+</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const displayMax = computed(() =>
  props.max > 10 ? 10 : props.max
)

const handleSliderInput = (e: Event) => {
  const value = parseFloat((e.target as HTMLInputElement).value)
  emit('update:modelValue', value)
}

const handleNumberInput = (e: Event) => {
  const value = parseFloat((e.target as HTMLInputElement).value)
  if (value >= props.min && value <= props.max) {
    emit('update:modelValue', value)
  }
}
</script>
```

#### スタイル仕様

```scss
.slider-field {
  .slider-container {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .number-input {
      width: 100px;
      padding: 8px;
      font-size: 16px;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      text-align: center;
    }

    .slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #E0E0E0;
      outline: none;
      -webkit-appearance: none;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--color-primary);
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      &::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--color-primary);
        cursor: pointer;
        border: none;
      }
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--color-text-secondary);
    }
  }
}
```

---

### 3.4 PrimaryButton

#### 用途
主要なアクション用ボタン

#### Props

```typescript
interface PrimaryButtonProps {
  /** ボタンテキスト */
  label: string
  /** ローディング状態 */
  loading?: boolean
  /** 無効状態 */
  disabled?: boolean
  /** フルワイド */
  fullWidth?: boolean
  /** サイズ */
  size?: 'sm' | 'md' | 'lg'
}
```

#### HTML構造

```vue
<template>
  <button
    :disabled="disabled || loading"
    :class="[
      'primary-button',
      `primary-button--${size}`,
      { 'primary-button--full-width': fullWidth }
    ]"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner" />
    <span v-else>{{ label }}</span>
  </button>
</template>
```

#### スタイル仕様

```scss
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 48px;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background-color: var(--color-primary);  /* #1976D2 */
  border: none;
  border-radius: 8px;  /* 24px → 8px に変更 */
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-dark);  /* #1565C0 */
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--sm {
    padding: 8px 24px;
    font-size: 14px;
  }

  &--lg {
    padding: 20px 64px;
    font-size: 18px;
  }

  &--full-width {
    width: 100%;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #FFFFFF;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 4. Display コンポーネント

### 4.1 ResultCard

#### 用途
日割り金額の結果表示カード

#### Props

```typescript
interface ResultCardProps {
  /** 日割り金額 */
  dailyCost: number
  /** アニメーション有効化 */
  animated?: boolean
}
```

#### デザインパターン

**パターンA: ラベル強調型（推奨）**
- 「1日あたり」を大きく太く表示
- 金額とのヒエラルキーを明確に

**パターンB: コンパクト型**
- 「1日あたり」を金額の上に配置
- よりコンパクトな表示

#### HTML構造（パターンA: ラベル強調型）

```vue
<template>
  <div class="result-card">
    <!-- 「1日あたり」を強調 -->
    <div class="label-wrapper">
      <lucide-icon name="lightbulb" :size="24" class="icon" />
      <h3 class="label">1日あたり</h3>
    </div>

    <!-- 金額 -->
    <p class="amount">
      <span class="currency">¥</span>
      <span class="value">{{ displayValue }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
const displayValue = ref(0)

watch(() => props.dailyCost, (newValue) => {
  if (props.animated) {
    animateValue(0, newValue, 800)
  } else {
    displayValue.value = newValue
  }
})

const animateValue = (start: number, end: number, duration: number) => {
  const startTime = Date.now()
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    displayValue.value = Math.floor(start + (end - start) * easeOut)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  animate()
}
</script>
```

#### スタイル仕様（パターンA: ラベル強調型）

```scss
.result-card {
  padding: 32px 24px;
  text-align: center;
  background: #FFFFFF;  // 白背景でコントラスト確保
  border: 2px solid #E3F2FD;  // 枠線でアクセント
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 24px 0;

  .label-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 12px;

    .icon {
      color: #1976D2;  // プライマリカラー（目立つ）
    }

    .label {
      font-size: 20px;  // 14px → 20px に拡大 ✨
      font-weight: 700;  // bold で強調 ✨
      color: #212121;  // メインテキスト (14.10:1 ✅)
      margin: 0;
    }
  }

  .amount {
    font-size: 56px;  // 48px → 56px にさらに拡大
    font-weight: 800;  // extrabold
    color: #1565C0;  // Primary Dark (5.03:1 ✅)
    line-height: 1.2;
    margin: 0;

    .currency {
      font-size: 36px;
      margin-right: 4px;
    }
  }
}
```

#### スタイル仕様（パターンB: コンパクト型）

```scss
.result-card {
  padding: 24px 20px;
  text-align: center;
  background: #FFFFFF;
  border: 2px solid #E3F2FD;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 24px 0;

  .label-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 8px;

    .icon {
      color: #1976D2;
    }

    .label {
      font-size: 16px;
      font-weight: 600;
      color: #212121;
      margin: 0;
    }
  }

  .amount {
    font-size: 48px;
    font-weight: 700;
    color: #1565C0;
    line-height: 1.2;

    .currency {
      font-size: 32px;
      margin-right: 4px;
    }
  }
}
```

#### WCAG 2.2 AA準拠チェック ✅

| 要素 | 色 | 背景 | コントラスト比 | 結果 |
|------|-----|------|--------------|------|
| ラベル「1日あたり」 | #212121 | #FFFFFF | 14.10:1 | ✅ |
| 金額 | #1565C0 | #FFFFFF | 5.03:1 | ✅ |
| アイコン | #1976D2 | #FFFFFF | 4.60:1 | ✅ |

すべてWCAG 2.2 AA基準（4.5:1以上）を満たしています ✨
```

---

### 4.2 ComparisonItem

#### 用途
比較アイテム1件の表示

#### Props

```typescript
interface ComparisonItemProps {
  /** 絵文字 */
  emoji: string
  /** アイテム名 */
  name: string
  /** 数量 */
  quantity: number
  /** 単位 */
  unit: string
}
```

#### HTML構造

```vue
<template>
  <div class="comparison-item">
    <span class="emoji">{{ emoji }}</span>
    <span class="name">{{ name }}</span>
    <span class="quantity">{{ formattedQuantity }}</span>
  </div>
</template>

<script setup lang="ts">
const formattedQuantity = computed(() => {
  const q = props.quantity
  return q < 0.1
    ? `約${(q * 100).toFixed(0)}%${props.unit}`
    : `${q.toFixed(1)}${props.unit}`
})
</script>
```

#### スタイル仕様

```scss
.comparison-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-background);
  }

  .emoji {
    font-size: 24px;
    flex-shrink: 0;
  }

  .name {
    flex: 1;
    font-size: 16px;
    color: var(--color-text);
  }

  .quantity {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-primary);
    white-space: nowrap;
  }
}
```

---

### 4.3 ComparisonList

#### 用途
比較アイテムのリスト表示

#### Props

```typescript
interface ComparisonListProps {
  /** 比較アイテムの配列 */
  items: Array<{
    id: string
    emoji: string
    name: string
    quantity: number
    unit: string
  }>
  /** 初期表示件数 */
  initialCount?: number
}
```

#### HTML構造

```vue
<template>
  <div class="comparison-list">
    <h3 class="title">
      <lucide-icon name="bar-chart-3" :size="20" class="icon" />
      身近なもので例えると…
    </h3>

    <div class="items">
      <ComparisonItem
        v-for="item in displayedItems"
        :key="item.id"
        v-bind="item"
      />
    </div>

    <button
      v-if="hasMore"
      @click="showAll = true"
      class="show-more"
    >
      もっと見る（残り{{ remainingCount }}件）
    </button>
  </div>
</template>

<script setup lang="ts">
const showAll = ref(false)

const displayedItems = computed(() =>
  showAll.value
    ? props.items
    : props.items.slice(0, props.initialCount || 3)
)

const hasMore = computed(() =>
  !showAll.value && props.items.length > (props.initialCount || 3)
)

const remainingCount = computed(() =>
  props.items.length - (props.initialCount || 3)
)
</script>
```

---

### 4.4 HappinessScore

#### 用途
幸福度スコアの表示（プログレスバー）

#### Props

```typescript
interface HappinessScoreProps {
  /** スコア（0-100） */
  score: number
  /** アニメーション */
  animated?: boolean
}
```

#### HTML構造

```vue
<template>
  <div class="happiness-score">
    <div class="score-header">
      <span class="label">幸福度スコア</span>
      <span class="value">{{ displayScore }} / 100</span>
    </div>

    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: `${displayScore}%` }"
        :class="scoreColorClass"
      />
    </div>

    <p class="message">{{ scoreMessage }}</p>
  </div>
</template>

<script setup lang="ts">
const displayScore = ref(0)

watchEffect(() => {
  if (props.animated) {
    animateScore(0, props.score, 800)
  } else {
    displayScore.value = props.score
  }
})

const scoreColorClass = computed(() => {
  if (displayScore.value >= 80) return 'progress-fill--excellent'
  if (displayScore.value >= 60) return 'progress-fill--good'
  if (displayScore.value >= 40) return 'progress-fill--fair'
  return 'progress-fill--poor'
})

const scoreMessage = computed(() => {
  if (displayScore.value >= 90) return 'めっちゃいい買い物！✨'
  if (displayScore.value >= 70) return 'なかなか良い買い物だね！'
  if (displayScore.value >= 50) return 'そこそこかな'
  if (displayScore.value >= 30) return 'もっといいのあったかも...'
  return '次はもっと考えよう💦'
})
</script>
```

#### スタイル仕様

```scss
.happiness-score {
  padding: 16px;
  background: var(--color-surface);
  border-radius: 12px;

  .score-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .label {
      font-size: 14px;
      color: var(--color-text-secondary);
    }

    .value {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text);
    }
  }

  .progress-bar {
    height: 8px;
    background: #E0E0E0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;

    .progress-fill {
      height: 100%;
      transition: width 0.8s ease-out;

      &--excellent { background: #66BB6A; }
      &--good { background: #42A5F5; }
      &--fair { background: #FDD835; }
      &--poor { background: #EF5350; }
    }
  }

  .message {
    font-size: 14px;
    color: var(--color-text-secondary);
    text-align: center;
  }
}
```

---

## 5. Modal コンポーネント

### 5.1 HappinessModal

#### 用途
幸福度スコア入力モーダル

#### Props

```typescript
interface HappinessModalProps {
  /** モーダル表示状態 */
  modelValue: boolean
  /** 初期値 */
  initialValues?: {
    frequency?: number
    satisfaction?: number
    necessity?: number
  }
}
```

#### Emits

```typescript
{
  'update:modelValue': (value: boolean) => void
  'submit': (values: {
    frequency: number
    satisfaction: number
    necessity: number
    score: number
  }) => void
}
```

#### HTML構造

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <div
          class="modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          @click.stop
        >
          <h2 id="modal-title" class="title">
            <lucide-icon name="smile" :size="24" class="icon" />
            この買い物、どうだった？
          </h2>

          <!-- 使用頻度 -->
          <div class="rating-group">
            <label class="rating-label">
              <lucide-icon name="trending-up" :size="16" class="icon" />
              使用頻度
            </label>
            <RatingInput
              v-model="frequency"
              :labels="['ほぼ使わない', 'たまに', '毎日使う']"
            />
          </div>

          <!-- 満足度 -->
          <div class="rating-group">
            <label class="rating-label">
              <lucide-icon name="star" :size="16" class="icon" />
              満足度
            </label>
            <RatingInput
              v-model="satisfaction"
              :labels="['不満', '普通', '超満足']"
            />
          </div>

          <!-- 必要性 -->
          <div class="rating-group">
            <label class="rating-label">
              <lucide-icon name="lightbulb" :size="16" class="icon" />
              必要性
            </label>
            <RatingInput
              v-model="necessity"
              :labels="['なくてもいい', 'あると便利', '絶対必要']"
            />
          </div>

          <!-- スコア表示 -->
          <HappinessScore
            v-if="isComplete"
            :score="calculatedScore"
            :animated="true"
          />

          <!-- アクション -->
          <div class="actions">
            <SecondaryButton
              label="キャンセル"
              @click="handleCancel"
            />
            <PrimaryButton
              label="保存"
              :disabled="!isComplete"
              @click="handleSubmit"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const frequency = ref<number | null>(null)
const satisfaction = ref<number | null>(null)
const necessity = ref<number | null>(null)

const isComplete = computed(() =>
  frequency.value !== null &&
  satisfaction.value !== null &&
  necessity.value !== null
)

const calculatedScore = computed(() => {
  if (!isComplete.value) return 0
  return Math.round(
    (frequency.value! * 0.4 +
     satisfaction.value! * 0.4 +
     necessity.value! * 0.2) * 20
  )
})

const handleSubmit = () => {
  emit('submit', {
    frequency: frequency.value!,
    satisfaction: satisfaction.value!,
    necessity: necessity.value!,
    score: calculatedScore.value
  })
  emit('update:modelValue', false)
}
</script>
```

#### スタイル仕様

```scss
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;

  .modal-content {
    background: var(--color-surface);
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

    .title {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 24px;
    }

    .rating-group {
      margin-bottom: 24px;

      .rating-label {
        display: block;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
      }
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;

  .modal-content {
    transition: transform 0.3s;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-content {
    transform: translateY(20px);
  }
}
```

---

## 6. Phase 2 コンポーネント

### 6.1 HistoryCard

#### 用途
履歴一覧の1件表示

#### Props

```typescript
interface HistoryCardProps {
  id: string
  productName: string
  dailyCost: number
  date: string
  happinessScore?: number
}
```

#### HTML構造

```vue
<template>
  <div class="history-card" @click="$emit('click', id)">
    <div class="header">
      <span class="product-name">
        <lucide-icon name="package" :size="16" class="icon" />
        {{ productName }}
      </span>
      <span class="daily-cost">¥{{ dailyCost.toLocaleString() }}/日</span>
    </div>

    <div class="footer">
      <span class="date">{{ formattedDate }}</span>
      <span v-if="happinessScore" class="score">
        <lucide-icon name="star" :size="14" class="icon" />
        {{ happinessScore }}点
      </span>
      <span v-else class="score--empty">未評価</span>
    </div>
  </div>
</template>
```

#### スタイル仕様

```scss
.history-card {
  padding: 16px;
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .product-name {
      font-size: 16px;
      font-weight: 600;
    }

    .daily-cost {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-primary);
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--color-text-secondary);

    .score {
      color: var(--color-accent);
      font-weight: 500;
    }

    .score--empty {
      color: #BDBDBD;
    }
  }
}
```

---

## 7. Volt UI マッピング

### 7.1 対応表

| カスタムコンポーネント | Volt UI | 備考 |
|---------------------|---------|------|
| PrimaryButton | Button (variant="primary") | カスタマイズ |
| SecondaryButton | Button (variant="outline") | カスタマイズ |
| TextField | InputText | ラッパー作成 |
| NumberField | InputNumber | カスタマイズ |
| SliderField | Slider | カスタマイズ |
| HappinessModal | Dialog | カスタマイズ |
| ConfirmDialog | ConfirmDialog | そのまま使用 |

### 7.2 Volt UI活用方針

```yaml
そのまま使用:
  - Card
  - Menu
  - Toast
  - ProgressSpinner

カスタマイズして使用:
  - Button（色・形状調整）
  - Dialog（アニメーション追加）
  - InputText（バリデーション追加）

完全カスタム:
  - ResultCard
  - ComparisonItem
  - HappinessScore
```

---

## 8. まとめ

このコンポーネント設計書に基づいて実装することで：

1. ✅ **再利用性の高いコンポーネント**
2. ✅ **一貫性のあるUI**
3. ✅ **アクセシビリティ対応**
4. ✅ **Volt UIとの統合**

が実現できます。

次は、カラー・タイポグラフィ・スペーシングなどの詳細を定義した `style-guide.md` を作成します。