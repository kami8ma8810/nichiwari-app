---
title: Gitワークフロー
category: development
dependencies: [setup.md]
phase: 1
last-updated: 2024-11-22
---

# Gitワークフロー

## 1. ブランチ戦略

### 1.1 GitHub Flow

```yaml
選定理由:
  - シンプルで理解しやすい
  - CI/CDと相性が良い
  - 小規模チームに最適
  - 継続的デプロイが可能

基本フロー:
  1. mainブランチから機能ブランチを作成
  2. 機能を実装してコミット
  3. プルリクエストを作成
  4. レビュー・テスト実行
  5. mainブランチにマージ
  6. 自動デプロイ
```

### 1.2 ブランチ命名規則

```bash
# 機能追加
feature/add-calculator-history
feature/implement-happiness-score

# バグ修正
fix/calculator-validation-error
fix/offline-mode-crash

# ドキュメント
docs/update-readme
docs/api-documentation

# リファクタリング
refactor/calculator-domain-logic
refactor/component-structure

# テスト
test/calculator-unit-tests
test/e2e-scenarios

# 緊急修正（ホットフィックス）
hotfix/critical-calculation-bug

# 依存関係更新
chore/update-dependencies
chore/bump-nuxt-version
```

## 2. コミット規約

### 2.1 Conventional Commits

```bash
# 基本フォーマット
<type>(<scope>): <subject>

<body>

<footer>
```

### 2.2 タイプ一覧

| タイプ   | 説明             | 例                                      |
| -------- | ---------------- | --------------------------------------- |
| feat     | 新機能追加       | feat(calculator): 履歴機能を追加        |
| fix      | バグ修正         | fix(validation): 価格の検証エラーを修正 |
| docs     | ドキュメント     | docs(readme): インストール手順を更新    |
| style    | コード整形       | style: インデントを修正                 |
| refactor | リファクタリング | refactor(domain): 計算ロジックを簡潔に  |
| test     | テスト           | test(calculator): 単体テストを追加      |
| chore    | その他           | chore(deps): 依存関係を更新             |
| perf     | パフォーマンス   | perf: レンダリング速度を改善            |
| ci       | CI/CD            | ci: GitHub Actions設定を更新            |

### 2.3 コミットメッセージ例

```bash
# 新機能
feat(calculator): 計算履歴の保存機能を実装

ローカルストレージに最大100件まで計算履歴を保存する機能を追加。
オフラインでも履歴が参照できるようになった。

Closes #123

# バグ修正
fix(validation): 0円入力時のエラーを修正

購入価格に0を入力した際に適切なエラーメッセージが
表示されない問題を修正。

# リファクタリング
refactor(calculator): 計算ロジックをドメイン層に移動

ビジネスロジックをプレゼンテーション層から
ドメイン層に移動し、テスタビリティを向上。

BREAKING CHANGE: calculateDailyCost関数のシグネチャが変更
```

## 3. プルリクエスト

### 3.1 PRテンプレート

```markdown
<!-- .github/pull_request_template.md -->

## 概要

<!-- このPRで何を実装/修正したか簡潔に記述 -->

## 変更内容

<!-- 具体的な変更点をリスト形式で -->

- [ ] 機能A を実装
- [ ] バグB を修正
- [ ] テストC を追加

## 関連Issue

<!-- 関連するIssue番号を記載 -->

Closes #

## スクリーンショット

<!-- UIに変更がある場合は必須 -->

## テスト

<!-- 実施したテストの内容 -->

- [ ] 単体テスト実行
- [ ] E2Eテスト実行
- [ ] 手動テスト実施

## チェックリスト

- [ ] コードは規約に従っている
- [ ] セルフレビュー実施済み
- [ ] テストを追加/更新した
- [ ] ドキュメントを更新した
- [ ] CHANGELOG を更新した（必要な場合）
- [ ] 破壊的変更なし（ある場合は明記）

## レビュワーへの注意事項

<!-- レビュー時に特に見てほしい点 -->

## デプロイ後の確認事項

<!-- 本番環境で確認すべき点 -->
```

### 3.2 PRサイズの目安

```yaml
理想的なPRサイズ:
  ファイル数: 5ファイル以下
  追加行数: 400行以下
  レビュー時間: 30分以内

大きなPRを避ける方法:
  - 機能を小さく分割
  - リファクタリングは別PR
  - テストは別PRでもOK
  - ドキュメントは別PR推奨
```

### 3.3 レビュー観点

```yaml
コードレビューチェックリスト:
  機能性:
    ✓ 要件を満たしているか
    ✓ エッジケースの考慮
    ✓ エラーハンドリング

  品質:
    ✓ 可読性・保守性
    ✓ DRY原則
    ✓ SOLID原則
    ✓ 適切な抽象化

  パフォーマンス:
    ✓ 不要な処理がないか
    ✓ N+1問題がないか
    ✓ メモリリーク対策

  セキュリティ:
    ✓ 入力検証
    ✓ 認証・認可
    ✓ 機密情報の扱い

  テスト:
    ✓ テストカバレッジ
    ✓ テストの品質
    ✓ E2Eテストの必要性
```

## 4. Git操作ガイド

### 4.1 基本的な開発フロー

```bash
# 1. 最新のmainブランチを取得
git checkout main
git pull origin main

# 2. 機能ブランチを作成
git checkout -b feature/add-new-function

# 3. 開発・コミット
git add .
git commit -m "feat(calculator): 新機能を追加"

# 4. リモートにプッシュ
git push origin feature/add-new-function

# 5. PRを作成（GitHub上で）

# 6. マージ後、ローカルをクリーンアップ
git checkout main
git pull origin main
git branch -d feature/add-new-function
```

### 4.2 コミットの修正

```bash
# 直前のコミットメッセージを修正
git commit --amend -m "新しいメッセージ"

# 直前のコミットに変更を追加
git add forgotten-file.ts
git commit --amend --no-edit

# 複数のコミットをまとめる（インタラクティブリベース）
git rebase -i HEAD~3
# エディタで pick を squash に変更

# コミットを取り消す（ローカルのみ）
git reset --soft HEAD~1  # 変更は残す
git reset --hard HEAD~1  # 変更も破棄（注意）
```

### 4.3 ブランチ操作

```bash
# ブランチ一覧
git branch -a  # リモート含む全て

# ブランチ切り替え
git checkout branch-name
git switch branch-name  # 新しい方法

# ブランチ作成と切り替え
git checkout -b new-branch
git switch -c new-branch  # 新しい方法

# ブランチ削除
git branch -d branch-name  # マージ済み
git branch -D branch-name  # 強制削除

# リモートブランチ削除
git push origin --delete branch-name
```

### 4.4 競合解決

```bash
# マージ時の競合解決
git merge feature-branch
# 競合発生

# 1. 競合ファイルを編集
# <<<<<<< HEAD
# 現在のブランチの内容
# =======
# マージするブランチの内容
# >>>>>>> feature-branch

# 2. 解決後、ステージング
git add resolved-file.ts

# 3. マージを完了
git commit

# リベース時の競合解決
git rebase main
# 競合発生

# 1. 競合を解決
# 2. ステージング
git add resolved-file.ts

# 3. リベース続行
git rebase --continue

# またはリベース中止
git rebase --abort
```

## 5. Git Hooks

### 5.1 Husky設定

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

### 5.2 pre-commit

```bash
#!/bin/sh
# .husky/pre-commit

. "$(dirname "$0")/_/husky.sh"

# lint-staged実行
pnpm lint-staged

# テスト実行（オプション）
pnpm test:unit
```

### 5.3 commit-msg

```bash
#!/bin/sh
# .husky/commit-msg

. "$(dirname "$0")/_/husky.sh"

# commitlint実行
pnpm commitlint --edit $1
```

### 5.4 lint-staged設定

```javascript
// .lintstagedrc.js
export default {
  '*.{js,ts,vue}': [
    'eslint --fix',
    'prettier --write'
  ],
  '*.{json,yml,yaml,md}': [
    'prettier --write'
  ],
  '*.{css,scss}': [
    'stylelint --fix',
    'prettier --write'
  ]
}
```

## 6. リリース管理

### 6.1 セマンティックバージョニング

```yaml
バージョン形式: MAJOR.MINOR.PATCH

MAJOR:
  - 破壊的変更
  - APIの非互換変更
  例: 1.0.0 → 2.0.0

MINOR:
  - 新機能追加
  - 後方互換性あり
  例: 1.0.0 → 1.1.0

PATCH:
  - バグ修正
  - 後方互換性あり
  例: 1.0.0 → 1.0.1
```

### 6.2 リリースフロー

```bash
# 1. リリースブランチ作成
git checkout -b release/v1.0.0

# 2. バージョン更新
npm version minor  # or major, patch

# 3. CHANGELOG更新
pnpm changelog

# 4. コミット
git add .
git commit -m "chore: release v1.0.0"

# 5. タグ付け
git tag -a v1.0.0 -m "Release version 1.0.0"

# 6. プッシュ
git push origin release/v1.0.0
git push origin v1.0.0

# 7. PRとマージ
# GitHub上でPRを作成し、mainにマージ

# 8. リリースノート作成
# GitHub Releasesで作成
```

### 6.3 CHANGELOG管理

```markdown
<!-- CHANGELOG.md -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- 計算履歴機能

### Changed

- UIデザインの改善

### Fixed

- バリデーションエラーの修正

## [1.0.0] - 2024-11-22

### Added

- 初回リリース
- 基本的な計算機能
- オフライン対応

[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

## 7. トラブルシューティング

### 7.1 よくある問題と解決方法

```bash
# プッシュが拒否される
git pull --rebase origin main
git push origin feature-branch

# 間違えてmainにコミット
git reset HEAD~1
git checkout -b feature-branch
git add .
git commit -m "正しいメッセージ"

# 大きなファイルをコミットしてしまった
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/large/file' \
  --prune-empty --tag-name-filter cat -- --all

# または BFG Repo-Cleaner を使用
bfg --delete-files large-file.zip
```

### 7.2 .gitignore設定

```gitignore
# 依存関係
node_modules/
.pnpm-store/

# ビルド成果物
.nuxt/
.output/
dist/

# 環境変数
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# ログ
logs/
*.log
npm-debug.log*
pnpm-debug.log*

# テスト
coverage/
.nyc_output/

# 一時ファイル
tmp/
temp/
```

## 8. ベストプラクティス

### 8.1 コミット原則

```yaml
良いコミット:
  ✓ 1つのコミット = 1つの論理的変更
  ✓ コミットメッセージは明確で具体的
  ✓ なぜ変更したかを説明
  ✓ テストが通る状態でコミット

避けるべきこと:
  ✗ "WIP" "fix" などの曖昧なメッセージ
  ✗ 複数の機能を1つのコミットに
  ✗ デバッグ用コードを含める
  ✗ console.logを残す
```

### 8.2 セキュリティ

```yaml
機密情報の扱い:
  - 環境変数を使用
  - .env.exampleを提供
  - git-secretsツール活用
  - pre-commitでスキャン

万が一コミットした場合:
  1. すぐにキーを無効化
  2. 履歴から完全削除
  3. 新しいキーを発行
  4. チームに通知
```

## 関連ドキュメント

- [環境構築](./setup.md)
- [コーディング規約](./coding-standards.md)
- [CI/CD設定](../06-infrastructure/deployment.md)
- [リリース計画](../05-implementation/phase-5-release.md)
