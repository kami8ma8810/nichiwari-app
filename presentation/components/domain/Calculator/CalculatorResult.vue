<script setup lang="ts">
import type { ComparisonResult } from '#root/domain/data/comparisonItems'
import type { CalculationResult } from '#root/types'
import { selectComparisonItems } from '#root/domain/data/comparisonItems'

const props = defineProps<{
  result: CalculationResult | null
}>()

const emit = defineEmits<{
  save: []
  share: []
}>()

function formatCurrency(value: number) {
  return `${value.toLocaleString()}円`
}

const comparisons = computed<ComparisonResult[]>(() => {
  if (!props.result)
    return []

  return selectComparisonItems(
    props.result.dailyCost,
    props.result.monthlyCost,
    props.result.yearlyCost,
  )
})

function saveToHistory() {
  emit('save')
}

async function share() {
  if (navigator.share) {
    await navigator.share({
      title: 'にちわり！計算結果',
      text: `1日あたり${props.result?.dailyCost}円でした！`,
      url: window.location.href,
    })
  }
  else {
    emit('share')
  }
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="result"
      class="bg-white rounded-2xl shadow-xl p-8 mt-8"
      role="region"
      aria-label="計算結果"
      aria-live="polite"
    >
      <!-- メイン結果 -->
      <div class="text-center mb-8">
        <p class="text-gray-600 mb-2">
          1日あたり
        </p>
        <p class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
          {{ formatCurrency(result.dailyCost) }}
        </p>
        <p v-if="result.productName" class="mt-4 text-gray-700">
          「{{ result.productName }}」の1日あたりの価値
        </p>
        <p class="mt-2 text-sm text-gray-500">
          使用期間：{{ result.periodFormatted }}
        </p>
      </div>

      <!-- 月額・年額表示 -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600 mb-1">
            月あたり
          </p>
          <p class="text-xl font-bold text-gray-800">
            {{ formatCurrency(result.monthlyCost) }}
          </p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600 mb-1">
            年あたり
          </p>
          <p class="text-xl font-bold text-gray-800">
            {{ formatCurrency(result.yearlyCost) }}
          </p>
        </div>
      </div>

      <!-- 比較 -->
      <div class="border-t pt-8">
        <h3 class="text-lg font-semibold mb-4">
          身近なものと比較すると...
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ComparisonCard
            v-for="item in comparisons"
            :key="item.name"
            :item="item"
          />
        </div>
      </div>

      <!-- アクション -->
      <div class="flex gap-4 mt-8">
        <button
          type="button"
          class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-bold cursor-pointer"
          @click="saveToHistory"
        >
          保存する
        </button>
        <button
          type="button"
          class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-bold cursor-pointer"
          @click="share"
        >
          シェアする
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
