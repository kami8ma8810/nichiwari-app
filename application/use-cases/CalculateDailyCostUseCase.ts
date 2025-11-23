import { Calculation } from '~/domain/entities/Calculation'
import { Product } from '~/domain/entities/Product'

/**
 * 日割りコスト計算ユースケースの入力DTO
 */
export interface CalculateDailyCostInput {
  products: {
    name: string
    price: number
    years: number
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
      new Product({ name: p.name, price: p.price, years: p.years }),
    )

    // Calculationエンティティを使って計算
    const calculation = new Calculation(products)
    const totalDailyCost = calculation.calculateTotalDailyCost()

    // 商品ごとの日割りコストを計算
    const productResults = products.map((product, index) => {
      const dailyCost = product.calculateDailyCost()
      return {
        name: input.products[index].name,
        price: input.products[index].price,
        years: input.products[index].years,
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
