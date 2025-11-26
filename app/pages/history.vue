<script setup lang="ts">
const store = useCalculatorStore()

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
  // eslint-disable-next-line no-alert
  if (window.confirm('この履歴を削除しますか？')) {
    store.removeFromHistory(id)
  }
}

function handleClearAll(): void {
  // eslint-disable-next-line no-alert
  if (window.confirm('すべての履歴を削除しますか？この操作は取り消せません。')) {
    store.clearHistory()
  }
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
          class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
          class="bg-white rounded-xl shadow-lg p-6"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-800 mb-2">
                {{ item.result.productName || '名称なし' }}
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">
                    購入価格
                  </p>
                  <p class="font-medium">
                    {{ item.result.price.toLocaleString() }}円
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">
                    使用期間
                  </p>
                  <p class="font-medium">
                    {{ item.result.periodFormatted }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">
                    1日あたり
                  </p>
                  <p class="font-bold text-orange-600">
                    {{ item.result.dailyCostFormatted }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">
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
              class="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              aria-label="削除"
              @click="handleDelete(item.id)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </article>
      </div>

      <!-- 空状態 -->
      <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-600 mb-2">
          履歴がありません
        </h2>
        <p class="text-gray-500 mb-6">
          計算結果を保存すると、ここに表示されます。
        </p>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-bold shadow-lg cursor-pointer"
        >
          計算をはじめる
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
