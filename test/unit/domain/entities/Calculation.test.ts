import { Calculation } from '#root/domain/entities/Calculation'
import { Product } from '#root/domain/entities/Product'
import { describe, expect, it } from 'vitest'

describe('calculation', () => {
  describe('constructor', () => {
    it('空の商品リストで計算を作成できる', () => {
      const calculation = new Calculation()
      expect(calculation.products).toEqual([])
    })

    it('商品リストを指定して計算を作成できる', () => {
      const products = [
        new Product({ name: '商品A', price: 10000, years: 1, months: 0 }),
        new Product({ name: '商品B', price: 20000, years: 2, months: 0 }),
      ]
      const calculation = new Calculation(products)
      expect(calculation.products).toHaveLength(2)
      expect(calculation.products[0].name).toBe('商品A')
      expect(calculation.products[1].name).toBe('商品B')
    })
  })

  describe('addProduct', () => {
    it('商品を追加できる', () => {
      const calculation = new Calculation()
      const product = new Product({ name: 'テスト商品', price: 10000, years: 1, months: 0 })

      calculation.addProduct(product)

      expect(calculation.products).toHaveLength(1)
      expect(calculation.products[0]).toBe(product)
    })

    it('複数の商品を追加できる', () => {
      const calculation = new Calculation()
      const product1 = new Product({ name: '商品1', price: 10000, years: 1, months: 0 })
      const product2 = new Product({ name: '商品2', price: 20000, years: 2, months: 0 })

      calculation.addProduct(product1)
      calculation.addProduct(product2)

      expect(calculation.products).toHaveLength(2)
    })
  })

  describe('removeProduct', () => {
    it('商品を削除できる', () => {
      const product1 = new Product({ name: '商品1', price: 10000, years: 1, months: 0 })
      const product2 = new Product({ name: '商品2', price: 20000, years: 2, months: 0 })
      const calculation = new Calculation([product1, product2])

      calculation.removeProduct(0)

      expect(calculation.products).toHaveLength(1)
      expect(calculation.products[0].name).toBe('商品2')
    })

    it('存在しないインデックスを指定するとエラーになる', () => {
      const calculation = new Calculation()
      expect(() => calculation.removeProduct(0)).toThrow('指定された商品が見つかりません')
    })

    it('負のインデックスを指定するとエラーになる', () => {
      const product = new Product({ name: '商品', price: 10000, years: 1, months: 0 })
      const calculation = new Calculation([product])
      expect(() => calculation.removeProduct(-1)).toThrow('インデックスは0以上である必要があります')
    })
  })

  describe('calculateTotalDailyCost', () => {
    it('商品が1つの場合、その商品の日割りコストを返す', () => {
      const product = new Product({ name: 'ノートPC', price: 150000, years: 3, months: 0 })
      const calculation = new Calculation([product])

      const totalDailyCost = calculation.calculateTotalDailyCost()

      // 150,000 ÷ (3 * 365) = 136.98... → 136円
      expect(totalDailyCost.value).toBe(136)
    })

    it('複数商品の合計日割りコストを計算できる', () => {
      const product1 = new Product({ name: 'ノートPC', price: 150000, years: 3, months: 0 })
      const product2 = new Product({ name: 'マウス', price: 3000, years: 2, months: 0 })
      const calculation = new Calculation([product1, product2])

      const totalDailyCost = calculation.calculateTotalDailyCost()

      // PC: 150,000 ÷ 1095 = 136.98... → 136円
      // マウス: 3,000 ÷ 730 = 4.10... → 4円
      // 合計: 136 + 4 = 140円
      expect(totalDailyCost.value).toBe(140)
    })

    it('商品が0個の場合、0円を返す', () => {
      const calculation = new Calculation()

      const totalDailyCost = calculation.calculateTotalDailyCost()

      expect(totalDailyCost.value).toBe(0)
    })

    it('3つ以上の商品の合計日割りコストを計算できる', () => {
      const products = [
        new Product({ name: 'ノートPC', price: 150000, years: 3, months: 0 }),
        new Product({ name: 'マウス', price: 3000, years: 2, months: 0 }),
        new Product({ name: 'キーボード', price: 10000, years: 5, months: 0 }),
      ]
      const calculation = new Calculation(products)

      const totalDailyCost = calculation.calculateTotalDailyCost()

      // PC: 150,000 ÷ 1095 = 136.98... → 136円
      // マウス: 3,000 ÷ 730 = 4.10... → 4円
      // キーボード: 10,000 ÷ 1825 = 5.47... → 5円
      // 合計: 136 + 4 + 5 = 145円
      expect(totalDailyCost.value).toBe(145)
    })
  })

  describe('isEmpty', () => {
    it('商品が0個の場合、trueを返す', () => {
      const calculation = new Calculation()
      expect(calculation.isEmpty()).toBe(true)
    })

    it('商品が1個以上の場合、falseを返す', () => {
      const product = new Product({ name: '商品', price: 10000, years: 1, months: 0 })
      const calculation = new Calculation([product])
      expect(calculation.isEmpty()).toBe(false)
    })
  })
})
