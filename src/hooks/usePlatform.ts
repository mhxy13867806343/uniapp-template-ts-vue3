import { getPlatformInfo } from '@/utils/platform'

export function usePlatform() {
  const platform = getPlatformInfo()

  return {
    platform,
    isH5: computed(() => platform.target === 'h5'),
    isApp: computed(() => platform.target === 'app'),
    isMiniProgram: computed(() => platform.target === 'mp')
  }
}
