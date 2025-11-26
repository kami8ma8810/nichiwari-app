<script setup lang="ts">
// useCalculatorはauto-importで利用可能
const { calculate, calculationResult } = useCalculator()
const store = useCalculatorStore()
const { saveCalculation } = useDataCollection()

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
    store.addToHistory(calculationResult.value)

    // Supabaseにデータを送信（バックグラウンドで実行、失敗してもユーザー体験に影響なし）
    saveCalculation({
      productName: calculationResult.value.productName,
      price: calculationResult.value.price,
      years: calculationResult.value.years,
      months: calculationResult.value.months,
      dailyCost: calculationResult.value.dailyCost,
      monthlyCost: calculationResult.value.monthlyCost,
      yearlyCost: calculationResult.value.yearlyCost,
    })
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
