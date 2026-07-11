import { callUniAsync } from './helpers'

type SetStorageOptions = NonNullable<Parameters<typeof uni.setStorage>[0]>
type GetStorageOptions = NonNullable<Parameters<typeof uni.getStorage>[0]>
type GetStorageInfoOptions = NonNullable<Parameters<typeof uni.getStorageInfo>[0]>

export function setStorage<T = unknown>(key: string, data: T) {
  return callUniAsync<SetStorageOptions, unknown>(uni.setStorage, {
    key,
    data
  } as SetStorageOptions)
}

export function getStorage<T = unknown>(key: string) {
  return callUniAsync<GetStorageOptions, { data: T }>(uni.getStorage, { key } as GetStorageOptions)
}

export function removeStorage(key: string) {
  return callUniAsync<{ key: string }, unknown>(uni.removeStorage as any, { key })
}

export function clearStorage() {
  return callUniAsync<Record<string, never>, unknown>(uni.clearStorage as any, {})
}

export function getStorageInfo() {
  return callUniAsync<GetStorageInfoOptions, {
    keys: string[]
    currentSize: number
    limitSize: number
  }>(uni.getStorageInfo, {} as GetStorageInfoOptions)
}

export function setStorageSync<T = unknown>(key: string, data: T) {
  uni.setStorageSync(key, data)
}

export function getStorageSync<T = unknown>(key: string) {
  return uni.getStorageSync(key) as T
}

export function removeStorageSync(key: string) {
  uni.removeStorageSync(key)
}

export function clearStorageSync() {
  uni.clearStorageSync()
}

export function getStorageInfoSync() {
  return uni.getStorageInfoSync()
}

export function hasStorage(key: string) {
  const value = getStorageSync(key)
  return value !== '' && value !== undefined && value !== null
}

export function setJSON<T extends Record<string, unknown>>(key: string, data: T) {
  setStorageSync(key, JSON.stringify(data))
}

export function getJSON<T extends Record<string, unknown>>(key: string, fallback?: T) {
  const raw = getStorageSync<string>(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const uniStorageApi = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  getStorageInfo,
  setStorageSync,
  getStorageSync,
  removeStorageSync,
  clearStorageSync,
  getStorageInfoSync,
  hasStorage,
  setJSON,
  getJSON
}
