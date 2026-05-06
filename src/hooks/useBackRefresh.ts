type BackRefreshMode = 'refresh' | 'silent'

export interface BackRefreshPayload {
  mode: BackRefreshMode
  data?: unknown
  time: number
}

export interface NavigateBackOptions {
  delta?: number
  refresh?: boolean
  data?: unknown
}

const BACK_REFRESH_PREFIX = '__UNI_TEMPLATE_BACK_REFRESH__'

function getStorageKey(key: string) {
  return `${BACK_REFRESH_PREFIX}:${key}`
}

export function useBackRefresh(key = 'default') {
  const storageKey = getStorageKey(key)

  function markBackRefresh(data?: unknown) {
    uni.setStorageSync(storageKey, {
      mode: 'refresh',
      data,
      time: Date.now()
    } satisfies BackRefreshPayload)
  }

  function markBackSilent(data?: unknown) {
    uni.setStorageSync(storageKey, {
      mode: 'silent',
      data,
      time: Date.now()
    } satisfies BackRefreshPayload)
  }

  function consumeBackRefresh() {
    const payload = uni.getStorageSync(storageKey) as BackRefreshPayload | ''
    if (!payload) return { shouldRefresh: true, data: undefined }
    uni.removeStorageSync(storageKey)

    return {
      shouldRefresh: payload.mode === 'refresh',
      data: payload.data
    }
  }

  function backWithoutRefresh(delta = 1, data?: unknown) {
    markBackSilent(data)
    uni.navigateBack({ delta })
  }

  function backWithRefresh(delta = 1, data?: unknown) {
    markBackRefresh(data)
    uni.navigateBack({ delta })
  }

  function navigateBack(options: NavigateBackOptions = {}) {
    if (options.refresh === false) {
      backWithoutRefresh(options.delta || 1, options.data)
      return
    }

    backWithRefresh(options.delta || 1, options.data)
  }

  return {
    markBackRefresh,
    markBackSilent,
    consumeBackRefresh,
    backWithoutRefresh,
    backWithRefresh,
    navigateBack
  }
}
