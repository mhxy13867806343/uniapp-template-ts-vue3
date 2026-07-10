import { copySharePayload, createLocationApis, createModalApis, getMockDeviceInfo, mapAppShareProvider, mapAppShareScene, mapPaymentProvider, requestUniPayment, simulatePayment } from '../shared'
import type { PaymentPayload, PlatformPlugins, PluginResult, SharePayload } from '../types'

export function getIosHardwareInfo(): string {
  // #ifdef APP-PLUS
  try {
    const DevicePluginClass = plus.ios.importClass("DevicePlugin");
    if (DevicePluginClass) {
      return (DevicePluginClass as any).getHardwareInfo();
    }
  } catch (e: any) {
    return `iOS (HTML5+ Bridge Fallback: ${e.message || e})`;
  }
  // #endif

  const info = uni.getSystemInfoSync();
  return `iOS Mock: ${info.model} (iPhone OS 17.5)`;
}

export function getIosNetworkDetails(): { type: string; ip: string } {
  // #ifdef APP-PLUS
  try {
    const NetworkPluginClass = plus.ios.importClass("NetworkPlugin");
    if (NetworkPluginClass) {
      const type = (NetworkPluginClass as any).getNetworkType();
      const ip = (NetworkPluginClass as any).getLocalIpAddress();
      return { type, ip };
    }
  } catch (e) {
    // Fallback if load fails
  }
  // #endif
  
  return { type: 'WiFi (iOS Mock)', ip: '192.168.1.103' };
}

export function pingIosHost(host: string, timeoutMs: number): string {
  // #ifdef APP-PLUS
  try {
    const NetworkPluginClass = plus.ios.importClass("NetworkPlugin");
    if (NetworkPluginClass) {
      return (NetworkPluginClass as any).pingHostTimeout(host, timeoutMs);
    }
  } catch (e: any) {
    return `iOS Ping Error: ${e.message || e}`;
  }
  // #endif
  
  return `iOS Mock Ping: Success 38ms (Target: ${host})`;
}

async function shareByIOS(payload: SharePayload): Promise<PluginResult> {
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

  return simulatePayment('ios', payload, 'iOS 端未传入真实支付签名，已走模拟支付')
}

export function createIOSPlugins(): PlatformPlugins {
  return {
    platform: 'ios',
    share: {
      send: shareByIOS,
      system: (payload) => shareByIOS({ ...payload, provider: 'system' }),
      copy: (payload) => copySharePayload(payload, 'ios')
    },
    payment: {
      request: requestIOSPayment
    },
    location: createLocationApis('ios', { preferNative: true }),
    modal: createModalApis('ios'),
    device: {
      getInfo: getIosHardwareInfo
    }
  }
}
