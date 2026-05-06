import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const title = ref(import.meta.env.VITE_APP_TITLE || 'UniApp Template')
  const locale = ref<'zh-CN' | 'en-US'>('zh-CN')
  const ready = ref(false)

  function markReady() {
    ready.value = true
  }

  function setLocale(value: 'zh-CN' | 'en-US') {
    locale.value = value
    uni.setStorageSync('app-locale', value)
  }

  function initLocale() {
    const cached = uni.getStorageSync('app-locale')
    if (cached === 'zh-CN' || cached === 'en-US') {
      locale.value = cached
    }
  }

  return {
    title,
    locale,
    ready,
    markReady,
    setLocale,
    initLocale
  }
})
