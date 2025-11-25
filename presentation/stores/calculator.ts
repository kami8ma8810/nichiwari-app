import type { CalculationResult, SavedCalculation } from '#root/types'
import { defineStore } from 'pinia'

export const useCalculatorStore = defineStore('calculator', () => {
  // 計算履歴
  const history = ref<SavedCalculation[]>([])

  // 現在の計算結果（一時保存用）
  const currentResult = ref<CalculationResult | null>(null)

  // 計算を履歴に追加
  function addToHistory(result: CalculationResult): SavedCalculation {
    const savedCalculation: SavedCalculation = {
      id: crypto.randomUUID(),
      result,
      savedAt: new Date(),
    }

    history.value.unshift(savedCalculation)

    // 最大100件まで保存
    if (history.value.length > 100) {
      history.value.pop()
    }

    // LocalStorageに保存
    saveToLocalStorage()

    return savedCalculation
  }

  // 履歴から削除
  function removeFromHistory(id: string): void {
    const index = history.value.findIndex(item => item.id === id)
    if (index !== -1) {
      history.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  // 履歴をクリア
  function clearHistory(): void {
    history.value = []
    saveToLocalStorage()
  }

  // LocalStorageに保存
  function saveToLocalStorage(): void {
    if (import.meta.client) {
      localStorage.setItem('nichiwari-history', JSON.stringify(history.value))
    }
  }

  // LocalStorageから読み込み
  function loadFromLocalStorage(): void {
    if (import.meta.client) {
      const saved = localStorage.getItem('nichiwari-history')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          history.value = parsed.map((item: SavedCalculation) => ({
            ...item,
            savedAt: new Date(item.savedAt),
          }))
        }
        catch {
          history.value = []
        }
      }
    }
  }

  // 初期化時にLocalStorageから読み込み
  if (import.meta.client) {
    loadFromLocalStorage()
  }

  return {
    history: readonly(history),
    currentResult,
    addToHistory,
    removeFromHistory,
    clearHistory,
    loadFromLocalStorage,
  }
})
