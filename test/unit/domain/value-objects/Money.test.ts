import { describe, expect, it } from 'vitest'
import { Money } from '@/domain/value-objects/Money'

describe('money', () => {
  describe('作成', () => {
    it('正の整数で作成できる', () => {
      const money = new Money(150000)
      expect(money.value).toBe(150000)
    })

    it('0円で作成できる', () => {
      const money = new Money(0)
      expect(money.value).toBe(0)
    })

    it('負の値は拒否される', () => {
      expect(() => new Money(-1)).toThrow('金額は0以上である必要があります')
    })

    it('10億円を超える値は拒否される', () => {
      expect(() => new Money(1000000001)).toThrow('金額は10億円以下である必要があります')
    })

    it('小数は拒否される', () => {
      expect(() => new Money(150.5)).toThrow('金額は整数である必要があります')
    })
  })

  describe('フォーマット', () => {
    it('通貨形式でフォーマットできる', () => {
      const money = new Money(150000)
      expect(money.format()).toBe('￥150,000')
    })

    it('0円を正しくフォーマットできる', () => {
      const money = new Money(0)
      expect(money.format()).toBe('￥0')
    })
  })

  describe('計算', () => {
    it('加算できる', () => {
      const money1 = new Money(1000)
      const money2 = new Money(2000)
      const result = money1.add(money2)
      expect(result.value).toBe(3000)
    })

    it('減算できる', () => {
      const money1 = new Money(5000)
      const money2 = new Money(2000)
      const result = money1.subtract(money2)
      expect(result.value).toBe(3000)
    })

    it('減算結果が負になる場合はエラーを投げる', () => {
      const money1 = new Money(1000)
      const money2 = new Money(2000)
      expect(() => money1.subtract(money2)).toThrow('減算結果が負の値になります')
    })
  })

  describe('比較', () => {
    it('同じ金額のMoneyは等しいと判定される', () => {
      const money1 = new Money(1000)
      const money2 = new Money(1000)
      expect(money1.equals(money2)).toBe(true)
    })

    it('異なる金額のMoneyは等しくないと判定される', () => {
      const money1 = new Money(1000)
      const money2 = new Money(2000)
      expect(money1.equals(money2)).toBe(false)
    })
  })
})
