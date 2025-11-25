import { Calculation } from '#root/domain/entities/Calculation'
import { Product } from '#root/domain/entities/Product'
import { Years } from '#root/domain/value-objects/Years'

/**
 * 日割りコスト計算ユースケースの入力DTO
 */
export interface CalculateDailyCostInput {
  products: {
    name: string
    price: number
    /** 使用期間（年の部分） */
    years: number
    /** 使用期間（月の部分） */
    months: number
  }[]
}

/**
 * 日割りコスト計算ユースケースの出力DTO
 */
export interface CalculateDailyCostOutput {
  totalDailyCost: number
  dailyCostFormatted: string
  monthlyCost: number
  yearlyCost: number
  products: {
    name: string
    price: number
    years: number
    months: number
    periodFormatted: string
    dailyCost: number
  }[]
}

/**
 * 日割りコスト計算ユースケース
 * 商品リストから合計日割りコストを計算する
 */
export class CalculateDailyCostUseCase {
  execute(input: CalculateDailyCostInput): CalculateDailyCostOutput {
    // DTOからドメインエンティティへ変換
    const products = input.products.map(p =>
      new Product({ name: p.name, price: p.price, years: p.years, months: p.months }),
    )

    // Calculationエンティティを使って計算
    const calculation = new Calculation(products)
    const totalDailyCost = calculation.calculateTotalDailyCost()

    // 商品ごとの日割りコストを計算
    const productResults = input.products.map((inputProduct, index) => {
      const product = products[index]
      if (!product) {
        throw new Error(`Product at index ${index} not found`)
      }
      const dailyCost = product.calculateDailyCost()
      const period = Years.fromYearsAndMonths(inputProduct.years, inputProduct.months)
      return {
        name: inputProduct.name,
        price: inputProduct.price,
        years: inputProduct.years,
        months: inputProduct.months,
        periodFormatted: period.format(),
        dailyCost: dailyCost.value,
      }
    })

    // ドメインエンティティからDTOへ変換
    return {
      totalDailyCost: totalDailyCost.value,
      dailyCostFormatted: totalDailyCost.format(),
      monthlyCost: totalDailyCost.toMonthly(),
      yearlyCost: totalDailyCost.toYearly(),
      products: productResults,
    }
  }
}
