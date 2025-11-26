<script setup lang="ts">
import type { ComparisonResult } from '#root/domain/data/comparisonItems'
import type { CalculationResult } from '#root/types'
import { selectComparisonItems } from '#root/domain/data/comparisonItems'
import html2canvas from 'html2canvas'

const props = defineProps<{
  result: CalculationResult | null
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

const resultCardRef = ref<HTMLElement | null>(null)
const isSaving = ref(false)
const copyMessage = ref('')

async function saveAsImage() {
  if (!resultCardRef.value || isSaving.value)
    return

  isSaving.value = true
  try {
    const canvas = await html2canvas(resultCardRef.value, {
      backgroundColor: '#ffffff',
      scale: 2,
    })

    const link = document.createElement('a')
    const productName = props.result?.productName || 'にちわり'
    link.download = `${productName}_日割り計算結果.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  catch (error) {
    console.error('画像保存エラー:', error)
  }
  finally {
    isSaving.value = false
  }
}

function getShareText() {
  if (!props.result)
    return ''

  const productText = props.result.productName
    ? `「${props.result.productName}」は`
    : ''
  return `${productText}1日あたり${props.result.dailyCost.toLocaleString()}円でした！\n\n#にちわり #日割り計算`
}

function shareToX() {
  const text = encodeURIComponent(getShareText())
  const url = encodeURIComponent(window.location.href)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
}

function shareToLine() {
  const text = encodeURIComponent(`${getShareText()}\n${window.location.href}`)
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copyMessage.value = 'コピーしました！'
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  }
  catch {
    copyMessage.value = 'コピーに失敗しました'
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  }
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="result"
      class="mt-8"
      role="region"
      aria-label="計算結果"
      aria-live="polite"
    >
      <!-- 画像保存対象の結果カード -->
      <div
        ref="resultCardRef"
        class="bg-white rounded-2xl shadow-xl p-8"
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
            これらより価値がある？
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ComparisonCard
              v-for="item in comparisons"
              :key="item.name"
              :item="item"
            />
          </div>
        </div>

        <!-- サイトロゴ（画像保存時用） -->
        <div class="mt-6 pt-4 border-t text-center text-sm text-gray-400">
          にちわり！ - 日割り計算アプリ
        </div>
      </div>

      <!-- アクションボタン（画像保存対象外） -->
      <div class="mt-6 space-y-4">
        <!-- 画像保存ボタン -->
        <button
          type="button"
          class="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-bold cursor-pointer shadow-lg disabled:opacity-50"
          :disabled="isSaving"
          @click="saveAsImage"
        >
          {{ isSaving ? '保存中...' : '📷 結果を画像で保存' }}
        </button>

        <!-- シェアボタン群 -->
        <div class="flex gap-3">
          <button
            type="button"
            class="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-bold cursor-pointer"
            @click="shareToX"
          >
            𝕏 でシェア
          </button>
          <button
            type="button"
            class="flex-1 px-4 py-3 bg-[#06C755] text-white rounded-lg hover:bg-[#05b04d] transition-colors font-bold cursor-pointer"
            @click="shareToLine"
          >
            LINE
          </button>
          <button
            type="button"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-bold cursor-pointer"
            @click="copyLink"
          >
            {{ copyMessage || '🔗 コピー' }}
          </button>
        </div>
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
