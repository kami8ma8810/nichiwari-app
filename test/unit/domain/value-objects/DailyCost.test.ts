import { describe, expect, it } from 'vitest'
import { DailyCost } from '@/domain/value-objects/DailyCost'

describe('dailyCost', () => {
  describe('作成', () => {
    it('正の整数で作成できる', () => {
      const dailyCost = new DailyCost(137)
      expect(dailyCost.value).toBe(137)
    })

    it('0円で作成できる', () => {
      const dailyCost = new DailyCost(0)
      expect(dailyCost.value).toBe(0)
    })

    it('負の値は拒否される', () => {
      expect(() => new DailyCost(-1)).toThrow('日割りコストは0以上である必要があります')
    })

    it('小数は拒否される', () => {
      expect(() => new DailyCost(137.5)).toThrow('日割りコストは整数である必要があります')
    })
  })

  describe('変換', () => {
    it('月割りコストに変換できる', () => {
      const dailyCost = new DailyCost(137)
      expect(dailyCost.toMonthly()).toBe(4110) // 137 * 30
    })

    it('年割りコストに変換できる', () => {
      const dailyCost = new DailyCost(137)
      expect(dailyCost.toYearly()).toBe(50005) // 137 * 365
    })

    it('0円の月割りコスト', () => {
      const dailyCost = new DailyCost(0)
      expect(dailyCost.toMonthly()).toBe(0)
    })

    it('0円の年割りコスト', () => {
      const dailyCost = new DailyCost(0)
      expect(dailyCost.toYearly()).toBe(0)
    })
  })

  describe('フォーマット', () => {
    it('日割りコストを正しくフォーマットできる', () => {
      const dailyCost = new DailyCost(137)
      expect(dailyCost.format()).toBe('￥137/日')
    })

    it('0円を正しくフォーマットできる', () => {
      const dailyCost = new DailyCost(0)
      expect(dailyCost.format()).toBe('￥0/日')
    })

    it('大きな金額を正しくフォーマットできる', () => {
      const dailyCost = new DailyCost(10000)
      expect(dailyCost.format()).toBe('￥10,000/日')
    })
  })

  describe('比較', () => {
    it('同じ日割りコストは等しいと判定される', () => {
      const cost1 = new DailyCost(137)
      const cost2 = new DailyCost(137)
      expect(cost1.equals(cost2)).toBe(true)
    })

    it('異なる日割りコストは等しくないと判定される', () => {
      const cost1 = new DailyCost(137)
      const cost2 = new DailyCost(200)
      expect(cost1.equals(cost2)).toBe(false)
    })
  })
})
