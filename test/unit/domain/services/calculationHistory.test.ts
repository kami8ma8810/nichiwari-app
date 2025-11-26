import type { CalculationResult } from '@/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// テスト用のモックストレージ
function createMockStorage() {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
}

// 実装前のテスト（RED）
describe('calculationHistory', () => {
  const mockResult: CalculationResult = {
    dailyCost: 100,
    dailyCostFormatted: '100円',
    monthlyCost: 3000,
    yearlyCost: 36500,
    productName: 'テスト商品',
    price: 36500,
    years: 1,
    months: 0,
    periodFormatted: '1年',
  }

  let mockStorage: ReturnType<typeof createMockStorage>

  beforeEach(() => {
    mockStorage = createMockStorage()
    vi.resetModules()
  })

  describe('addToHistory', () => {
    it('計算結果を履歴に追加できる', async () => {
      const { createHistoryService } = await import('@/domain/services/calculationHistory')
      const historyService = createHistoryService(mockStorage)

      historyService.addToHistory(mockResult)

      expect(mockStorage.setItem).toHaveBeenCalled()
      const history = historyService.getHistory()
      expect(history).toHaveLength(1)
      expect(history[0].result).toEqual(mockResult)
    })

    it('追加時にIDと保存日時が付与される', async () => {
      const { createHistoryService } = await import('@/domain/services/calculationHistory')
      const historyService = createHistoryService(mockStorage)

      historyService.addToHistory(mockResult)

      const history = historyService.getHistory()
      expect(history[0].id).toBeDefined()
      expect(history[0].savedAt).toBeInstanceOf(Date)
    })

    it('最大10件まで保存される', async () => {
      const { createHistoryService } = await import('@/domain/services/calculationHistory')
      const historyService = createHistoryService(mockStorage)

      // 11件追加
      for (let i = 0; i < 11; i++) {
        historyService.addToHistory({
          ...mockResult,
          dailyCost: i,
        })
      }

      const history = historyService.getHistory()
      expect(history).toHaveLength(10)
      // 最新の10件が残る（最初の1件は削除される）
      expect(history[0].result.dailyCost).toBe(10)
    })

    it('同じ計算結果は重複して追加されない', async () => {
      const { createHistoryService } = await import('@/domain/services/calculationHistory')
      const historyService = createHistoryService(mockStorage)

      historyService.addToHistory(mockResult)
      historyService.addToHistory(mockResult)

      const history = historyService.getHistory()
      expect(history).toHaveLength(1)
    })
  })

  describe('getHistory', () => {
    it('空の場合は空配列を返す', async () => {
      const { createHistoryService } = await import('@/domain/services/calculationHistory')
      const historyService = createHistoryService(mockStorage)

      const history = historyService.getHistory()
      expect(history).toEqual([])
    })

    it('新しい順に並んでいる', async () => {
      const { createHistoryService } = await import('@/domain/services/calculationHistory')
      const historyService = createHistoryService(mockStorage)

      historyService.addToHistory({ ...mockResult, dailyCost: 100 })
      historyService.addToHistory({ ...mockResult, dailyCost: 200 })
      historyService.addToHistory({ ...mockResult, dailyCost: 300 })

      const history = historyService.getHistory()
      expect(history[0].result.dailyCost).toBe(300)
      expect(history[1].result.dailyCost).toBe(200)
      expect(history[2].result.dailyCost).toBe(100)
    })
  })

  describe('removeFromHistory', () => {
    it('指定したIDの履歴を削除できる', async () => {
      const { createHistoryService } = await import('@/domain/services/calculationHistory')
      const historyService = createHistoryService(mockStorage)

      historyService.addToHistory(mockResult)
      const history = historyService.getHistory()
      const id = history[0].id

      historyService.removeFromHistory(id)

      expect(historyService.getHistory()).toHaveLength(0)
    })
  })

  describe('clearHistory', () => {
    it('全ての履歴を削除できる', async () => {
      const { createHistoryService } = await import('@/domain/services/calculationHistory')
      const historyService = createHistoryService(mockStorage)

      historyService.addToHistory(mockResult)
      historyService.addToHistory({ ...mockResult, dailyCost: 200 })

      historyService.clearHistory()

      expect(historyService.getHistory()).toHaveLength(0)
    })
  })
})
