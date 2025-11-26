<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 py-8 border-t border-gray-200 bg-white/80">
    <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
      <p>
        &copy; {{ currentYear }} にちわり！
      </p>
      <p class="mt-2">
        日割り計算で買い物の判断をサポートするアプリ
      </p>
    </div>
  </footer>
</template>
