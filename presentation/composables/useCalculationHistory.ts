/**
 * 計算履歴管理用Composable
 * LocalStorageを使って計算履歴を永続化
 */

import type { CalculationResult, SavedCalculation } from '#root/types'
import { createHistoryService } from '#root/domain/services/calculationHistory'

let historyService: ReturnType<typeof createHistoryService> | null = null

function getHistoryService() {
  if (!historyService && import.meta.client) {
    historyService = createHistoryService(localStorage)
  }
  return historyService
}

export function useCalculationHistory() {
  const history = ref<SavedCalculation[]>([])

  function loadHistory() {
    const service = getHistoryService()
    if (service) {
      history.value = service.getHistory()
    }
  }

  function addToHistory(result: CalculationResult) {
    const service = getHistoryService()
    if (service) {
      service.addToHistory(result)
      loadHistory()
    }
  }

  function removeFromHistory(id: string) {
    const service = getHistoryService()
    if (service) {
      service.removeFromHistory(id)
      loadHistory()
    }
  }

  function clearHistory() {
    const service = getHistoryService()
    if (service) {
      service.clearHistory()
      history.value = []
    }
  }

  // 初期読み込み
  onMounted(() => {
    loadHistory()
  })

  return {
    history: readonly(history),
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
