type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration = 3000): void {
    const id = crypto.randomUUID()
    const toast: Toast = { id, message, type }

    toasts.value.push(toast)

    setTimeout(() => {
      remove(id)
    }, duration)
  }

  function remove(id: string): void {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message: string, duration?: number): void {
    show(message, 'success', duration)
  }

  function error(message: string, duration?: number): void {
    show(message, 'error', duration)
  }

  function info(message: string, duration?: number): void {
    show(message, 'info', duration)
  }

  return {
    toasts: readonly(toasts),
    show,
    remove,
    success,
    error,
    info,
  }
}
