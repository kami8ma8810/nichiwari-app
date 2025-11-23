---
title: 非機能要件
category: requirements
dependencies: []
phase: 1
last-updated: 2024-11-22
---

# 非機能要件

## 1. パフォーマンス要件

### 1.1 レスポンスタイム

```yaml
初回ロード:
  目標: 3秒以内
  測定条件:
    - 3G回線相当（1.6Mbps）
    - 初回訪問（キャッシュなし）
  対策:
    - 静的サイト生成（SSG）
    - 画像の遅延読み込み
    - Critical CSSのインライン化
    - コード分割とツリーシェイキング

計算結果表示:
  目標: 100ms以内
  測定条件:
    - クライアントサイド処理
    - 入力完了から結果表示まで
  対策:
    - Web Worker活用
    - 計算ロジックの最適化
    - Virtual DOM効率化

API応答時間:
  目標: 500ms以内
  測定条件:
    - Supabase APIコール
    - 日本国内からのアクセス
  対策:
    - エッジ関数の活用
    - データベースインデックス最適化
    - 接続プーリング
```

### 1.2 Lighthouse Score目標

```yaml
Performance: 90以上
  metrics:
    - FCP (First Contentful Paint): < 1.8s
    - LCP (Largest Contentful Paint): < 2.5s
    - FID (First Input Delay): < 100ms
    - CLS (Cumulative Layout Shift): < 0.1
    - TTI (Time to Interactive): < 3.8s
    - TBT (Total Blocking Time): < 200ms

Accessibility: 100
  requirements:
    - 適切な見出し構造
    - 十分なカラーコントラスト
    - フォーカス管理
    - ARIAラベル

Best Practices: 90以上
  requirements:
    - HTTPS使用
    - 安全な外部リンク
    - 適切なエラーハンドリング
    - 最新のWeb API使用

SEO: 90以上
  requirements:
    - メタデータ最適化
    - 構造化データ
    - sitemap.xml
    - robots.txt

PWA: 対応
  requirements:
    - Service Worker
    - manifest.json
    - オフライン対応
    - インストール可能
```

### 1.3 スケーラビリティ

```yaml
同時接続数:
  目標: 1000ユーザー/分
  対策:
    - CDN活用（静的アセット）
    - Vercelのエッジネットワーク
    - Supabase接続プーリング

データ容量:
  検索ログ: 最大100万件/月
  参考データ: 最大1万商品
  対策:
    - 古いデータの自動アーカイブ
    - データ圧縮
    - 効率的なインデックス設計

トラフィック:
  想定: 10万PV/月（初年度）
  ピーク: 1万PV/日
  対策:
    - オートスケーリング
    - レート制限実装
    - キャッシュ戦略
```

## 2. アクセシビリティ要件

### 2.1 準拠基準

```yaml
WCAG 2.1 Level AA:
  必須要件:
    知覚可能:
      - 画像の代替テキスト
      - 動画のキャプション
      - 十分なコントラスト比（4.5:1以上）
      - テキストの拡大縮小（200%まで）

    操作可能:
      - キーボードアクセス
      - 十分な時間制限
      - 発作の防止
      - ナビゲーション支援

    理解可能:
      - 読みやすさ
      - 予測可能な動作
      - 入力支援
      - エラー説明

    堅牢:
      - 互換性確保
      - 支援技術対応
```

### 2.2 実装要件

```typescript
// フォーカス管理
interface FocusManagement {
  tabIndex: number // タブ順序
  focusVisible: boolean // フォーカス表示
  skipLinks: boolean // スキップリンク
  focusTrap: boolean // モーダル内フォーカストラップ
}

// ARIAサポート
interface ARIASupport {
  role: string // 要素の役割
  ariaLabel: string // ラベル
  ariaDescribedBy: string // 説明
  ariaLive: 'polite' | 'assertive' // 動的コンテンツ
  ariaExpanded: boolean // 展開状態
}

// カラーコントラスト
interface ColorContrast {
  normal: {
    large: 3.0 // 18pt以上
    small: 4.5 // 18pt未満
  }
  enhanced: {
    large: 4.5
    small: 7.0
  }
}
```

### 2.3 スクリーンリーダー対応

```yaml
対応スクリーンリーダー:
  Windows:
    - NVDA
    - JAWS
  macOS:
    - VoiceOver
  Mobile:
    - iOS VoiceOver
    - Android TalkBack

実装要件:
  - セマンティックHTML使用
  - 適切な見出し階層
  - ランドマーク設定
  - フォーム要素のラベル付け
  - エラーメッセージの関連付け
  - 動的コンテンツの通知
```

## 3. 対応環境

### 3.1 ブラウザサポート

```yaml
デスクトップ:
  Chrome:
    versions: 最新2バージョン
    share: 約65%

  Edge:
    versions: 最新2バージョン
    share: 約15%

  Firefox:
    versions: 最新2バージョン
    share: 約10%

  Safari:
    versions: 最新2バージョン
    share: 約10%

モバイル:
  iOS Safari:
    versions: iOS 15以上
    share: 約60%

  Chrome Mobile:
    versions: 最新2バージョン
    share: 約35%

  Samsung Internet:
    versions: 最新2バージョン
    share: 約5%
```

### 3.2 デバイス対応

```yaml
画面解像度:
  最小: 320px (iPhone SE)
  最大: 3840px (4K)

デバイスカテゴリ:
  スマートフォン:
    - iPhone 12以降
    - Android 10以降
    - 画面: 375-414px

  タブレット:
    - iPad (全モデル)
    - Android タブレット
    - 画面: 768-1024px

  デスクトップ:
    - Windows 10以降
    - macOS 11以降
    - 画面: 1024px以上

入力方式:
  - タッチ操作
  - マウス操作
  - キーボード操作
  - 音声入力（将来対応）
```

### 3.3 ネットワーク環境

```yaml
対応回線:
  3G:
    speed: 1.6Mbps
    latency: 300ms
    対策: アグレッシブなキャッシュ

  4G:
    speed: 12Mbps
    latency: 100ms
    対策: 標準的な最適化

  5G/WiFi:
    speed: 100Mbps+
    latency: 20ms
    対策: 高品質アセット配信

オフライン:
  必須機能:
    - 計算機能
    - 結果表示
    - 履歴閲覧

  制限機能:
    - データ送信
    - トレンド取得
    - 最新データ同期
```

## 4. セキュリティ要件

### 4.1 データ保護

```yaml
暗号化:
  通信: TLS 1.3
  保存: AES-256

認証:
  方式: 匿名認証（Supabase Auth）
  セッション: JWT
  有効期限: 24時間

個人情報:
  収集: 最小限
  保存期間: 90日
  削除: 自動削除
```

### 4.2 セキュリティ対策

```yaml
XSS対策:
  - Vue.jsの自動エスケープ
  - CSP (Content Security Policy)
  - サニタイゼーション

CSRF対策:
  - SameSite Cookie
  - CSRFトークン

SQLインジェクション対策:
  - プリペアドステートメント
  - パラメータバインディング
  - Supabaseの型安全クエリ

レート制限:
  - API: 100リクエスト/分
  - 計算: 1000回/時
  - 検索: 50回/分
```

## 5. 可用性要件

### 5.1 稼働率目標

```yaml
SLA目標: 99.9% (月間43分以内のダウンタイム)

計画メンテナンス:
  頻度: 月1回
  時間帯: 深夜2-4時
  事前通知: 1週間前

障害対応:
  初動: 15分以内
  復旧目標: 2時間以内
  通知方法: Webサイト、Twitter
```

### 5.2 バックアップ・リカバリ

```yaml
バックアップ:
  頻度:
    - データベース: 日次
    - 設定ファイル: 変更時
    - コード: コミット時

  保存期間:
    - 日次: 7日間
    - 週次: 4週間
    - 月次: 12ヶ月

リカバリ:
  RPO (Recovery Point Objective): 24時間
  RTO (Recovery Time Objective): 4時間
```

## 6. 保守性要件

### 6.1 コード品質

```yaml
metrics:
  テストカバレッジ: 80%以上
  重複コード: 5%以下
  循環的複雑度: 10以下
  技術的負債: 5日以内

tools:
  静的解析: ESLint, TypeScript
  フォーマッタ: Prettier
  テスト: Vitest, Playwright
  CI/CD: GitHub Actions
```

### 6.2 ドキュメント

```yaml
required:
  - README.md
  - API仕様書
  - データベース設計書
  - 運用手順書
  - トラブルシューティングガイド

format:
  - Markdown
  - JSDoc/TSDoc
  - Storybook
  - OpenAPI Specification
```

## 7. 国際化要件（将来対応）

### 7.1 言語対応

```yaml
初期リリース:
  - 日本語

将来対応予定:
  - 英語
  - 中国語（簡体字）
  - 韓国語
```

### 7.2 地域対応

```yaml
通貨:
  - 円（JPY）
  - ドル（USD）※将来
  - ユーロ（EUR）※将来

日付形式:
  - YYYY/MM/DD（日本）
  - MM/DD/YYYY（米国）
  - DD/MM/YYYY（欧州）

数値形式:
  - 3桁カンマ区切り
  - 小数点表記
```

## 関連ドキュメント

- [機能要件](./functional.md) - 機能仕様
- [セキュリティ設計](../06-infrastructure/security.md) - セキュリティ詳細
- [パフォーマンス最適化](../05-implementation/phase-5-release.md) - 最適化手法
