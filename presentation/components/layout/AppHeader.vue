<script setup lang="ts">
// アプリケーションヘッダー
</script>

<template>
  <header class="bg-white/80 backdrop-blur-lg border-b border-gray-200">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div
            class="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center"
          >
            <span class="text-white text-xl font-bold" aria-hidden="true">¥</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">
            にちわり！
          </h1>
        </NuxtLink>

        <nav aria-label="メインナビゲーション">
          <NuxtLink
            to="/history"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            履歴
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>
