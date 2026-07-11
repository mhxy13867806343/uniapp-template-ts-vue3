import { callUniAsync } from './helpers'

type GetSystemInfoOptions = NonNullable<Parameters<typeof uni.getSystemInfo>[0]>
type SetClipboardDataOptions = NonNullable<Parameters<typeof uni.setClipboardData>[0]>
type GetClipboardDataOptions = NonNullable<Parameters<typeof uni.getClipboardData>[0]>
type MakePhoneCallOptions = NonNullable<Parameters<typeof uni.makePhoneCall>[0]>
type AuthorizeOptions = NonNullable<Parameters<typeof uni.authorize>[0]>
type OpenSettingOptions = NonNullable<Parameters<typeof uni.openSetting>[0]>

export function getSystemInfo() {
  return callUniAsync<GetSystemInfoOptions, Record<string, unknown>>(uni.getSystemInfo, {} as GetSystemInfoOptions)
}

export function getSystemInfoSync() {
  return uni.getSystemInfoSync()
}

export function getWindowInfo() {
  return typeof uni.getWindowInfo === 'function' ? uni.getWindowInfo() : uni.getSystemInfoSync()
}

export function getDeviceInfo() {
  return typeof uni.getDeviceInfo === 'function' ? uni.getDeviceInfo() : uni.getSystemInfoSync()
}

export function getAppBaseInfo() {
  return typeof uni.getAppBaseInfo === 'function' ? uni.getAppBaseInfo() : {}
}

export function getNetworkType() {
  return callUniAsync<{ success?: (result: { networkType: string }) => void; fail?: (error: unknown) => void }, { networkType: string }>(
    uni.getNetworkType as any,
    {}
  )
}

export function onNetworkStatusChange(callback: (result: Record<string, unknown>) => void) {
  uni.onNetworkStatusChange(callback as any)
}

export function offNetworkStatusChange(callback?: (result: Record<string, unknown>) => void) {
  const off = (uni as any).offNetworkStatusChange
  if (typeof off === 'function') off(callback)
}

export function setClipboardData(data: string) {
  return callUniAsync<SetClipboardDataOptions, unknown>(uni.setClipboardData, { data } as SetClipboardDataOptions)
}

export function getClipboardData() {
  return callUniAsync<GetClipboardDataOptions, { data: string }>(uni.getClipboardData, {} as GetClipboardDataOptions)
}

export function makePhoneCall(phoneNumber: string) {
  return callUniAsync<MakePhoneCallOptions, unknown>(uni.makePhoneCall, { phoneNumber } as MakePhoneCallOptions)
}

export function authorize(scope: string) {
  return callUniAsync<AuthorizeOptions, unknown>(uni.authorize, { scope } as AuthorizeOptions)
}

export function openSetting() {
  return callUniAsync<OpenSettingOptions, Record<string, unknown>>(uni.openSetting, {} as OpenSettingOptions)
}

export function vibrateShort() {
  return typeof uni.vibrateShort === 'function'
    ? callUniAsync<Record<string, never>, unknown>(uni.vibrateShort as any, {})
    : Promise.resolve()
}

export function vibrateLong() {
  return typeof uni.vibrateLong === 'function'
    ? callUniAsync<Record<string, never>, unknown>(uni.vibrateLong as any, {})
    : Promise.resolve()
}

export const uniDeviceApi = {
  getSystemInfo,
  getSystemInfoSync,
  getWindowInfo,
  getDeviceInfo,
  getAppBaseInfo,
  getNetworkType,
  onNetworkStatusChange,
  offNetworkStatusChange,
  setClipboardData,
  getClipboardData,
  makePhoneCall,
  authorize,
  openSetting,
  vibrateShort,
  vibrateLong
}
