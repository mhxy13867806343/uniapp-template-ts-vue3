import { copySharePayload, createLocationApis, createModalApis, getMockDeviceInfo, requestUniPayment, simulatePayment } from '../shared'
import type { PaymentPayload, PlatformPlugins, PluginResult, SharePayload } from '../types'

export function getMiniProgramHardwareInfo(): string {
  return getMockDeviceInfo('Mini Program')
}

async function shareByMiniProgram(payload: SharePayload): Promise<PluginResult> {
  return new Promise((resolve) => {
    uni.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
      success: (raw: Record<string, unknown>) => {
        uni.setStorageSync('__plugin_share_payload__', payload)
        resolve({
          ok: true,
          platform: 'miniProgram',
          message: '已打开小程序分享能力，请使用右上角继续分享',
          raw
        })
      },
      fail: async (raw: Record<string, unknown>) => {
        const copied = await copySharePayload(payload, 'miniProgram')
        resolve({
          ...copied,
          raw
        })
      }
    } as any)
  })
}

async function requestMiniProgramPayment(payload: PaymentPayload) {
  if (!payload.mock && payload.orderInfo && typeof payload.orderInfo === 'object') {
    return requestUniPayment('miniProgram', payload.orderInfo, payload)
  }

  return simulatePayment('miniProgram', payload, '小程序端未传入 requestPayment 所需签名字段，已走模拟支付')
}

export function createMiniProgramPlugins(): PlatformPlugins {
  return {
    platform: 'miniProgram',
    share: {
      send: shareByMiniProgram,
      system: shareByMiniProgram,
      copy: (payload) => copySharePayload(payload, 'miniProgram')
    },
    payment: {
      request: requestMiniProgramPayment
    },
    location: createLocationApis('miniProgram'),
    modal: createModalApis('miniProgram'),
    device: {
      getInfo: getMiniProgramHardwareInfo
    }
  }
}
