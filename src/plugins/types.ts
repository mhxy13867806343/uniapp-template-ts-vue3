export type PluginPlatform = 'android' | 'ios' | 'harmonyOS' | 'h5' | 'pc' | 'miniProgram' | 'unknown'

export type ShareProvider = 'system' | 'weixin' | 'qq' | 'weibo' | 'copy'
export type ShareScene = 'session' | 'timeline' | 'favorite'
export type PaymentProvider = 'wechat' | 'alipay' | 'appleiap' | 'mock'

export interface PluginResult<T = unknown> {
  ok: boolean
  platform: PluginPlatform
  message: string
  raw?: T
}

export interface SharePayload {
  title: string
  content?: string
  url?: string
  imageUrl?: string
  provider?: ShareProvider
  scene?: ShareScene
}

export interface PaymentPayload {
  provider: PaymentProvider
  orderNo?: string
  amount?: number
  currency?: string
  orderInfo?: string | Record<string, unknown>
  paymentUrl?: string
  mock?: boolean
  mockDelay?: number
}

export interface PaymentResult<T = unknown> extends PluginResult<T> {
  transactionId?: string
}

export interface LocationPayload {
  type?: 'wgs84' | 'gcj02'
  isHighAccuracy?: boolean
  altitude?: boolean
  geocode?: boolean
  timeout?: number
}

export interface OpenLocationPayload {
  latitude: number
  longitude: number
  name?: string
  address?: string
  scale?: number
}

export interface LocationResult<T = unknown> extends PluginResult<T> {
  latitude?: number
  longitude?: number
  accuracy?: number
  altitude?: number
  address?: string
  name?: string
}

export interface AlertPayload {
  title?: string
  content: string
  confirmText?: string
}

export interface ConfirmPayload {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
}

export interface ConfirmResult<T = unknown> extends PluginResult<T> {
  confirmed: boolean
  cancelled: boolean
}

export interface ActionSheetPayload {
  itemList: string[]
  itemColor?: string
  alertText?: string
}

export interface ActionSheetResult<T = unknown> extends PluginResult<T> {
  tapIndex: number
}

export interface PlatformPlugins {
  platform: PluginPlatform
  share: {
    send: (payload: SharePayload) => Promise<PluginResult>
    system: (payload: SharePayload) => Promise<PluginResult>
    copy: (payload: SharePayload) => Promise<PluginResult>
  }
  payment: {
    request: (payload: PaymentPayload) => Promise<PaymentResult>
  }
  location: {
    getCurrent: (payload?: LocationPayload) => Promise<LocationResult>
    choose: () => Promise<LocationResult>
    openMap: (payload: OpenLocationPayload) => Promise<PluginResult>
  }
  modal: {
    alert: (payload: AlertPayload) => Promise<PluginResult>
    confirm: (payload: ConfirmPayload) => Promise<ConfirmResult>
    actionSheet: (payload: ActionSheetPayload) => Promise<ActionSheetResult>
  }
  device: {
    getInfo: () => string
  }
}
