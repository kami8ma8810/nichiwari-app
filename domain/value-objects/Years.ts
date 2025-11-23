/**
 * 使用年数を表す値オブジェクト
 *
 * - 使用年数は0.5年以上、100年以下
 * - 0.5年単位で入力
 * - イミュータブル（不変）なオブジェクト
 */
export class Years {
  private readonly _value: number

  /**
   * @param value - 使用年数
   * @throws {Error} 使用年数が0.5年未満の場合
   * @throws {Error} 使用年数が100年を超える場合
   * @throws {Error} 使用年数が0.5年単位でない場合
   */
  constructor(value: number) {
    // 範囲チェック
    if (value < 0.5) {
      throw new Error('使用年数は0.5年以上である必要があります')
    }

    if (value > 100) {
      throw new Error('使用年数は100年以下である必要があります')
    }

    // 0.5年単位チェック
    // 浮動小数点の誤差を考慮して、0.01の許容範囲で判定
    const remainder = (value * 10) % 5
    if (Math.abs(remainder) > 0.01 && Math.abs(remainder - 5) > 0.01) {
      throw new Error('使用年数は0.5年単位で入力してください')
    }

    this._value = value
  }

  /**
   * 使用年数の値を取得
   */
  get value(): number {
    return this._value
  }

  /**
   * 日数に変換
   *
   * @returns 日数（1年 = 365日として計算）
   */
  toDays(): number {
    return Math.floor(this._value * 365)
  }

  /**
   * フォーマット
   *
   * @returns 年数の文字列表現（例: 3年、0.5年）
   */
  format(): string {
    return `${this._value}年`
  }
}
