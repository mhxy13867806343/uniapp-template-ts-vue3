import { callUniMethodAsync } from './helpers'

export interface ScanCodeOptions {
  onlyFromCamera?: boolean
  scanType?: string[]
  autoZoom?: boolean
  needResult?: number
}

export function scanCode(options: ScanCodeOptions = {}) {
  return callUniMethodAsync<ScanCodeOptions, Record<string, unknown>>('scanCode', options)
}

export function scanQrCode() {
  return scanCode({
    scanType: ['qrCode']
  })
}

export function scanBarCode() {
  return scanCode({
    scanType: ['barCode']
  })
}

export const uniScanApi = {
  scanCode,
  scanQrCode,
  scanBarCode
}
