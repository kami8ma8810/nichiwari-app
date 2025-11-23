import { describe, expect, it } from 'vitest'
import { Years } from '@/domain/value-objects/Years'

describe('years', () => {
  describe('作成', () => {
    it('0.5年で作成できる', () => {
      const years = new Years(0.5)
      expect(years.value).toBe(0.5)
    })

    it('100年で作成できる', () => {
      const years = new Years(100)
      expect(years.value).toBe(100)
    })

    it('1年で作成できる', () => {
      const years = new Years(1)
      expect(years.value).toBe(1)
    })

    it('0.5年未満は拒否される', () => {
      expect(() => new Years(0.3)).toThrow('使用年数は0.5年以上である必要があります')
    })

    it('100年を超える値は拒否される', () => {
      expect(() => new Years(101)).toThrow('使用年数は100年以下である必要があります')
    })

    it('0.5年単位でない値は拒否される', () => {
      expect(() => new Years(1.3)).toThrow('使用年数は0.5年単位で入力してください')
    })

    it('負の値は拒否される', () => {
      expect(() => new Years(-1)).toThrow('使用年数は0.5年以上である必要があります')
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

    it('0.5年を182日に変換できる', () => {
      const years = new Years(0.5)
      expect(years.toDays()).toBe(182)
    })

    it('10年を3650日に変換できる', () => {
      const years = new Years(10)
      expect(years.toDays()).toBe(3650)
    })
  })

  describe('フォーマット', () => {
    it('整数年数を正しくフォーマットできる', () => {
      const years = new Years(3)
      expect(years.format()).toBe('3年')
    })

    it('0.5年を正しくフォーマットできる', () => {
      const years = new Years(0.5)
      expect(years.format()).toBe('0.5年')
    })

    it('1.5年を正しくフォーマットできる', () => {
      const years = new Years(1.5)
      expect(years.format()).toBe('1.5年')
    })
  })
})
