---
title: セキュリティ設定
category: infrastructure
dependencies: [deployment.md, supabase.md]
phase: 5
last-updated: 2024-11-22
---

# セキュリティ設定

## 1. セキュリティ方針

### 1.1 基本原則

```yaml
原則:
  - 最小権限の原則
  - 多層防御
  - ゼロトラスト
  - 継続的監視

対象範囲:
  - アプリケーションセキュリティ
  - インフラセキュリティ
  - データセキュリティ
  - アクセス管理
```

### 1.2 脅威モデル

```yaml
主な脅威:
  XSS攻撃:
    リスク: 高
    対策: CSP、入力検証、出力エスケープ

  SQLインジェクション:
    リスク: 中
    対策: パラメータ化クエリ、Supabase RLS

  CSRF攻撃:
    リスク: 低
    対策: SameSite Cookie、トークン検証

  DDoS攻撃:
    リスク: 中
    対策: Vercel保護、レート制限
```

## 2. アプリケーションセキュリティ

### 2.1 Content Security Policy (CSP)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    rollupConfig: {
      output: {
        format: 'es'
      }
    }
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'", // Nuxt用
          "'unsafe-eval'", // 開発時のみ
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com'
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'", // Tailwind用
          'https://fonts.googleapis.com'
        ],
        'font-src': [
          "'self'",
          'https://fonts.gstatic.com'
        ],
        'img-src': [
          "'self'",
          'data:',
          'https:',
          'blob:'
        ],
        'connect-src': [
          "'self'",
          'https://*.supabase.co',
          'wss://*.supabase.co',
          'https://www.google-analytics.com'
        ],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'upgrade-insecure-requests': true
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true
      },
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
      xXssProtection: '1; mode=block',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        camera: false,
        microphone: false,
        geolocation: false,
        payment: false
      }
    }
  }
})
```

### 2.2 入力検証

```typescript
// utils/validation.ts
import DOMPurify from 'isomorphic-dompurify'
import * as v from 'valibot'

// XSS対策
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  })
}

// SQLインジェクション対策
export const sanitizeForSQL = (input: string): string => {
  return input
    .replace(/'/g, "''") // シングルクォートエスケープ
    .replace(/;/g, '') // セミコロン削除
    .replace(/--/g, '') // コメント削除
    .replace(/\/\*/g, '') // コメント削除
    .replace(/\*\//g, '') // コメント削除
}

// ファイル名サニタイズ
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // 英数字以外を_に
    .replace(/^\.+/, '') // 先頭のドット削除
    .substring(0, 255) // 最大長制限
}

// メールアドレス検証
export const EmailSchema = v.pipe(
  v.string(),
  v.email('有効なメールアドレスを入力してください'),
  v.maxLength(254, 'メールアドレスが長すぎます')
)

// URL検証
export const UrlSchema = v.pipe(
  v.string(),
  v.url('有効なURLを入力してください'),
  v.regex(/^https:\/\//, 'HTTPSのみ許可されています')
)

// 数値範囲検証
export const validateNumberRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  if (!Number.isFinite(value)) return false
  if (value < min || value > max) return false
  return true
}
```

### 2.3 認証・認可

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { supabase, user } = useSupabase()

  // セッション確認
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && to.meta.requiresAuth) {
    return navigateTo('/login')
  }

  // 権限確認
  if (to.meta.requiredRole) {
    const hasRole = await checkUserRole(session?.user?.id, to.meta.requiredRole)
    if (!hasRole) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden'
      })
    }
  }

  // CSRF対策
  if (['POST', 'PUT', 'DELETE'].includes(to.method || 'GET')) {
    const csrfToken = getCookie('csrf-token')
    const headerToken = getHeader('x-csrf-token')

    if (!csrfToken || csrfToken !== headerToken) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid CSRF token'
      })
    }
  }
})
```

## 3. インフラセキュリティ

### 3.1 環境変数管理

```typescript
// utils/env-validator.ts
import * as v from 'valibot'

const EnvSchema = v.object({
  NUXT_PUBLIC_SUPABASE_URL: v.pipe(
    v.string(),
    v.url(),
    v.regex(/^https:\/\/.*\.supabase\.co$/)
  ),
  NUXT_PUBLIC_SUPABASE_ANON_KEY: v.pipe(
    v.string(),
    v.minLength(40)
  ),
  SUPABASE_SERVICE_KEY: v.optional(v.pipe(
    v.string(),
    v.minLength(40)
  )),
  NODE_ENV: v.picklist(['development', 'test', 'production'])
})

export const validateEnv = () => {
  try {
    const env = v.parse(EnvSchema, process.env)
    return env
  } catch (error) {
    console.error('Environment validation failed:', error)
    throw new Error('Invalid environment configuration')
  }
}

// 機密情報の漏洩防止
export const redactSensitiveData = (obj: any): any => {
  const sensitiveKeys = [
    'password', 'token', 'key', 'secret',
    'apikey', 'authorization', 'cookie'
  ]

  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const redacted = Array.isArray(obj) ? [...obj] : { ...obj }

  for (const key in redacted) {
    const lowerKey = key.toLowerCase()

    if (sensitiveKeys.some(k => lowerKey.includes(k))) {
      redacted[key] = '[REDACTED]'
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactSensitiveData(redacted[key])
    }
  }

  return redacted
}
```

### 3.2 レート制限

```typescript
// server/middleware/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export default defineEventHandler(async (event) => {
  // 静的ファイルはスキップ
  if (event.node.req.url?.startsWith('/_nuxt/')) return

  const ip = getClientIP(event) || 'unknown'
  const key = `${ip}:${event.node.req.url}`
  const now = Date.now()

  // レート制限設定
  const limit = 100 // 1分あたり100リクエスト
  const window = 60 * 1000 // 1分

  let record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + window
    }
  } else {
    record.count++
  }

  rateLimitMap.set(key, record)

  // 制限超過
  if (record.count > limit) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      headers: {
        'Retry-After': String(Math.ceil((record.resetTime - now) / 1000))
      }
    })
  }

  // クリーンアップ（メモリリーク防止）
  if (rateLimitMap.size > 10000) {
    const expired = []
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) {
        expired.push(k)
      }
    }
    expired.forEach(k => rateLimitMap.delete(k))
  }
})
```

## 4. データセキュリティ

### 4.1 暗号化

```typescript
// utils/crypto.ts
import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const saltLength = 64
const tagLength = 16
const ivLength = 16
const iterations = 100000
const keyLength = 32

// 暗号化
export const encrypt = (text: string, password: string): string => {
  const salt = crypto.randomBytes(saltLength)
  const key = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256')
  const iv = crypto.randomBytes(ivLength)

  const cipher = crypto.createCipheriv(algorithm, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ])

  const tag = cipher.getAuthTag()

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64')
}

// 復号化
export const decrypt = (encryptedData: string, password: string): string => {
  const buffer = Buffer.from(encryptedData, 'base64')

  const salt = buffer.slice(0, saltLength)
  const iv = buffer.slice(saltLength, saltLength + ivLength)
  const tag = buffer.slice(saltLength + ivLength, saltLength + ivLength + tagLength)
  const encrypted = buffer.slice(saltLength + ivLength + tagLength)

  const key = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256')

  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(tag)

  return decipher.update(encrypted) + decipher.final('utf8')
}

// ハッシュ化（不可逆）
export const hash = (text: string): string => {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex')
}

// セキュアランダム生成
export const generateSecureToken = (length = 32): string => {
  return crypto
    .randomBytes(length)
    .toString('base64url')
}
```

### 4.2 個人情報保護

```typescript
// utils/privacy.ts
export class PrivacyManager {
  // 個人情報のマスキング
  static maskEmail(email: string): string {
    const [local, domain] = email.split('@')
    const maskedLocal = local.slice(0, 2) + '***'
    return `${maskedLocal}@${domain}`
  }

  static maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  // IPアドレスの匿名化
  static anonymizeIP(ip: string): string {
    if (ip.includes(':')) {
      // IPv6
      const parts = ip.split(':')
      return parts.slice(0, 4).join(':') + '::0000:0000:0000:0000'
    } else {
      // IPv4
      const parts = ip.split('.')
      return parts.slice(0, 3).join('.') + '.0'
    }
  }

  // データ削除
  static async deleteUserData(userId: string) {
    const { supabase } = useSupabase()

    // トランザクションで削除
    await supabase.rpc('delete_user_data', { user_id: userId })

    // キャッシュクリア
    await clearUserCache(userId)

    // ログ記録
    console.log(`User data deleted: ${userId}`)
  }
}
```

## 5. セキュリティ監査

### 5.1 自動セキュリティスキャン

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0' # 週次実行

jobs:
  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: |
          npm audit --production
          pnpm audit --production-only

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  code-scanning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: CodeQL Analysis
        uses: github/codeql-action/analyze@v2

      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: auto

  container-scanning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
```

### 5.2 ペネトレーションテスト

```typescript
// test/security/penetration.test.ts
describe('Security Tests', () => {
  test('XSS攻撃への耐性', async () => {
    const maliciousInputs = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<iframe src="javascript:alert(\'XSS\')">',
      '<svg onload=alert("XSS")>'
    ]

    for (const input of maliciousInputs) {
      const response = await $fetch('/api/calculate', {
        method: 'POST',
        body: { name: input }
      })

      expect(response.name).not.toContain('<script>')
      expect(response.name).not.toContain('javascript:')
      expect(response.name).not.toContain('onerror')
    }
  })

  test('SQLインジェクション対策', async () => {
    const sqlInjections = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "admin'--",
      "1' UNION SELECT * FROM users--"
    ]

    for (const injection of sqlInjections) {
      const response = await $fetch('/api/search', {
        query: { q: injection }
      })

      expect(response.error).toBeUndefined()
      expect(response.results).toBeDefined()
    }
  })

  test('認証バイパステスト', async () => {
    // 認証なしでアクセス
    await expect(
      $fetch('/api/admin/users')
    ).rejects.toThrow('401')

    // 不正なトークン
    await expect(
      $fetch('/api/admin/users', {
        headers: {
          Authorization: 'Bearer invalid-token'
        }
      })
    ).rejects.toThrow('401')
  })
})
```

## 6. インシデント対応

### 6.1 対応手順

```yaml
インシデント対応フロー:
  1. 検知:
    - 自動アラート
    - ユーザー報告
    - 定期監査

  2. トリアージ:
    - 深刻度評価
    - 影響範囲特定
    - 対応優先度決定

  3. 封じ込め:
    - 影響範囲の限定
    - 一時的対策実施
    - 証拠保全

  4. 根絶:
    - 原因究明
    - 恒久対策実施
    - パッチ適用

  5. 復旧:
    - サービス再開
    - 監視強化
    - 正常性確認

  6. 事後対応:
    - インシデント報告書作成
    - 再発防止策検討
    - プロセス改善
```

### 6.2 連絡体制

```yaml
緊急連絡先:
  セキュリティチーム:
    - 主担当: security@nichiwari.app
    - 副担当: backup@nichiwari.app

  エスカレーション:
    Level 1: 開発チーム (15分以内)
    Level 2: プロダクトマネージャー (30分以内)
    Level 3: CTO/CEO (1時間以内)

  外部連絡先:
    - Vercel Support
    - Supabase Support
    - セキュリティベンダー
```

## 7. コンプライアンス

### 7.1 法規制対応

```yaml
GDPR対応:
  - プライバシーポリシー明記
  - 同意取得機能
  - データポータビリティ
  - 削除権の保証

個人情報保護法対応:
  - 利用目的の明示
  - 安全管理措置
  - 第三者提供の制限
  - 開示請求対応

Cookie法対応:
  - Cookie同意バナー
  - オプトアウト機能
  - Cookie一覧表示
```

## 8. セキュリティチェックリスト

```yaml
デプロイ前チェック:
  ✓ 依存関係の脆弱性スキャン
  ✓ 環境変数の確認
  ✓ CSPヘッダー設定
  ✓ HTTPS強制
  ✓ レート制限実装
  ✓ 入力検証実装
  ✓ エラーメッセージの確認
  ✓ ログ出力の確認
  ✓ バックアップ確認
  ✓ インシデント対応準備
```

## 関連ドキュメント

- [デプロイメント設定](./deployment.md)
- [監視設定](./monitoring.md)
- [Supabase設定](./supabase.md)