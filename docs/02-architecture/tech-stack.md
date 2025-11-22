---
title: 技術スタック選定理由
category: architecture
dependencies: [non-functional.md]
phase: 1
last-updated: 2024-11-22
---

# 技術スタック選定理由

## 1. フロントエンド技術選定

### 1.1 フレームワーク: Nuxt 3

#### 選定理由

| 要件 | Nuxt 3の利点 | 他の選択肢との比較 |
|------|------------|-----------------|
| **SSG対応** | 静的サイト生成が標準機能 | Next.js: 同等、Vite: 要追加設定 |
| **Vue 3エコシステム** | Vue 3の全機能活用可能 | React: 学習コスト高、Svelte: エコシステム小 |
| **開発効率** | Auto-imports、ファイルベースルーティング | 手動設定より効率的 |
| **パフォーマンス** | Nitroエンジン、最適化済み | 高速なビルドと実行 |
| **TypeScript** | ネイティブサポート | 型安全性の確保 |

```typescript
// Nuxt 3の特徴的な機能例
// Auto-imports（自動インポート）
export default defineNuxtConfig({
  imports: {
    dirs: ['stores', 'composables']
  }
});

// Server API Routes
export default defineEventHandler(async (event) => {
  return await $fetch('/api/products');
});
```

### 1.2 UIライブラリ: Volt (PrimeVue + Tailwind CSS)

#### Voltの特徴

```yaml
Volt:
  概要: PrimeVueとTailwind CSSの統合ライブラリ
  特徴:
    - Code Ownership: 完全なコード制御
    - WCAG AA準拠のアクセシビリティ
    - カスタマイズ性の高さ
    - 軽量なバンドルサイズ
```

#### 選定理由

| 観点 | Volt | Vuetify | Element Plus | Ant Design Vue |
|------|------|---------|--------------|----------------|
| **アクセシビリティ** | ◎ WCAG AA | ○ 部分対応 | △ 最小限 | ○ 部分対応 |
| **カスタマイズ性** | ◎ 完全制御 | △ 制限あり | ○ 中程度 | ○ 中程度 |
| **バンドルサイズ** | ◎ 最小限 | × 大きい | △ 中程度 | △ 中程度 |
| **学習コスト** | ○ Tailwind知識要 | ○ 独自API | ○ 標準的 | ○ 標準的 |

```vue
<!-- Voltコンポーネントの例 -->
<template>
  <VButton
    variant="primary"
    size="lg"
    :loading="isCalculating"
    @click="calculate"
  >
    <template #icon>
      <CalculatorIcon />
    </template>
    計算する
  </VButton>
</template>

<style>
/* Tailwindでカスタマイズ */
.v-button {
  @apply transition-all duration-200 hover:shadow-lg;
}
</style>
```

### 1.3 CSS: Tailwind CSS v4

#### 選定理由

```yaml
利点:
  開発速度: ユーティリティファーストで高速開発
  一貫性: デザインシステムの統一
  最適化: 未使用CSSの自動削除
  保守性: クラス名の標準化

v4の新機能:
  - CSS-firstアプローチ
  - カスケードレイヤー対応
  - パフォーマンス向上（3倍高速）
  - コンテナクエリサポート
```

### 1.4 状態管理: Pinia

#### 選定理由

| 観点 | Pinia | Vuex 4 | 理由 |
|------|-------|--------|------|
| **TypeScript** | ◎ 完全対応 | ○ 部分対応 | 型推論が優秀 |
| **DevTools** | ◎ 統合 | ○ 別途 | 開発効率向上 |
| **シンプルさ** | ◎ 直感的 | △ 複雑 | 学習コスト低 |
| **バンドルサイズ** | ◎ 2KB | △ 10KB | 軽量 |

```typescript
// Piniaストアの例
export const useCalculatorStore = defineStore('calculator', () => {
  // State
  const history = ref<Calculation[]>([]);
  const isOffline = ref(false);

  // Getters
  const recentCalculations = computed(() =>
    history.value.slice(0, 10)
  );

  // Actions
  const addCalculation = (calc: Calculation) => {
    history.value.unshift(calc);
    if (history.value.length > 100) {
      history.value.pop();
    }
  };

  return {
    history: readonly(history),
    isOffline: readonly(isOffline),
    recentCalculations,
    addCalculation
  };
});
```

### 1.5 バリデーション: Valibot

#### 選定理由

```typescript
// バンドルサイズ比較
// Valibot: ~3KB
// Zod: ~30KB
// Yup: ~50KB

// Valibotの実装例
import * as v from 'valibot';

export const ProductSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, '商品名を入力してください'),
    v.maxLength(100, '100文字以内で入力してください')
  ),
  price: v.pipe(
    v.number(),
    v.minValue(1, '1円以上で入力してください'),
    v.maxValue(1000000000, '10億円以下で入力してください')
  ),
  years: v.pipe(
    v.number(),
    v.minValue(0.5),
    v.maxValue(100),
    v.multipleOf(0.5)
  )
});

// Tree-shakable（必要な機能のみインポート）
import { parse, safeParse } from 'valibot';
```

## 2. バックエンド技術選定

### 2.1 BaaS: Supabase

#### 選定理由

| 要件 | Supabase | Firebase | AWS Amplify |
|------|----------|----------|-------------|
| **PostgreSQL** | ◎ ネイティブ | × NoSQL | △ Aurora |
| **リアルタイム** | ◎ 標準機能 | ◎ 標準機能 | △ 要設定 |
| **無料枠** | ◎ 寛大 | ○ 制限あり | △ 少ない |
| **オープンソース** | ◎ OSS | × プロプライエタリ | × プロプライエタリ |
| **型安全性** | ◎ 自動生成 | △ 手動 | △ 手動 |

```typescript
// Supabaseクライアントの型安全な実装
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// 型安全なクエリ
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'ガジェット')
  .order('created_at', { ascending: false });
// data: Product[] | null （型推論される）
```

### 2.2 データベース: PostgreSQL（Supabase）

#### 選定理由

```yaml
利点:
  - ACID準拠のトランザクション
  - 豊富な機能（JSON、全文検索、GIS）
  - 実績と安定性
  - RLS（Row Level Security）

スキーマ設計:
  - 正規化されたリレーショナル設計
  - インデックス最適化
  - パーティショニング対応
```

## 3. 開発環境技術選定

### 3.1 パッケージマネージャ: pnpm

#### 選定理由

| 観点 | pnpm | npm | yarn | bun |
|------|------|-----|------|-----|
| **ディスク効率** | ◎ シンボリックリンク | × 重複 | △ キャッシュ | ○ 効率的 |
| **速度** | ◎ 高速 | △ 遅い | ○ 普通 | ◎ 最速 |
| **厳格性** | ◎ 厳格 | △ 緩い | ○ 中間 | △ 緩い |
| **成熟度** | ◎ 安定 | ◎ 安定 | ◎ 安定 | △ 新しい |

```yaml
# pnpmの利点を活かした設定
# .npmrc
shamefully-hoist=false  # 厳格な依存関係管理
auto-install-peers=true # peerDependencies自動インストール
```

### 3.2 テストフレームワーク

#### 単体テスト: Vitest

```typescript
// Vitestを選んだ理由
// 1. Viteとの完全な統合
// 2. Jest互換API
// 3. 高速な実行（ESBuildベース）
// 4. ネイティブESM対応

import { describe, it, expect, vi } from 'vitest';

describe('CalculateDailyCost', () => {
  it('should calculate daily cost correctly', () => {
    const result = calculateDailyCost(150000, 3);
    expect(result).toBe(137); // 150000 / (3 * 365)
  });

  it('should handle mocked dependencies', () => {
    const mock = vi.fn(() => 42);
    expect(mock()).toBe(42);
  });
});
```

#### E2Eテスト: Playwright

```typescript
// Playwrightを選んだ理由
// 1. 複数ブラウザ対応（Chrome, Firefox, Safari）
// 2. 自動待機とリトライ
// 3. スクリーンショット・動画記録
// 4. モバイルデバイスエミュレーション

import { test, expect } from '@playwright/test';

test('calculate daily cost', async ({ page }) => {
  await page.goto('/');
  await page.fill('[name="price"]', '150000');
  await page.fill('[name="years"]', '3');
  await page.click('button:has-text("計算する")');

  await expect(page.locator('.daily-cost'))
    .toContainText('137円');
});
```

### 3.3 リンター/フォーマッター

#### ESLint + @antfu/eslint-config

```javascript
// 選定理由
// 1. Anthony Fuの設定は最新のベストプラクティス
// 2. TypeScript, Vue 3対応済み
// 3. Prettierとの競合なし
// 4. 合理的なデフォルト設定

// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({
  vue: true,
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  rules: {
    'no-console': 'warn',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  },
});
```

### 3.4 CI/CD: GitHub Actions

#### 選定理由

```yaml
利点:
  - GitHubとの完全統合
  - 無料枠が寛大（2000分/月）
  - マーケットプレイスの豊富なActions
  - シークレット管理
  - 並列実行対応

実装例:
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
```

### 3.5 ホスティング: Vercel

#### 選定理由

| 観点 | Vercel | Netlify | Cloudflare Pages | AWS |
|------|--------|---------|------------------|------|
| **Nuxt対応** | ◎ 公式 | ○ 対応 | ○ 対応 | △ 要設定 |
| **パフォーマンス** | ◎ エッジ | ○ CDN | ◎ エッジ | ○ CloudFront |
| **無料枠** | ◎ 寛大 | ○ 普通 | ◎ 寛大 | × 有料 |
| **DX** | ◎ 最高 | ○ 良好 | △ 普通 | × 複雑 |

## 4. 技術スタックまとめ

### 4.1 選定技術一覧

```yaml
フロントエンド:
  フレームワーク: Nuxt 3
  UI: Volt (PrimeVue + Tailwind CSS)
  言語: TypeScript
  状態管理: Pinia
  バリデーション: Valibot
  CSS: Tailwind CSS v4

バックエンド:
  BaaS: Supabase
  データベース: PostgreSQL
  認証: Supabase Auth（匿名）
  リアルタイム: Supabase Realtime

開発環境:
  パッケージ管理: pnpm
  Node管理: Volta
  単体テスト: Vitest
  E2Eテスト: Playwright
  リンター: ESLint
  フォーマッター: Prettier
  CI/CD: GitHub Actions
  ホスティング: Vercel
```

### 4.2 技術的な一貫性

```yaml
原則:
  - モダンだが枯れた技術を選択
  - エコシステムの充実度を重視
  - 型安全性の確保
  - バンドルサイズの最小化
  - 開発者体験の最大化
```

## 関連ドキュメント

- [アーキテクチャ概要](./overview.md) - 全体設計
- [環境構築ガイド](../03-development/setup.md) - セットアップ手順
- [コーディング規約](../03-development/coding-standards.md) - 開発規約
- [Phase 1実装](../05-implementation/phase-1-setup.md) - 実装開始