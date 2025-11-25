<script setup lang="ts">
// useCalculatorとuseCalculatorStoreはauto-importで利用可能
const { calculate, calculationResult } = useCalculator()
const store = useCalculatorStore()

interface CalculateData {
  name?: string
  price: number
  years: number
  months: number
}

async function handleCalculate(data: CalculateData) {
  await calculate(data)
}

function saveCalculation() {
  if (calculationResult.value) {
    store.addToHistory(calculationResult.value)
    // TODO: トースト通知を表示
  }
}

function shareResult() {
  // Web Share APIが使えない場合のフォールバック
  if (calculationResult.value) {
    const text = `「${calculationResult.value.productName || '商品'}」の1日あたりの価値は${calculationResult.value.dailyCostFormatted}でした！ #にちわり`
    // クリップボードにコピー
    navigator.clipboard.writeText(text)
    // TODO: トースト通知を表示
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
    <CalculatorResult
      :result="calculationResult"
      @save="saveCalculation"
      @share="shareResult"
    />
  </div>
</template>
