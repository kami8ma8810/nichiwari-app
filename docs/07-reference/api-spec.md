---
title: API仕様書
category: reference
dependencies: [../05-implementation/phase-3-backend.md]
phase: 3
last-updated: 2024-11-22
---

# API仕様書

## 1. API概要

### 1.1 基本情報

```yaml
ベースURL:
  開発: http://localhost:3000/api
  ステージング: https://staging.nichiwari.app/api
  本番: https://nichiwari.app/api

認証方式: Supabase Auth (JWT)
レート制限: 100リクエスト/分
タイムアウト: 30秒
```

### 1.2 共通ヘッダー

```yaml
リクエストヘッダー:
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer <token> # 認証が必要な場合
  X-Request-ID: <uuid> # トレーシング用

レスポンスヘッダー:
  Content-Type: application/json
  X-Request-ID: <uuid>
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 99
  X-RateLimit-Reset: 1640995200
```

## 2. エンドポイント一覧

### 2.1 計算機能

#### POST /api/calculate

購入価格と使用年数から1日あたりの価値を計算

**リクエスト:**

```typescript
interface CalculateRequest {
  name?: string // 商品名（任意）
  price: number // 購入価格（1〜1,000,000,000）
  years: number // 使用年数（0.5〜100、0.5刻み）
  userId?: string // ユーザーID（任意）
}
```

**レスポンス:**

```typescript
interface CalculateResponse {
  success: boolean
  data: {
    id: string // 計算ID
    product: {
      id: string
      name: string
      price: number
      years: number
    }
    dailyCost: number // 1日あたりの金額
    comparisons: Array<{
      id: string
      name: string
      price: number
      quantity: number
      emoji: string
    }>
    createdAt: string
  }
}
```

**エラーレスポンス:**

```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}
```

**実装例:**

```typescript
// server/api/calculate.post.ts
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // バリデーション
    const validated = v.parse(CalculateSchema, body)

    // 計算処理
    const dailyCost = Math.floor(validated.price / (validated.years * 365))

    // Supabase保存
    const { data: product } = await supabase
      .from('products')
      .insert({
        name: validated.name || 'Unknown',
        price: validated.price,
        years: validated.years
      })
      .select()
      .single()

    const { data: calculation } = await supabase
      .from('calculations')
      .insert({
        product_id: product.id,
        daily_cost: dailyCost,
        user_id: validated.userId
      })
      .select()
      .single()

    // 比較アイテム取得
    const comparisons = await getComparisons(dailyCost)

    return {
      success: true,
      data: {
        id: calculation.id,
        product,
        dailyCost,
        comparisons,
        createdAt: calculation.created_at
      }
    }
  }
  catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})
```

### 2.2 履歴管理

#### GET /api/calculations

計算履歴を取得

**パラメータ:**

```yaml
limit: number # 取得件数（デフォルト: 20、最大: 100）
offset: number # オフセット（デフォルト: 0）
userId: string # ユーザーID（任意）
```

**レスポンス:**

```typescript
interface CalculationsListResponse {
  success: boolean
  data: {
    items: Array<{
      id: string
      product: Product
      dailyCost: number
      createdAt: string
    }>
    total: number
    limit: number
    offset: number
  }
}
```

#### GET /api/calculations/:id

特定の計算結果を取得

**レスポンス:**

```typescript
interface CalculationDetailResponse {
  success: boolean
  data: {
    id: string
    product: Product
    dailyCost: number
    happinessScore?: {
      score: number
      factors: {
        frequency: number
        satisfaction: number
        necessity: number
      }
      message: string
    }
    comparisons: Comparison[]
    createdAt: string
  }
}
```

#### DELETE /api/calculations/:id

計算履歴を削除

**レスポンス:**

```typescript
interface DeleteResponse {
  success: boolean
  message: string
}
```

### 2.3 幸福度スコア

#### POST /api/happiness-score

幸福度スコアを保存

**リクエスト:**

```typescript
interface HappinessScoreRequest {
  calculationId: string
  frequency: number // 1-5: 使用頻度
  satisfaction: number // 1-5: 満足度
  necessity: number // 1-5: 必要性
}
```

**レスポンス:**

```typescript
interface HappinessScoreResponse {
  success: boolean
  data: {
    id: string
    score: number // 0-100
    message: string
    createdAt: string
  }
}
```

### 2.4 比較データ

#### GET /api/comparisons

比較アイテム一覧を取得

**レスポンス:**

```typescript
interface ComparisonsResponse {
  success: boolean
  data: Array<{
    id: string
    name: string
    price: number
    emoji: string
    unit: string
    category: string
  }>
}
```

### 2.5 統計情報

#### GET /api/statistics

アプリ全体の統計情報を取得

**レスポンス:**

```typescript
interface StatisticsResponse {
  success: boolean
  data: {
    totalCalculations: number
    averageDailyCost: number
    averageHappinessScore: number
    popularProducts: Array<{
      name: string
      count: number
    }>
    priceRanges: Array<{
      range: string
      count: number
    }>
  }
}
```

#### GET /api/statistics/user/:userId

ユーザー個別の統計情報

**レスポンス:**

```typescript
interface UserStatisticsResponse {
  success: boolean
  data: {
    totalCalculations: number
    totalSavings: number
    averageDailyCost: number
    mostExpensiveItem: Product
    mostValueItem: Product // 最も日割りが安い
    categoryBreakdown: Array<{
      category: string
      count: number
      totalCost: number
    }>
  }
}
```

## 3. WebSocket API

### 3.1 リアルタイム更新

```typescript
// WebSocket接続
const ws = new WebSocket('wss://nichiwari.app/ws')

// イベントタイプ
interface WSMessage {
  type: 'calculation:new' | 'calculation:update' | 'calculation:delete'
  data: any
}

// 接続確立
ws.onopen = () => {
  // 認証
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'xxx'
  }))

  // チャンネル購読
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'calculations'
  }))
}

// メッセージ受信
ws.onmessage = (event) => {
  const message: WSMessage = JSON.parse(event.data)

  switch (message.type) {
    case 'calculation:new':
      // 新規計算追加処理
      break
    case 'calculation:update':
      // 更新処理
      break
    case 'calculation:delete':
      // 削除処理
      break
  }
}
```

## 4. エラーコード

### 4.1 HTTPステータスコード

```yaml
200: OK - リクエスト成功
201: Created - リソース作成成功
204: No Content - 削除成功

400: Bad Request - リクエスト不正
401: Unauthorized - 認証失敗
403: Forbidden - 権限なし
404: Not Found - リソースなし
409: Conflict - 競合発生
429: Too Many Requests - レート制限

500: Internal Server Error - サーバーエラー
502: Bad Gateway - ゲートウェイエラー
503: Service Unavailable - サービス停止
504: Gateway Timeout - タイムアウト
```

### 4.2 アプリケーションエラーコード

```yaml
VALIDATION_ERROR: 入力値検証エラー
CALCULATION_ERROR: 計算処理エラー
DATABASE_ERROR: データベースエラー
AUTH_ERROR: 認証エラー
PERMISSION_ERROR: 権限エラー
RATE_LIMIT_ERROR: レート制限エラー
NETWORK_ERROR: ネットワークエラー
```

## 5. API利用例

### 5.1 JavaScript/TypeScript

```typescript
// APIクライアントクラス
class NichiwariAPI {
  private baseURL: string
  private token?: string

  constructor(baseURL = 'https://nichiwari.app/api') {
    this.baseURL = baseURL
  }

  setToken(token: string) {
    this.token = token
  }

  private async request(
    path: string,
    options: RequestInit = {}
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers
    }

    const response = await fetch(`${this.baseURL}${path}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  // 計算実行
  async calculate(data: CalculateRequest): Promise<CalculateResponse> {
    return this.request('/calculate', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // 履歴取得
  async getCalculations(params?: {
    limit?: number
    offset?: number
  }): Promise<CalculationsListResponse> {
    const query = new URLSearchParams(params as any).toString()
    return this.request(`/calculations?${query}`)
  }

  // 詳細取得
  async getCalculation(id: string): Promise<CalculationDetailResponse> {
    return this.request(`/calculations/${id}`)
  }

  // 削除
  async deleteCalculation(id: string): Promise<DeleteResponse> {
    return this.request(`/calculations/${id}`, {
      method: 'DELETE'
    })
  }

  // 幸福度スコア保存
  async saveHappinessScore(
    data: HappinessScoreRequest
  ): Promise<HappinessScoreResponse> {
    return this.request('/happiness-score', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// 使用例
const api = new NichiwariAPI()

// 計算実行
const result = await api.calculate({
  name: 'iPhone 15 Pro',
  price: 159800,
  years: 2
})

console.log(`1日あたり${result.data.dailyCost}円`)
```

### 5.2 cURL

```bash
# 計算実行
curl -X POST https://nichiwari.app/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "price": 159800,
    "years": 2
  }'

# 履歴取得
curl https://nichiwari.app/api/calculations?limit=10

# 削除
curl -X DELETE https://nichiwari.app/api/calculations/xxx \
  -H "Authorization: Bearer <token>"
```

### 5.3 Python

```python
import requests
from typing import Optional, Dict, Any

class NichiwariAPI:
    def __init__(self, base_url: str = "https://nichiwari.app/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "Accept": "application/json"
        })

    def set_token(self, token: str):
        self.session.headers["Authorization"] = f"Bearer {token}"

    def calculate(
        self,
        price: int,
        years: float,
        name: Optional[str] = None
    ) -> Dict[str, Any]:
        response = self.session.post(
            f"{self.base_url}/calculate",
            json={"name": name, "price": price, "years": years}
        )
        response.raise_for_status()
        return response.json()

    def get_calculations(
        self,
        limit: int = 20,
        offset: int = 0
    ) -> Dict[str, Any]:
        response = self.session.get(
            f"{self.base_url}/calculations",
            params={"limit": limit, "offset": offset}
        )
        response.raise_for_status()
        return response.json()

# 使用例
api = NichiwariAPI()
result = api.calculate(price=159800, years=2, name="iPhone 15 Pro")
print(f"1日あたり{result['data']['dailyCost']}円")
```

## 6. OpenAPI仕様

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: Nichiwari API
  version: 1.0.0
  description: 買い物の価値を見える化するアプリのAPI

servers:
  - url: https://nichiwari.app/api
    description: Production
  - url: https://staging.nichiwari.app/api
    description: Staging
  - url: http://localhost:3000/api
    description: Development

paths:
  /calculate:
    post:
      summary: 計算実行
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CalculateRequest'
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CalculateResponse'

components:
  schemas:
    CalculateRequest:
      type: object
      required:
        - price
        - years
      properties:
        name:
          type: string
          maxLength: 100
        price:
          type: integer
          minimum: 1
          maximum: 1000000000
        years:
          type: number
          minimum: 0.5
          maximum: 100
          multipleOf: 0.5
```

## 関連ドキュメント

- [データベーススキーマ](./database-schema.md)
- [エラーコード一覧](./error-codes.md)
- [バックエンド連携](../05-implementation/phase-3-backend.md)
