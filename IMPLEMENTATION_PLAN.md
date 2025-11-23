# 📋 にちわり！実装計画

> **最終更新**: 2025-11-22
> **対象バージョン**: v1.0.0
> **実装期間**: 約7週間
>
> **重要更新（2025-11-22）**:
>
> - ✅ 環境構築時のエラー・警告解消を必須化
> - ✅ 各ステップでの確認項目を明記
> - ✅ トラブルシューティングセクションを追加（よくあるエラー8種類と解決方法）

---

## 📖 目次

1. [プロジェクト概要](#-プロジェクト概要)
2. [技術スタック](#-技術スタック)
3. [アーキテクチャ](#-アーキテクチャ)
4. [実装フェーズ](#-実装フェーズ)
5. [デザイン実装ロードマップ](#-デザイン実装ロードマップ)
6. [品質基準](#-品質基準)
7. [リスクと対策](#-リスクと対策)
8. [スケジュール](#-スケジュール)
9. [次のアクション](#-次のアクション)
10. [環境構築時のトラブルシューティング](#-環境構築時のトラブルシューティング)

---

## 🎯 プロジェクト概要

### ビジョン

**「高い買い物も、1日あたりで考えれば意外とお得かも？」**

購入価格を1日あたりの金額に変換して、買い物の価値を見える化するWebアプリケーション。減価償却の考え方を日常の買い物に適用し、賢い消費判断を支援します。

### 目的

- **即座に価値を実感**: リアルタイム計算で日割りコストを表示
- **身近な比較**: コーヒー1杯、ランチ1食などと比較して直感的に理解
- **データに基づく判断**: 履歴とトレンドから自分の消費パターンを分析
- **幸福度の可視化**: 「本当に必要か？」を科学的に評価

### コアバリュー

1. **シンプルさ**: 3ステップで誰でも使える
2. **スピード**: オフラインでも動作、PWA対応
3. **信頼性**: 計算精度100%、データ保護
4. **アクセシビリティ**: WCAG 2.2 AA準拠

---

## 🛠️ 技術スタック

### フロントエンド

| 技術             | バージョン | 選定理由                                   |
| ---------------- | ---------- | ------------------------------------------ |
| **Nuxt 3**       | ^3.15.0    | SSG/SPA両対応、優れたDX、SEO最適化         |
| **TypeScript**   | ^5.7.2     | 型安全性、保守性向上、エディタサポート     |
| **Vue 3**        | ^3.5.13    | Composition API、軽量、高速レンダリング    |
| **Volt**         | latest     | PrimeVue拡張、洗練されたUI、カスタマイズ性 |
| **Tailwind CSS** | ^4.0.0     | ユーティリティファースト、柔軟性、高速開発 |
| **Valibot**      | ^1.0.0     | 軽量バリデーション、型推論、優れたDX       |

### バックエンド・インフラ

| 技術         | 用途         | 選定理由                                   |
| ------------ | ------------ | ------------------------------------------ |
| **Supabase** | BaaS         | PostgreSQL、認証、リアルタイム、無料枠充実 |
| **Vercel**   | ホスティング | Edge Network、自動デプロイ、分析機能       |
| **Sentry**   | エラー監視   | リアルタイム通知、詳細なスタックトレース   |

### 開発・テスト

| 技術           | 用途       | 選定理由                                     |
| -------------- | ---------- | -------------------------------------------- |
| **Vitest**     | 単体テスト | 高速、Viteネイティブ、ESM対応                |
| **Playwright** | E2Eテスト  | クロスブラウザ、並列実行、安定性             |
| **Storybook**  | UIカタログ | コンポーネント駆動開発、デザインシステム     |
| **ESLint**     | Lint       | @antfu/eslint-config、最新ベストプラクティス |

---

## 🏗️ アーキテクチャ

### Clean Architecture + Feature Slicing

```
src/
├── core/                    # ドメイン層（ビジネスロジック）
│   ├── domain/
│   │   ├── entities/        # エンティティ（Product, Calculation）
│   │   ├── value-objects/   # 値オブジェクト（Money, Years, DailyCost）
│   │   └── repositories/    # リポジトリインターフェース
│   ├── use-cases/           # ユースケース（CalculateDailyCost）
│   └── ports/               # 外部接続のインターフェース
│
├── infrastructure/          # インフラ層（外部サービス連携）
│   ├── supabase/            # Supabase実装
│   ├── repositories/        # リポジトリ実装
│   └── services/            # 外部サービス
│
├── presentation/            # プレゼンテーション層（UI）
│   ├── components/
│   │   ├── common/          # 共通コンポーネント
│   │   ├── domain/          # ドメイン固有コンポーネント
│   │   └── layout/          # レイアウトコンポーネント
│   ├── composables/         # VueコンポーザブルAPI
│   ├── pages/               # ページコンポーネント
│   └── stores/              # Piniaストア
│
└── types/                   # 型定義
```

### データフロー

```
User Input → Presentation Layer → Use Case → Domain Logic → Repository → Supabase
                    ↓                                           ↓
              Pinia Store ←──────────────── Result ←────────────┘
                    ↓
              Vue Component
```

---

## 🚀 実装フェーズ

### Phase 1: 環境構築とドメイン層（2日）

#### 目標

- 開発環境の構築
- プロジェクト基盤の確立
- ドメインロジックの実装（TDD）

#### タスク

**Day 1: 環境構築**

- [x] Node.js/pnpm環境構築
- [ ] Nuxt 3プロジェクト作成
- [ ] TypeScript設定（strict: true）
- [ ] Tailwind CSS + Volt UI設定
- [ ] Pinia設定
- [ ] Valibot設定
- [ ] Vitest設定
- [ ] Playwright設定
- [ ] ESLint/Prettier設定

**Day 2: ドメイン層実装（TDD）**

- [ ] 値オブジェクト実装
  - [ ] `Money`: 金額の値オブジェクト
  - [ ] `Years`: 使用年数の値オブジェクト
  - [ ] `DailyCost`: 日割りコストの値オブジェクト
- [ ] エンティティ実装
  - [ ] `Product`: 商品エンティティ
  - [ ] `Calculation`: 計算結果エンティティ
- [ ] ユースケース実装
  - [ ] `CalculateDailyCostUseCase`: 日割り計算ユースケース

#### 品質チェックリスト

- [ ] **環境構築時のエラー・警告がすべて解消されている**
  - [ ] `pnpm install` で警告・エラーがない
  - [ ] `pnpm dev` が正常に起動する
  - [ ] TypeScript型チェックでエラーがない
  - [ ] ESLintで警告・エラーがない
- [ ] 全テストがパス（カバレッジ90%以上）
- [ ] 型安全性を確保（any/unknown禁止）
- [ ] ドキュメント（JSDoc）が整備されている
- [ ] コード規約に準拠

---

### Phase 2: UIコンポーネント実装（3日）

#### 目標

- 計算フォームの実装
- 結果表示の実装
- レスポンシブ対応
- アクセシビリティ対応

#### タスク

**Day 3: レイアウト・フォーム**

- [ ] AppHeader コンポーネント
- [ ] AppFooter コンポーネント
- [ ] CalculatorForm コンポーネント
  - [ ] 商品名入力（任意）
  - [ ] 価格入力（1〜10億円）
  - [ ] 使用年数入力（0.5〜100年）
  - [ ] Valibotバリデーション
  - [ ] プリセットボタン

**Day 4: 結果表示**

- [ ] CalculatorResult コンポーネント
  - [ ] 日割り金額表示（大きく強調）
  - [ ] カウントアップアニメーション
- [ ] ComparisonCard コンポーネント
  - [ ] コーヒー換算
  - [ ] ランチ換算
  - [ ] 電車運賃換算
- [ ] ComparisonList コンポーネント

**Day 5: インタラクション・ポリッシュ**

- [ ] アニメーション実装
  - [ ] フェードイン/アウト
  - [ ] スライドアップ
  - [ ] カウントアップ
- [ ] ローディング状態
- [ ] エラー表示
- [ ] Storybook ストーリー作成

#### 品質チェックリスト

- [ ] レスポンシブ対応（Mobile/Tablet/Desktop）
- [ ] WCAG 2.2 AA準拠
  - [ ] キーボード操作可能
  - [ ] スクリーンリーダー対応
  - [ ] 適切なARIAラベル
  - [ ] コントラスト比4.5:1以上
- [ ] E2Eテストが作成されている
- [ ] Lighthouseスコア90以上

---

### Phase 3: データ永続化とSupabase連携（3日）

#### 目標

- Supabaseプロジェクトセットアップ
- データベーススキーマ作成
- リポジトリパターン実装
- オフライン対応

#### タスク

**Day 6: Supabase初期設定**

- [ ] Supabaseプロジェクト作成
- [ ] テーブル定義
  - [ ] `products`: 商品マスタ
  - [ ] `search_logs`: 検索ログ（匿名）
  - [ ] `calculation_history`: 計算履歴
  - [ ] `trend_data`: トレンドデータ
- [ ] RLS（Row Level Security）設定
- [ ] インデックス作成
- [ ] サンプルデータ投入

**Day 7: リポジトリ実装**

- [ ] `ProductRepository` インターフェース
- [ ] `ProductRepositoryImpl` 実装
  - [ ] findByName: 商品名で検索
  - [ ] findByCategory: カテゴリで検索
  - [ ] save: 商品保存
  - [ ] saveSearchLog: 検索ログ保存
- [ ] キャッシュ戦略実装

**Day 8: オフライン対応**

- [ ] LocalStorage管理
  - [ ] 計算履歴保存（最大100件）
  - [ ] 設定保存
- [ ] Service Worker設定
  - [ ] キャッシュ戦略（Cache First）
  - [ ] オフライン通知
- [ ] データ同期処理
  - [ ] オンライン復帰時の同期

#### 品質チェックリスト

- [ ] RLSポリシーが正しく設定されている
- [ ] データマイグレーションが作成されている
- [ ] オフラインで計算可能
- [ ] 同期処理が正しく動作

---

### Phase 4: 拡張機能（PWA、幸福度診断）（3日）

#### 目標

- PWA対応
- 幸福度診断機能
- 履歴・統計機能
- トレンド機能

#### タスク

**Day 9: PWA対応**

- [ ] manifest.json作成
- [ ] アイコン生成（192x192, 512x512）
- [ ] Service Worker最適化
- [ ] インストールプロンプト
- [ ] オフライン画面
- [ ] App ShellパターンとプリレンダリングでTTI < 3s実現

**Day 10: 幸福度診断**

- [ ] `HappinessScore` エンティティ
  - [ ] チェックリスト管理
  - [ ] スコア計算ロジック
  - [ ] レコメンデーション生成
- [ ] HappinessModal コンポーネント
  - [ ] 5段階評価UI（使用頻度、満足度、必要性）
  - [ ] スコア表示
  - [ ] メッセージ表示

**Day 11: 履歴・統計**

- [ ] HistoryPage 実装
  - [ ] 計算履歴一覧
  - [ ] 月別グルーピング
  - [ ] スワイプで削除（モバイル）
- [ ] StatsPage 実装
  - [ ] 総計算回数
  - [ ] 平均日額
  - [ ] 月別グラフ（Chart.js）

#### 品質チェックリスト

- [ ] PWAとしてインストール可能（iOS/Android）
- [ ] Lighthouse PWAスコア100
- [ ] 幸福度スコア計算が正確
- [ ] 履歴がデバイス間で同期

---

### Phase 5: テストとリリース準備（2日）

#### 目標

- 総合テスト
- パフォーマンス最適化
- セキュリティ監査
- デプロイ準備

#### タスク

**Day 12: 総合テスト**

- [ ] E2Eテスト全実行
  - [ ] 計算フロー
  - [ ] 履歴保存フロー
  - [ ] 幸福度診断フロー
- [ ] クロスブラウザテスト（Chrome, Firefox, Safari, Edge）
- [ ] デバイステスト（iOS, Android）
- [ ] パフォーマンステスト
  - [ ] Lighthouse（Performance 90+, Accessibility 100）
  - [ ] WebPageTest
- [ ] セキュリティ監査
  - [ ] XSS対策確認
  - [ ] CSRF対策確認
  - [ ] SQLインジェクション対策確認

**Day 13: リリース準備**

- [ ] ドキュメント整備
  - [ ] README.md更新
  - [ ] ユーザーガイド作成
  - [ ] プライバシーポリシー作成
  - [ ] 利用規約作成
- [ ] 本番環境準備
  - [ ] Vercelデプロイ設定
  - [ ] Supabase本番設定
  - [ ] 環境変数設定
  - [ ] ドメイン設定
  - [ ] SSL証明書
  - [ ] Sentry設定
- [ ] ソフトローンチ
  - [ ] ベータテスター募集
  - [ ] フィードバック収集

#### 品質チェックリスト

- [ ] すべてのE2Eテストがパス
- [ ] Lighthouse全項目90+
- [ ] セキュリティ問題なし
- [ ] ドキュメントが整備されている
- [ ] 本番環境が正常稼働

---

## 🎨 デザイン実装ロードマップ

### MVP（2週間）- 最小限で価値提供

#### Week 1: デザインシステム構築

- **Day 1-2**: CSS変数とユーティリティクラス
  - カラーパレット（オレンジ〜レッド系のグラデーション）
  - タイポグラフィ（Hiragino Sans、Noto Sans JP）
  - スペーシング（4pxベース）
- **Day 3-4**: 基本コンポーネント（Layout）
  - AppHeader、AppContainer、AppFooter
- **Day 5-7**: Formコンポーネント
  - TextField、NumberField、SliderField、PrimaryButton

#### Week 2: 結果表示と計算機能

- **Day 8-10**: 結果表示コンポーネント
  - ResultCard（大きく強調）
  - ComparisonItem（絵文字+数値）
  - ComparisonList
- **Day 11-12**: ホーム画面統合
  - フォーム入力
  - リアルタイム計算
  - 結果表示
- **Day 13-14**: PWA対応とポリッシュ
  - Service Worker設定
  - manifest.json
  - マイクロインタラクション

### 拡張機能（1.5週間）- データ蓄積

#### Week 3: 履歴機能

- **Day 15-17**: バックエンド連携
  - Supabase設定
  - テーブル作成
  - API作成
- **Day 18-19**: 履歴UI実装
  - HistoryCard、HistoryList
  - 無限スクロール
  - スワイプで削除

#### Week 4: 統計・設定

- **Day 20-21**: 統計画面
  - StatsCard
  - BarChart（Chart.js）
- **Day 22**: ダークモード
  - CSS変数のダークモード定義
  - システム設定連動
- **Day 23**: 設定画面
- **Day 24**: タブナビゲーション

### 高度機能（2週間）- 個別最適化

#### Week 5: 認証・幸福度

- **Day 25-27**: 認証機能
  - メール/パスワード認証
  - ソーシャルログイン
- **Day 28-30**: 幸福度スコア
  - HappinessModal
  - RatingInput（5段階）
  - スコア計算

#### Week 6: レコメンド・改善

- **Day 31-33**: レコメンド機能
- **Day 34-35**: データ同期
- **Day 36-38**: ポリッシュ

---

## ✅ 品質基準

### パフォーマンス

| 指標                         | 目標   | 計測方法        |
| ---------------------------- | ------ | --------------- |
| **Lighthouse Performance**   | 90+    | Lighthouse CI   |
| **First Contentful Paint**   | < 1.5s | WebPageTest     |
| **Time to Interactive**      | < 3s   | WebPageTest     |
| **Largest Contentful Paint** | < 2.5s | Core Web Vitals |
| **Cumulative Layout Shift**  | < 0.1  | Core Web Vitals |

### アクセシビリティ

| 項目                   | 基準               | 検証方法        |
| ---------------------- | ------------------ | --------------- |
| **WCAG 2.2準拠**       | AA                 | axe DevTools    |
| **キーボード操作**     | 全機能対応         | 手動テスト      |
| **スクリーンリーダー** | VoiceOver/NVDA対応 | 手動テスト      |
| **コントラスト比**     | 4.5:1以上          | Chrome DevTools |
| **フォーカス表示**     | 明確に表示         | 手動テスト      |

### テストカバレッジ

| テストタイプ   | 目標カバレッジ       | ツール     |
| -------------- | -------------------- | ---------- |
| **単体テスト** | 90%+                 | Vitest     |
| **統合テスト** | 70%+                 | Vitest     |
| **E2Eテスト**  | クリティカルパス100% | Playwright |

### コード品質

- **TypeScript strict mode**: 有効
- **ESLint**: @antfu/eslint-config準拠
- **Prettier**: フォーマット統一
- **型安全性**: any/unknown禁止（例外は型ガード使用）
- **エラーハンドリング**: すべてのエラーをキャッチして適切に処理

### 実装のルール

#### TDD（テスト駆動開発）

- **Red → Green → Refactor** サイクルを厳守
- 実装コードを書く前に必ずテストを書く
- テストがパスしてから次の機能に進む
- リファクタリング時もテストを実行して安全性を確保

#### Git コミットルール

**コミットの粒度**

- 作業がひととおり終わったら、細かくまとまりごとにコミット
- 1つのコミットには1つの目的のみを含める
- 以下のような単位でコミットすることを推奨：
  - 1つの値オブジェクトの実装完了
  - 1つのエンティティの実装完了
  - 1つのユースケースの実装完了
  - 1つのコンポーネントの実装完了
  - 設定ファイルの追加・変更
  - テストの追加・修正
  - リファクタリング

**コミットメッセージ**

- 日本語で記述
- プレフィックスを使用（feat, fix, chore, docs, refactor, test等）
- 1行目: 変更の概要（50文字以内）
- 2行目: 空行
- 3行目以降: 詳細な変更内容（箇条書き推奨）
- 末尾に Claude Code 署名を含める

**例**:

```
feat: Money値オブジェクトをTDDで実装

- 金額の値オブジェクトを作成（0〜10億円）
- バリデーション実装（整数チェック、範囲チェック）
- format()メソッドで日本円表記
- 12個のテストケース作成（すべてパス）

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**コミット前の確認事項**

- [ ] すべてのテストがパス（`pnpm test`）
- [ ] 型チェックでエラーなし（`pnpm typecheck`）
- [ ] Lint エラーなし（`pnpm lint`）
- [ ] 不要なコンソールログやデバッグコードを削除
- [ ] コミットメッセージが明確で分かりやすい

---

## ⚠️ リスクと対策

### 技術的リスク

| リスク                          | 影響度 | 対策                                             |
| ------------------------------- | ------ | ------------------------------------------------ |
| **Volt UIの習熟に時間がかかる** | 中     | 事前ドキュメント精読、カスタムコンポーネント優先 |
| **Supabase RLS設定ミス**        | 高     | セキュリティレビュー、テストケース作成           |
| **パフォーマンス問題**          | 中     | 早期Lighthouse計測、コード分割、キャッシュ戦略   |
| **PWA動作不良（iOS）**          | 中     | 実機テスト徹底、フォールバック実装               |

### スケジュールリスク

| リスク               | 影響度 | 対策                             |
| -------------------- | ------ | -------------------------------- |
| **見積もり甘く遅延** | 高     | バッファ20%確保、毎日進捗確認    |
| **仕様変更**         | 中     | 設計書を先に固める、変更管理     |
| **外部依存の障害**   | 低     | Supabase以外のBaaSも検討、冗長化 |

---

## 📅 スケジュール

### マイルストーン

| マイルストーン       | 期間      | 完了条件                                    |
| -------------------- | --------- | ------------------------------------------- |
| **M1: 環境構築完了** | Day 1-2   | 開発環境が整い、ドメイン層が実装されている  |
| **M2: MVP完成**      | Day 1-14  | 計算機能が動作し、PWAとしてインストール可能 |
| **M3: 拡張機能完成** | Day 15-24 | 履歴・統計機能が利用可能                    |
| **M4: 高度機能完成** | Day 25-38 | 認証、幸福度診断が動作                      |
| **M5: リリース**     | Day 39-50 | 全テストパス、本番環境デプロイ完了          |

### タイムライン（7週間）

```
Week 1: Phase 1 (環境構築) + Phase 2開始 (UI実装)
Week 2: Phase 2完了 (UI実装) + Phase 3開始 (データ永続化)
Week 3: Phase 3完了 (データ永続化) + Phase 4開始 (拡張機能)
Week 4: Phase 4完了 (拡張機能) + デザインMVP完成
Week 5: デザイン拡張機能実装
Week 6: デザイン高度機能実装
Week 7: Phase 5 (テスト・リリース準備) + ソフトローンチ
```

---

## 🎬 次のアクション

### 今すぐ開始すべきタスク

#### ステップ1: 環境構築（1時間）

**⚠️ 重要**: 各ステップで警告・エラーが出た場合は、必ず解消してから次のステップに進むこと！

```bash
# 1. Voltaインストール（Node.jsバージョン管理）
curl https://get.volta.sh | bash

# ✅ 確認: Voltaが正しくインストールされたか確認
volta --version
# エラーが出た場合 → シェルを再起動してPATHを通す

volta install node@20
# ✅ 確認: Node.jsがインストールされたか確認
node --version  # v20.x.x が表示されることを確認

volta install pnpm
# ✅ 確認: pnpmがインストールされたか確認
pnpm --version  # 8.x.x が表示されることを確認

# 2. プロジェクト作成
pnpm dlx nuxi@latest init nichiwari-app
cd nichiwari-app
pnpm install

# ✅ 確認: インストール時にエラー・警告がないか確認
# - peer dependencies の警告がある場合は解消
# - deprecated パッケージの警告は記録（後で対応検討）

# 3. 依存関係追加
pnpm add @primevue/volt @primevue/core @primevue/themes
pnpm add tailwindcss@next @tailwindcss/forms
pnpm add @pinia/nuxt pinia
pnpm add valibot
pnpm add @vueuse/nuxt @vueuse/core

# ✅ 確認: ここまでで警告・エラーがないか確認
pnpm list  # 依存関係が正しくインストールされているか確認

pnpm add -D @nuxtjs/tailwindcss @nuxt/devtools @nuxt/test-utils
pnpm add -D vitest @vitest/ui happy-dom @vue/test-utils
pnpm add -D @playwright/test
pnpm add -D eslint @antfu/eslint-config prettier

# ✅ 確認: すべての依存関係が正しくインストールされたか最終確認
pnpm list --depth=0

# 4. 開発サーバー起動確認
pnpm dev

# ✅ 確認: 以下をチェック
# - サーバーが正常に起動する（http://localhost:3000）
# - ブラウザでページが表示される
# - コンソールにエラーがない
# - TypeScript型チェックでエラーがない

# 5. Lintチェック
pnpm lint

# ✅ 確認: ESLintでエラー・警告がないか確認
# - エラーがある場合は修正
# - 警告も可能な限り解消

# 6. 型チェック
pnpm nuxi typecheck

# ✅ 確認: TypeScript型エラーがないか確認
# - any型の使用がないか確認
# - 型エラーはすべて解消

# 7. テスト実行確認
pnpm test

# ✅ 確認: テストが実行できるか確認
# - Vitestが正常に動作するか
# - サンプルテストがパスするか
```

**📝 チェックリスト**

各ステップ完了後、以下を必ず確認してください：

- [ ] `pnpm install` で警告・エラーなし
- [ ] `pnpm dev` が正常起動（ブラウザでページ表示確認）
- [ ] `pnpm lint` でエラー・警告なし
- [ ] `pnpm nuxi typecheck` でエラーなし
- [ ] `pnpm test` が正常実行
- [ ] package.jsonのscriptsが期待通り動作
- [ ] .gitignoreが適切に設定されている

#### ステップ2: ドメイン層実装（TDD）

```bash
# 1. テストファイル作成
mkdir -p domain/value-objects
touch domain/value-objects/Money.test.ts
touch domain/value-objects/Money.ts

# 2. TDDサイクル開始
pnpm test:watch Money.test.ts
```

#### ステップ3: 最初のコミット

```bash
git add .
git commit -m "feat: 初期プロジェクトセットアップとドメイン層実装

- Nuxt 3プロジェクト作成
- TypeScript strict mode有効化
- Tailwind CSS + Volt UI設定
- Vitest/Playwright設定
- Money値オブジェクト実装（TDD）

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🔧 環境構築時のトラブルシューティング

### よくあるエラーと解決方法

#### 1. `pnpm install` でエラーが発生する

**症状**: 依存関係のインストールに失敗する

```bash
# エラー例
ERR_PNPM_PEER_DEP_ISSUES  Unmet peer dependencies
```

**解決方法**:

```bash
# キャッシュをクリア
pnpm store prune

# node_modules と pnpm-lock.yaml を削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install

# それでもダメな場合は .pnpm フォルダも削除
rm -rf node_modules pnpm-lock.yaml .pnpm
pnpm install
```

#### 2. `volta install` でコマンドが見つからない

**症状**: `volta: command not found`

**解決方法**:

```bash
# シェルを再起動してPATHを反映
exec $SHELL

# または手動でPATHを追加（.zshrc または .bashrc に追加）
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

# 設定を再読み込み
source ~/.zshrc  # zshの場合
source ~/.bashrc  # bashの場合
```

#### 3. TypeScript型エラーが大量に出る

**症状**: `pnpm nuxi typecheck` で型エラーが多数表示される

**解決方法**:

```bash
# 1. Nuxtの型定義を再生成
pnpm nuxi prepare

# 2. VSCodeを再起動
code --reload

# 3. TypeScriptサーバーを再起動（VSCode内）
# Command Palette (Cmd+Shift+P) → "TypeScript: Restart TS Server"
```

#### 4. `pnpm dev` が起動しない

**症状**: ポート3000が既に使用中

```bash
# エラー例
Port 3000 is already in use
```

**解決方法**:

```bash
# 使用中のポートを確認
lsof -i :3000

# プロセスを終了（PIDを確認して）
kill -9 [PID]

# または別ポートで起動
pnpm dev --port 3001
```

#### 5. ESLintの警告が大量に出る

**症状**: `pnpm lint` で警告が多数表示される

**解決方法**:

```bash
# 自動修正を試す
pnpm lint --fix

# 修正できない警告は個別に対応
# 特に以下に注意：
# - 未使用の変数・インポート → 削除
# - any型の使用 → 適切な型に変更
# - console.log → 削除（必要なら logger.debug() など）
```

#### 6. Playwright のインストールに失敗

**症状**: ブラウザのダウンロードに失敗する

**解決方法**:

```bash
# Playwrightのブラウザを手動でインストール
pnpm exec playwright install

# 必要なブラウザだけインストール（軽量化）
pnpm exec playwright install chromium

# システム依存関係が不足している場合
pnpm exec playwright install-deps
```

#### 7. `@primevue/volt` が見つからない

**症状**: Voltパッケージのインストールに失敗

**解決方法**:

```bash
# 最新のVoltパッケージ名を確認
pnpm search @primevue/volt

# バージョンを指定してインストール
pnpm add @primevue/volt@latest

# または代替として通常のPrimeVueを使用
pnpm add primevue
```

#### 8. Windows環境でのパス問題

**症状**: スラッシュやパスの違いでエラー

**解決方法**:

```bash
# WSL2を使用（推奨）
wsl --install

# またはクロスプラットフォーム対応パッケージを使用
pnpm add -D cross-env
```

### エラーが解決しない場合

以下の順序で対処してください：

1. **公式ドキュメントを確認**
   - [Nuxt 3](https://nuxt.com/docs)
   - [Volta](https://docs.volta.sh/)
   - [pnpm](https://pnpm.io/)

2. **GitHub Issuesを検索**
   - 同じエラーの報告がないか確認
   - 解決策が提示されている場合が多い

3. **環境をクリーンにして再試行**

   ```bash
   # すべてをクリーンにして再インストール
   rm -rf node_modules pnpm-lock.yaml .nuxt .output
   pnpm install
   ```

4. **バージョンを確認**

   ```bash
   node --version   # v20.x.x
   pnpm --version   # 8.x.x
   ```

5. **プロジェクトの再作成**
   - 最終手段として、新しいディレクトリで最初からやり直す

### デバッグのコツ

```bash
# 詳細なログを出力
pnpm install --loglevel=verbose

# 依存関係のツリーを確認
pnpm list --depth=2

# パッケージの情報を確認
pnpm info [package-name]

# Nuxtのデバッグモード
DEBUG=nuxt:* pnpm dev
```

**💡 ポイント**: エラーメッセージは必ず最後まで読み、スタックトレースを確認すること！

---

## 📚 関連ドキュメント

### 必読ドキュメント

- [環境構築ガイド](./docs/03-development/setup.md)
- [アーキテクチャ概要](./docs/02-architecture/overview.md)
- [コーディング規約](./docs/03-development/coding-standards.md)
- [TDD実践ガイド](./docs/03-development/tdd-guide.md)

### フェーズ別ガイド

- [Phase 1: 初期セットアップ](./docs/05-implementation/phase-1-setup.md)
- [Phase 2: UIコンポーネント](./docs/05-implementation/phase-2-ui.md)
- [Phase 3: データ永続化](./docs/05-implementation/phase-3-data.md)
- [Phase 4: 拡張機能](./docs/05-implementation/phase-4-features.md)
- [Phase 5: リリース準備](./docs/05-implementation/phase-5-release.md)

### デザイン関連

- [デザイン実装ロードマップ](./docs/08-design/implementation-roadmap.md)
- [画面設計](./docs/08-design/screens.md)
- [コンポーネント設計](./docs/08-design/components.md)
- [スタイルガイド](./docs/08-design/style-guide.md)

---

## 🎉 まとめ

この実装計画に従うことで、**約7週間**で「にちわり！」アプリを完成させることができます。

### 重要なポイント

1. ✅ **TDD徹底** - すべての実装はテストファーストで
2. ✅ **品質優先** - アクセシビリティ、パフォーマンス、セキュリティ
3. ✅ **段階的リリース** - MVPから順次機能追加
4. ✅ **ドキュメント駆動** - 実装前に必ずドキュメント確認
5. ✅ **データ駆動改善** - KPIを計測し継続的に改善

---

**準備はOK？さっそく実装を始めよう！** 🚀
