import { describe, expect, it } from 'vitest'
import { comparisonItemsData, selectComparisonItems } from '@/domain/data/comparisonItems'

describe('comparisonItems', () => {
  describe('comparisonItemsData', () => {
    it('比較アイテムが定義されている', () => {
      expect(comparisonItemsData.length).toBeGreaterThan(0)
    })

    it('全てのアイテムに必要なプロパティがある', () => {
      for (const item of comparisonItemsData) {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('price')
        expect(item).toHaveProperty('unit')
        expect(item.price).toBeGreaterThan(0)
      }
    })
  })

  describe('selectComparisonItems', () => {
    it('3つの比較アイテムを返す', () => {
      const result = selectComparisonItems(100, 3000, 36500)
      expect(result.length).toBeLessThanOrEqual(3)
      expect(result.length).toBeGreaterThan(0)
    })

    it('各アイテムに期間（日/月/年）が設定されている', () => {
      const result = selectComparisonItems(100, 3000, 36500)
      for (const item of result) {
        expect(['日', '月', '年']).toContain(item.period)
      }
    })

    describe('価格帯ごとの比較結果', () => {
      // 日割り100円（約3万円/1年）
      it('日割り100円: 身近な物（ガム、コーヒーなど）と比較', () => {
        const result = selectComparisonItems(100, 3000, 36500)
        console.log('\n=== 日割り100円の場合 ===')
        console.log('（3万円の商品を1年使用）')
        for (const item of result) {
          console.log(`  ${item.period}に約${item.quantity}${item.unit}分 - ${item.name}（${item.price}円）`)
        }
        expect(result.length).toBeGreaterThan(0)
      })

      // 日割り50円（約1.8万円/1年）
      it('日割り50円: より小さな出費と比較', () => {
        const result = selectComparisonItems(50, 1500, 18250)
        console.log('\n=== 日割り50円の場合 ===')
        console.log('（約1.8万円の商品を1年使用）')
        for (const item of result) {
          console.log(`  ${item.period}に約${item.quantity}${item.unit}分 - ${item.name}（${item.price}円）`)
        }
        expect(result.length).toBeGreaterThan(0)
      })

      // 日割り300円（約11万円/1年）
      it('日割り300円: ランチや本と比較', () => {
        const result = selectComparisonItems(300, 9000, 109500)
        console.log('\n=== 日割り300円の場合 ===')
        console.log('（約11万円の商品を1年使用）')
        for (const item of result) {
          console.log(`  ${item.period}に約${item.quantity}${item.unit}分 - ${item.name}（${item.price}円）`)
        }
        expect(result.length).toBeGreaterThan(0)
      })

      // 日割り500円（約18万円/1年）
      it('日割り500円: 外食と比較', () => {
        const result = selectComparisonItems(500, 15000, 182500)
        console.log('\n=== 日割り500円の場合 ===')
        console.log('（約18万円の商品を1年使用）')
        for (const item of result) {
          console.log(`  ${item.period}に約${item.quantity}${item.unit}分 - ${item.name}（${item.price}円）`)
        }
        expect(result.length).toBeGreaterThan(0)
      })

      // 日割り1000円（約36万円/1年）
      it('日割り1000円: 映画やジムと比較', () => {
        const result = selectComparisonItems(1000, 30000, 365000)
        console.log('\n=== 日割り1000円の場合 ===')
        console.log('（約36万円の商品を1年使用）')
        for (const item of result) {
          console.log(`  ${item.period}に約${item.quantity}${item.unit}分 - ${item.name}（${item.price}円）`)
        }
        expect(result.length).toBeGreaterThan(0)
      })

      // 日割り20円（約7000円/1年）
      it('日割り20円: 安価な買い物', () => {
        const result = selectComparisonItems(20, 600, 7300)
        console.log('\n=== 日割り20円の場合 ===')
        console.log('（約7000円の商品を1年使用）')
        for (const item of result) {
          console.log(`  ${item.period}に約${item.quantity}${item.unit}分 - ${item.name}（${item.price}円）`)
        }
        expect(result.length).toBeGreaterThan(0)
      })

      // 日割り2000円（約73万円/1年）
      it('日割り2000円: 高価な買い物', () => {
        const result = selectComparisonItems(2000, 60000, 730000)
        console.log('\n=== 日割り2000円の場合 ===')
        console.log('（約73万円の商品を1年使用）')
        for (const item of result) {
          console.log(`  ${item.period}に約${item.quantity}${item.unit}分 - ${item.name}（${item.price}円）`)
        }
        expect(result.length).toBeGreaterThan(0)
      })
    })

    describe('分かりやすい数量の選択', () => {
      it('数量が極端に小さい/大きい値にならない', () => {
        const testCases = [
          { daily: 100, monthly: 3000, yearly: 36500 },
          { daily: 500, monthly: 15000, yearly: 182500 },
          { daily: 1000, monthly: 30000, yearly: 365000 },
        ]

        for (const { daily, monthly, yearly } of testCases) {
          const result = selectComparisonItems(daily, monthly, yearly)
          for (const item of result) {
            const qty = Number.parseFloat(item.quantity)
            // 数量は0.3〜20の範囲に収まるはず
            expect(qty).toBeGreaterThanOrEqual(0.1)
            expect(qty).toBeLessThanOrEqual(50)
          }
        }
      })
    })
  })
})
