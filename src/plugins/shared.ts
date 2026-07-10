import type {
  ActionSheetPayload,
  ActionSheetResult,
  AlertPayload,
  ConfirmPayload,
  ConfirmResult,
  LocationPayload,
  LocationResult,
  OpenLocationPayload,
  PaymentPayload,
  PaymentResult,
  PlatformPlugins,
  PluginPlatform,
  PluginResult,
  SharePayload
} from './types'

export function getMockDeviceInfo(platformLabel: string) {
  const info = uni.getSystemInfoSync()
  const brand = info.brand || ''
  const model = info.model || ''
  const system = info.system || info.platform || 'unknown'
  return `${platformLabel}: ${brand} ${model} (${system})`.trim()
}

export function buildShareText(payload: SharePayload) {
  return [payload.title, payload.content, payload.url].filter(Boolean).join(' - ')
}

export async function copySharePayload(payload: SharePayload, platform: PluginPlatform) {
  return new Promise<PluginResult>((resolve) => {
    uni.setClipboardData({
      data: buildShareText(payload),
      success: (raw) => {
        resolve({
          ok: true,
          platform,
          message: '分享内容已复制到剪贴板',
          raw
        })
      },
      fail: (raw) => {
        resolve({
          ok: false,
          platform,
          message: '复制分享内容失败',
          raw
        })
      }
    })
  })
}

export async function browserShare(payload: SharePayload, platform: PluginPlatform) {
  // #ifdef H5
  if (typeof navigator !== 'undefined') {
    const nav = navigator as Navigator & {
      share?: (data: { title?: string, text?: string, url?: string }) => Promise<void>
    }

    if (typeof nav.share === 'function') {
      try {
        await nav.share({
          title: payload.title,
          text: payload.content,
          url: payload.url
        })
        return {
          ok: true,
          platform,
          message: '已唤起浏览器原生分享面板'
        } satisfies PluginResult
      } catch (raw) {
        return {
          ok: false,
          platform,
          message: '浏览器原生分享未完成，已切换为复制分享内容',
          raw
        } satisfies PluginResult
      }
    }
  }
  // #endif

  return null
}

export function mapAppShareProvider(provider?: SharePayload['provider']) {
  if (provider === 'qq') return 'qq'
  if (provider === 'weibo') return 'sinaweibo'
  return 'weixin'
}

export function mapAppShareScene(scene?: SharePayload['scene']) {
  if (scene === 'timeline') return 'WXSceneTimeline'
  if (scene === 'favorite') return 'WXSceneFavorite'
  return 'WXSceneSession'
}

export function mapPaymentProvider(provider: PaymentPayload['provider']) {
  if (provider === 'wechat') return 'wxpay'
  if (provider === 'alipay') return 'alipay'
  if (provider === 'appleiap') return 'appleiap'
  return 'mock'
}

export async function requestUniPayment(
  platform: PluginPlatform,
  options: Record<string, unknown>,
  payload: PaymentPayload,
) {
  return new Promise<PaymentResult>((resolve) => {
    uni.requestPayment({
      ...(options as any),
      success: (raw: Record<string, unknown>) => {
        resolve({
          ok: true,
          platform,
          message: '支付请求已完成',
          transactionId: String(raw.transactionId || payload.orderNo || `tx-${Date.now()}`),
          raw
        })
      },
      fail: (raw: Record<string, unknown>) => {
        resolve({
          ok: false,
          platform,
          message: `支付失败: ${String(raw.errMsg || 'unknown')}`,
          transactionId: payload.orderNo,
          raw
        })
      }
    } as any)
  })
}

export async function simulatePayment(platform: PluginPlatform, payload: PaymentPayload, message?: string) {
  const delay = payload.mockDelay ?? 600
  await new Promise(resolve => setTimeout(resolve, delay))
  return {
    ok: true,
    platform,
    message: message || '已完成模拟支付，可继续对接真实支付签名参数',
    transactionId: payload.orderNo || `mock-${Date.now()}`
  } satisfies PaymentResult
}

function normalizeLocationResult(platform: PluginPlatform, raw: Record<string, unknown>, message = '定位成功'): LocationResult {
  return {
    ok: true,
    platform,
    message,
    latitude: Number(raw.latitude || 0),
    longitude: Number(raw.longitude || 0),
    accuracy: Number(raw.accuracy || 0) || undefined,
    altitude: Number(raw.altitude || 0) || undefined,
    address: String(raw.address || raw.addr || raw.poiName || ''),
    name: String(raw.name || raw.poiName || ''),
    raw
  }
}

export async function requestCurrentLocation(
  platform: PluginPlatform,
  payload: LocationPayload = {},
  preferNative = false,
) {
  // #ifdef APP-PLUS
  if (preferNative && typeof plus !== 'undefined' && plus.geolocation) {
    return new Promise<LocationResult>((resolve) => {
      plus.geolocation.getCurrentPosition(
        (position: any) => {
          const coords = (position.coords || {}) as Record<string, unknown>
          const address = (position.address || {}) as Record<string, unknown>
          resolve(normalizeLocationResult(platform, {
            ...coords,
            address: String(address.street || address.poiName || address.city || '')
          }, '原生定位成功'))
        },
        (raw: any) => {
          resolve({
            ok: false,
            platform,
            message: `原生定位失败: ${String(raw.message || raw.code || 'unknown')}`,
            raw
          })
        },
        {
          enableHighAccuracy: payload.isHighAccuracy ?? true,
          geocode: payload.geocode ?? true,
          timeout: payload.timeout ?? 15000,
          coordsType: payload.type || 'gcj02'
        } as any
      )
    })
  }
  // #endif

  // #ifdef H5
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    return new Promise<LocationResult>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(normalizeLocationResult(platform, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined
          }, '浏览器定位成功'))
        },
        (raw) => {
          resolve({
            ok: false,
            platform,
            message: `浏览器定位失败: ${raw.message}`,
            raw
          })
        },
        {
          enableHighAccuracy: payload.isHighAccuracy ?? true,
          timeout: payload.timeout ?? 15000
        }
      )
    })
  }
  // #endif

  return new Promise<LocationResult>((resolve) => {
    uni.getLocation({
      type: payload.type || 'gcj02',
      isHighAccuracy: payload.isHighAccuracy ?? true,
      altitude: payload.altitude ?? false,
      geocode: payload.geocode ?? true,
      success: (raw: Record<string, unknown>) => {
        resolve(normalizeLocationResult(platform, raw))
      },
      fail: (raw: Record<string, unknown>) => {
        resolve({
          ok: false,
          platform,
          message: `定位失败: ${String(raw.errMsg || 'unknown')}`,
          raw
        })
      }
    } as any)
  })
}

export async function chooseLocation(platform: PluginPlatform) {
  return new Promise<LocationResult>((resolve) => {
    uni.chooseLocation({
      success: (raw: any) => {
        resolve(normalizeLocationResult(platform, raw, '位置选择成功'))
      },
      fail: (raw: Record<string, unknown>) => {
        resolve({
          ok: false,
          platform,
          message: `位置选择失败: ${String(raw.errMsg || 'unknown')}`,
          raw
        })
      }
    })
  })
}

export async function openMapLocation(platform: PluginPlatform, payload: OpenLocationPayload) {
  return new Promise<PluginResult>((resolve) => {
    uni.openLocation({
      latitude: payload.latitude,
      longitude: payload.longitude,
      name: payload.name,
      address: payload.address,
      scale: payload.scale || 16,
      success: (raw) => {
        resolve({
          ok: true,
          platform,
          message: '已打开地图定位',
          raw
        })
      },
      fail: (raw) => {
        resolve({
          ok: false,
          platform,
          message: `打开地图失败: ${String((raw as Record<string, unknown>).errMsg || 'unknown')}`,
          raw
        })
      }
    })
  })
}

export function createLocationApis(
  platform: PluginPlatform,
  options: { preferNative?: boolean } = {},
): PlatformPlugins['location'] {
  return {
    getCurrent(payload) {
      return requestCurrentLocation(platform, payload, options.preferNative)
    },
    choose() {
      return chooseLocation(platform)
    },
    openMap(payload) {
      return openMapLocation(platform, payload)
    }
  }
}

export function createModalApis(platform: PluginPlatform): PlatformPlugins['modal'] {
  return {
    alert(payload: AlertPayload) {
      return new Promise<PluginResult>((resolve) => {
        uni.showModal({
          title: payload.title || '提示',
          content: payload.content,
          confirmText: payload.confirmText || '知道了',
          showCancel: false,
          success: (raw) => {
            resolve({
              ok: true,
              platform,
              message: '弹窗已关闭',
              raw
            })
          },
          fail: (raw) => {
            resolve({
              ok: false,
              platform,
              message: '弹窗拉起失败',
              raw
            })
          }
        })
      })
    },
    confirm(payload: ConfirmPayload) {
      return new Promise<ConfirmResult>((resolve) => {
        uni.showModal({
          title: payload.title || '确认操作',
          content: payload.content,
          confirmText: payload.confirmText || '确认',
          cancelText: payload.cancelText || '取消',
          success: (raw) => {
            resolve({
              ok: true,
              platform,
              message: raw.confirm ? '用户已确认' : '用户已取消',
              confirmed: !!raw.confirm,
              cancelled: !!raw.cancel,
              raw
            })
          },
          fail: (raw) => {
            resolve({
              ok: false,
              platform,
              message: '确认弹窗拉起失败',
              confirmed: false,
              cancelled: true,
              raw
            })
          }
        })
      })
    },
    actionSheet(payload: ActionSheetPayload) {
      return new Promise<ActionSheetResult>((resolve) => {
        uni.showActionSheet({
          itemList: payload.itemList,
          itemColor: payload.itemColor,
          alertText: payload.alertText,
          success: (raw) => {
            resolve({
              ok: true,
              platform,
              message: '已选择操作项',
              tapIndex: raw.tapIndex,
              raw
            })
          },
          fail: (raw) => {
            resolve({
              ok: false,
              platform,
              message: '操作面板已取消或拉起失败',
              tapIndex: -1,
              raw
            })
          }
        })
      })
    }
  }
}
