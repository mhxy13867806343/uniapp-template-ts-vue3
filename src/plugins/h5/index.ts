import { browserShare, copySharePayload, createModalApis, getMockDeviceInfo, simulatePayment } from '../shared'
import type { PaymentPayload, PlatformPlugins, PluginResult, SharePayload } from '../types'

export function getH5HardwareInfo(): string {
  return getMockDeviceInfo('H5')
}

async function shareByH5(payload: SharePayload): Promise<PluginResult> {
  const shareResult = await browserShare(payload, 'h5')
  if (shareResult?.ok) return shareResult
  return copySharePayload(payload, 'h5')
}

async function requestH5Payment(payload: PaymentPayload) {
  if (payload.paymentUrl) {
    // #ifdef H5
    if (typeof window !== 'undefined') {
      window.open(payload.paymentUrl, '_blank')
      return {
        ok: true,
        platform: 'h5',
        message: '已打开 H5 支付收银台',
        transactionId: payload.orderNo
      } as const
    }
    // #endif
  }

  return simulatePayment('h5', payload, 'H5 暂未传入真实收银台地址，已走模拟支付')
}

export function createH5Plugins(): PlatformPlugins {
  return {
    platform: 'h5',
    share: {
      send: shareByH5,
      system: shareByH5,
      copy: (payload) => copySharePayload(payload, 'h5')
    },
    payment: {
      request: requestH5Payment
    },
    modal: createModalApis('h5'),
    device: {
      getInfo: getH5HardwareInfo
    }
  }
}
