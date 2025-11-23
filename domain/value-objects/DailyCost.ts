/**
 * 日割りコストを表す値オブジェクト
 *
 * - 日割りコストは0円以上の整数
 * - イミュータブル（不変）なオブジェクト
 * - 月割り・年割りへの変換機能を提供
 */
export class DailyCost {
  private readonly _value: number

  /**
   * @param value - 日割りコスト（円/日）
   * @throws {Error} 日割りコストが整数でない場合
   * @throws {Error} 日割りコストが0未満の場合
   */
  constructor(value: number) {
    // 整数チェック
    if (!Number.isInteger(value)) {
      throw new TypeError('日割りコストは整数である必要があります')
    }

    // 範囲チェック
    if (value < 0) {
      throw new Error('日割りコストは0以上である必要があります')
    }

    this._value = value
  }

  /**
   * 日割りコストの値を取得
   */
  get value(): number {
    return this._value
  }

  /**
   * 月割りコストに変換
   *
   * @returns 月割りコスト（円/月、30日換算）
   */
  toMonthly(): number {
    return this._value * 30
  }

  /**
   * 年割りコストに変換
   *
   * @returns 年割りコスト（円/年、365日換算）
   */
  toYearly(): number {
    return this._value * 365
  }

  /**
   * フォーマット
   *
   * @returns 日割りコストの文字列表現（例: ￥137/日）
   */
  format(): string {
    const formatted = new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(this._value)
    return `${formatted}/日`
  }

  /**
   * 等価性の比較
   *
   * @param other - 比較対象のDailyCost
   * @returns 同じ日割りコストの場合true
   */
  equals(other: DailyCost): boolean {
    return this._value === other._value
  }
}
