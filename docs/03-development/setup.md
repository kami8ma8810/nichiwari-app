---
title: 環境構築ガイド
category: development
dependencies: []
phase: 1
last-updated: 2024-11-22
---

# 環境構築ガイド

このガイドでは「にちわり！」プロジェクトの開発環境を構築する手順を説明します。

## 前提条件

### 必要なソフトウェア

| ソフトウェア | 最小バージョン | 推奨バージョン | 確認コマンド     |
| ------------ | -------------- | -------------- | ---------------- |
| Node.js      | v18.17.0       | v20 LTS        | `node --version` |
| pnpm         | v8.0.0         | v8.10.0+       | `pnpm --version` |
| Git          | v2.30.0        | 最新           | `git --version`  |
| VSCode       | -              | 最新           | -                |

### 推奨環境

- **OS**: macOS 12+, Windows 11 (WSL2), Ubuntu 22.04+
- **メモリ**: 8GB以上
- **ストレージ**: 10GB以上の空き容量

## 1. 開発ツールのインストール

### 1.1 Node.js と Volta

Voltaを使用してNode.jsのバージョン管理を行います。

```bash
# macOS/Linux
curl https://get.volta.sh | bash

# Windows (PowerShell)
iwr https://get.volta.sh | iex

# Voltaのパスを通す（必要に応じて）
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

# Node.js LTSをインストール
volta install node@20

# 確認
node --version  # v20.x.x
```

### 1.2 pnpm のインストール

```bash
# Voltaでpnpmをインストール
volta install pnpm

# または npm経由
npm install -g pnpm

# 確認
pnpm --version  # 8.x.x
```

### 1.3 VSCode拡張機能

必須の拡張機能をインストールします。

```bash
# 拡張機能の一括インストール
code --install-extension Vue.volar
code --install-extension Vue.vscode-typescript-vue-plugin
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ZixuanChen.vitest-explorer
code --install-extension ms-playwright.playwright
code --install-extension bradlc.vscode-tailwindcss
```

#### 推奨する拡張機能リスト

- **Vue - Official** - Vue 3サポート
- **TypeScript Vue Plugin** - TypeScript統合
- **ESLint** - コード品質チェック
- **Prettier** - コードフォーマッタ
- **Vitest** - テストランナー
- **Playwright Test** - E2Eテスト
- **Tailwind CSS IntelliSense** - Tailwind補完
- **GitLens** - Git統合強化
- **Error Lens** - エラー表示強化

## 2. プロジェクトのセットアップ

### 2.1 リポジトリのクローン

```bash
# HTTPSでクローン
git clone https://github.com/yourusername/nichiwari-app.git

# または SSH
git clone git@github.com:yourusername/nichiwari-app.git

# プロジェクトディレクトリに移動
cd nichiwari-app
```

### 2.2 依存関係のインストール

```bash
# 依存関係をインストール
pnpm install

# Playwrightのブラウザをインストール（E2Eテスト用）
pnpm exec playwright install
```

### 2.3 環境変数の設定

```bash
# .env.exampleをコピー
cp .env.example .env

# .envファイルを編集
# エディタで開いて必要な値を設定
```

#### .env ファイルの設定項目

```bash
# Supabase設定（必須）
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here  # ローカル開発のみ

# Google Analytics（オプション）
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Sentry（オプション）
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# 環境設定
NODE_ENV=development
APP_ENV=local

# 機能フラグ
ENABLE_ANALYTICS=false  # 開発環境ではfalse推奨
ENABLE_PWA=true
ENABLE_OFFLINE_MODE=true

# API設定
API_TIMEOUT=5000
MAX_RETRY_COUNT=3
```

## 3. Supabase プロジェクトの設定

### 3.1 Supabaseアカウントの作成

1. [Supabase](https://supabase.com)にアクセス
2. GitHubアカウントでサインアップ
3. 新しいプロジェクトを作成

### 3.2 データベース初期設定

```sql
-- Supabase SQLエディタで実行

-- 商品データテーブル
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  years DECIMAL(4,1) NOT NULL CHECK (years >= 0.5),
  category VARCHAR(50),
  icon VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 検索ログテーブル（匿名）
CREATE TABLE search_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name VARCHAR(100),
  price_range VARCHAR(50),
  years_range VARCHAR(50),
  category VARCHAR(50),
  calculated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_search_logs_created ON search_logs(created_at);

-- RLS（Row Level Security）設定
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- 読み取り専用ポリシー
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- 匿名ユーザーの書き込み許可
CREATE POLICY "Anyone can insert search logs"
  ON search_logs FOR INSERT
  WITH CHECK (true);
```

### 3.3 初期データの投入

```sql
-- サンプル商品データ
INSERT INTO products (name, price, years, category, icon) VALUES
  ('iPhone 15 Pro', 159800, 3, 'ガジェット', '📱'),
  ('MacBook Air M3', 164800, 5, 'ガジェット', '💻'),
  ('ドラム式洗濯機', 250000, 10, '家電', '🌀'),
  ('冷蔵庫（500L）', 200000, 15, '家電', '🧊'),
  ('ビジネススーツ', 80000, 3, 'ファッション', '👔');
```

## 4. 開発サーバーの起動

### 4.1 基本的な起動

```bash
# 開発サーバー起動
pnpm dev

# 以下のURLでアクセス可能
# - アプリケーション: http://localhost:3000
# - Nuxt DevTools: http://localhost:3000/_nuxt
```

### 4.2 その他の起動オプション

```bash
# HTTPSで起動
pnpm dev --https

# 別ポートで起動
pnpm dev --port 3001

# ネットワーク経由でアクセス可能にする
pnpm dev --host
```

## 5. 開発ツールの起動

### 5.1 Storybook

```bash
# Storybookの起動
pnpm storybook

# http://localhost:6006 でアクセス
```

### 5.2 テストの実行

```bash
# 単体テスト（watch mode）
pnpm test:unit

# 単体テスト（CI mode）
pnpm test:unit:ci

# E2Eテスト（ヘッドレス）
pnpm test:e2e

# E2Eテスト（ブラウザ表示）
pnpm test:e2e:headed

# テストカバレッジ
pnpm test:coverage
```

## 6. ビルドと本番環境

### 6.1 プロダクションビルド

```bash
# ビルド実行
pnpm build

# ビルド結果の確認
pnpm preview

# http://localhost:3000 でプレビュー
```

### 6.2 静的サイト生成

```bash
# SSGビルド
pnpm generate

# 生成されたファイルの確認
ls -la .output/public/
```

## 7. トラブルシューティング

### よくある問題と解決方法

#### pnpm install でエラーが発生する

```bash
# キャッシュクリア
pnpm store prune

# node_modules削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### ポート3000が使用中

```bash
# 使用中のポートを確認
lsof -i :3000

# プロセスを終了
kill -9 [PID]

# または別ポートで起動
pnpm dev --port 3001
```

#### Supabase接続エラー

```bash
# 環境変数を確認
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# .envファイルの読み込み確認
source .env
```

#### TypeScriptエラー

```bash
# 型定義を再生成
pnpm nuxi typecheck

# VSCodeを再起動
code --reload
```

## 8. 便利なスクリプト

package.jsonに定義されている主要なスクリプト：

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "nuxi typecheck",
    "storybook": "storybook dev -p 6006",
    "clean": "rm -rf .nuxt .output node_modules"
  }
}
```

## 9. IDEの設定

### 9.1 VSCode設定（.vscode/settings.json）

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "tailwindCSS.experimental.classRegex": [
    ["tw`([^`]*)`", "([^`]*)"]
  ]
}
```

### 9.2 デバッグ設定（.vscode/launch.json）

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Nuxt: Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Nuxt: Node",
      "outputCapture": "std",
      "program": "${workspaceFolder}/node_modules/nuxi/bin/nuxi.mjs",
      "args": ["dev"]
    }
  ]
}
```

## 次のステップ

環境構築が完了したら、以下のドキュメントを参照してください：

1. [アーキテクチャ概要](../02-architecture/overview.md) - システム設計を理解
2. [コーディング規約](./coding-standards.md) - コード規約を確認
3. [Phase 1: 基盤構築](../05-implementation/phase-1-setup.md) - 実装開始

## サポート

問題が解決しない場合は：

- [GitHub Issues](https://github.com/yourusername/nichiwari-app/issues)で報告
- [Discussions](https://github.com/yourusername/nichiwari-app/discussions)で質問
