# にちわり！ - 日割り計算で賢い買い物を

<div align="center">

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82)](https://nuxt.com/)
  [![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D)](https://vuejs.org/)

  [🇺🇸 English](./README.md)

</div>

## 🎯 概要

「にちわり！」は、購入を検討している商品の**日割りコスト**を計算することで、本当に必要な買い物かどうかを判断できるWebアプリケーションです。

「この商品は1日あたり◯◯円」という形で価値を可視化することで、より賢い買い物の判断をサポートします。

### ✨ 主な機能

- 📊 **日割りコスト計算** - 購入価格と使用年数から日割り・月割り・年割りコストを算出
- 💡 **商品サジェスト** - 人気商品の平均価格と耐用年数を自動提案
- 😊 **幸福度診断** - 科学的根拠に基づいたチェックリストで購入価値を評価
- 📈 **トレンド分析** - よく検索される商品のランキング表示
- 🌐 **オフライン対応** - インターネット接続なしでも基本機能が利用可能

## 🚀 Quick Start

### 必要な環境

- Node.js v20 LTS以上
- pnpm 8.0以上

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/nichiwari-app.git
cd nichiwari-app

# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してSupabase認証情報を設定
```

### 開発サーバーの起動

```bash
# 開発サーバー起動
pnpm dev

# http://localhost:3000 でアクセス可能
```

### その他のコマンド

```bash
# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm preview

# テスト実行
pnpm test           # 単体テスト
pnpm test:e2e       # E2Eテスト

# コード品質チェック
pnpm lint           # ESLint
pnpm type-check     # TypeScript型チェック

# Storybook起動
pnpm storybook
```

## 📚 ドキュメント

プロジェクトの詳細なドキュメントは [`docs/`](./docs/) ディレクトリにあります。

### 開発者向けドキュメント

- [📋 要件定義](./docs/01-requirements/) - 機能要件・非機能要件
- [🏗️ アーキテクチャ](./docs/02-architecture/) - システム設計・技術選定
- [💻 開発ガイド](./docs/03-development/) - セットアップ・コーディング規約
- [🧪 テスト戦略](./docs/04-testing/) - TDD・E2Eテスト
- [🔧 実装ガイド](./docs/05-implementation/) - フェーズ別実装手順
- [☁️ インフラ・運用](./docs/06-infrastructure/) - デプロイ・監視
- [📖 リファレンス](./docs/07-reference/) - API仕様・データ構造

### はじめに読むべきドキュメント

1. [環境構築ガイド](./docs/03-development/setup.md)
2. [アーキテクチャ概要](./docs/02-architecture/overview.md)
3. [コーディング規約](./docs/03-development/coding-standards.md)

## 🛠️ 技術スタック

### フロントエンド
- **Framework**: Nuxt 3 (SSG)
- **UI Library**: Volt (PrimeVue + Tailwind CSS)
- **Language**: TypeScript (strict mode)
- **State Management**: Pinia
- **Validation**: Valibot

### バックエンド
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime

### 開発環境
- **Package Manager**: pnpm
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel

## 🏗️ プロジェクト構造

```
nichiwari-app/
├── docs/                 # プロジェクトドキュメント
├── src/
│   ├── core/            # ビジネスロジック層
│   │   ├── domain/      # ドメインモデル
│   │   ├── usecases/    # ユースケース
│   │   └── ports/       # インターフェース
│   ├── infrastructure/  # 外部サービス層
│   ├── presentation/    # プレゼンテーション層
│   │   ├── components/  # UIコンポーネント
│   │   ├── pages/       # ページコンポーネント
│   │   └── composables/ # Vue Composables
│   └── shared/          # 共通機能
├── tests/               # テストコード
│   ├── unit/           # 単体テスト
│   ├── integration/    # 統合テスト
│   └── e2e/            # E2Eテスト
└── public/             # 静的ファイル
```

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

### 開発に参加する方法

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### コミット規約

[Conventional Commits](https://www.conventionalcommits.org/) に従ってください：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント
- `style:` コード整形
- `refactor:` リファクタリング
- `test:` テスト
- `chore:` ビルド・ツール関連

詳細は [Git ワークフロー](./docs/03-development/git-workflow.md) を参照してください。

## 📝 ライセンス

このプロジェクトは MIT License のもとで公開されています。
詳細は [LICENSE](./LICENSE) ファイルを参照してください。

## 📮 お問い合わせ

- Issues: [GitHub Issues](https://github.com/yourusername/nichiwari-app/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/nichiwari-app/discussions)

## 🙏 謝辞

このプロジェクトは以下の素晴らしいオープンソースプロジェクトを利用しています：

- [Nuxt](https://nuxt.com/)
- [Vue.js](https://vuejs.org/)
- [PrimeVue](https://primevue.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)

---

<div align="center">
  Made with ❤️ for smarter shopping decisions
</div>