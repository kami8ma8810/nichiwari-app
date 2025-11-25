<script setup lang="ts">
// デフォルトレイアウト
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50">
    <AppHeader />

    <main class="flex-1 container mx-auto px-4 py-8">
      <slot />
    </main>

    <AppFooter />
    <ToastContainer />
  </div>
</template>
