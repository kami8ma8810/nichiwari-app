/**
 * 使用年数を表す値オブジェクト
 *
 * - 使用年数は1ヶ月以上、100年以下
 * - 年と月の組み合わせで入力可能（内部では年数として保持）
 * - イミュータブル（不変）なオブジェクト
 */
export class Years {
  private readonly _value: number

  /**
   * @param value - 使用年数（年単位の数値）
   * @throws {Error} 使用年数が1ヶ月（約0.083年）未満の場合
   * @throws {Error} 使用年数が100年を超える場合
   */
  constructor(value: number) {
    // 1ヶ月 = 1/12年 ≈ 0.0833...
    const oneMonth = 1 / 12

    // 範囲チェック（1ヶ月以上）
    // 浮動小数点の誤差を考慮して少し小さめの閾値を使用
    if (value < oneMonth - 0.001) {
      throw new Error('使用期間は1ヶ月以上である必要があります')
    }

    if (value > 100) {
      throw new Error('使用期間は100年以下である必要があります')
    }

    this._value = value
  }

  /**
   * 年と月から Years インスタンスを作成するファクトリメソッド
   *
   * @param years - 年数（0以上の整数）
   * @param months - 月数（0以上11以下の整数）
   * @throws {Error} 年数が負の場合
   * @throws {Error} 月数が0未満または12以上の場合
   * @throws {Error} 年数と月数の合計が0の場合
   */
  static fromYearsAndMonths(years: number, months: number): Years {
    if (!Number.isInteger(years) || years < 0) {
      throw new Error('年数は0以上の整数である必要があります')
    }

    if (!Number.isInteger(months) || months < 0 || months > 11) {
      throw new Error('月数は0以上11以下の整数である必要があります')
    }

    if (years === 0 && months === 0) {
      throw new Error('使用期間は1ヶ月以上である必要があります')
    }

    const totalYears = years + months / 12
    return new Years(totalYears)
  }

  /**
   * 使用年数の値を取得（年単位）
   */
  get value(): number {
    return this._value
  }

  /**
   * 年の部分を取得（整数部分）
   */
  get years(): number {
    return Math.floor(this._value)
  }

  /**
   * 月の部分を取得（小数部分を月に変換）
   */
  get months(): number {
    const fractionalYears = this._value - Math.floor(this._value)
    return Math.round(fractionalYears * 12)
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
   * @returns 年数の文字列表現（例: 3年、1年6ヶ月、6ヶ月）
   */
  format(): string {
    const years = this.years
    const months = this.months

    if (years === 0) {
      return `${months}ヶ月`
    }

    if (months === 0) {
      return `${years}年`
    }

    return `${years}年${months}ヶ月`
  }
}
