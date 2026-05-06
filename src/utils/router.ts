export function navigateTo(url: string) {
  uni.navigateTo({ url })
}

export function redirectTo(url: string) {
  uni.redirectTo({ url })
}

export function navigateBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
    return
  }

  uni.switchTab({ url: '/pages/home/index' })
}
