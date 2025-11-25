import { DailyCost } from '../value-objects/DailyCost'
import { Money } from '../value-objects/Money'
import { Years } from '../value-objects/Years'

/**
 * 商品プロパティ
 */
export interface ProductProps {
  name: string
  price: number
  /** 使用期間（年の部分） */
  years: number
  /** 使用期間（月の部分） */
  months: number
}

/**
 * 商品エンティティ
 *
 * - 商品名、価格、使用年数を保持
 * - 日割り・月割り・年割りコストを計算
 */
export class Product {
  private readonly _name: string
  private readonly _price: Money
  private readonly _years: Years

  /**
   * @param props - 商品プロパティ
   * @throws {Error} 商品名が空の場合
   * @throws {Error} 商品名が100文字を超える場合
   */
  constructor(props: ProductProps) {
    // 商品名のバリデーション
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('商品名は必須です')
    }

    if (props.name.length > 100) {
      throw new Error('商品名は100文字以内で入力してください')
    }

    this._name = props.name
    this._price = new Money(props.price)
    this._years = Years.fromYearsAndMonths(props.years, props.months)
  }

  /**
   * 商品名を取得
   */
  get name(): string {
    return this._name
  }

  /**
   * 価格を取得
   */
  get price(): Money {
    return this._price
  }

  /**
   * 使用年数を取得
   */
  get years(): Years {
    return this._years
  }

  /**
   * 日割りコストを計算
   *
   * @returns 日割りコスト
   */
  calculateDailyCost(): DailyCost {
    const days = this._years.toDays()
    const dailyCost = Math.floor(this._price.value / days)
    return new DailyCost(dailyCost)
  }

  /**
   * 月割りコストを計算
   *
   * @returns 月割りコスト（30日換算）
   */
  calculateMonthlyCost(): number {
    const dailyCost = this.calculateDailyCost()
    return dailyCost.toMonthly()
  }

  /**
   * 年割りコストを計算
   *
   * @returns 年割りコスト
   */
  calculateYearlyCost(): number {
    return Math.floor(this._price.value / this._years.value)
  }
}
