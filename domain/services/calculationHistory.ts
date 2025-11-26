/**
 * 計算履歴管理サービス
 * LocalStorage（または互換ストレージ）を使って計算履歴を永続化
 */

import type { CalculationResult, SavedCalculation } from '#root/types'

const STORAGE_KEY = 'nichiwari_history'
const MAX_HISTORY_SIZE = 10

interface StorageAdapter {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

interface HistoryService {
  addToHistory: (result: CalculationResult) => void
  getHistory: () => SavedCalculation[]
  removeFromHistory: (id: string) => void
  clearHistory: () => void
}

/**
 * 計算結果が同一かどうかを判定
 */
function isSameResult(a: CalculationResult, b: CalculationResult): boolean {
  return (
    a.dailyCost === b.dailyCost
    && a.monthlyCost === b.monthlyCost
    && a.yearlyCost === b.yearlyCost
    && a.price === b.price
    && a.years === b.years
    && a.months === b.months
    && a.productName === b.productName
  )
}

/**
 * 一意なIDを生成
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * ストレージから履歴を読み込む
 */
function loadHistory(storage: StorageAdapter): SavedCalculation[] {
  try {
    const data = storage.getItem(STORAGE_KEY)
    if (!data)
      return []

    const parsed = JSON.parse(data) as Array<{
      id: string
      result: CalculationResult
      savedAt: string
    }>

    return parsed.map(item => ({
      ...item,
      savedAt: new Date(item.savedAt),
    }))
  }
  catch {
    return []
  }
}

/**
 * 履歴をストレージに保存
 */
function saveHistory(storage: StorageAdapter, history: SavedCalculation[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(history))
}

/**
 * 履歴管理サービスを作成
 */
export function createHistoryService(storage: StorageAdapter): HistoryService {
  return {
    addToHistory(result: CalculationResult): void {
      const history = loadHistory(storage)

      // 重複チェック
      const isDuplicate = history.some(item => isSameResult(item.result, result))
      if (isDuplicate)
        return

      const newEntry: SavedCalculation = {
        id: generateId(),
        result,
        savedAt: new Date(),
      }

      // 先頭に追加（新しい順）
      const updatedHistory = [newEntry, ...history]

      // 最大件数を超えたら古いものを削除
      if (updatedHistory.length > MAX_HISTORY_SIZE) {
        updatedHistory.splice(MAX_HISTORY_SIZE)
      }

      saveHistory(storage, updatedHistory)
    },

    getHistory(): SavedCalculation[] {
      return loadHistory(storage)
    },

    removeFromHistory(id: string): void {
      const history = loadHistory(storage)
      const updatedHistory = history.filter(item => item.id !== id)
      saveHistory(storage, updatedHistory)
    },

    clearHistory(): void {
      storage.removeItem(STORAGE_KEY)
    },
  }
}
