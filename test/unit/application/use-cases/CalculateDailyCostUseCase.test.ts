import type { CalculateDailyCostInput } from '#root/application/use-cases/CalculateDailyCostUseCase'
import { describe, expect, it } from 'vitest'
import { CalculateDailyCostUseCase } from '#root/application/use-cases/CalculateDailyCostUseCase'

describe('calculateDailyCostUseCase', () => {
  describe('execute', () => {
    it('空の商品リストで実行できる', () => {
      const useCase = new CalculateDailyCostUseCase()
      const input: CalculateDailyCostInput = {
        products: [],
      }

      const result = useCase.execute(input)

      expect(result.totalDailyCost).toBe(0)
      expect(result.dailyCostFormatted).toBe('￥0/日')
      expect(result.monthlyCost).toBe(0)
      expect(result.yearlyCost).toBe(0)
      expect(result.products).toEqual([])
    })

    it('1つの商品で計算できる', () => {
      const useCase = new CalculateDailyCostUseCase()
      const input: CalculateDailyCostInput = {
        products: [
          { name: 'ノートPC', price: 150000, years: 3, months: 0 },
        ],
      }

      const result = useCase.execute(input)

      // 150,000 ÷ (3 * 365) = 136.98... → 136円
      expect(result.totalDailyCost).toBe(136)
      expect(result.dailyCostFormatted).toBe('￥136/日')
      expect(result.monthlyCost).toBe(4080) // 136 * 30
      expect(result.yearlyCost).toBe(49640) // 136 * 365
      expect(result.products).toHaveLength(1)
      expect(result.products[0]).toEqual({
        name: 'ノートPC',
        price: 150000,
        years: 3,
        months: 0,
        periodFormatted: '3年',
        dailyCost: 136,
      })
    })

    it('複数の商品で合計を計算できる', () => {
      const useCase = new CalculateDailyCostUseCase()
      const input: CalculateDailyCostInput = {
        products: [
          { name: 'ノートPC', price: 150000, years: 3, months: 0 },
          { name: 'マウス', price: 3000, years: 2, months: 0 },
        ],
      }

      const result = useCase.execute(input)

      // PC: 150,000 ÷ 1095 = 136.98... → 136円
      // マウス: 3,000 ÷ 730 = 4.10... → 4円
      // 合計: 140円
      expect(result.totalDailyCost).toBe(140)
      expect(result.dailyCostFormatted).toBe('￥140/日')
      expect(result.monthlyCost).toBe(4200) // 140 * 30
      expect(result.yearlyCost).toBe(51100) // 140 * 365
      expect(result.products).toHaveLength(2)
    })

    it('3つ以上の商品で計算できる', () => {
      const useCase = new CalculateDailyCostUseCase()
      const input: CalculateDailyCostInput = {
        products: [
          { name: 'ノートPC', price: 150000, years: 3, months: 0 },
          { name: 'マウス', price: 3000, years: 2, months: 0 },
          { name: 'キーボード', price: 10000, years: 5, months: 0 },
        ],
      }

      const result = useCase.execute(input)

      // PC: 136円, マウス: 4円, キーボード: 5円
      // 合計: 145円
      expect(result.totalDailyCost).toBe(145)
      expect(result.products).toHaveLength(3)
      expect(result.products[0].dailyCost).toBe(136)
      expect(result.products[1].dailyCost).toBe(4)
      expect(result.products[2].dailyCost).toBe(5)
    })

    it('商品データに元の情報を含む', () => {
      const useCase = new CalculateDailyCostUseCase()
      const input: CalculateDailyCostInput = {
        products: [
          { name: 'テスト商品', price: 10000, years: 1, months: 0 },
        ],
      }

      const result = useCase.execute(input)

      expect(result.products[0].name).toBe('テスト商品')
      expect(result.products[0].price).toBe(10000)
      expect(result.products[0].years).toBe(1)
      expect(result.products[0].months).toBe(0)
      expect(result.products[0].periodFormatted).toBe('1年')
      expect(result.products[0].dailyCost).toBe(27) // 10,000 ÷ 365 = 27.39... → 27円
    })

    it('フォーマットされた文字列を返す', () => {
      const useCase = new CalculateDailyCostUseCase()
      const input: CalculateDailyCostInput = {
        products: [
          { name: 'テスト', price: 100000, years: 1, months: 0 },
        ],
      }

      const result = useCase.execute(input)

      // 100,000 ÷ 365 = 273.97... → 273円
      expect(result.dailyCostFormatted).toMatch(/^￥\d+\/日$/)
      expect(result.dailyCostFormatted).toBe('￥273/日')
    })

    it('月額・年額コストを正しく計算する', () => {
      const useCase = new CalculateDailyCostUseCase()
      const input: CalculateDailyCostInput = {
        products: [
          { name: 'テスト', price: 36500, years: 1, months: 0 },
        ],
      }

      const result = useCase.execute(input)

      // 36,500 ÷ 365 = 100円
      expect(result.totalDailyCost).toBe(100)
      expect(result.monthlyCost).toBe(3000) // 100 * 30
      expect(result.yearlyCost).toBe(36500) // 100 * 365
    })

    it('年と月の組み合わせで計算できる', () => {
      const useCase = new CalculateDailyCostUseCase()
      const input: CalculateDailyCostInput = {
        products: [
          { name: 'サブスク', price: 12000, years: 1, months: 6 },
        ],
      }

      const result = useCase.execute(input)

      // 1年6ヶ月 = 1.5年 = 547.5日 → 547日
      // 12,000 ÷ 547 = 21.93... → 21円
      expect(result.products[0].years).toBe(1)
      expect(result.products[0].months).toBe(6)
      expect(result.products[0].periodFormatted).toBe('1年6ヶ月')
      expect(result.products[0].dailyCost).toBe(21)
    })

    it('0年3ヶ月で計算できる', () => {
      const useCase = new CalculateDailyCostUseCase()
      const input: CalculateDailyCostInput = {
        products: [
          { name: '短期サブスク', price: 3000, years: 0, months: 3 },
        ],
      }

      const result = useCase.execute(input)

      // 0年3ヶ月 = 0.25年 = 91.25日 → 91日
      // 3,000 ÷ 91 = 32.96... → 32円
      expect(result.products[0].years).toBe(0)
      expect(result.products[0].months).toBe(3)
      expect(result.products[0].periodFormatted).toBe('3ヶ月')
      expect(result.products[0].dailyCost).toBe(32)
    })
  })
})
