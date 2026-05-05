export type PlatformTarget = 'h5' | 'app' | 'mp'

export interface PlatformInfo {
  target: PlatformTarget
  name: string
}

export function getPlatformInfo(): PlatformInfo {
  // #ifdef H5
  return { target: 'h5', name: 'H5' }
  // #endif

  // #ifdef APP-PLUS
  return { target: 'app', name: 'App' }
  // #endif

  // #ifdef MP
  return { target: 'mp', name: 'Mini Program' }
  // #endif

  return { target: 'h5', name: 'H5' }
}
