import { callUniAsync } from './helpers'

type GetLocationOptions = NonNullable<Parameters<typeof uni.getLocation>[0]>
type ChooseLocationOptions = NonNullable<Parameters<typeof uni.chooseLocation>[0]>
type OpenLocationOptions = NonNullable<Parameters<typeof uni.openLocation>[0]>

export function getLocation(options: Omit<GetLocationOptions, 'success' | 'fail' | 'complete'> = {}) {
  return callUniAsync<GetLocationOptions, Record<string, unknown>>(uni.getLocation, options)
}

export function chooseLocation(options: Omit<ChooseLocationOptions, 'success' | 'fail' | 'complete'> = {}) {
  return callUniAsync<ChooseLocationOptions, Record<string, unknown>>(uni.chooseLocation, options)
}

export function openLocation(options: Omit<OpenLocationOptions, 'success' | 'fail' | 'complete'>) {
  return callUniAsync<OpenLocationOptions, unknown>(uni.openLocation, options)
}

export function startLocationUpdate() {
  const start = (uni as any).startLocationUpdate
  if (typeof start !== 'function') {
    return Promise.reject(new Error('当前平台不支持 startLocationUpdate'))
  }
  return callUniAsync<Record<string, never>, unknown>(start, {})
}

export function stopLocationUpdate() {
  const stop = (uni as any).stopLocationUpdate
  if (typeof stop !== 'function') {
    return Promise.reject(new Error('当前平台不支持 stopLocationUpdate'))
  }
  return callUniAsync<Record<string, never>, unknown>(stop, {})
}

export const uniLocationApi = {
  getLocation,
  chooseLocation,
  openLocation,
  startLocationUpdate,
  stopLocationUpdate
}
