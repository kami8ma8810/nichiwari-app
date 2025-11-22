---
title: サンプルデータ
category: reference
dependencies: [../04-testing/test-data.md, ./database-schema.md]
phase: 1
last-updated: 2024-11-22
---

# サンプルデータ

## 1. 商品マスターデータ

### 1.1 カテゴリ別商品例

```typescript
// data/products.ts
export const sampleProducts = [
  // 電子機器
  {
    name: 'iPhone 15 Pro',
    price: 159800,
    years: 2,
    category: 'electronics',
    expectedDailyCost: 219
  },
  {
    name: 'MacBook Air M2',
    price: 164800,
    years: 4,
    category: 'electronics',
    expectedDailyCost: 113
  },
  {
    name: 'Apple Watch Series 9',
    price: 59800,
    years: 3,
    category: 'electronics',
    expectedDailyCost: 55
  },
  {
    name: 'AirPods Pro',
    price: 39800,
    years: 2,
    category: 'electronics',
    expectedDailyCost: 54
  },

  // 家電
  {
    name: '洗濯機（ドラム式）',
    price: 200000,
    years: 10,
    category: 'appliances',
    expectedDailyCost: 55
  },
  {
    name: '冷蔵庫（450L）',
    price: 150000,
    years: 10,
    category: 'appliances',
    expectedDailyCost: 41
  },
  {
    name: '電子レンジ',
    price: 30000,
    years: 7,
    category: 'appliances',
    expectedDailyCost: 12
  },
  {
    name: 'ロボット掃除機',
    price: 80000,
    years: 5,
    category: 'appliances',
    expectedDailyCost: 44
  },

  // ファッション
  {
    name: 'ビジネススーツ',
    price: 50000,
    years: 3,
    category: 'fashion',
    expectedDailyCost: 46
  },
  {
    name: 'スニーカー',
    price: 15000,
    years: 1.5,
    category: 'fashion',
    expectedDailyCost: 27
  },
  {
    name: '腕時計（高級）',
    price: 300000,
    years: 20,
    category: 'fashion',
    expectedDailyCost: 41
  },
  {
    name: 'リュック',
    price: 12000,
    years: 3,
    category: 'fashion',
    expectedDailyCost: 11
  },

  // 趣味・娯楽
  {
    name: 'PlayStation 5',
    price: 66980,
    years: 5,
    category: 'hobby',
    expectedDailyCost: 37
  },
  {
    name: 'ロードバイク',
    price: 200000,
    years: 8,
    category: 'hobby',
    expectedDailyCost: 68
  },
  {
    name: 'デジタル一眼カメラ',
    price: 180000,
    years: 5,
    category: 'hobby',
    expectedDailyCost: 99
  },
  {
    name: 'ゴルフクラブセット',
    price: 100000,
    years: 10,
    category: 'hobby',
    expectedDailyCost: 27
  }
]
```

## 2. 比較アイテムデータ

### 2.1 価格帯別比較アイテム

```typescript
// data/comparisons.ts
export const comparisonItems = [
  // 10円以下
  {
    name: 'うまい棒',
    price: 12,
    emoji: '🍡',
    unit: '本',
    minDailyCost: 1,
    maxDailyCost: 10
  },

  // 10-50円
  {
    name: '駄菓子',
    price: 30,
    emoji: '🍬',
    unit: '個',
    minDailyCost: 10,
    maxDailyCost: 50
  },

  // 50-100円
  {
    name: 'ガム',
    price: 100,
    emoji: '🍬',
    unit: 'パック',
    minDailyCost: 50,
    maxDailyCost: 100
  },

  // 100-200円
  {
    name: 'コンビニコーヒー',
    price: 110,
    emoji: '☕',
    unit: '杯',
    minDailyCost: 100,
    maxDailyCost: 150
  },
  {
    name: 'ペットボトル飲料',
    price: 150,
    emoji: '🥤',
    unit: '本',
    minDailyCost: 150,
    maxDailyCost: 200
  },

  // 200-500円
  {
    name: 'おにぎり',
    price: 200,
    emoji: '🍙',
    unit: '個',
    minDailyCost: 200,
    maxDailyCost: 250
  },
  {
    name: 'サンドイッチ',
    price: 350,
    emoji: '🥪',
    unit: '個',
    minDailyCost: 300,
    maxDailyCost: 400
  },
  {
    name: 'カップラーメン',
    price: 200,
    emoji: '🍜',
    unit: '個',
    minDailyCost: 180,
    maxDailyCost: 250
  },

  // 500-1000円
  {
    name: '牛丼',
    price: 500,
    emoji: '🍚',
    unit: '杯',
    minDailyCost: 450,
    maxDailyCost: 550
  },
  {
    name: 'ランチ',
    price: 800,
    emoji: '🍱',
    unit: '食',
    minDailyCost: 700,
    maxDailyCost: 900
  },
  {
    name: 'スタバ（トール）',
    price: 500,
    emoji: '☕',
    unit: '杯',
    minDailyCost: 450,
    maxDailyCost: 600
  },

  // 1000円以上
  {
    name: 'ディナー',
    price: 2000,
    emoji: '🍽️',
    unit: '食',
    minDailyCost: 1500,
    maxDailyCost: 2500
  },
  {
    name: '映画チケット',
    price: 1900,
    emoji: '🎬',
    unit: '枚',
    minDailyCost: 1800,
    maxDailyCost: 2000
  },
  {
    name: 'タクシー（初乗り）',
    price: 500,
    emoji: '🚕',
    unit: '回',
    minDailyCost: 400,
    maxDailyCost: 600
  },

  // サブスクリプション
  {
    name: 'Netflix',
    price: 990,
    emoji: '📺',
    unit: '月',
    minDailyCost: 33,
    maxDailyCost: 33
  },
  {
    name: 'Spotify',
    price: 980,
    emoji: '🎵',
    unit: '月',
    minDailyCost: 33,
    maxDailyCost: 33
  },
  {
    name: 'ジム会費',
    price: 8000,
    emoji: '💪',
    unit: '月',
    minDailyCost: 267,
    maxDailyCost: 267
  }
]
```

## 3. 幸福度スコアサンプル

### 3.1 スコア計算パターン

```typescript
// data/happiness-patterns.ts
export const happinessPatterns = [
  {
    name: '高頻度・高満足',
    frequency: 5,
    satisfaction: 5,
    necessity: 4,
    score: 93, // (5 * 0.4 + 5 * 0.4 + 4 * 0.2) * 20
    message: 'めちゃくちゃいい買い物！毎日使って大満足✨'
  },
  {
    name: '高頻度・低満足',
    frequency: 5,
    satisfaction: 2,
    necessity: 3,
    score: 60, // (5 * 0.4 + 2 * 0.4 + 3 * 0.2) * 20
    message: 'よく使うけど、もっといいものがあったかも...'
  },
  {
    name: '低頻度・高満足',
    frequency: 2,
    satisfaction: 5,
    necessity: 3,
    score: 60, // (2 * 0.4 + 5 * 0.4 + 3 * 0.2) * 20
    message: '使うときは最高だけど、そんなに使わないかな'
  },
  {
    name: 'バランス型',
    frequency: 3,
    satisfaction: 4,
    necessity: 4,
    score: 72, // (3 * 0.4 + 4 * 0.4 + 4 * 0.2) * 20
    message: 'そこそこ使って、そこそこ満足。悪くない買い物'
  },
  {
    name: '必需品',
    frequency: 4,
    satisfaction: 3,
    necessity: 5,
    score: 68, // (4 * 0.4 + 3 * 0.4 + 5 * 0.2) * 20
    message: '生活に必要だから買ったけど、特別感はないかな'
  }
]
```

## 4. テスト用ユーザーデータ

### 4.1 ペルソナ別ユーザー

```typescript
// data/test-users.ts
export const testUsers = [
  {
    id: 'user-001',
    name: 'テクノロジー愛好家',
    email: 'tech@example.com',
    profile: {
      age: 28,
      occupation: 'エンジニア',
      interests: ['ガジェット', 'プログラミング', 'ゲーム']
    },
    purchaseHistory: [
      { productId: 'iphone-15-pro', date: '2024-01-15' },
      { productId: 'macbook-air-m2', date: '2023-06-20' },
      { productId: 'ps5', date: '2023-01-10' }
    ]
  },
  {
    id: 'user-002',
    name: '節約志向の主婦',
    email: 'saver@example.com',
    profile: {
      age: 35,
      occupation: '主婦',
      interests: ['料理', '節約', '家計管理']
    },
    purchaseHistory: [
      { productId: 'washing-machine', date: '2023-03-01' },
      { productId: 'refrigerator', date: '2022-12-01' }
    ]
  },
  {
    id: 'user-003',
    name: 'アウトドア派',
    email: 'outdoor@example.com',
    profile: {
      age: 32,
      occupation: '営業',
      interests: ['キャンプ', 'サイクリング', '写真']
    },
    purchaseHistory: [
      { productId: 'road-bike', date: '2023-04-15' },
      { productId: 'camera', date: '2023-07-20' }
    ]
  }
]
```

## 5. 分析用統計データ

### 5.1 計算履歴トレンドデータ

```typescript
// data/analytics.ts
export const analyticsData = {
  // 日別計算数
  dailyCalculations: [
    { date: '2024-11-01', count: 120 },
    { date: '2024-11-02', count: 135 },
    { date: '2024-11-03', count: 98 },
    { date: '2024-11-04', count: 156 },
    { date: '2024-11-05', count: 143 },
    { date: '2024-11-06', count: 167 },
    { date: '2024-11-07', count: 189 }
  ],

  // カテゴリ別割合
  categoryDistribution: [
    { category: 'electronics', percentage: 35 },
    { category: 'appliances', percentage: 20 },
    { category: 'fashion', percentage: 15 },
    { category: 'hobby', percentage: 25 },
    { category: 'others', percentage: 5 }
  ],

  // 価格帯分布
  priceRanges: [
    { range: '0-10000', count: 45 },
    { range: '10000-50000', count: 120 },
    { range: '50000-100000', count: 89 },
    { range: '100000-200000', count: 56 },
    { range: '200000+', count: 23 }
  ],

  // 使用年数分布
  yearsDistribution: [
    { years: '0.5-1', percentage: 8 },
    { years: '1-2', percentage: 25 },
    { years: '2-3', percentage: 30 },
    { years: '3-5', percentage: 22 },
    { years: '5-10', percentage: 12 },
    { years: '10+', percentage: 3 }
  ]
}
```

## 6. E2Eテスト用データセット

### 6.1 シナリオ別テストデータ

```typescript
// data/e2e-scenarios.ts
export const e2eScenarios = {
  // 基本計算フロー
  basicCalculation: {
    input: {
      name: 'テスト商品',
      price: 10000,
      years: 2
    },
    expected: {
      dailyCost: 14,
      comparisons: ['うまい棒 1本分', 'ガム 0.14パック分']
    }
  },

  // 境界値テスト
  boundaryValues: [
    {
      name: '最小値',
      price: 1,
      years: 0.5,
      expectedDailyCost: 1
    },
    {
      name: '最大値',
      price: 1000000000,
      years: 100,
      expectedDailyCost: 27397
    },
    {
      name: '中間値',
      price: 50000,
      years: 3,
      expectedDailyCost: 46
    }
  ],

  // 幸福度評価フロー
  happinessEvaluation: {
    calculation: {
      name: 'iPhone 15 Pro',
      price: 159800,
      years: 2
    },
    evaluation: {
      frequency: 5,
      satisfaction: 4,
      necessity: 3
    },
    expectedScore: 80
  },

  // オフラインシナリオ
  offlineScenario: {
    actions: [
      'ネットワーク切断',
      '計算実行',
      'ローカル保存確認',
      'ネットワーク復帰',
      '同期確認'
    ],
    expectedResults: [
      '計算機能は動作',
      'データはIndexedDBに保存',
      'オンライン復帰後に自動同期'
    ]
  }
}
```

## 7. パフォーマンステスト用大量データ

### 7.1 負荷テスト用データ生成

```typescript
// data/performance-test.ts
export function generateBulkData(count: number) {
  const products = []
  const calculations = []

  for (let i = 0; i < count; i++) {
    const product = {
      id: `product-${i}`,
      name: `テスト商品${i}`,
      price: Math.floor(Math.random() * 100000) + 1000,
      years: Math.floor(Math.random() * 10) + 1,
      category: ['electronics', 'appliances', 'fashion', 'hobby'][i % 4]
    }
    products.push(product)

    const calculation = {
      id: `calc-${i}`,
      productId: product.id,
      dailyCost: Math.floor(product.price / (product.years * 365)),
      userId: `user-${Math.floor(i / 100)}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }
    calculations.push(calculation)
  }

  return { products, calculations }
}

// 使用例
const testData = {
  small: generateBulkData(100),     // 100件
  medium: generateBulkData(1000),    // 1,000件
  large: generateBulkData(10000),    // 10,000件
  stress: generateBulkData(100000)   // 100,000件
}
```

## 8. データシード用SQL

### 8.1 初期データ投入

```sql
-- seed.sql
-- 比較アイテムマスター
INSERT INTO comparisons (name, price, emoji, unit, category, is_active) VALUES
('うまい棒', 12, '🍡', '本', 'snack', true),
('コンビニコーヒー', 110, '☕', '杯', 'drink', true),
('ペットボトル', 150, '🥤', '本', 'drink', true),
('おにぎり', 200, '🍙', '個', 'food', true),
('牛丼', 500, '🍚', '杯', 'food', true),
('ランチ', 800, '🍱', '食', 'food', true),
('スタバ', 500, '☕', '杯', 'drink', true),
('Netflix', 990, '📺', '月', 'subscription', true),
('Spotify', 980, '🎵', '月', 'subscription', true),
('ジム会費', 8000, '💪', '月', 'subscription', true);

-- テスト用商品データ
INSERT INTO products (name, price, years) VALUES
('iPhone 15 Pro', 159800, 2.0),
('MacBook Air M2', 164800, 4.0),
('洗濯機', 200000, 10.0),
('冷蔵庫', 150000, 10.0),
('ビジネススーツ', 50000, 3.0),
('PlayStation 5', 66980, 5.0),
('ロードバイク', 200000, 8.0),
('デジタル一眼カメラ', 180000, 5.0);

-- テスト用計算履歴
WITH product_ids AS (
  SELECT id, price, years FROM products LIMIT 5
)
INSERT INTO calculations (product_id, daily_cost, user_id)
SELECT
  id,
  FLOOR(price / (years * 365)),
  NULL
FROM product_ids;
```

### 8.2 開発環境リセット

```bash
#!/bin/bash
# scripts/reset-dev-data.sh

# データベースリセット
supabase db reset

# シードデータ投入
supabase db seed

# サンプルデータ生成
node scripts/generate-sample-data.js

echo "開発データがリセットされました"
```

## 9. モックAPIレスポンス

### 9.1 MSW (Mock Service Worker) 定義

```typescript
// mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  // 計算API
  rest.post('/api/calculate', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id: 'calc-mock-001',
          product: {
            id: 'prod-mock-001',
            name: req.body.name || 'モック商品',
            price: req.body.price,
            years: req.body.years
          },
          dailyCost: Math.floor(req.body.price / (req.body.years * 365)),
          comparisons: [
            { id: 'comp-001', name: 'コーヒー', quantity: 0.5 },
            { id: 'comp-002', name: 'おにぎり', quantity: 0.3 }
          ],
          createdAt: new Date().toISOString()
        }
      })
    )
  }),

  // 履歴取得API
  rest.get('/api/calculations', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          items: sampleProducts.slice(0, 5).map((p, i) => ({
            id: `calc-${i}`,
            product: p,
            dailyCost: p.expectedDailyCost,
            createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
          })),
          total: 5,
          limit: 20,
          offset: 0
        }
      })
    )
  })
]
```

## 10. Storybook用データ

### 10.1 コンポーネントストーリー用Props

```typescript
// stories/data.ts
export const storybookData = {
  // 計算結果カード
  calculationCard: {
    default: {
      product: 'iPhone 15 Pro',
      price: 159800,
      years: 2,
      dailyCost: 219,
      comparisons: ['コーヒー2杯分']
    },
    expensive: {
      product: 'Tesla Model 3',
      price: 5000000,
      years: 8,
      dailyCost: 1712,
      comparisons: ['ランチ2食分']
    },
    cheap: {
      product: 'Kindle',
      price: 10000,
      years: 3,
      dailyCost: 9,
      comparisons: ['うまい棒1本分']
    }
  },

  // 幸福度メーター
  happinessMeter: {
    high: { score: 90, color: 'success' },
    medium: { score: 60, color: 'warning' },
    low: { score: 30, color: 'danger' }
  },

  // チャートデータ
  charts: {
    trend: analyticsData.dailyCalculations,
    distribution: analyticsData.categoryDistribution,
    comparison: analyticsData.priceRanges
  }
}
```

## 関連ドキュメント

- [テストデータ管理](../04-testing/test-data.md)
- [データベーススキーマ](./database-schema.md)
- [API仕様書](./api-spec.md)