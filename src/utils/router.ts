import { navigateTo as uniNavigateTo, redirectTo as uniRedirectTo, safeNavigateBack } from '@/apis/uni'

export function navigateTo(url: string) {
  return uniNavigateTo(url)
}

export function redirectTo(url: string) {
  return uniRedirectTo(url)
}

export function navigateBack() {
  return safeNavigateBack('/pages/home/index')
}
