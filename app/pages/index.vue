<script setup lang="ts">
import { useCalculationHistory } from '#root/presentation/composables/useCalculationHistory'

// useCalculatorはauto-importで利用可能
const { calculate, calculationResult } = useCalculator()
const { addToHistory } = useCalculationHistory()

interface CalculateData {
  name?: string
  price: number
  years: number
  months: number
}

async function handleCalculate(data: CalculateData) {
  await calculate(data)

  // 計算完了後に自動で履歴に保存
  if (calculationResult.value) {
    addToHistory(calculationResult.value)
  }
}
</script>

<template>
  <div>
    <!-- ヒーローセクション -->
    <section class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        日割り計算で買い物の判断を<span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">サポート</span>
      </h1>
    </section>

    <!-- 計算機能 -->
    <CalculatorForm @calculate="handleCalculate" />
    <CalculatorResult :result="calculationResult" />
  </div>
</template>
