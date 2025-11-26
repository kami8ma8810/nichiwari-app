<script setup lang="ts">
import type { ComparisonResult } from '#root/domain/data/comparisonItems'

defineProps<{
  item: ComparisonResult
}>()
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-4 text-center">
    <p class="text-sm text-gray-600 mb-1">
      {{ item.name }}（{{ item.price.toLocaleString() }}円）
    </p>
    <p class="font-bold text-lg text-orange-600">
      {{ item.period }}に約{{ item.quantity }}{{ item.unit }}分
    </p>
  </div>
</template>
