/**
 * 計算機能に関する型定義
 */

/**
 * 計算フォームの入力データ
 */
export interface CalculatorFormData {
  /** 商品名（任意） */
  name: string
  /** 購入価格（円） */
  price: number | null
  /** 使用予定年数（年の部分） */
  years: number | null
  /** 使用予定年数（月の部分） */
  months: number | null
}

/**
 * 計算結果
 */
export interface CalculationResult {
  /** 日割りコスト（円/日） */
  dailyCost: number
  /** 日割りコスト（フォーマット済み） */
  dailyCostFormatted: string
  /** 月割りコスト（円/月） */
  monthlyCost: number
  /** 年割りコスト（円/年） */
  yearlyCost: number
  /** 商品名 */
  productName?: string
  /** 購入価格 */
  price: number
  /** 使用期間（年の部分） */
  years: number
  /** 使用期間（月の部分） */
  months: number
  /** 使用期間（フォーマット済み） */
  periodFormatted: string
}

/**
 * 履歴に保存する計算データ
 */
export interface SavedCalculation {
  /** ID */
  id: string
  /** 計算結果 */
  result: CalculationResult
  /** 保存日時 */
  savedAt: Date
}
