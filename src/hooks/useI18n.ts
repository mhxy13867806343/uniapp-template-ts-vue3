import { getMessage, type AppLocale } from '@/locales'
import { useAppStore } from '@/store'

export function useI18n() {
  const appStore = useAppStore()

  function t(path: string) {
    return getMessage(appStore.locale as AppLocale, path)
  }

  return {
    locale: computed(() => appStore.locale),
    setLocale: appStore.setLocale,
    t
  }
}
