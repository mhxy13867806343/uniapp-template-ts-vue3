import { browserShare, copySharePayload, createLocationApis, createModalApis, getMockDeviceInfo, simulatePayment } from '../shared'
import type { PaymentPayload, PlatformPlugins, PluginResult, SharePayload } from '../types'

export function getPcHardwareInfo(): string {
  return getMockDeviceInfo('PC')
}

async function shareByPc(payload: SharePayload): Promise<PluginResult> {
  const shareResult = await browserShare(payload, 'pc')
  if (shareResult?.ok) return shareResult
  return copySharePayload(payload, 'pc')
}

async function requestPcPayment(payload: PaymentPayload) {
  if (payload.paymentUrl) {
    // #ifdef H5
    if (typeof window !== 'undefined') {
      window.open(payload.paymentUrl, '_blank')
      return {
        ok: true,
        platform: 'pc',
        message: '已打开 PC 网页收银台',
        transactionId: payload.orderNo
      } as const
    }
    // #endif
  }

  return simulatePayment('pc', payload, 'PC 端暂未传入真实支付链接，已走模拟支付')
}

export function createPcPlugins(): PlatformPlugins {
  return {
    platform: 'pc',
    share: {
      send: shareByPc,
      system: shareByPc,
      copy: (payload) => copySharePayload(payload, 'pc')
    },
    payment: {
      request: requestPcPayment
    },
    location: createLocationApis('pc'),
    modal: createModalApis('pc'),
    device: {
      getInfo: getPcHardwareInfo
    }
  }
}
