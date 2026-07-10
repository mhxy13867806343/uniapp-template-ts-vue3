import { copySharePayload, createLocationApis, createModalApis, mapAppShareProvider, mapAppShareScene, mapPaymentProvider, requestUniPayment, simulatePayment } from '../shared'
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
  
  const info = uni.getSystemInfoSync();
  return `Android Mock: ${info.brand} ${info.model} (SDK 34)`;
}

export function getAndroidNetworkDetails(): { type: string; ip: string } {
  // #ifdef APP-PLUS
  try {
    const mainActivity = plus.android.runtimeMainActivity();
    const NetworkPluginClass = plus.android.importClass("com.uniapp.plugins.NetworkPlugin");
    if (NetworkPluginClass) {
      const type = (NetworkPluginClass as any).getNetworkType(mainActivity);
      const ip = (NetworkPluginClass as any).getLocalIpAddress();
      return { type, ip };
    }
  } catch (e) {
    // Fallback if load fails
  }
  // #endif
  
  return { type: 'WiFi (Android Mock)', ip: '192.168.1.102' };
}

export function pingAndroidHost(host: string, timeoutMs: number): string {
  // #ifdef APP-PLUS
  try {
    const NetworkPluginClass = plus.android.importClass("com.uniapp.plugins.NetworkPlugin");
    if (NetworkPluginClass) {
      return (NetworkPluginClass as any).pingHost(host, timeoutMs);
    }
  } catch (e: any) {
    return `Android Ping Error: ${e.message || e}`;
  }
  // #endif
  
  return `Android Mock Ping: Success 45ms (Target: ${host})`;
}

async function shareByAndroid(payload: SharePayload): Promise<PluginResult> {
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

  return simulatePayment('android', payload, 'Android 端未传入真实支付签名，已走模拟支付')
}

export function createAndroidPlugins(): PlatformPlugins {
  return {
    platform: 'android',
    share: {
      send: shareByAndroid,
      system: (payload) => shareByAndroid({ ...payload, provider: 'system' }),
      copy: (payload) => copySharePayload(payload, 'android')
    },
    payment: {
      request: requestAndroidPayment
    },
    location: createLocationApis('android', { preferNative: true }),
    modal: createModalApis('android'),
    device: {
      getInfo: getAndroidHardwareInfo
    }
  }
}
