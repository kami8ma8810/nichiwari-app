---
title: E2Eテストガイド
category: testing
dependencies: [unit-testing.md, ../03-development/component-guide.md]
phase: 3
last-updated: 2024-11-22
---

# E2Eテストガイド

## 1. E2Eテスト方針

### 1.1 テスト範囲

```yaml
対象シナリオ:
  クリティカルパス:
    - 計算機能の完全フロー
    - 履歴の保存と参照
    - オフライン動作

  ユーザージャーニー:
    - 初回利用者のオンボーディング
    - リピーターの利用パターン
    - エラーからの回復

  リグレッション防止:
    - 過去のバグ再発防止
    - ブラウザ互換性
    - レスポンシブデザイン
```

### 1.2 テスト環境

```yaml
ブラウザ:
  - Chrome (最新版)
  - Firefox (最新版)
  - Safari (最新版)
  - Edge (最新版)

デバイス:
  - デスクトップ (1920x1080)
  - タブレット (768x1024)
  - モバイル (375x812)

環境:
  - ローカル開発環境
  - ステージング環境
  - 本番環境（スモークテストのみ）
```

## 2. Playwright設定

### 2.1 基本設定

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] }
    },
    {
      name: 'tablet',
      use: { ...devices['iPad (gen 7)'] }
    }
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
})
```

### 2.2 グローバルセットアップ

```typescript
// e2e/global-setup.ts
import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // テスト用Supabase環境のセットアップ
  if (process.env.CI) {
    await setupTestDatabase()
  }

  // 認証状態の準備（必要に応じて）
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // テストデータの初期化
  await page.goto(`${config.projects[0].use.baseURL}/api/test/setup`)

  await browser.close()
}

async function setupTestDatabase() {
  // Supabaseテスト環境のセットアップ
  const { createClient } = require('@supabase/supabase-js')

  const supabase = createClient(
    process.env.SUPABASE_TEST_URL!,
    process.env.SUPABASE_TEST_ANON_KEY!
  )

  // テストデータのクリア
  await supabase.from('calculations').delete().neq('id', 0)
  await supabase.from('happiness_scores').delete().neq('id', 0)
}

export default globalSetup
```

## 3. Page Object Model

### 3.1 ベースページクラス

```typescript
// e2e/pages/BasePage.ts
import { Page, Locator } from '@playwright/test'

export abstract class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  async navigate(path: string = '') {
    await this.page.goto(path)
    await this.waitForPageLoad()
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true
    })
  }

  async checkAccessibility() {
    await this.page.evaluate(() => {
      // axe-coreを使用したアクセシビリティチェック
      return new Promise((resolve, reject) => {
        // @ts-ignore
        if (window.axe) {
          // @ts-ignore
          window.axe.run().then(resolve).catch(reject)
        } else {
          resolve({ violations: [] })
        }
      })
    })
  }

  async waitForElement(selector: string, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout })
  }

  async isElementVisible(selector: string): Promise<boolean> {
    const element = this.page.locator(selector)
    return await element.isVisible()
  }
}
```

### 3.2 計算機ページ

```typescript
// e2e/pages/CalculatorPage.ts
import { Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class CalculatorPage extends BasePage {
  // ロケーター
  private priceInput: Locator
  private yearsInput: Locator
  private calculateButton: Locator
  private resultSection: Locator
  private dailyCostValue: Locator
  private errorMessage: Locator
  private resetButton: Locator

  constructor(page: Page) {
    super(page)

    // ロケーターの初期化
    this.priceInput = page.getByLabel('購入価格')
    this.yearsInput = page.getByLabel('使用予定年数')
    this.calculateButton = page.getByRole('button', { name: '計算する' })
    this.resultSection = page.getByTestId('calculator-result')
    this.dailyCostValue = page.getByTestId('daily-cost-value')
    this.errorMessage = page.getByRole('alert')
    this.resetButton = page.getByRole('button', { name: 'リセット' })
  }

  async fillPrice(price: string) {
    await this.priceInput.clear()
    await this.priceInput.fill(price)
  }

  async fillYears(years: string) {
    await this.yearsInput.clear()
    await this.yearsInput.fill(years)
  }

  async calculate() {
    await this.calculateButton.click()
  }

  async reset() {
    await this.resetButton.click()
  }

  async performCalculation(price: string, years: string) {
    await this.fillPrice(price)
    await this.fillYears(years)
    await this.calculate()
  }

  async getDailyCost(): Promise<string> {
    await this.resultSection.waitFor({ state: 'visible' })
    return await this.dailyCostValue.textContent() || ''
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' })
    return await this.errorMessage.textContent() || ''
  }

  async isResultVisible(): Promise<boolean> {
    return await this.resultSection.isVisible()
  }

  async verifyCalculation(expectedDailyCost: string) {
    const actualCost = await this.getDailyCost()
    expect(actualCost).toContain(expectedDailyCost)
  }

  async verifyError(expectedError: string) {
    const actualError = await this.getErrorMessage()
    expect(actualError).toContain(expectedError)
  }
}
```

### 3.3 履歴ページ

```typescript
// e2e/pages/HistoryPage.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class HistoryPage extends BasePage {
  private historyList: Locator
  private historyItems: Locator
  private clearButton: Locator
  private exportButton: Locator

  constructor(page: Page) {
    super(page)

    this.historyList = page.getByTestId('history-list')
    this.historyItems = page.getByTestId('history-item')
    this.clearButton = page.getByRole('button', { name: '履歴をクリア' })
    this.exportButton = page.getByRole('button', { name: 'エクスポート' })
  }

  async getHistoryCount(): Promise<number> {
    return await this.historyItems.count()
  }

  async getHistoryItem(index: number) {
    const item = this.historyItems.nth(index)
    return {
      name: await item.getByTestId('product-name').textContent(),
      price: await item.getByTestId('product-price').textContent(),
      dailyCost: await item.getByTestId('daily-cost').textContent(),
      date: await item.getByTestId('calculation-date').textContent()
    }
  }

  async clearHistory() {
    await this.clearButton.click()
    await this.page.getByRole('button', { name: '確認' }).click()
  }

  async exportHistory(format: 'csv' | 'json') {
    const downloadPromise = this.page.waitForEvent('download')
    await this.exportButton.click()
    await this.page.getByRole('button', { name: format.toUpperCase() }).click()
    return await downloadPromise
  }

  async searchHistory(query: string) {
    const searchInput = this.page.getByPlaceholder('履歴を検索')
    await searchInput.fill(query)
    await this.page.keyboard.press('Enter')
  }
}
```

## 4. テストシナリオ

### 4.1 基本計算フロー

```typescript
// e2e/tests/calculator-basic.spec.ts
import { test, expect } from '@playwright/test'
import { CalculatorPage } from '../pages/CalculatorPage'

test.describe('基本計算機能', () => {
  let calculatorPage: CalculatorPage

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page)
    await calculatorPage.navigate()
  })

  test('正常な計算ができる', async () => {
    await calculatorPage.performCalculation('150000', '3')

    await expect(calculatorPage.isResultVisible()).toBeTruthy()
    await calculatorPage.verifyCalculation('137円')
  })

  test('バリデーションエラーが表示される', async () => {
    await calculatorPage.performCalculation('0', '3')

    await calculatorPage.verifyError('1円以上で入力してください')
  })

  test('リセット機能が動作する', async () => {
    await calculatorPage.performCalculation('150000', '3')
    await calculatorPage.reset()

    const priceInput = await page.getByLabel('購入価格')
    await expect(priceInput).toHaveValue('')
    await expect(calculatorPage.isResultVisible()).toBeFalsy()
  })

  test('キーボードナビゲーションが動作する', async ({ page }) => {
    await page.getByLabel('購入価格').focus()
    await page.keyboard.type('150000')
    await page.keyboard.press('Tab')

    const yearsInput = page.getByLabel('使用予定年数')
    await expect(yearsInput).toBeFocused()

    await page.keyboard.type('3')
    await page.keyboard.press('Enter')

    await expect(calculatorPage.isResultVisible()).toBeTruthy()
  })
})
```

### 4.2 レスポンシブデザイン

```typescript
// e2e/tests/responsive.spec.ts
import { test, expect, devices } from '@playwright/test'
import { CalculatorPage } from '../pages/CalculatorPage'

const viewports = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 812 }
]

viewports.forEach(viewport => {
  test.describe(`レスポンシブ: ${viewport.name}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height }
    })

    test('UIが正しく表示される', async ({ page }) => {
      const calculatorPage = new CalculatorPage(page)
      await calculatorPage.navigate()

      // スクリーンショット比較
      await expect(page).toHaveScreenshot(
        `calculator-${viewport.name.toLowerCase()}.png`
      )
    })

    test('計算機能が動作する', async ({ page }) => {
      const calculatorPage = new CalculatorPage(page)
      await calculatorPage.navigate()

      await calculatorPage.performCalculation('150000', '3')
      await calculatorPage.verifyCalculation('137円')
    })
  })
})
```

### 4.3 オフライン機能

```typescript
// e2e/tests/offline.spec.ts
import { test, expect } from '@playwright/test'
import { CalculatorPage } from '../pages/CalculatorPage'

test.describe('オフライン機能', () => {
  test('オフラインでも計算が動作する', async ({ page, context }) => {
    const calculatorPage = new CalculatorPage(page)
    await calculatorPage.navigate()

    // オフラインモードに切り替え
    await context.setOffline(true)

    // 計算実行
    await calculatorPage.performCalculation('150000', '3')
    await calculatorPage.verifyCalculation('137円')
  })

  test('オフライン時にプリセットデータが利用できる', async ({ page, context }) => {
    await page.goto('/')
    await context.setOffline(true)

    // プリセット選択
    await page.getByRole('button', { name: 'プリセット' }).click()
    await page.getByText('iPhone 15 Pro').click()

    // 自動入力確認
    const priceInput = page.getByLabel('購入価格')
    await expect(priceInput).toHaveValue('159800')
  })

  test('Service Workerがキャッシュする', async ({ page }) => {
    await page.goto('/')

    // Service Worker登録確認
    const swRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.ready
    })

    expect(swRegistration).toBeTruthy()

    // キャッシュ確認
    const cacheNames = await page.evaluate(async () => {
      return await caches.keys()
    })

    expect(cacheNames).toContain('nichiwari-v1')
  })
})
```

### 4.4 パフォーマンステスト

```typescript
// e2e/tests/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('パフォーマンス', () => {
  test('初回読み込みが3秒以内', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    expect(loadTime).toBeLessThan(3000)
  })

  test('Lighthouse スコアが基準を満たす', async ({ page }) => {
    await page.goto('/')

    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Lighthouse metrics collection
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcp = entries.find(e => e.name === 'first-contentful-paint')
          const lcp = entries.find(e => e.name === 'largest-contentful-paint')

          resolve({
            fcp: fcp?.startTime || 0,
            lcp: lcp?.startTime || 0
          })
        })

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
      })
    })

    expect(metrics.fcp).toBeLessThan(1800) // 1.8秒以内
    expect(metrics.lcp).toBeLessThan(2500) // 2.5秒以内
  })

  test('メモリリークがない', async ({ page }) => {
    await page.goto('/')

    // 初期メモリ使用量
    const initialMemory = await page.evaluate(() => {
      return performance.memory?.usedJSHeapSize || 0
    })

    // 100回計算実行
    for (let i = 0; i < 100; i++) {
      await page.fill('[name="price"]', String(100000 + i))
      await page.fill('[name="years"]', '3')
      await page.click('button:has-text("計算する")')
    }

    // 最終メモリ使用量
    const finalMemory = await page.evaluate(() => {
      return performance.memory?.usedJSHeapSize || 0
    })

    // メモリ増加が10MB以内
    expect(finalMemory - initialMemory).toBeLessThan(10 * 1024 * 1024)
  })
})
```

## 5. アクセシビリティテスト

### 5.1 WCAG準拠テスト

```typescript
// e2e/tests/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('アクセシビリティ', () => {
  test('WCAG 2.1 AAに準拠', async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)

    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
        }
      }
    })
  })

  test('キーボードナビゲーションが完全', async ({ page }) => {
    await page.goto('/')

    // Tabキーでの移動
    await page.keyboard.press('Tab')
    let focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(focused).toBe('INPUT')

    // Enterキーでの送信
    await page.fill('[name="price"]', '150000')
    await page.keyboard.press('Tab')
    await page.fill('[name="years"]', '3')
    await page.keyboard.press('Enter')

    const result = page.getByTestId('calculator-result')
    await expect(result).toBeVisible()
  })

  test('スクリーンリーダー対応', async ({ page }) => {
    await page.goto('/')

    // ARIA属性の確認
    const priceInput = page.getByLabel('購入価格')
    await expect(priceInput).toHaveAttribute('aria-required', 'true')
    await expect(priceInput).toHaveAttribute('aria-invalid', 'false')

    // エラー時のARIA
    await page.fill('[name="price"]', '0')
    await page.click('button:has-text("計算する")')

    await expect(priceInput).toHaveAttribute('aria-invalid', 'true')
    const errorId = await priceInput.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
  })
})
```

## 6. データドリブンテスト

### 6.1 テストデータ定義

```typescript
// e2e/fixtures/calculation-data.ts
export const validCalculations = [
  { price: '150000', years: '3', expected: '137' },
  { price: '50000', years: '5', expected: '27' },
  { price: '1000000', years: '10', expected: '274' },
  { price: '1', years: '1', expected: '0' }, // 切り捨て
]

export const invalidCalculations = [
  { price: '0', years: '3', error: '1円以上' },
  { price: '-100', years: '3', error: '0以上' },
  { price: '150000', years: '0', error: '0.5年以上' },
  { price: '150000', years: '101', error: '100年以下' },
  { price: 'abc', years: '3', error: '数値を入力' },
]
```

### 6.2 パラメータ化テスト

```typescript
// e2e/tests/calculation-variations.spec.ts
import { test } from '@playwright/test'
import { CalculatorPage } from '../pages/CalculatorPage'
import { validCalculations, invalidCalculations } from '../fixtures/calculation-data'

test.describe('計算バリエーション', () => {
  validCalculations.forEach(({ price, years, expected }) => {
    test(`${price}円を${years}年 → ${expected}円/日`, async ({ page }) => {
      const calculatorPage = new CalculatorPage(page)
      await calculatorPage.navigate()

      await calculatorPage.performCalculation(price, years)
      await calculatorPage.verifyCalculation(expected)
    })
  })

  invalidCalculations.forEach(({ price, years, error }) => {
    test(`エラー: ${price}円, ${years}年`, async ({ page }) => {
      const calculatorPage = new CalculatorPage(page)
      await calculatorPage.navigate()

      await calculatorPage.performCalculation(price, years)
      await calculatorPage.verifyError(error)
    })
  })
})
```

## 7. CI/CDパイプライン

### 7.1 GitHub Actions設定

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * *' # 毎日実行

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright
        run: pnpm playwright install --with-deps ${{ matrix.browser }}

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e --project=${{ matrix.browser }}
        env:
          BASE_URL: http://localhost:3000
          SUPABASE_TEST_URL: ${{ secrets.SUPABASE_TEST_URL }}
          SUPABASE_TEST_ANON_KEY: ${{ secrets.SUPABASE_TEST_ANON_KEY }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.browser }}
          path: |
            test-results/
            playwright-report/

      - name: Upload coverage
        if: matrix.browser == 'chromium'
        uses: codecov/codecov-action@v3
```

## 8. デバッグとトラブルシューティング

### 8.1 デバッグツール

```typescript
// e2e/helpers/debug.ts
import { Page } from '@playwright/test'

export class DebugHelper {
  static async pauseWithMessage(page: Page, message: string) {
    console.log(`🔍 Debug: ${message}`)
    await page.pause()
  }

  static async logPageInfo(page: Page) {
    const url = page.url()
    const title = await page.title()
    console.log(`📍 Current page: ${title} (${url})`)
  }

  static async captureState(page: Page, name: string) {
    await page.screenshot({
      path: `debug/${name}-screenshot.png`,
      fullPage: true
    })

    const html = await page.content()
    require('fs').writeFileSync(`debug/${name}.html`, html)
  }

  static async logNetworkActivity(page: Page) {
    page.on('request', request => {
      console.log(`➡️ ${request.method()} ${request.url()}`)
    })

    page.on('response', response => {
      console.log(`⬅️ ${response.status()} ${response.url()}`)
    })
  }
}
```

### 8.2 よくある問題と解決方法

```yaml
タイムアウトエラー:
  原因:
    - 要素が見つからない
    - ネットワークが遅い
    - アニメーションが長い
  解決:
    - セレクタの確認
    - タイムアウト時間の調整
    - waitForAnimationの使用

フレーク（不安定なテスト）:
  原因:
    - 非同期処理の競合
    - ランダムな要素
    - 外部依存
  解決:
    - 明示的な待機
    - モックの使用
    - リトライの設定

環境差異:
  原因:
    - ローカルとCIの違い
    - ブラウザバージョン
    - OS差異
  解決:
    - Dockerコンテナ使用
    - バージョン固定
    - 環境変数統一
```

## 9. ベストプラクティス

### 9.1 テスト作成指針

```yaml
良いE2Eテスト:
  ✓ ユーザー視点のシナリオ
  ✓ 実装詳細に依存しない
  ✓ 独立して実行可能
  ✓ 明確な成功/失敗基準
  ✓ 適切な待機処理

避けるべきこと:
  ✗ 単体テストレベルの検証
  ✗ CSSセレクタへの過度な依存
  ✗ ハードコードされた待機時間
  ✗ 状態を共有するテスト
  ✗ 外部サービスへの直接依存
```

## 関連ドキュメント

- [単体テストガイド](./unit-testing.md)
- [テストデータ管理](./test-data.md)
- [CI/CD設定](../06-infrastructure/deployment.md)
- [パフォーマンス要件](../01-requirements/non-functional.md)