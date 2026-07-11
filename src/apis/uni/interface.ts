import { callUniAsync, type WithoutCallbacks } from './helpers'

type ShowToastOptions = NonNullable<Parameters<typeof uni.showToast>[0]>
type ShowLoadingOptions = NonNullable<Parameters<typeof uni.showLoading>[0]>
type ShowModalOptions = NonNullable<Parameters<typeof uni.showModal>[0]>
type ShowActionSheetOptions = NonNullable<Parameters<typeof uni.showActionSheet>[0]>
type SetNavigationBarTitleOptions = NonNullable<Parameters<typeof uni.setNavigationBarTitle>[0]>
type SetNavigationBarColorOptions = NonNullable<Parameters<typeof uni.setNavigationBarColor>[0]>
type TabBarBadgeOptions = NonNullable<Parameters<typeof uni.setTabBarBadge>[0]>
type TabBarDotOptions = NonNullable<Parameters<typeof uni.showTabBarRedDot>[0]>
type PageScrollToOptions = NonNullable<Parameters<typeof uni.pageScrollTo>[0]>

export function showToast(options: string | ShowToastOptions) {
  const normalized = typeof options === 'string'
    ? { title: options, icon: 'none' as const }
    : options
  uni.showToast(normalized)
}

export function showSuccessToast(title: string, duration = 2000) {
  uni.showToast({
    title,
    icon: 'success',
    duration
  })
}

export function showErrorToast(title: string, duration = 2000) {
  uni.showToast({
    title,
    icon: 'none',
    duration
  })
}

export function showLoading(options: string | ShowLoadingOptions) {
  const normalized = typeof options === 'string'
    ? { title: options, mask: true }
    : options
  uni.showLoading(normalized)
}

export function hideLoading() {
  uni.hideLoading()
}

export function showModal(options: WithoutCallbacks<ShowModalOptions>) {
  return callUniAsync<ShowModalOptions, { confirm: boolean; cancel: boolean }>(uni.showModal, options)
}

export async function confirm(options: string | WithoutCallbacks<ShowModalOptions>) {
  const normalized = typeof options === 'string'
    ? { title: '提示', content: options, showCancel: true }
    : options
  const result = await showModal(normalized)
  return Boolean(result.confirm)
}

export function alert(content: string, title = '提示') {
  return showModal({
    title,
    content,
    showCancel: false
  })
}

export function showActionSheet(options: WithoutCallbacks<ShowActionSheetOptions>) {
  return callUniAsync<ShowActionSheetOptions, { tapIndex: number }>(uni.showActionSheet, options)
}

export function setNavigationBarTitle(options: string | SetNavigationBarTitleOptions) {
  const normalized = typeof options === 'string' ? { title: options } : options
  return callUniAsync<SetNavigationBarTitleOptions, unknown>(uni.setNavigationBarTitle, normalized)
}

export function setNavigationBarColor(options: SetNavigationBarColorOptions) {
  return callUniAsync<SetNavigationBarColorOptions, unknown>(uni.setNavigationBarColor, options)
}

export function showNavigationBarLoading() {
  uni.showNavigationBarLoading()
}

export function hideNavigationBarLoading() {
  uni.hideNavigationBarLoading()
}

export function setTabBarBadge(options: TabBarBadgeOptions) {
  return callUniAsync<TabBarBadgeOptions, unknown>(uni.setTabBarBadge, options)
}

export function removeTabBarBadge(options: { index: number }) {
  return callUniAsync<{ index: number }, unknown>(uni.removeTabBarBadge as any, options)
}

export function showTabBarRedDot(options: TabBarDotOptions) {
  return callUniAsync<TabBarDotOptions, unknown>(uni.showTabBarRedDot, options)
}

export function hideTabBarRedDot(options: { index: number }) {
  return callUniAsync<{ index: number }, unknown>(uni.hideTabBarRedDot as any, options)
}

export function pageScrollTo(options: PageScrollToOptions) {
  return callUniAsync<PageScrollToOptions, unknown>(uni.pageScrollTo, options)
}

export const uniInterfaceApi = {
  showToast,
  showSuccessToast,
  showErrorToast,
  showLoading,
  hideLoading,
  showModal,
  confirm,
  alert,
  showActionSheet,
  setNavigationBarTitle,
  setNavigationBarColor,
  showNavigationBarLoading,
  hideNavigationBarLoading,
  setTabBarBadge,
  removeTabBarBadge,
  showTabBarRedDot,
  hideTabBarRedDot,
  pageScrollTo
}
