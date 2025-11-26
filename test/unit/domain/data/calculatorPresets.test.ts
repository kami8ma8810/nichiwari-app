/**
 * 計算機プリセットデータのテスト
 */

import { describe, expect, it } from 'vitest'
import { calculatorPresets } from '#root/domain/data/calculatorPresets'

describe('calculatorPresets', () => {
  it('8つのプリセットが存在する', () => {
    expect(calculatorPresets).toHaveLength(8)
  })

  it('すべてのプリセットが必要なフィールドを持つ', () => {
    calculatorPresets.forEach((preset) => {
      expect(preset).toHaveProperty('id')
      expect(preset).toHaveProperty('name')
      expect(preset).toHaveProperty('price')
      expect(preset).toHaveProperty('years')
      expect(preset).toHaveProperty('months')
      expect(preset).toHaveProperty('label')
    })
  })

  it('価格の小さい順に並んでいる', () => {
    for (let i = 0; i < calculatorPresets.length - 1; i++) {
      expect(calculatorPresets[i].price).toBeLessThanOrEqual(calculatorPresets[i + 1].price)
    }
  })

  it('Kindleプリセットが正しい値を持つ（最安）', () => {
    const kindle = calculatorPresets.find(p => p.id === 'kindle')
    expect(kindle).toBeDefined()
    expect(kindle?.name).toBe('Kindle Paperwhite')
    expect(kindle?.price).toBe(20000)
    expect(kindle?.years).toBe(4)
    expect(kindle?.months).toBe(0)
    expect(kindle?.label).toBe('Kindle')
  })

  it('Switch2プリセットが正しい値を持つ', () => {
    const switchPreset = calculatorPresets.find(p => p.id === 'switch')
    expect(switchPreset).toBeDefined()
    expect(switchPreset?.name).toBe('Nintendo Switch2')
    expect(switchPreset?.price).toBe(50000)
    expect(switchPreset?.years).toBe(5)
    expect(switchPreset?.months).toBe(0)
    expect(switchPreset?.label).toBe('ゲーム機')
  })

  it('スマホプリセットが正しい値を持つ', () => {
    const smartphone = calculatorPresets.find(p => p.id === 'smartphone')
    expect(smartphone).toBeDefined()
    expect(smartphone?.name).toBe('iPhone 16')
    expect(smartphone?.price).toBe(125000)
    expect(smartphone?.years).toBe(3)
    expect(smartphone?.months).toBe(0)
    expect(smartphone?.label).toBe('スマホ')
  })

  it('MacBookプリセットが正しい値を持つ', () => {
    const pc = calculatorPresets.find(p => p.id === 'pc')
    expect(pc).toBeDefined()
    expect(pc?.name).toBe('MacBook Air M3')
    expect(pc?.price).toBe(165000)
    expect(pc?.years).toBe(5)
    expect(pc?.months).toBe(0)
    expect(pc?.label).toBe('MacBook')
  })

  it('カメラプリセットが正しい値を持つ（最高額）', () => {
    const camera = calculatorPresets.find(p => p.id === 'camera')
    expect(camera).toBeDefined()
    expect(camera?.name).toBe('フルサイズカメラ')
    expect(camera?.price).toBe(250000)
    expect(camera?.years).toBe(7)
    expect(camera?.months).toBe(0)
    expect(camera?.label).toBe('カメラ')
  })

  it('すべてのプリセットの価格が1以上', () => {
    calculatorPresets.forEach((preset) => {
      expect(preset.price).toBeGreaterThanOrEqual(1)
    })
  })

  it('すべてのプリセットの期間が有効', () => {
    calculatorPresets.forEach((preset) => {
      // 年または月のいずれかが1以上設定されている
      const hasPeriod = preset.years > 0 || preset.months > 0
      expect(hasPeriod).toBe(true)
    })
  })
})
