<script setup lang="ts">
import type { ComparisonItem } from '#root/types'

defineProps<{
  item: ComparisonItem
  dailyCost: number
}>()

function getUnit(name: string): string {
  const unitMap: Record<string, string> = {
    コンビニコーヒー: '杯',
    ペットボトル: '本',
    電車運賃: '回',
    映画チケット: '回',
    ランチ: '食',
  }
  return unitMap[name] || '個'
}
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-4 text-center hover:bg-orange-50 transition-colors">
    <p class="text-sm text-gray-600 mb-1">
      {{ item.name }}
    </p>
    <p class="font-bold text-lg text-orange-600">
      約{{ item.quantity }}{{ getUnit(item.name) }}
    </p>
    <p class="text-xs text-gray-500">
      @{{ item.price }}円
    </p>
  </div>
</template>
