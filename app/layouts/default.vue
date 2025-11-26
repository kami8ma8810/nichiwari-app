<script setup lang="ts">
const confirmDialogPt = {
  root: {
    class: 'bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 relative z-10',
  },
  mask: {
    class: 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center',
  },
  icon: { class: 'hidden' },
  title: { class: 'text-lg font-bold text-gray-800' },
  message: { class: 'hidden' },
  footer: { class: 'w-full flex gap-3 justify-between mt-6' },
  pcRejectButton: {
    root: {
      class:
        'px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer font-bold flex-1',
    },
  },
  pcAcceptButton: {
    root: {
      class:
        'px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer font-bold flex-1',
    },
  },
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50">
    <AppHeader />

    <main class="flex-1 container mx-auto px-4 py-4 md:py-8">
      <slot />
    </main>

    <AppFooter />
    <ToastContainer />
    <ConfirmDialog :pt="confirmDialogPt" :closable="false" default-focus="reject" />
  </div>
</template>
