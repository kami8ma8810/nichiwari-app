<script setup lang="ts">
// デフォルトレイアウト
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
    <AppHeader />

    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
