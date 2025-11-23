import type { Product } from './Product'
import { DailyCost } from '../value-objects/DailyCost'

/**
 * 計算エンティティ
 * 複数の商品を管理し、合計日割りコストを計算する
 */
export class Calculation {
  private _products: Product[]

  constructor(products: Product[] = []) {
    this._products = [...products] // 配列をコピーして外部からの変更を防ぐ
  }

  /**
   * 商品リストを取得（読み取り専用）
   */
  get products(): readonly Product[] {
    return this._products
  }

  /**
   * 商品を追加する
   */
  addProduct(product: Product): void {
    this._products.push(product)
  }

  /**
   * 指定されたインデックスの商品を削除する
   */
  removeProduct(index: number): void {
    if (index < 0) {
      throw new Error('インデックスは0以上である必要があります')
    }
    if (index >= this._products.length) {
      throw new Error('指定された商品が見つかりません')
    }
    this._products.splice(index, 1)
  }

  /**
   * 合計日割りコストを計算する
   */
  calculateTotalDailyCost(): DailyCost {
    if (this._products.length === 0) {
      return new DailyCost(0)
    }

    const totalCost = this._products.reduce((sum, product) => {
      const dailyCost = product.calculateDailyCost()
      return sum + dailyCost.value
    }, 0)

    return new DailyCost(totalCost)
  }

  /**
   * 商品が0個かどうかを判定する
   */
  isEmpty(): boolean {
    return this._products.length === 0
  }
}
