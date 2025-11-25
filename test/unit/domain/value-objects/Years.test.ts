import { describe, expect, it } from 'vitest'
import { Years } from '@/domain/value-objects/Years'

describe('years', () => {
  describe('作成（コンストラクタ）', () => {
    it('1ヶ月（1/12年）で作成できる', () => {
      const years = new Years(1 / 12)
      expect(years.value).toBeCloseTo(1 / 12, 5)
    })

    it('100年で作成できる', () => {
      const years = new Years(100)
      expect(years.value).toBe(100)
    })

    it('1年で作成できる', () => {
      const years = new Years(1)
      expect(years.value).toBe(1)
    })

    it('1.5年で作成できる', () => {
      const years = new Years(1.5)
      expect(years.value).toBe(1.5)
    })

    it('1ヶ月未満は拒否される', () => {
      expect(() => new Years(0)).toThrow('使用期間は1ヶ月以上である必要があります')
    })

    it('100年を超える値は拒否される', () => {
      expect(() => new Years(101)).toThrow('使用期間は100年以下である必要があります')
    })

    it('負の値は拒否される', () => {
      expect(() => new Years(-1)).toThrow('使用期間は1ヶ月以上である必要があります')
    })
  })

  describe('ファクトリメソッド（fromYearsAndMonths）', () => {
    it('0年3ヶ月で作成できる', () => {
      const years = Years.fromYearsAndMonths(0, 3)
      expect(years.value).toBeCloseTo(0.25, 5)
    })

    it('1年0ヶ月で作成できる', () => {
      const years = Years.fromYearsAndMonths(1, 0)
      expect(years.value).toBe(1)
    })

    it('1年6ヶ月で作成できる', () => {
      const years = Years.fromYearsAndMonths(1, 6)
      expect(years.value).toBeCloseTo(1.5, 5)
    })

    it('2年3ヶ月で作成できる', () => {
      const years = Years.fromYearsAndMonths(2, 3)
      expect(years.value).toBeCloseTo(2.25, 5)
    })

    it('0年0ヶ月は拒否される', () => {
      expect(() => Years.fromYearsAndMonths(0, 0)).toThrow('使用期間は1ヶ月以上である必要があります')
    })

    it('負の年数は拒否される', () => {
      expect(() => Years.fromYearsAndMonths(-1, 0)).toThrow('年数は0以上の整数である必要があります')
    })

    it('負の月数は拒否される', () => {
      expect(() => Years.fromYearsAndMonths(0, -1)).toThrow('月数は0以上11以下の整数である必要があります')
    })

    it('12ヶ月以上は拒否される', () => {
      expect(() => Years.fromYearsAndMonths(0, 12)).toThrow('月数は0以上11以下の整数である必要があります')
    })

    it('小数の年数は拒否される', () => {
      expect(() => Years.fromYearsAndMonths(1.5, 0)).toThrow('年数は0以上の整数である必要があります')
    })

    it('小数の月数は拒否される', () => {
      expect(() => Years.fromYearsAndMonths(0, 1.5)).toThrow('月数は0以上11以下の整数である必要があります')
    })
  })

  describe('年・月の取得', () => {
    it('1年6ヶ月の年部分を取得できる', () => {
      const years = Years.fromYearsAndMonths(1, 6)
      expect(years.years).toBe(1)
    })

    it('1年6ヶ月の月部分を取得できる', () => {
      const years = Years.fromYearsAndMonths(1, 6)
      expect(years.months).toBe(6)
    })

    it('0年3ヶ月の年部分は0', () => {
      const years = Years.fromYearsAndMonths(0, 3)
      expect(years.years).toBe(0)
    })

    it('0年3ヶ月の月部分は3', () => {
      const years = Years.fromYearsAndMonths(0, 3)
      expect(years.months).toBe(3)
    })

    it('2年0ヶ月の月部分は0', () => {
      const years = Years.fromYearsAndMonths(2, 0)
      expect(years.months).toBe(0)
    })
  })

  describe('日数への変換', () => {
    it('1年を365日に変換できる', () => {
      const years = new Years(1)
      expect(years.toDays()).toBe(365)
    })

    it('3年を1095日に変換できる', () => {
      const years = new Years(3)
      expect(years.toDays()).toBe(1095)
    })

    it('6ヶ月（0.5年）を182日に変換できる', () => {
      const years = Years.fromYearsAndMonths(0, 6)
      expect(years.toDays()).toBe(182)
    })

    it('10年を3650日に変換できる', () => {
      const years = new Years(10)
      expect(years.toDays()).toBe(3650)
    })

    it('1ヶ月を30日に変換できる', () => {
      const years = Years.fromYearsAndMonths(0, 1)
      expect(years.toDays()).toBe(30)
    })
  })

  describe('フォーマット', () => {
    it('3年を正しくフォーマットできる', () => {
      const years = Years.fromYearsAndMonths(3, 0)
      expect(years.format()).toBe('3年')
    })

    it('6ヶ月を正しくフォーマットできる', () => {
      const years = Years.fromYearsAndMonths(0, 6)
      expect(years.format()).toBe('6ヶ月')
    })

    it('1年6ヶ月を正しくフォーマットできる', () => {
      const years = Years.fromYearsAndMonths(1, 6)
      expect(years.format()).toBe('1年6ヶ月')
    })

    it('0年3ヶ月を正しくフォーマットできる', () => {
      const years = Years.fromYearsAndMonths(0, 3)
      expect(years.format()).toBe('3ヶ月')
    })

    it('2年0ヶ月を正しくフォーマットできる', () => {
      const years = Years.fromYearsAndMonths(2, 0)
      expect(years.format()).toBe('2年')
    })
  })
})
