---
title: スタイルガイド
category: design
dependencies: [competitive-analysis.md, components.md]
phase: 1
last-updated: 2024-11-22
---

# スタイルガイド

## 1. カラーシステム

### 1.1 プライマリカラー

```css
/* ブルー - メインカラー（WCAG 2.2 AA準拠） */
--color-primary: #1976d2; /* 白テキスト 4.60:1 ✅ */
--color-primary-dark: #1565c0; /* 白テキスト 5.75:1 ✅ */
--color-primary-light: #42a5f5; /* 装飾・アイコン用（テキスト不可） */
--color-primary-lighter: #e3f2fd; /* 背景用 */

使用場所: -メインボタン背景（白テキスト） - リンク - アクティブ状態 - プログレスバー - フォーカスリング;
```

### 1.2 アクセントカラー

```css
/* オレンジ - 強調・ポジティブ（WCAG 2.2 AA準拠） */
--color-accent: #FF9800;          /* 黒テキスト 7.47:1 ✅ */
--color-accent-dark: #F57C00;     /* 黒テキスト 5.95:1 ✅ */
--color-accent-light: #FFB74D;    /* 装飾用 */
--color-accent-lighter: #FFF3E0;  /* 背景用 */

使用場所:
- 幸福度スコア（黒テキスト）
- 特別な通知（黒テキスト）
- CTA（Call to Action）（黒テキスト）
- ハイライト

⚠️ 重要: アクセントカラーには黒テキスト（#212121）を使用してください
```

### 1.3 ステータスカラー

```css
/* 成功 - グリーン（WCAG 2.2 AA準拠） */
--color-success: #2E7D32;         /* 白テキスト 5.13:1 ✅ */
--color-success-dark: #1B5E20;    /* 白テキスト 6.92:1 ✅ */
--color-success-light: #A5D6A7;   /* 装飾用 */
--color-success-lighter: #E8F5E9; /* 背景用 */

/* 警告 - アンバー（WCAG 2.2 AA準拠） */
--color-warning: #FFA000;         /* 黒テキスト 7.88:1 ✅ */
--color-warning-dark: #FF8F00;    /* 黒テキスト 8.52:1 ✅ */
--color-warning-light: #FFCA28;   /* 装飾用 */
--color-warning-lighter: #FFF8E1; /* 背景用 */

/* エラー - レッド（WCAG 2.2 AA準拠） */
--color-error: #D32F2F;           /* 白テキスト 4.98:1 ✅ */
--color-error-dark: #C62828;      /* 白テキスト 5.62:1 ✅ */
--color-error-light: #EF9A9A;     /* 装飾用 */
--color-error-lighter: #FFEBEE;   /* 背景用 */

/* 情報 - シアン（WCAG 2.2 AA準拠） */
--color-info: #00838F;            /* 白テキスト 4.52:1 ✅ */
--color-info-dark: #006064;       /* 白テキスト 6.23:1 ✅ */
--color-info-light: #80DEEA;      /* 装飾用 */
--color-info-lighter: #E0F7FA;    /* 背景用 */

⚠️ 重要:
- 成功・エラー・情報: 白テキスト（#FFFFFF）を使用
- 警告: 黒テキスト（#212121）を使用
```

### 1.4 ニュートラルカラー

```css
/* グレースケール */
--color-black: #000000;
--color-gray-900: #212121; /* メインテキスト */
--color-gray-800: #424242;
--color-gray-700: #616161;
--color-gray-600: #757575; /* セカンダリテキスト */
--color-gray-500: #9e9e9e;
--color-gray-400: #bdbdbd; /* プレースホルダー */
--color-gray-300: #e0e0e0; /* ボーダー */
--color-gray-200: #eeeeee;
--color-gray-100: #f5f5f5;
--color-gray-50: #fafafa; /* 背景 */
--color-white: #ffffff; /* サーフェス */
```

### 1.5 セマンティックトークン

```css
/* テキストカラー */
--color-text: var(--color-gray-900);
--color-text-secondary: var(--color-gray-600);
--color-text-disabled: var(--color-gray-400);
--color-text-inverse: var(--color-white);

/* 背景カラー */
--color-background: var(--color-gray-50);
--color-surface: var(--color-white);
--color-surface-raised: var(--color-white);
--color-surface-overlay: rgba(0, 0, 0, 0.6);

/* ボーダーカラー */
--color-border: var(--color-gray-300);
--color-border-light: var(--color-gray-200);
--color-border-dark: var(--color-gray-400);

/* シャドウカラー */
--shadow-color: rgba(0, 0, 0, 0.1);
--shadow-color-medium: rgba(0, 0, 0, 0.15);
--shadow-color-strong: rgba(0, 0, 0, 0.3);
```

### 1.6 ダークモード

```css
/* ダークモード用カラーパレット（Phase 2） */
@media (prefers-color-scheme: dark) {
  --color-text: #e0e0e0;
  --color-text-secondary: #b0b0b0;
  --color-background: #121212;
  --color-surface: #1e1e1e;
  --color-surface-raised: #2c2c2c;
  --color-border: #404040;

  /* プライマリカラーは明度調整 */
  --color-primary: #64b5f6;
  --color-accent: #ffb74d;
}
```

---

## 2. タイポグラフィ

### 2.1 フォントファミリー

```css
/* 日本語 + 欧文 */
--font-family-base:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo,
  sans-serif;

/* 数値専用（等幅・読みやすさ優先） */
--font-family-numeric: 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', Menlo, Monaco, Consolas, monospace;
```

### 2.2 フォントサイズ

```css
/* モバイルファースト */
--font-size-xs: 12px; /* キャプション */
--font-size-sm: 14px; /* 小さめテキスト */
--font-size-base: 16px; /* 基本テキスト */
--font-size-lg: 18px; /* 大きめテキスト */
--font-size-xl: 20px; /* サブタイトル */
--font-size-2xl: 24px; /* タイトル */
--font-size-3xl: 32px; /* 見出し */
--font-size-4xl: 48px; /* 日割り金額 */
--font-size-5xl: 64px; /* 超大見出し */

/* デスクトップ（1024px以上） */
@media (min-width: 1024px) {
  --font-size-base: 18px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 28px;
  --font-size-3xl: 36px;
  --font-size-4xl: 56px;
}
```

### 2.3 フォントウェイト

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;

使用ガイド:
- 本文: regular (400)
- 強調: medium (500) or semibold (600)
- 見出し: bold (700)
- 超強調: extrabold (800)
```

### 2.4 行間（Line Height）

```css
--line-height-tight: 1.2; /* 見出し */
--line-height-snug: 1.4; /* サブタイトル */
--line-height-normal: 1.6; /* 本文 */
--line-height-relaxed: 1.8; /* 読みやすさ重視 */
--line-height-loose: 2; /* 余裕のある行間 */
```

### 2.5 文字間隔（Letter Spacing）

```css
--letter-spacing-tighter: -0.05em;
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;

使用ガイド:
- 大見出し: tighter（詰める）
- 本文: normal
- 小さいテキスト: wide（広げる）
```

### 2.6 テキストスタイル定義

```css
/* 日割り金額（超重要） */
.text-daily-cost {
  font-family: var(--font-family-numeric);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-primary);
}

/* ページタイトル */
.text-page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text);
}

/* セクション見出し */
.text-section-heading {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
  color: var(--color-text);
}

/* 本文 */
.text-body {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
  color: var(--color-text);
}

/* キャプション */
.text-caption {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}

/* ラベル */
.text-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--color-text);
}
```

---

## 3. スペーシング

### 3.1 スペーシングスケール

```css
/* 4pxベースのスケール */
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

使用例:
- margin: var(--space-4);
- padding: var(--space-6);
- gap: var(--space-2);
```

### 3.2 余白ルール

```css
/* ページ余白 */
.container-mobile {
  padding: var(--space-4);
}
.container-tablet {
  padding: var(--space-6);
}
.container-desktop {
  padding: var(--space-8);
}

/* セクション間 */
.section-spacing {
  margin-bottom: var(--space-8);
}

/* カード内 */
.card-padding-sm {
  padding: var(--space-3);
}
.card-padding-md {
  padding: var(--space-4);
}
.card-padding-lg {
  padding: var(--space-6);
}

/* 要素間 */
.stack-xs {
  gap: var(--space-2);
}
.stack-sm {
  gap: var(--space-3);
}
.stack-md {
  gap: var(--space-4);
}
.stack-lg {
  gap: var(--space-6);
}
```

### 3.3 コンポーネント別余白

```yaml
TextField:
  padding: 12px 16px (space-3 space-4)
  margin-bottom: 16px (space-4)

Button:
  padding-sm: 8px 24px (space-2 space-6)
  padding-md: 16px 48px (space-4 space-12)
  padding-lg: 20px 64px (space-5 space-16)

Card:
  padding: 16px (space-4)
  margin-bottom: 16px (space-4)

Modal:
  padding: 24px (space-6)

Section:
  margin-bottom: 32px (space-8)
```

---

## 4. 角丸（Border Radius）

### 4.1 角丸スケール

```css
--radius-none: 0;
--radius-sm: 4px; /* 小さめボタン */
--radius-md: 8px; /* 入力フィールド */
--radius-lg: 12px; /* カード */
--radius-xl: 16px; /* モーダル */
--radius-2xl: 24px; /* ピル型ボタン */
--radius-full: 9999px; /* 完全な円 */
```

### 4.2 使用ガイド

```yaml
入力フィールド: radius-md (8px)
ボタン:
  - 通常: radius-md (8px)
  - 小さめ: radius-sm (4px)
カード: radius-lg (12px)
モーダル: radius-xl (16px)
アバター: radius-full (円形)
画像: radius-md (8px)

⚠️ 重要: ボタンのroundedは8px以下にしてください
```

---

## 5. シャドウ（Box Shadow）

### 5.1 シャドウ定義

```css
/* レベル1: 浮遊感（低） */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);

/* レベル2: カード */
--shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);

/* レベル3: ホバー */
--shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);

/* レベル4: モーダル */
--shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.2);

/* レベル5: ドロワー */
--shadow-2xl: 0 16px 32px rgba(0, 0, 0, 0.3);

/* インナーシャドウ */
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);

/* フォーカスリング */
--shadow-focus: 0 0 0 3px rgba(66, 165, 245, 0.1);
```

### 5.2 使用例

```css
/* カード */
.card {
  box-shadow: var(--shadow-md);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

/* モーダル */
.modal {
  box-shadow: var(--shadow-2xl);
}

/* フォーカス状態 */
.input:focus {
  box-shadow: var(--shadow-focus);
}
```

---

## 6. アイコン

### 6.1 アイコンライブラリ

**使用ライブラリ: Lucide Icons**

- 公式サイト: https://lucide.dev/
- MIT License
- Vue/Reactコンポーネント対応
- 1400以上のアイコン
- カスタマイズ可能（色、サイズ、太さ）

⚠️ 重要: アプリ内では絵文字を使用しません。すべてLucide Iconsを使用してください。

### 6.2 必要なアイコン

```yaml
ナビゲーション:
  - Home (home)
  - History (history)
  - BarChart (bar-chart-3)
  - Settings (settings)
  - User (user)
  - LogOut (log-out)

アクション:
  - Plus (plus)
  - Trash (trash-2)
  - Edit (edit)
  - Check (check)
  - X (x)
  - Share (share-2)
  - Copy (copy)
  - Download (download)

UI:
  - ChevronRight (chevron-right)
  - ChevronDown (chevron-down)
  - Info (info)
  - AlertCircle (alert-circle)
  - CheckCircle (check-circle)
  - Calendar (calendar)
  - Clock (clock)
  - TrendingUp (trending-up)
  - Sparkles (sparkles)

カテゴリ:
  - Package (package)
  - Wallet (wallet) - 購入価格・お金
  - Coins (coins) - お金・コイン
  - Banknote (banknote) - 紙幣
  - Smile (smile)
```

### 6.3 サイズガイド

```css
--icon-size-xs: 16px;
--icon-size-sm: 20px;
--icon-size-md: 24px;  /* デフォルト */
--icon-size-lg: 32px;
--icon-size-xl: 48px;

使用例:
<lucide-icon name="home" :size="24" />
```

### 6.4 カラーガイド

```css
/* プライマリアイコン */
.icon-primary {
  color: var(--color-primary);
}

/* セカンダリアイコン */
.icon-secondary {
  color: var(--color-text-secondary);
}

/* アクセントアイコン */
.icon-accent {
  color: var(--color-accent);
}

/* ステータスアイコン */
.icon-success {
  color: var(--color-success);
}
.icon-error {
  color: var(--color-error);
}
.icon-warning {
  color: var(--color-warning);
}
.icon-info {
  color: var(--color-info);
}
```

---

## 7. アニメーション

### 7.1 トランジション

```css
/* デュレーション */
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 800ms;

/* イージング */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 7.2 標準トランジション

```css
/* 汎用 */
.transition-all {
  transition: all var(--duration-normal) var(--ease-in-out);
}

/* 色変更 */
.transition-colors {
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

/* 変形 */
.transition-transform {
  transition: transform var(--duration-normal) var(--ease-out);
}

/* 透明度 */
.transition-opacity {
  transition: opacity var(--duration-fast) var(--ease-out);
}
```

### 7.3 アニメーション定義

```css
/* フェードイン */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* スライドイン（下から） */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* スケールイン */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* スピン（ローディング） */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* パルス */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* カウントアップ（数値） */
@keyframes countUp {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 7.4 使用例

```css
/* 結果カード表示 */
.result-card {
  animation: slideInUp var(--duration-normal) var(--ease-out);
}

/* ボタンホバー */
.button:hover {
  transform: translateY(-2px);
  transition: transform var(--duration-fast) var(--ease-out);
}

/* ローディングスピナー */
.spinner {
  animation: spin var(--duration-slower) linear infinite;
}

/* モーダル表示 */
.modal-enter-active {
  animation: scaleIn var(--duration-normal) var(--ease-out);
}
```

---

## 8. レスポンシブブレークポイント

### 8.1 ブレークポイント定義

```css
/* モバイル */
--breakpoint-xs: 0px;

/* 小型タブレット */
--breakpoint-sm: 640px;

/* タブレット */
--breakpoint-md: 768px;

/* 小型デスクトップ */
--breakpoint-lg: 1024px;

/* デスクトップ */
--breakpoint-xl: 1280px;

/* 大型デスクトップ */
--breakpoint-2xl: 1536px;
```

### 8.2 メディアクエリ

```scss
/* モバイルファースト */
@mixin sm {
  @media (min-width: 640px) {
    @content;
  }
}

@mixin md {
  @media (min-width: 768px) {
    @content;
  }
}

@mixin lg {
  @media (min-width: 1024px) {
    @content;
  }
}

@mixin xl {
  @media (min-width: 1280px) {
    @content;
  }
}

/* 使用例 */
.container {
  padding: 16px;

  @include md {
    padding: 24px;
  }

  @include lg {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## 9. アクセシビリティ

### 9.1 フォーカススタイル

```css
/* デフォルトフォーカス */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* カスタムフォーカスリング */
.focus-ring:focus-visible {
  box-shadow: var(--shadow-focus);
}
```

### 9.2 タッチターゲット

```css
/* 最小タッチサイズ: 44×44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### 9.3 コントラスト比（WCAG 2.2 AA準拠）

```yaml
基準:
  - 通常テキスト: 4.5:1 以上 ✅
  - 大きいテキスト（18px以上）: 3:1 以上 ✅
  - UIコンポーネント: 3:1 以上 ✅

確認済み組み合わせ（すべてAA準拠）:
  ✅ #212121 on #FFFFFF (16.10:1) - 通常テキスト
  ✅ #757575 on #FFFFFF (4.61:1) - セカンダリテキスト
  ✅ #FFFFFF on #1976D2 (4.60:1) - プライマリボタン
  ✅ #212121 on #FF9800 (7.47:1) - アクセントボタン
  ✅ #FFFFFF on #2E7D32 (5.13:1) - サクセスボタン
  ✅ #FFFFFF on #D32F2F (4.98:1) - エラーボタン
  ✅ #212121 on #FFA000 (7.88:1) - ワーニングボタン
  ✅ #FFFFFF on #00838F (4.52:1) - インフォボタン

⚠️ 重要:
- プライマリ・サクセス・エラー・インフォ: 白テキスト
- アクセント・ワーニング: 黒テキスト
```

---

## 10. ダークモードガイドライン

### 10.1 カラー調整

```css
@media (prefers-color-scheme: dark) {
  /* 背景は真っ黒ではなく、#121212を使用 */
  --color-background: #121212;

  /* サーフェスは段階的に明るく */
  --color-surface: #1e1e1e;
  --color-surface-raised: #2c2c2c;

  /* テキストは純白ではなく、#E0E0E0 */
  --color-text: #e0e0e0;

  /* プライマリカラーは明度を上げる */
  --color-primary: #64b5f6;

  /* シャドウは不透明度を下げる */
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.4);
}
```

### 10.2 画像・絵文字対応

```css
/* ダークモードで画像を少し暗く */
@media (prefers-color-scheme: dark) {
  img {
    opacity: 0.9;
  }

  /* 絵文字はそのまま */
  .emoji {
    opacity: 1;
  }
}
```

---

## 11. CSS変数の完全定義

### 11.1 ルート変数

```css
:root {
  /* カラー（WCAG 2.2 AA準拠） */
  --color-primary: #1976d2;
  --color-primary-dark: #1565c0;
  --color-primary-light: #42a5f5;
  --color-accent: #ff9800;
  --color-success: #2e7d32;
  --color-warning: #ffa000;
  --color-error: #d32f2f;
  --color-info: #00838f;

  /* グレー */
  --color-gray-900: #212121;
  --color-gray-600: #757575;
  --color-gray-400: #bdbdbd;
  --color-gray-300: #e0e0e0;
  --color-gray-50: #fafafa;
  --color-white: #ffffff;

  /* セマンティック */
  --color-text: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-background: var(--color-gray-50);
  --color-surface: var(--color-white);
  --color-border: var(--color-gray-300);

  /* タイポグラフィ */
  --font-family-base: -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-4xl: 48px;

  /* スペーシング */
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* 角丸 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;

  /* シャドウ */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.2);
  --shadow-focus: 0 0 0 3px rgba(66, 165, 245, 0.1);

  /* アニメーション */
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

---

## 12. 実装チェックリスト

### 12.1 Phase 1（MVP）

```yaml
必須:
  ✅ カラーシステム実装
  ✅ タイポグラフィ設定
  ✅ スペーシング定義
  ✅ コンポーネント基本スタイル
  ✅ レスポンシブ対応
  ✅ アクセシビリティ（フォーカス、コントラスト）

推奨:
  ✅ マイクロインタラクション
  ✅ アニメーション（フェードイン、スライドイン）
```

### 12.2 Phase 2（拡張）

```yaml
追加:
  □ ダークモード実装
  □ カスタムアイコン統合
  □ スケルトンローダー
  □ トースト通知スタイル
```

### 12.3 Phase 3（高度機能）

```yaml
追加:
  □ アニメーション強化
  □ ゲーミフィケーション要素
  □ テーマカスタマイズ機能
```

---

## 13. Tailwind CSS設定

### 13.1 tailwind.config.js

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976D2', // WCAG AA準拠
          dark: '#1565C0',
          light: '#42A5F5',
        },
        accent: {
          DEFAULT: '#FF9800', // 黒テキスト推奨
          dark: '#F57C00',
          light: '#FFB74D',
        },
        success: '#2E7D32',
        warning: '#FFA000', // 黒テキスト推奨
        error: '#D32F2F',
        info: '#00838F',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Noto Sans JP',
          'sans-serif',
        ],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '4xl': '48px',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px', // ボタンデフォルト
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px', // 非推奨（ボタンには使用しない）
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 2px 4px rgba(0, 0, 0, 0.1)',
        lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
}
```

---

## 14. まとめ

このスタイルガイドは、「にちわり！」アプリ全体で一貫したデザイン言語を実現するための基盤です。

**重要なポイント:**

1. ✅ **CSS変数で管理** - 一箇所の変更で全体に反映
2. ✅ **アクセシビリティ優先** - コントラスト、フォーカス、タッチサイズ
3. ✅ **モバイルファースト** - レスポンシブ対応
4. ✅ **ダークモード対応** - Phase 2で実装
5. ✅ **マイクロインタラクション** - 楽しいUX

次は、この設計書を基に実装を開始します（Phase 1 - Setup）。
