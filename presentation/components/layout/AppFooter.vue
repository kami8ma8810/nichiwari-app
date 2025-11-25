<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 py-8 border-t border-gray-200 bg-white/50">
    <div class="container mx-auto px-4 text-center text-gray-500 text-sm">
      <p>
        &copy; {{ currentYear }} にちわり！
      </p>
      <p class="mt-2">
        買い物の価値を1日あたりで見える化するアプリ
      </p>
    </div>
  </footer>
</template>
