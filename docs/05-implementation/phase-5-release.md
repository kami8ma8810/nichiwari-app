---
title: Phase 5 - リリース準備
category: implementation
dependencies: [phase-4-polish.md, ../01-requirements/business.md]
phase: 5
last-updated: 2024-11-22
---

# Phase 5 - リリース準備

## 1. 概要

### 1.1 Phase 5の目標

```yaml
目標:
  - 本番環境準備
  - リリース前テスト
  - ドキュメント整備
  - マーケティング準備

期間: 2日

成果物:
  - 本番環境
  - リリースノート
  - マーケティング素材
  - 運用ドキュメント
```

## 2. リリース前チェックリスト

### 2.1 技術チェック

```yaml
✅ コード品質:
  - [ ] TypeScript型エラーなし
  - [ ] ESLintエラーなし
  - [ ] 単体テストカバレッジ80%以上
  - [ ] E2Eテスト全パス
  - [ ] ビルド成功
  - [ ] バンドルサイズ確認

✅ パフォーマンス:
  - [ ] Lighthouse Performance 90+
  - [ ] First Contentful Paint < 1.8s
  - [ ] Largest Contentful Paint < 2.5s
  - [ ] Time to Interactive < 3.8s
  - [ ] Total Blocking Time < 200ms

✅ アクセシビリティ:
  - [ ] Lighthouse Accessibility 100
  - [ ] キーボード操作可能
  - [ ] スクリーンリーダー対応
  - [ ] カラーコントラスト基準

✅ セキュリティ:
  - [ ] 環境変数設定
  - [ ] CSPヘッダー設定
  - [ ] HTTPS強制
  - [ ] 脆弱性スキャン完了
```

### 2.2 機能チェック

```yaml
✅ コア機能:
  - [ ] 計算機能動作
  - [ ] 履歴保存機能
  - [ ] オフライン動作
  - [ ] PWAインストール

✅ ブラウザ対応:
  - [ ] Chrome (最新)
  - [ ] Firefox (最新)
  - [ ] Safari (最新)
  - [ ] Edge (最新)
  - [ ] iOS Safari
  - [ ] Android Chrome

✅ デバイス対応:
  - [ ] デスクトップ表示
  - [ ] タブレット表示
  - [ ] モバイル表示
  - [ ] レスポンシブ動作
```

## 3. 本番環境設定

### 3.1 Vercel設定

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".output",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nuxtjs",
  "regions": ["hnd1"],
  "functions": {
    "app/**/*.js": {
      "memory": 512,
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.nichiwari.app/$1",
      "permanent": false
    }
  ]
}
```

### 3.2 環境変数

```bash
# Production環境変数
NUXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
NUXT_PUBLIC_APP_URL=https://nichiwari.app
NUXT_PUBLIC_GA_ID=G-XXXXX
NUXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### 3.3 ドメイン設定

```yaml
ドメイン: nichiwari.app
DNS設定:
  - A: 76.76.21.21 (Vercel)
  - AAAA: 2606:4700:3030::6815:1515 (Vercel)
SSL: Vercel自動証明書
```

## 4. 監視設定

### 4.1 Google Analytics

```typescript
// plugins/gtag.client.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (!config.public.gaId)
    return

  // Google Analytics スクリプト挿入
  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${config.public.gaId}`,
        async: true
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.public.gaId}', {
            page_path: window.location.pathname,
          });
        `
      }
    ]
  })

  // ページビュー追跡
  const router = useRouter()
  router.afterEach((to) => {
    gtag('config', config.public.gaId, {
      page_path: to.fullPath
    })
  })
})
```

### 4.2 Sentry設定

```typescript
// plugins/sentry.client.ts
import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  if (!config.public.sentryDsn)
    return

  const { vueApp } = nuxtApp

  Sentry.init({
    app: vueApp,
    dsn: config.public.sentryDsn,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(
          nuxtApp.$router
        )
      }),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false
      })
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  })
})
```

## 5. リリースノート

### 5.1 CHANGELOG.md

```markdown
# Changelog

## [1.0.0] - 2024-11-25

### 🎉 初回リリース

#### ✨ 機能

- **計算機能**: 購入価格と使用年数から1日あたりの価値を計算
- **比較表示**: コーヒーやペットボトルなど身近なものと比較
- **履歴管理**: 計算結果を最大100件まで保存
- **幸福度スコア**: 使用頻度と満足度から幸福度を算出
- **オフライン対応**: ネット接続なしでも基本機能が利用可能
- **PWA対応**: ホーム画面に追加してアプリとして利用可能

#### 🎨 デザイン

- レスポンシブデザイン対応
- ダークモード対応（今後実装予定）
- アクセシビリティ WCAG 2.1 AA準拠

#### 🔧 技術仕様

- Nuxt 3 + Vue 3
- TypeScript
- Tailwind CSS
- Supabase
- Vercel ホスティング

### 今後の予定

- 共有機能の強化
- 商品カテゴリ別の分析
- 月次レポート機能
- 多言語対応
```

## 6. マーケティング準備

### 6.1 OGP設定

```vue
<!-- app.vue -->
<script setup lang="ts">
useHead({
  title: 'にちわり！ - 買い物の価値を見える化',
  meta: [
    {
      name: 'description',
      content: '高い買い物も1日あたりで考えれば意外とお得かも？購入価格を日割り計算して、買い物の価値を見える化するアプリです。'
    },
    // Open Graph
    { property: 'og:title', content: 'にちわり！ - 買い物の価値を見える化' },
    { property: 'og:description', content: '高い買い物も1日あたりで考えれば意外とお得かも？' },
    { property: 'og:image', content: 'https://nichiwari.app/og-image.png' },
    { property: 'og:url', content: 'https://nichiwari.app' },
    { property: 'og:type', content: 'website' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'にちわり！' },
    { name: 'twitter:description', content: '買い物の価値を見える化' },
    { name: 'twitter:image', content: 'https://nichiwari.app/twitter-card.png' }
  ]
})
</script>
```

### 6.2 プレスキット

```markdown
# にちわり！プレスキット

## アプリ概要

- **名称**: にちわり！
- **キャッチコピー**: 買い物の価値を見える化
- **URL**: https://nichiwari.app
- **カテゴリ**: 生活・ユーティリティ

## 特徴

1. シンプルな操作で1日あたりの価値を計算
2. 身近なものと比較して価値を実感
3. オフラインでも使える
4. 完全無料・広告なし

## スクリーンショット

- [ホーム画面](./assets/screenshots/home.png)
- [計算結果](./assets/screenshots/result.png)
- [履歴画面](./assets/screenshots/history.png)

## ロゴ素材

- [ロゴ（カラー）](./assets/logo/logo-color.svg)
- [ロゴ（モノクロ）](./assets/logo/logo-mono.svg)
- [アイコン](./assets/logo/icon.png)

## お問い合わせ

contact@nichiwari.app
```

## 7. 運用準備

### 7.1 バックアップ戦略

```yaml
データベース:
  - 日次自動バックアップ（Supabase）
  - 週次エクスポート
  - 月次アーカイブ

コード:
  - Git（GitHub）
  - タグ付けリリース
  - ブランチ保護

ログ:
  - エラーログ（Sentry）
  - アクセスログ（Vercel Analytics）
  - カスタムイベント（Google Analytics）
```

### 7.2 サポート体制

```yaml
問い合わせ対応:
  - メール: support@nichiwari.app
  - Twitter: @nichiwari_app
  - GitHub Issues

FAQ:
  - よくある質問ページ
  - 使い方ガイド
  - トラブルシューティング

更新計画:
  - 2週間ごとのバグ修正
  - 月次での機能追加
  - 四半期ごとの大型アップデート
```

## 8. ローンチ手順

### 8.1 段階的リリース

```yaml
Day 1 - ソフトローンチ:
  - 限定公開（社内・友人）
  - フィードバック収集
  - 緊急修正対応

Day 3 - ベータリリース:
  - SNSで限定告知
  - 早期ユーザー獲得
  - 使用状況モニタリング

Day 7 - 正式リリース:
  - プレスリリース
  - ProductHunt投稿
  - SNS告知拡大
```

### 8.2 リリース当日の作業

```bash
# 1. 最終ビルド
pnpm build

# 2. デプロイ
vercel --prod

# 3. 動作確認
- [ ] トップページ表示
- [ ] 計算機能
- [ ] データ保存
- [ ] PWAインストール

# 4. 監視開始
- [ ] Sentry確認
- [ ] Analytics確認
- [ ] パフォーマンス監視

# 5. 告知
- [ ] Twitter投稿
- [ ] ブログ記事公開
- [ ] ProductHunt投稿
```

## 9. 緊急時対応

### 9.1 ロールバック手順

```bash
# Vercelでの即座ロールバック
vercel rollback

# または特定バージョンへ
vercel alias set nichiwari-xxx.vercel.app nichiwari.app
```

### 9.2 ホットフィックス

```bash
# 緊急修正ブランチ
git checkout -b hotfix/critical-bug main
# 修正実施
git add .
git commit -m "fix: 緊急バグ修正"
git push origin hotfix/critical-bug

# デプロイ
vercel --prod
```

## 成功指標

```yaml
初週目標:
  - DAU: 100人
  - 計算実行数: 500回
  - PWAインストール: 50件

初月目標:
  - MAU: 1,000人
  - リピート率: 30%
  - 平均滞在時間: 3分

3ヶ月目標:
  - MAU: 5,000人
  - リピート率: 40%
  - 口コミ拡散: 100件
```

## 関連ドキュメント

- [ビジネス要件](../01-requirements/business.md)
- [デプロイメント設定](../06-infrastructure/deployment.md)
- [監視設定](../06-infrastructure/monitoring.md)
