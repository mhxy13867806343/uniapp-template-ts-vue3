export interface CachePayload<T> {
  value: T
  createdAt: number
  expiresAt: number
}

export interface CacheOptions {
  prefix?: string
  defaultTtl?: number
}

const DEFAULT_PREFIX = 'uniapp-template'

function isCachePayload<T>(value: unknown): value is CachePayload<T> {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'value' in value &&
    'createdAt' in value &&
    'expiresAt' in value
  )
}

export function createCache(options: CacheOptions = {}) {
  const prefix = options.prefix || DEFAULT_PREFIX
  const defaultTtl = options.defaultTtl || 0

  function getKey(key: string) {
    return `${prefix}:${key}`
  }

  function set<T>(key: string, value: T, ttl = defaultTtl) {
    const now = Date.now()
    const payload: CachePayload<T> = {
      value,
      createdAt: now,
      expiresAt: ttl > 0 ? now + ttl : 0
    }
    uni.setStorageSync(getKey(key), payload)
    return payload
  }

  function get<T>(key: string, fallback?: T) {
    const storageKey = getKey(key)
    const payload = uni.getStorageSync(storageKey) as CachePayload<T> | ''
    if (!isCachePayload<T>(payload)) return fallback

    if (payload.expiresAt > 0 && payload.expiresAt <= Date.now()) {
      uni.removeStorageSync(storageKey)
      return fallback
    }

    return payload.value
  }

  function getPayload<T>(key: string) {
    const payload = uni.getStorageSync(getKey(key)) as CachePayload<T> | ''
    if (!isCachePayload<T>(payload)) return undefined
    return payload
  }

  function has(key: string) {
    return get(key) !== undefined
  }

  function remove(key: string) {
    uni.removeStorageSync(getKey(key))
  }

  function keys() {
    return uni
      .getStorageInfoSync()
      .keys
      .filter((key) => key.startsWith(`${prefix}:`))
      .map((key) => key.replace(`${prefix}:`, ''))
  }

  function clear() {
    keys().forEach((key) => remove(key))
  }

  function clearExpired() {
    keys().forEach((key) => {
      const payload = getPayload(key)
      if (payload?.expiresAt && payload.expiresAt <= Date.now()) remove(key)
    })
  }

  async function getOrSet<T>(key: string, getter: () => T | Promise<T>, ttl = defaultTtl) {
    const cached = get<T>(key)
    if (cached !== undefined) return cached
    const value = await getter()
    set(key, value, ttl)
    return value
  }

  return {
    getKey,
    set,
    get,
    getPayload,
    has,
    remove,
    keys,
    clear,
    clearExpired,
    getOrSet
  }
}

export const appCache = createCache()
