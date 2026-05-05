import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const title = ref(import.meta.env.VITE_APP_TITLE || 'UniApp Template')
  const ready = ref(false)

  function markReady() {
    ready.value = true
  }

  return {
    title,
    ready,
    markReady
  }
})
