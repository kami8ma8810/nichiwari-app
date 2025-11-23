/**
 * 金額を表す値オブジェクト
 *
 * - 金額は0円以上、10億円以下の整数
 * - イミュータブル（不変）なオブジェクト
 * - 演算メソッドは新しいMoneyインスタンスを返す
 */
export class Money {
  private readonly _value: number

  /**
   * @param value - 金額（円）
   * @throws {Error} 金額が整数でない場合
   * @throws {Error} 金額が0未満の場合
   * @throws {Error} 金額が10億円を超える場合
   */
  constructor(value: number) {
    // 整数チェック
    if (!Number.isInteger(value)) {
      throw new TypeError('金額は整数である必要があります')
    }

    // 範囲チェック
    if (value < 0) {
      throw new Error('金額は0以上である必要があります')
    }

    if (value > 1000000000) {
      throw new Error('金額は10億円以下である必要があります')
    }

    this._value = value
  }

  /**
   * 金額の値を取得
   */
  get value(): number {
    return this._value
  }

  /**
   * 通貨形式でフォーマット
   *
   * @returns 日本円形式の文字列（例: ¥150,000）
   */
  format(): string {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(this._value)
  }

  /**
   * 加算
   *
   * @param other - 加算する金額
   * @returns 新しいMoneyインスタンス
   */
  add(other: Money): Money {
    return new Money(this._value + other._value)
  }

  /**
   * 減算
   *
   * @param other - 減算する金額
   * @returns 新しいMoneyインスタンス
   * @throws {Error} 減算結果が負の値になる場合
   */
  subtract(other: Money): Money {
    const result = this._value - other._value
    if (result < 0) {
      throw new Error('減算結果が負の値になります')
    }
    return new Money(result)
  }

  /**
   * 等価性の比較
   *
   * @param other - 比較対象のMoney
   * @returns 同じ金額の場合true
   */
  equals(other: Money): boolean {
    return this._value === other._value
  }
}
