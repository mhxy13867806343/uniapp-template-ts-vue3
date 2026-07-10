import { browserShare, copySharePayload, createLocationApis, createModalApis, getMockDeviceInfo, mapAppShareProvider, mapAppShareScene, mapPaymentProvider, requestUniPayment, simulatePayment } from '../shared'
import type { PaymentPayload, PlatformPlugins, PluginResult, SharePayload } from '../types'

export function getIOSHardwareInfo() {
  return getMockDeviceInfo(typeof plus !== 'undefined' ? 'iOS Native' : 'iOS Mock')
}

async function shareByIOSApp(payload: SharePayload): Promise<PluginResult> {
  // #ifdef APP-PLUS
  if (payload.provider === 'system') {
    return new Promise((resolve) => {
      ;(uni as any).shareWithSystem({
        type: 'text',
        summary: payload.content || payload.title,
        href: payload.url,
        success: (raw: Record<string, unknown>) => {
          resolve({
            ok: true,
            platform: 'ios',
            message: '已唤起 iOS 系统分享面板',
            raw
          })
        },
        fail: (raw: Record<string, unknown>) => {
          resolve({
            ok: false,
            platform: 'ios',
            message: `系统分享失败: ${String(raw.errMsg || 'unknown')}`,
            raw
          })
        }
      })
    })
  }

  return new Promise((resolve) => {
    ;(uni as any).share({
      provider: mapAppShareProvider(payload.provider),
      scene: mapAppShareScene(payload.scene),
      type: 0,
      title: payload.title,
      summary: payload.content || '',
      href: payload.url || '',
      imageUrl: payload.imageUrl || '',
      success: (raw: Record<string, unknown>) => {
        resolve({
          ok: true,
          platform: 'ios',
          message: 'iOS 原生分享已触发',
          raw
        })
      },
      fail: (raw: Record<string, unknown>) => {
        resolve({
          ok: false,
          platform: 'ios',
          message: `原生分享失败: ${String(raw.errMsg || 'unknown')}`,
          raw
        })
      }
    })
  })
  // #endif

  const browserResult = await browserShare(payload, 'ios')
  if (browserResult !== null) return browserResult as PluginResult
  return copySharePayload(payload, 'ios')
}

async function requestIOSPayment(payload: PaymentPayload) {
  // #ifdef APP-PLUS
  if (!payload.mock && payload.orderInfo) {
    return requestUniPayment('ios', {
      provider: mapPaymentProvider(payload.provider),
      orderInfo: payload.orderInfo
    }, payload)
  }
  // #endif

  return simulatePayment('ios', payload)
}

export function createIOSPlugins(): PlatformPlugins {
  return {
    platform: 'ios',
    share: {
      send: shareByIOSApp,
      system: (payload) => shareByIOSApp({ ...payload, provider: 'system' }),
      copy: (payload) => copySharePayload(payload, 'ios')
    },
    payment: {
      request: requestIOSPayment
    },
    location: createLocationApis('ios', { preferNative: true }),
    modal: createModalApis('ios'),
    device: {
      getInfo: getIOSHardwareInfo
    }
  }
}
