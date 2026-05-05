import { appEnv } from '@/utils/env'

export function useAppEnv() {
  const isDev = computed(() => appEnv.mode === 'development')
  const isProd = computed(() => appEnv.mode === 'production')

  return {
    appEnv,
    isDev,
    isProd
  }
}
