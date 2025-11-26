<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 py-8 border-t border-gray-200 bg-white/80">
    <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
      <p>
        &copy; {{ currentYear }} にちわり！
      </p>
    </div>
  </footer>
</template>
