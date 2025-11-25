import { describe, expect, it } from 'vitest'
import { Product } from '@/domain/entities/Product'

describe('product', () => {
  describe('作成', () => {
    it('有効な値で作成できる（年と月を指定）', () => {
      const product = new Product({
        name: 'iPhone 15',
        price: 150000,
        years: 3,
        months: 0,
      })

      expect(product.name).toBe('iPhone 15')
      expect(product.price.value).toBe(150000)
      expect(product.years.value).toBe(3)
    })

    it('年と月の組み合わせで作成できる', () => {
      const product = new Product({
        name: 'iPhone 15',
        price: 150000,
        years: 1,
        months: 6,
      })

      expect(product.years.value).toBeCloseTo(1.5, 5)
    })

    it('0年3ヶ月で作成できる', () => {
      const product = new Product({
        name: 'サブスク商品',
        price: 3000,
        years: 0,
        months: 3,
      })

      expect(product.years.value).toBeCloseTo(0.25, 5)
    })

    it('商品名が空の場合はエラーを投げる', () => {
      expect(() => {
        new Product({
          name: '',
          price: 150000,
          years: 3,
          months: 0,
        })
      }).toThrow('商品名は必須です')
    })

    it('商品名が100文字を超える場合はエラーを投げる', () => {
      const longName = 'a'.repeat(101)
      expect(() => {
        new Product({
          name: longName,
          price: 150000,
          years: 3,
          months: 0,
        })
      }).toThrow('商品名は100文字以内で入力してください')
    })

    it('0年0ヶ月は拒否される', () => {
      expect(() => {
        new Product({
          name: 'テスト',
          price: 10000,
          years: 0,
          months: 0,
        })
      }).toThrow('使用期間は1ヶ月以上である必要があります')
    })
  })

  describe('日割りコスト計算', () => {
    it('150,000円の商品を3年使う場合、日割り136円になる', () => {
      const product = new Product({
        name: 'テスト商品',
        price: 150000,
        years: 3,
        months: 0,
      })

      const dailyCost = product.calculateDailyCost()
      expect(dailyCost.value).toBe(136)
    })

    it('109,500円の商品を3年使う場合、日割り100円になる', () => {
      const product = new Product({
        name: 'テスト商品',
        price: 109500,
        years: 3,
        months: 0,
      })

      const dailyCost = product.calculateDailyCost()
      expect(dailyCost.value).toBe(100)
    })

    it('1,000,000円の商品を10年使う場合、日割り273円になる', () => {
      const product = new Product({
        name: 'テスト商品',
        price: 1000000,
        years: 10,
        months: 0,
      })

      const dailyCost = product.calculateDailyCost()
      expect(dailyCost.value).toBe(273)
    })

    it('12,000円の商品を0年6ヶ月使う場合、日割り65円になる', () => {
      const product = new Product({
        name: 'テスト商品',
        price: 12000,
        years: 0,
        months: 6,
      })

      const dailyCost = product.calculateDailyCost()
      // 0.5年 = 182日、12000 / 182 = 65.93... → 65円
      expect(dailyCost.value).toBe(65)
    })
  })

  describe('月割りコスト計算', () => {
    it('月割りコストを正しく計算できる', () => {
      const product = new Product({
        name: 'テスト商品',
        price: 150000,
        years: 3,
        months: 0,
      })

      const monthlyCost = product.calculateMonthlyCost()
      expect(monthlyCost).toBe(4080) // 136 * 30
    })
  })

  describe('年割りコスト計算', () => {
    it('年割りコストを正しく計算できる', () => {
      const product = new Product({
        name: 'テスト商品',
        price: 150000,
        years: 3,
        months: 0,
      })

      const yearlyCost = product.calculateYearlyCost()
      expect(yearlyCost).toBe(50000) // 150000 / 3
    })
  })
})
