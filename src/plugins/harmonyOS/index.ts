import { copySharePayload, createLocationApis, createModalApis, getMockDeviceInfo, mapAppShareProvider, mapAppShareScene, mapPaymentProvider, requestUniPayment, simulatePayment } from '../shared'
import type { PaymentPayload, PlatformPlugins, PluginResult, SharePayload } from '../types'

function getHarmonyHardwareInfo() {
  return getMockDeviceInfo('HarmonyOS')
}

async function shareByHarmony(payload: SharePayload): Promise<PluginResult> {
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
            platform: 'harmonyOS',
            message: '已唤起 HarmonyOS 系统分享面板',
            raw
          })
        },
        fail: (raw: Record<string, unknown>) => {
          resolve({
            ok: false,
            platform: 'harmonyOS',
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
          platform: 'harmonyOS',
          message: 'HarmonyOS 原生分享已触发',
          raw
        })
      },
      fail: (raw: Record<string, unknown>) => {
        resolve({
          ok: false,
          platform: 'harmonyOS',
          message: `原生分享失败: ${String(raw.errMsg || 'unknown')}`,
          raw
        })
      }
    })
  })
  // #endif

  return copySharePayload(payload, 'harmonyOS')
}

async function requestHarmonyPayment(payload: PaymentPayload) {
  // #ifdef APP-PLUS
  if (!payload.mock && payload.orderInfo) {
    return requestUniPayment('harmonyOS', {
      provider: mapPaymentProvider(payload.provider),
      orderInfo: payload.orderInfo
    }, payload)
  }
  // #endif

  return simulatePayment('harmonyOS', payload)
}

export function createHarmonyOSPlugins(): PlatformPlugins {
  return {
    platform: 'harmonyOS',
    share: {
      send: shareByHarmony,
      system: (payload) => shareByHarmony({ ...payload, provider: 'system' }),
      copy: (payload) => copySharePayload(payload, 'harmonyOS')
    },
    payment: {
      request: requestHarmonyPayment
    },
    location: createLocationApis('harmonyOS', { preferNative: true }),
    modal: createModalApis('harmonyOS'),
    device: {
      getInfo: getHarmonyHardwareInfo
    }
  }
}
