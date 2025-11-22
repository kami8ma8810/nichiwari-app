---
title: Phase 1 - 初期セットアップ
category: implementation
dependencies: [../03-development/setup.md, ../02-architecture/tech-stack.md]
phase: 1
last-updated: 2024-11-22
---

# Phase 1 - 初期セットアップ

## 1. 概要

### 1.1 Phase 1の目標

```yaml
目標:
  - 開発環境の構築
  - プロジェクト基盤の確立
  - CI/CDパイプラインの設定
  - 基本的なアーキテクチャ実装

期間: 2日

成果物:
  - Nuxt 3プロジェクト
  - TypeScript設定
  - Tailwind CSS + Volt UI
  - テスト環境
  - CI/CD基盤
```

### 1.2 作業チェックリスト

- [ ] Node.js/pnpm環境構築
- [ ] Nuxt 3プロジェクト作成
- [ ] TypeScript設定
- [ ] Tailwind CSS + Volt UI設定
- [ ] Pinia設定
- [ ] Valibot設定
- [ ] Vitest設定
- [ ] Playwright設定
- [ ] ESLint/Prettier設定
- [ ] Git/GitHub設定
- [ ] CI/CD設定
- [ ] Supabase初期設定
- [ ] 環境変数設定

## 2. プロジェクト作成

### 2.1 Nuxt 3プロジェクト初期化

```bash
# プロジェクト作成
pnpm dlx nuxi@latest init nichiwari-app
cd nichiwari-app

# 依存関係インストール
pnpm install

# 開発サーバー起動確認
pnpm dev
```

### 2.2 プロジェクト構造

```
nichiwari-app/
├── .github/               # GitHub Actions設定
├── assets/               # スタイル・画像
│   ├── css/
│   └── images/
├── components/           # Vueコンポーネント
│   ├── common/          # 共通コンポーネント
│   ├── domain/          # ドメイン固有
│   └── layout/          # レイアウト
├── composables/         # Composables
├── domain/             # ドメイン層
│   ├── entities/
│   ├── repositories/
│   └── value-objects/
├── application/        # アプリケーション層
│   ├── use-cases/
│   └── services/
├── infrastructure/     # インフラ層
│   ├── supabase/
│   └── storage/
├── layouts/           # レイアウト
├── middleware/        # ミドルウェア
├── pages/            # ページコンポーネント
├── plugins/          # プラグイン
├── public/           # 静的ファイル
├── server/           # サーバーAPI
├── stores/           # Piniaストア
├── test/            # テスト
│   ├── unit/
│   ├── e2e/
│   └── fixtures/
├── types/           # 型定義
├── utils/           # ユーティリティ
├── .env.example     # 環境変数例
├── nuxt.config.ts   # Nuxt設定
├── package.json
├── tsconfig.json    # TypeScript設定
└── vitest.config.ts # Vitest設定
```

## 3. 基本パッケージインストール

### 3.1 依存関係追加

```bash
# UIフレームワーク
pnpm add @primevue/volt @primevue/core @primevue/themes
pnpm add tailwindcss@next @tailwindcss/forms @tailwindcss/typography

# 状態管理
pnpm add @pinia/nuxt pinia

# バリデーション
pnpm add valibot

# ユーティリティ
pnpm add @vueuse/nuxt @vueuse/core

# 開発依存
pnpm add -D @nuxtjs/tailwindcss
pnpm add -D @nuxt/devtools
pnpm add -D @nuxt/test-utils
pnpm add -D vitest @vitest/ui happy-dom
pnpm add -D @vue/test-utils
pnpm add -D @playwright/test
pnpm add -D eslint @antfu/eslint-config
pnpm add -D prettier
pnpm add -D husky lint-staged
pnpm add -D @types/node
```

## 4. 設定ファイル作成

### 4.1 Nuxt設定

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-22',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module'
  ],

  css: [
    '@/assets/css/main.css',
    '@primevue/volt/volt.css'
  ],

  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  },

  nitro: {
    preset: 'vercel',
    storage: {
      cache: {
        driver: 'redis',
        // Vercelの場合KV使用
      }
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  },

  experimental: {
    payloadExtraction: false // SSG最適化
  },

  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }
  },

  app: {
    head: {
      title: 'にちわり！ - 買い物の価値を見える化',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '購入価格を1日あたりの金額に変換して、買い物の価値を見える化するアプリ' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  ssr: false, // SPAモード（オフライン対応のため）

  imports: {
    dirs: [
      'stores',
      'domain/**',
      'application/**'
    ]
  }
})
```

### 4.2 TypeScript設定

```json
// tsconfig.json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "types": [
      "@nuxt/types",
      "@nuxtjs/tailwindcss",
      "@pinia/nuxt",
      "@types/node"
    ],
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["./src/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.vue"
  ],
  "exclude": [
    "node_modules",
    ".nuxt",
    "dist"
  ]
}
```

### 4.3 Tailwind CSS設定

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        }
      },
      fontFamily: {
        sans: [
          'Hiragino Sans',
          'Hiragino Kaku Gothic ProN',
          'Noto Sans JP',
          'sans-serif'
        ]
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
} satisfies Config
```

```css
/* assets/css/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply text-gray-900 antialiased;
  }

  body {
    @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-primary-500 text-white rounded-lg
           hover:bg-primary-600 active:bg-primary-700
           transition-colors duration-200
           font-medium shadow-sm;
  }

  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg
           focus:ring-2 focus:ring-primary-500 focus:border-transparent
           transition-all duration-200;
  }

  .card {
    @apply bg-white rounded-xl shadow-lg p-6;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## 5. ドメイン層実装

### 5.1 値オブジェクト

```typescript
// domain/value-objects/Money.ts
export class Money {
  constructor(private readonly _value: number) {
    if (!Number.isInteger(_value)) {
      throw new Error('金額は整数である必要があります')
    }
    if (_value < 0) {
      throw new Error('金額は0以上である必要があります')
    }
    if (_value > 1000000000) {
      throw new Error('金額は10億円以下である必要があります')
    }
  }

  get value(): number {
    return this._value
  }

  add(other: Money): Money {
    return new Money(this._value + other.value)
  }

  subtract(other: Money): Money {
    const result = this._value - other.value
    if (result < 0) {
      throw new Error('減算結果が負の値になります')
    }
    return new Money(result)
  }

  equals(other: Money): boolean {
    return this._value === other.value
  }

  format(): string {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(this._value)
  }
}
```

```typescript
// domain/value-objects/Years.ts
export class Years {
  constructor(private readonly _value: number) {
    if (_value < 0.5) {
      throw new Error('使用年数は0.5年以上である必要があります')
    }
    if (_value > 100) {
      throw new Error('使用年数は100年以下である必要があります')
    }
    if (_value % 0.5 !== 0) {
      throw new Error('使用年数は0.5年単位で入力してください')
    }
  }

  get value(): number {
    return this._value
  }

  toDays(): number {
    return Math.floor(this._value * 365)
  }
}
```

### 5.2 エンティティ

```typescript
// domain/entities/Product.ts
import { Money } from '../value-objects/Money'
import { Years } from '../value-objects/Years'
import { DailyCost } from '../value-objects/DailyCost'

export class Product {
  constructor(
    private readonly _name: string,
    private readonly _price: Money,
    private readonly _usageYears: Years
  ) {
    if (!_name || _name.trim().length === 0) {
      throw new Error('商品名は必須です')
    }
    if (_name.length > 100) {
      throw new Error('商品名は100文字以内で入力してください')
    }
  }

  get name(): string {
    return this._name
  }

  get price(): Money {
    return this._price
  }

  get usageYears(): Years {
    return this._usageYears
  }

  calculateDailyCost(): DailyCost {
    const days = this._usageYears.toDays()
    const dailyCost = Math.floor(this._price.value / days)
    return new DailyCost(dailyCost)
  }
}
```

## 6. テスト環境設定

### 6.1 Vitest設定

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

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
        '.nuxt/',
        'test/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '~': resolve(__dirname, './')
    }
  }
})
```

```typescript
// test/setup.ts
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Nuxt auto-imports モック
vi.stubGlobal('defineNuxtPlugin', vi.fn())
vi.stubGlobal('useState', vi.fn())
vi.stubGlobal('useRuntimeConfig', vi.fn(() => ({
  public: {
    supabaseUrl: 'http://localhost:54321',
    supabaseAnonKey: 'test-key'
  }
})))

// Vue Test Utils設定
config.global.mocks = {
  $t: (key: string) => key
}
```

### 6.2 最初のテスト

```typescript
// test/unit/domain/value-objects/Money.test.ts
import { describe, it, expect } from 'vitest'
import { Money } from '@/domain/value-objects/Money'

describe('Money', () => {
  it('正の整数で作成できる', () => {
    const money = new Money(150000)
    expect(money.value).toBe(150000)
  })

  it('負の値は拒否される', () => {
    expect(() => new Money(-1)).toThrow('金額は0以上である必要があります')
  })

  it('通貨形式でフォーマットできる', () => {
    const money = new Money(150000)
    expect(money.format()).toBe('¥150,000')
  })
})
```

## 7. CI/CD設定

### 7.1 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit
      - run: pnpm test:coverage

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: .output
```

## 8. 環境変数設定

### 8.1 環境変数ファイル

```bash
# .env.example
# Supabase
NUXT_PUBLIC_SUPABASE_URL=your_supabase_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App
NUXT_PUBLIC_APP_URL=http://localhost:3000

# Development
NODE_ENV=development
```

### 8.2 Vercel環境変数

```bash
# Vercel Dashboard で設定
NUXT_PUBLIC_SUPABASE_URL=[Production Supabase URL]
NUXT_PUBLIC_SUPABASE_ANON_KEY=[Production Anon Key]
NUXT_PUBLIC_APP_URL=https://nichiwari.app
```

## 9. Supabase初期設定

### 9.1 プロジェクト作成

```sql
-- Supabase SQL Editor で実行

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 1 AND price <= 1000000000),
  years DECIMAL(4,1) NOT NULL CHECK (years >= 0.5 AND years <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calculations table
CREATE TABLE calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  daily_cost INTEGER NOT NULL,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Happiness scores table
CREATE TABLE happiness_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calculation_id UUID REFERENCES calculations(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  frequency INTEGER CHECK (frequency >= 1 AND frequency <= 5),
  satisfaction INTEGER CHECK (satisfaction >= 1 AND satisfaction <= 5),
  necessity INTEGER CHECK (necessity >= 1 AND necessity <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_calculations_user_id ON calculations(user_id);
CREATE INDEX idx_calculations_created_at ON calculations(created_at DESC);
```

### 9.2 RLS設定

```sql
-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE happiness_scores ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーポリシー
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON calculations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read own calculations" ON calculations
  FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL
  );
```

## 10. 初回起動確認

### 10.1 開発サーバー起動

```bash
# 環境変数設定
cp .env.example .env
# .envファイルを編集して実際の値を設定

# 開発サーバー起動
pnpm dev

# ブラウザで http://localhost:3000 を開く
```

### 10.2 テスト実行

```bash
# 単体テスト
pnpm test:unit

# カバレッジ
pnpm test:coverage

# Linting
pnpm lint
```

### 10.3 ビルド確認

```bash
# プロダクションビルド
pnpm build

# プレビュー
pnpm preview
```

## 完了チェックリスト

- [x] Nuxt 3プロジェクト作成
- [x] TypeScript厳格モード設定
- [x] Tailwind CSS設定
- [x] ドメイン層の基本実装
- [x] テスト環境構築
- [x] CI/CD設定
- [x] Supabase初期設定
- [x] 環境変数設定
- [x] 初回起動確認

## 次のフェーズ

[Phase 2 - UIコンポーネント実装](./phase-2-ui.md)へ進む

## 関連ドキュメント

- [環境構築ガイド](../03-development/setup.md)
- [技術スタック](../02-architecture/tech-stack.md)
- [コーディング規約](../03-development/coding-standards.md)