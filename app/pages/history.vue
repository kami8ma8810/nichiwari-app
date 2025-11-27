<script setup lang="ts">
import { ClipboardList } from 'lucide-vue-next'
import { useConfirm } from 'primevue/useconfirm'

const store = useCalculatorStore()
const confirm = useConfirm()

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function handleDelete(id: string): void {
  store.removeFromHistory(id)
}

function handleClearAll(): void {
  confirm.require({
    header: 'すべての履歴を削除しますか？',
    acceptLabel: '削除',
    rejectLabel: 'キャンセル',
    accept: () => {
      store.clearHistory()
    },
  })
}
</script>

<template>
  <div>
    <section class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">
          計算履歴
        </h1>
        <button
          v-if="store.history.length > 0"
          type="button"
          class="px-4 py-2 text-sm md:text-base text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
          @click="handleClearAll"
        >
          すべて削除
        </button>
      </div>

      <!-- 履歴リスト -->
      <div v-if="store.history.length > 0" class="space-y-4">
        <article
          v-for="item in store.history"
          :key="item.id"
          class="bg-white rounded-xl shadow-lg p-4 md:p-6"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-800 mb-2">
                {{ item.result.productName || '名称なし' }}
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base">
                <div>
                  <p class="text-gray-800">
                    購入価格
                  </p>
                  <p class="font-medium">
                    {{ item.result.price.toLocaleString() }}円
                  </p>
                </div>
                <div>
                  <p class="text-gray-800">
                    使用期間
                  </p>
                  <p class="font-medium">
                    {{ item.result.periodFormatted }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-800">
                    1日あたり
                  </p>
                  <p class="font-bold text-orange-600">
                    {{ item.result.dailyCostFormatted }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-800">
                    保存日時
                  </p>
                  <p class="font-medium">
                    {{ formatDate(item.savedAt) }}
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="ml-4 p-2 text-gray-600 hover:text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              aria-label="削除"
              @click="handleDelete(item.id)"
            >
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </article>
      </div>

      <!-- 空状態 -->
      <div v-else class="bg-white rounded-xl shadow-lg p-6 md:p-12 text-center">
        <div class="text-gray-600 mb-4">
          <ClipboardList class="w-16 h-16 mx-auto" aria-hidden="true" />
        </div>
        <h2 class="text-xl font-semibold text-gray-600 mb-2">
          履歴がありません
        </h2>
        <p class="text-gray-600 mb-6 md:text-lg">
          計算すると自動で履歴に保存されます。
        </p>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-lg cursor-pointer font-bold btn-gradient-orange"
        >
          計算をはじめる
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* グラデーションボタン ホバーエフェクト */
.btn-gradient-orange {
  position: relative;
  overflow: hidden;
}

.btn-gradient-orange::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 200ms ease-out;
  border-radius: inherit;
}

.btn-gradient-orange:hover::before {
  background: rgba(0, 0, 0, 0.1);
}

.btn-gradient-orange > :deep(*) {
  position: relative;
  z-index: 10;
}
</style>
