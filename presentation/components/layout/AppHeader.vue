<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <header class="bg-white/80 backdrop-blur-lg border-b border-gray-200">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/favicon.webp" alt="" class="w-8 h-8" aria-hidden="true">
          <h1 class="text-2xl font-bold text-gray-800">
            にちわり！
          </h1>
        </NuxtLink>

        <nav aria-label="メインナビゲーション">
          <ul class="flex gap-4">
            <li>
              <NuxtLink
                to="/"
                :aria-current="route.path === '/' ? 'page' : undefined"
                class="text-gray-800 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all"
                :class="{ 'underline': route.path === '/', 'hover:decoration-dotted': route.path !== '/' }"
              >
                ホーム
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/history"
                :aria-current="route.path === '/history' ? 'page' : undefined"
                class="text-gray-800 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all"
                :class="{ 'underline': route.path === '/history', 'hover:decoration-dotted': route.path !== '/history' }"
              >
                履歴
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>
