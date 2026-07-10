import { browserShare, copySharePayload, createModalApis, getMockDeviceInfo, mapAppShareProvider, mapAppShareScene, mapPaymentProvider, requestUniPayment, simulatePayment } from '../shared'
import type { PaymentPayload, PlatformPlugins, PluginResult, SharePayload } from '../types'

export function getAndroidHardwareInfo(): string {
  // #ifdef APP-PLUS
  try {
    const mainActivity = plus.android.runtimeMainActivity();
    const DevicePluginClass = plus.android.importClass("com.uniapp.plugins.DevicePlugin");
    if (DevicePluginClass) {
      return (DevicePluginClass as any).getHardwareInfo(mainActivity);
    }
  } catch (e: any) {
    return `Android (HTML5+ Bridge Fallback: ${e.message || e})`;
  }
  // #endif
  
  // Return a simulation if testing in non-app environment
  return getMockDeviceInfo('Android Mock');
}

async function shareByAndroidApp(payload: SharePayload): Promise<PluginResult> {
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
            platform: 'android',
            message: '已唤起 Android 系统分享面板',
            raw
          })
        },
        fail: (raw: Record<string, unknown>) => {
          resolve({
            ok: false,
            platform: 'android',
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
          platform: 'android',
          message: 'Android 原生分享已触发',
          raw
        })
      },
      fail: (raw: Record<string, unknown>) => {
        resolve({
          ok: false,
          platform: 'android',
          message: `原生分享失败: ${String(raw.errMsg || 'unknown')}`,
          raw
        })
      }
    })
  })
  // #endif

  const browserResult = await browserShare(payload, 'android')
  if (browserResult !== null) return browserResult as PluginResult
  return copySharePayload(payload, 'android')
}

async function requestAndroidPayment(payload: PaymentPayload) {
  // #ifdef APP-PLUS
  if (!payload.mock && payload.orderInfo) {
    return requestUniPayment('android', {
      provider: mapPaymentProvider(payload.provider),
      orderInfo: payload.orderInfo
    }, payload)
  }
  // #endif

  if (payload.paymentUrl) {
    // #ifdef H5
    if (typeof window !== 'undefined') {
      window.open(payload.paymentUrl, '_blank')
      return {
        ok: true,
        platform: 'android',
        message: '已打开支付链接，请在浏览器中继续完成支付',
        transactionId: payload.orderNo
      } satisfies PluginResult & { transactionId?: string }
    }
    // #endif
  }

  return simulatePayment('android', payload)
}

export function createAndroidPlugins(): PlatformPlugins {
  return {
    platform: 'android',
    share: {
      send: shareByAndroidApp,
      system: (payload) => shareByAndroidApp({ ...payload, provider: 'system' }),
      copy: (payload) => copySharePayload(payload, 'android')
    },
    payment: {
      request: requestAndroidPayment
    },
    modal: createModalApis('android'),
    device: {
      getInfo: getAndroidHardwareInfo
    }
  }
}
