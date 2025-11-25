---
title: 機能要件
category: requirements
dependencies: []
phase: 1
last-updated: 2024-11-22
---

# 機能要件

## 1. コア機能

### 1.1 減価償却計算機能

#### 入力項目

```yaml
商品名:
  type: string
  required: true
  maxLength: 100
  description: 購入を検討している商品の名称

価格:
  type: number
  required: true
  min: 1
  max: 1000000000 # 10億円
  description: 商品の購入価格（円）

予想使用年数:
  type: number
  required: true
  min: 0.5
  max: 100
  step: 0.5
  description: 商品を使用する予定年数
```

#### 処理ロジック

```typescript
// 計算式
interface CalculationResult {
  dailyCost: number // 価格 ÷ (年数 × 365)
  monthlyCost: number // 日割りコスト × 30
  yearlyCost: number // 価格 ÷ 年数
  totalDays: number // 年数 × 365
}

// 比較指標の算出
interface ComparisonMetrics {
  coffeeCount: number // 日割りコスト ÷ 200円（コーヒー1杯）
  lunchCount: number // 日割りコスト ÷ 500円（ランチ代）
  subscriptionCount: number // 月割りコスト ÷ 1000円（サブスク代）
}
```

#### 出力形式

- 1日あたりのコスト（円）
- 月額換算（円）
- 年額換算（円）
- 総使用日数
- 比較指標（コーヒー○杯分、ランチ○回分など）

### 1.2 商品サジェスト機能

#### 機能概要

商品名の入力時に、データベースから類似商品を検索して候補として表示する。

#### 実装仕様

```typescript
interface ProductSuggestion {
  name: string // 商品名
  price: number // 平均価格
  years: number // 平均耐用年数
  category: string // カテゴリ
  popularity: number // 人気度スコア
}

// サジェストロジック
-入力文字列での前方一致検索
- カテゴリによる絞り込み
- 人気度順でソート
- 最大10件まで表示
```

#### オフライン時の動作

- プリセットデータ（人気商品TOP30）から検索
- オンライン復帰時に最新データに更新

### 1.3 参考データベース機能

#### カテゴリ構成

```yaml
categories:
  - 家電
  - ファッション
  - 家具
  - ガジェット
  - スポーツ
  - 趣味
```

#### データ構造

```typescript
interface ReferenceProduct {
  id: string
  name: string // 商品名
  price: number // 平均価格
  priceRange: { // 価格帯
    min: number
    max: number
  }
  years: number // 平均耐用年数
  yearsRange: { // 耐用年数の幅
    min: number
    max: number
  }
  category: string // カテゴリ
  icon: string // 表示用アイコン（絵文字）
  description?: string // 商品説明
  lastUpdated: Date // 最終更新日
}
```

### 1.4 幸福度診断機能

#### チェックリスト項目

```typescript
interface HappinessChecklistItem {
  id: string
  question: string
  weight: number // 重要度（1-3）
  category: 'frequency' | 'value' | 'financial' | 'emotional'
}

const checklist: HappinessChecklistItem[] = [
  {
    id: 'daily-use',
    question: '毎日または週に数回は使用する予定',
    weight: 3,
    category: 'frequency'
  },
  {
    id: 'long-term-value',
    question: '長期的に価値が持続する（流行に左右されない）',
    weight: 2,
    category: 'value'
  },
  {
    id: 'quality-improvement',
    question: '生活の質や効率が明確に向上する',
    weight: 3,
    category: 'value'
  },
  {
    id: 'no-alternative',
    question: '同等の代替品やレンタルでは満足できない',
    weight: 2,
    category: 'value'
  },
  {
    id: 'affordable-maintenance',
    question: '維持費が収入の5%以下である',
    weight: 3,
    category: 'financial'
  },
  {
    id: 'delayed-gratification',
    question: '購入後1ヶ月経っても欲しいと思っている',
    weight: 2,
    category: 'emotional'
  },
  {
    id: 'experience-value',
    question: '体験や思い出作りに寄与する',
    weight: 2,
    category: 'emotional'
  },
  {
    id: 'self-investment',
    question: '健康や学習など自己投資になる',
    weight: 3,
    category: 'value'
  }
]
```

#### スコアリング算出

```typescript
interface HappinessScore {
  totalScore: number // 0-100%
  categoryScores: {
    frequency: number
    value: number
    financial: number
    emotional: number
  }
  recommendation: 'highly-recommended' | 'consider-more' | 'reconsider'
  advice: string
}

// スコア計算ロジック
function calculateScore(answers: boolean[]): HappinessScore {
  // 重み付きスコアの計算
  const weightedScore = answers.reduce((sum, answer, index) => {
    return sum + (answer ? checklist[index].weight : 0)
  }, 0)

  const maxScore = checklist.reduce((sum, item) => sum + item.weight, 0)
  const percentage = (weightedScore / maxScore) * 100

  // 推奨度の判定
  let recommendation: HappinessScore['recommendation']
  if (percentage >= 70)
    recommendation = 'highly-recommended'
  else if (percentage >= 40)
    recommendation = 'consider-more'
  else recommendation = 'reconsider'

  return { /* ... */ }
}
```

#### アドバイス表示

- **70%以上**: 「購入する価値が高いです！長期的な満足度が期待できます。」
- **40-69%**: 「もう少し検討が必要かもしれません。特に○○の観点を再考してみてください。」
- **40%未満**: 「再考をお勧めします。レンタルや代替品も検討してみてください。」

### 1.5 データ収集・トレンド機能

#### 収集データ

```typescript
interface SearchData {
  productName: string // 検索された商品名（匿名化）
  priceRange: string // 価格帯（例: "10万-20万"）
  yearsRange: string // 耐用年数帯（例: "3-5年"）
  category?: string // カテゴリ
  timestamp: Date // 検索日時
  calculated: boolean // 計算実行の有無
}
```

#### プライバシー保護

- IPアドレスは収集しない
- ユーザー識別子は使用しない
- 個人を特定できる情報は保存しない
- 集計データのみを表示

#### トレンド表示

```typescript
interface TrendData {
  popular: Product[] // 人気商品TOP10
  rising: Product[] // 急上昇商品TOP5
  categories: { // カテゴリ別統計
    name: string
    searchCount: number
    avgPrice: number
    avgYears: number
  }[]
  lastUpdated: Date
}
```

## 2. 科学的根拠に基づくTips機能

### 2.1 表示するTips

```typescript
interface ResearchTip {
  id: string
  title: string
  content: string
  source: {
    author: string
    year: number
    publication?: string
  }
  category: 'psychology' | 'economics' | 'behavioral'
}

const tips: ResearchTip[] = [
  {
    id: 'experience-vs-material',
    title: '経験 vs 物質',
    content: '経験への投資は物質的な購入より長期的な幸福度向上につながります。',
    source: {
      author: 'Gilovich & Kumar',
      year: 2015
    },
    category: 'psychology'
  },
  {
    id: 'adaptation',
    title: '適応の法則',
    content: '高価な買い物による幸福感は3-6ヶ月で元のレベルに戻ります。',
    source: {
      author: 'Kahneman & Deaton',
      year: 2010
    },
    category: 'psychology'
  },
  {
    id: 'time-buying',
    title: '時間を買う',
    content: '時間を節約する商品への投資が最も効率的に幸福度を向上させます。',
    source: {
      author: 'Whillans et al.',
      year: 2017
    },
    category: 'economics'
  },
  {
    id: 'comparison-trap',
    title: '比較の罠',
    content: '他人との比較で購入を決めると満足度が低下する傾向があります。',
    source: {
      author: 'Solnick & Hemenway',
      year: 1998
    },
    category: 'behavioral'
  },
  {
    id: 'delayed-satisfaction',
    title: '遅延満足',
    content: '30日ルールを使うと衝動買いの70%を防ぐことができます。',
    source: {
      author: 'Ariely & Wertenbroch',
      year: 2002
    },
    category: 'behavioral'
  },
  {
    id: 'pareto-principle',
    title: '80/20ルール',
    content: '多機能製品でも実際に使用される機能は約20%程度です。',
    source: {
      author: 'Nielsen Norman Group',
      year: 2020
    },
    category: 'economics'
  }
]
```

### 2.2 Tips表示ロジック

- ページ読み込み時にランダムで1つ表示
- 「次のTips」ボタンで切り替え可能
- ユーザーの計算結果に応じて関連Tipsを優先表示

## 3. UI/UX要件

### 3.0 UIデザインガイドライン

```yaml
禁止事項:
  - 絵文字の使用禁止（アプリ内のUI全般）
  - 「使い方」セクションは設置しない（直感的に使えるUIを目指す）

アイコン:
  - 絵文字ではなくアイコンライブラリ（Heroicons等）を使用
  - 装飾目的の絵文字は一切使用しない
```

### 3.1 レスポンシブデザイン

```yaml
breakpoints:
  mobile: 0-767px
  tablet: 768-1023px
  desktop: 1024px以上

layout:
  mobile:
    - 1カラムレイアウト
    - 縦スクロール最適化
    - タッチ操作対応

  tablet:
    - 2カラムレイアウト可
    - サイドバー表示

  desktop:
    - 3カラムレイアウト可
    - サイドパネル表示
    - ホバーエフェクト
```

### 3.2 インタラクション

```yaml
animations:
  - ページ遷移: スムーズフェード
  - 計算実行: ローディングスピナー
  - 結果表示: スライドイン
  - エラー表示: シェイクアニメーション

feedback:
  - 入力検証: リアルタイムエラー表示
  - 計算完了: サクセストースト
  - オフライン: 警告バナー
  - コピー操作: 確認トースト
```

### 3.3 アクセシビリティ

- すべてのインタラクティブ要素にフォーカス表示
- 適切なARIAラベル
- キーボードのみで全機能操作可能
- スクリーンリーダー対応
- 高コントラストモード対応

## 関連ドキュメント

- [非機能要件](./non-functional.md) - パフォーマンス、セキュリティ要件
- [アーキテクチャ概要](../02-architecture/overview.md) - システム設計
- [UI実装ガイド](../05-implementation/phase-2-core.md) - 実装手順
