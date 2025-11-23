---
title: エラーコード一覧
category: reference
dependencies: [../06-infrastructure/security.md, ../05-implementation/phase-4-polish.md]
phase: 4
last-updated: 2024-11-22
---

# エラーコード一覧

## 1. エラーコード体系

### 1.1 コード構成

```
PREFIX_CATEGORY_NUMBER

例: VAL_INPUT_001
    APP_CALC_002
    NET_CONN_001
```

### 1.2 プレフィックス

```yaml
VAL: バリデーションエラー
APP: アプリケーションエラー
NET: ネットワークエラー
AUTH: 認証・認可エラー
DB: データベースエラー
SYS: システムエラー
```

### 1.3 カテゴリ

```yaml
INPUT: 入力値関連
CALC: 計算処理関連
CONN: 接続関連
SESSION: セッション関連
QUERY: クエリ関連
CONFIG: 設定関連
```

## 2. バリデーションエラー (VAL)

### VAL_INPUT_001: 価格入力エラー

```typescript
{
  code: 'VAL_INPUT_001',
  message: '価格は1円以上10億円以下で入力してください',
  field: 'price',
  details: {
    min: 1,
    max: 1000000000,
    actual: value
  }
}
```

### VAL_INPUT_002: 使用年数入力エラー

```typescript
{
  code: 'VAL_INPUT_002',
  message: '使用年数は0.5年以上100年以下で入力してください',
  field: 'years',
  details: {
    min: 0.5,
    max: 100,
    step: 0.5,
    actual: value
  }
}
```

### VAL_INPUT_003: 商品名エラー

```typescript
{
  code: 'VAL_INPUT_003',
  message: '商品名は100文字以内で入力してください',
  field: 'name',
  details: {
    maxLength: 100,
    actual: value.length
  }
}
```

### VAL_INPUT_004: 幸福度スコアエラー

```typescript
{
  code: 'VAL_INPUT_004',
  message: '評価は1〜5の範囲で選択してください',
  field: 'score',
  details: {
    min: 1,
    max: 5,
    actual: value
  }
}
```

## 3. アプリケーションエラー (APP)

### APP_CALC_001: 計算処理エラー

```typescript
{
  code: 'APP_CALC_001',
  message: '計算処理中にエラーが発生しました',
  details: {
    price: value.price,
    years: value.years,
    error: originalError.message
  },
  retry: true
}
```

### APP_CALC_002: 比較データ取得エラー

```typescript
{
  code: 'APP_CALC_002',
  message: '比較データの取得に失敗しました',
  details: {
    dailyCost: value,
    fallback: true
  },
  retry: true
}
```

### APP_STORAGE_001: ローカルストレージエラー

```typescript
{
  code: 'APP_STORAGE_001',
  message: 'データの保存に失敗しました。ストレージ容量を確認してください',
  details: {
    available: storageEstimate.quota,
    used: storageEstimate.usage,
    required: dataSize
  },
  action: 'clear_cache'
}
```

### APP_OFFLINE_001: オフライン機能制限

```typescript
{
  code: 'APP_OFFLINE_001',
  message: 'この機能はオンライン時のみ利用可能です',
  details: {
    feature: featureName,
    networkStatus: 'offline'
  },
  retry: false
}
```

## 4. ネットワークエラー (NET)

### NET_CONN_001: 接続エラー

```typescript
{
  code: 'NET_CONN_001',
  message: 'サーバーへの接続に失敗しました',
  details: {
    url: requestUrl,
    method: requestMethod,
    status: response?.status
  },
  retry: true
}
```

### NET_TIMEOUT_001: タイムアウト

```typescript
{
  code: 'NET_TIMEOUT_001',
  message: 'リクエストがタイムアウトしました',
  details: {
    timeout: 30000,
    url: requestUrl
  },
  retry: true
}
```

### NET_RATE_001: レート制限

```typescript
{
  code: 'NET_RATE_001',
  message: 'リクエスト数が制限を超えました。しばらくお待ちください',
  details: {
    limit: 100,
    reset: resetTime,
    retryAfter: retrySeconds
  },
  retry: true
}
```

## 5. 認証エラー (AUTH)

### AUTH_SESSION_001: セッション期限切れ

```typescript
{
  code: 'AUTH_SESSION_001',
  message: 'セッションの有効期限が切れました。再度ログインしてください',
  details: {
    expiredAt: sessionExpiry
  },
  action: 'login'
}
```

### AUTH_TOKEN_001: トークン無効

````typescript
{
  code: 'AUTH_TOKEN_001',
  message: '認証トークンが無効です',
  details: {
    tokenType: 'bearer'
  },
  action: 'refresh_token'
}

### AUTH_PERM_001: 権限不足

```typescript
{
  code: 'AUTH_PERM_001',
  message: 'この操作を行う権限がありません',
  details: {
    required: requiredRole,
    actual: userRole
  },
  action: 'upgrade_account'
}
````

## 6. データベースエラー (DB)

### DB_QUERY_001: クエリエラー

```typescript
{
  code: 'DB_QUERY_001',
  message: 'データの取得に失敗しました',
  details: {
    table: tableName,
    operation: operationType,
    error: pgError.message
  },
  retry: true
}
```

### DB_CONSTRAINT_001: 制約違反

```typescript
{
  code: 'DB_CONSTRAINT_001',
  message: 'データの整合性エラーが発生しました',
  details: {
    constraint: constraintName,
    table: tableName
  },
  retry: false
}
```

### DB_CONN_001: 接続プールエラー

```typescript
{
  code: 'DB_CONN_001',
  message: 'データベース接続が確立できません',
  details: {
    pool: poolName,
    available: availableConnections,
    waiting: waitingClients
  },
  retry: true
}
```

## 7. システムエラー (SYS)

### SYS_CONFIG_001: 設定エラー

```typescript
{
  code: 'SYS_CONFIG_001',
  message: 'システム設定の読み込みに失敗しました',
  details: {
    config: configName,
    error: originalError.message
  },
  fatal: true
}
```

### SYS_MEMORY_001: メモリ不足

```typescript
{
  code: 'SYS_MEMORY_001',
  message: 'メモリ不足のため処理を継続できません',
  details: {
    used: memoryUsage.used,
    limit: memoryUsage.limit
  },
  action: 'reload_page'
}
```

### SYS_UNKNOWN_001: 予期しないエラー

```typescript
{
  code: 'SYS_UNKNOWN_001',
  message: '予期しないエラーが発生しました',
  details: {
    error: originalError.message,
    stack: originalError.stack
  },
  fatal: false
}
```

## 8. エラーハンドリング実装

### 8.1 エラークラス定義

```typescript
// types/errors.ts
export class AppError extends Error {
  code: string
  details?: any
  retry?: boolean
  action?: string
  fatal?: boolean

  constructor(
    code: string,
    message: string,
    options?: {
      details?: any
      retry?: boolean
      action?: string
      fatal?: boolean
    }
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = options?.details
    this.retry = options?.retry ?? false
    this.action = options?.action
    this.fatal = options?.fatal ?? false
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      retry: this.retry,
      action: this.action
    }
  }
}
```

### 8.2 グローバルエラーハンドラー

```typescript
// composables/useErrorHandler.ts
export function useErrorHandler() {
  const { t } = useI18n()
  const toast = useToast()

  const handleError = (error: unknown) => {
    // AppErrorの場合
    if (error instanceof AppError) {
      const message = t(`errors.${error.code}`, error.message)

      // トースト表示
      toast.add({
        severity: error.fatal ? 'error' : 'warn',
        summary: message,
        detail: error.details ? JSON.stringify(error.details) : undefined,
        life: error.retry ? 5000 : 3000
      })

      // リトライボタン表示
      if (error.retry) {
        showRetryButton(error)
      }

      // アクション実行
      if (error.action) {
        executeAction(error.action)
      }

      // Sentryに送信
      if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(error, {
          tags: {
            errorCode: error.code
          },
          extra: error.details
        })
      }

      return
    }

    // ネイティブエラー
    if (error instanceof Error) {
      handleUnknownError(error)
      return
    }

    // その他
    console.error('Unknown error:', error)
  }

  const showRetryButton = (error: AppError) => {
    // リトライUI表示ロジック
  }

  const executeAction = (action: string) => {
    switch (action) {
      case 'login':
        navigateTo('/login')
        break
      case 'reload_page':
        window.location.reload()
        break
      case 'clear_cache':
        clearApplicationCache()
        break
    }
  }

  return {
    handleError
  }
}
```

### 8.3 API エラーレスポンス

```typescript
// server/api/errors.ts
export function createErrorResponse(error: AppError) {
  const statusCode = getStatusCode(error.code)

  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString()
    }
  }
}

function getStatusCode(errorCode: string): number {
  const prefix = errorCode.split('_')[0]

  switch (prefix) {
    case 'VAL':
      return 400
    case 'AUTH':
      return 401
    case 'NET':
      return 503
    case 'DB':
      return 500
    case 'SYS':
      return 500
    default:
      return 500
  }
}
```

## 9. エラー通知設定

### 9.1 ユーザー向け通知

```yaml
軽微なエラー:
  表示: トースト（3秒）
  色: warning（黄色）
  例: VAL_INPUT_*

重要なエラー:
  表示: モーダルダイアログ
  色: error（赤色）
  例: AUTH_*, DB_*

致命的エラー:
  表示: フルスクリーンエラー
  アクション: サポート連絡先表示
  例: SYS_CONFIG_001
```

### 9.2 開発者向け通知

```yaml
開発環境:
  コンソール: 全エラー出力
  詳細: スタックトレース表示

本番環境:
  Sentry: エラー送信
  ログ: 構造化ログ出力
  アラート: 重要度に応じてSlack通知
```

## 10. エラー復旧戦略

### 10.1 自動リトライ

```typescript
const retryConfig = {
  'NET_*': {
    maxRetries: 3,
    backoff: 'exponential',
    initialDelay: 1000
  },
  'DB_CONN_*': {
    maxRetries: 5,
    backoff: 'linear',
    initialDelay: 2000
  }
}
```

### 10.2 フォールバック

```typescript
const fallbackStrategies = {
  APP_CALC_002: useOfflineComparisons,
  NET_CONN_001: useLocalCache,
  DB_QUERY_001: useIndexedDB
}
```

## 関連ドキュメント

- [セキュリティ](../06-infrastructure/security.md)
- [Phase 4 - 機能改善](../05-implementation/phase-4-polish.md)
- [API仕様書](./api-spec.md)
