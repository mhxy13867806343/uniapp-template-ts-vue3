import { callUniAsync } from './helpers'

type NavigateToOptions = NonNullable<Parameters<typeof uni.navigateTo>[0]>
type RedirectToOptions = NonNullable<Parameters<typeof uni.redirectTo>[0]>
type ReLaunchOptions = NonNullable<Parameters<typeof uni.reLaunch>[0]>
type SwitchTabOptions = NonNullable<Parameters<typeof uni.switchTab>[0]>
type NavigateBackOptions = NonNullable<Parameters<typeof uni.navigateBack>[0]>

export interface CurrentPageItem {
  route: string
  options: Record<string, unknown>
}

function toRouteOptions(url: string) {
  return { url }
}

export function navigateTo(options: string | NavigateToOptions) {
  const normalized = typeof options === 'string' ? toRouteOptions(options) : options
  return callUniAsync<NavigateToOptions, unknown>(uni.navigateTo, normalized)
}

export function redirectTo(options: string | RedirectToOptions) {
  const normalized = typeof options === 'string' ? toRouteOptions(options) : options
  return callUniAsync<RedirectToOptions, unknown>(uni.redirectTo, normalized)
}

export function reLaunch(options: string | ReLaunchOptions) {
  const normalized = typeof options === 'string' ? toRouteOptions(options) : options
  return callUniAsync<ReLaunchOptions, unknown>(uni.reLaunch, normalized)
}

export function switchTab(options: string | SwitchTabOptions) {
  const normalized = typeof options === 'string' ? toRouteOptions(options) : options
  return callUniAsync<SwitchTabOptions, unknown>(uni.switchTab, normalized)
}

export function navigateBack(options: NavigateBackOptions = { delta: 1 }) {
  return callUniAsync<NavigateBackOptions, unknown>(uni.navigateBack, options)
}

export function preloadPage(url: string) {
  const preload = (uni as any).preloadPage
  if (typeof preload !== 'function') {
    return Promise.reject(new Error('当前平台不支持 preloadPage'))
  }
  return callUniAsync<{ url: string }, unknown>(preload, { url })
}

export function getCurrentPageStack(): CurrentPageItem[] {
  try {
    return getCurrentPages().map((page: any) => ({
      route: page.route || '未知页面',
      options: page.options || {}
    }))
  } catch {
    return []
  }
}

export async function safeNavigateBack(fallbackUrl = '/pages/home/index', delta = 1) {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    await navigateBack({ delta })
    return
  }
  await switchTab(fallbackUrl)
}

export const uniRouterApi = {
  navigateTo,
  redirectTo,
  reLaunch,
  switchTab,
  navigateBack,
  preloadPage,
  getCurrentPageStack,
  safeNavigateBack
}
