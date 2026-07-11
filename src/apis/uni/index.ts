export * from './helpers'
export * from './interface'
export * from './storage'
export * from './router'
export * from './device'
export * from './location'
export * from './media'
export * from './network'
export * from './keyboard'
export * from './worker'
export * from './fileSystem'
export * from './bluetooth'
export * from './scan'
export * from './canvas'
export * from './contact'
export * from './biometrics'

import { uniDeviceApi } from './device'
import { uniInterfaceApi } from './interface'
import { uniKeyboardApi } from './keyboard'
import { uniLocationApi } from './location'
import { uniMediaApi } from './media'
import { uniNetworkApi } from './network'
import { uniRouterApi } from './router'
import { uniStorageApi } from './storage'
import { uniWorkerApi } from './worker'
import { uniFileSystemApi } from './fileSystem'
import { uniBluetoothApi } from './bluetooth'
import { uniScanApi } from './scan'
import { uniCanvasApi } from './canvas'
import { uniContactApi } from './contact'
import { uniBiometricsApi } from './biometrics'

export const uniApi = {
  interface: uniInterfaceApi,
  storage: uniStorageApi,
  router: uniRouterApi,
  device: uniDeviceApi,
  location: uniLocationApi,
  media: uniMediaApi,
  network: uniNetworkApi,
  keyboard: uniKeyboardApi,
  worker: uniWorkerApi,
  fileSystem: uniFileSystemApi,
  bluetooth: uniBluetoothApi,
  scan: uniScanApi,
  canvas: uniCanvasApi,
  contact: uniContactApi,
  biometrics: uniBiometricsApi
}
