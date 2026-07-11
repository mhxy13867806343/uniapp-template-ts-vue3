import { callUniMethodAsync, getUniMethod } from './helpers'

export interface BluetoothListenerResult extends Record<string, unknown> {}

export function openBluetoothAdapter(mode: 'central' | 'peripheral' = 'central') {
  return callUniMethodAsync<{ mode?: 'central' | 'peripheral' }, unknown>('openBluetoothAdapter', { mode })
}

export function closeBluetoothAdapter() {
  return callUniMethodAsync<Record<string, never>, unknown>('closeBluetoothAdapter', {})
}

export function getBluetoothAdapterState() {
  return callUniMethodAsync<Record<string, never>, Record<string, unknown>>('getBluetoothAdapterState', {})
}

export function startBluetoothDevicesDiscovery(options: Record<string, unknown> = {}) {
  return callUniMethodAsync<Record<string, unknown>, unknown>('startBluetoothDevicesDiscovery', options)
}

export function stopBluetoothDevicesDiscovery() {
  return callUniMethodAsync<Record<string, never>, unknown>('stopBluetoothDevicesDiscovery', {})
}

export function getBluetoothDevices() {
  return callUniMethodAsync<Record<string, never>, { devices: Array<Record<string, unknown>> }>('getBluetoothDevices', {})
}

export function getConnectedBluetoothDevices(services: string[] = []) {
  return callUniMethodAsync<{ services: string[] }, { devices: Array<Record<string, unknown>> }>('getConnectedBluetoothDevices', { services })
}

export function createBLEConnection(deviceId: string, timeout?: number) {
  return callUniMethodAsync<{ deviceId: string; timeout?: number }, unknown>('createBLEConnection', { deviceId, timeout })
}

export function closeBLEConnection(deviceId: string) {
  return callUniMethodAsync<{ deviceId: string }, unknown>('closeBLEConnection', { deviceId })
}

export function getBLEDeviceServices(deviceId: string) {
  return callUniMethodAsync<{ deviceId: string }, { services: Array<Record<string, unknown>> }>('getBLEDeviceServices', { deviceId })
}

export function getBLEDeviceCharacteristics(deviceId: string, serviceId: string) {
  return callUniMethodAsync<{ deviceId: string; serviceId: string }, { characteristics: Array<Record<string, unknown>> }>(
    'getBLEDeviceCharacteristics',
    { deviceId, serviceId }
  )
}

export function readBLECharacteristicValue(deviceId: string, serviceId: string, characteristicId: string) {
  return callUniMethodAsync<{ deviceId: string; serviceId: string; characteristicId: string }, unknown>(
    'readBLECharacteristicValue',
    { deviceId, serviceId, characteristicId }
  )
}

export function writeBLECharacteristicValue(
  deviceId: string,
  serviceId: string,
  characteristicId: string,
  value: ArrayBuffer
) {
  return callUniMethodAsync<{ deviceId: string; serviceId: string; characteristicId: string; value: ArrayBuffer }, unknown>(
    'writeBLECharacteristicValue',
    { deviceId, serviceId, characteristicId, value }
  )
}

export function notifyBLECharacteristicValueChange(
  deviceId: string,
  serviceId: string,
  characteristicId: string,
  state = true
) {
  return callUniMethodAsync<{ deviceId: string; serviceId: string; characteristicId: string; state: boolean }, unknown>(
    'notifyBLECharacteristicValueChange',
    { deviceId, serviceId, characteristicId, state }
  )
}

export function onBluetoothDeviceFound(callback: (result: BluetoothListenerResult) => void) {
  getUniMethod<(callback: (result: BluetoothListenerResult) => void) => void>('onBluetoothDeviceFound')(callback)
}

export function offBluetoothDeviceFound(callback?: (result: BluetoothListenerResult) => void) {
  const method = (uni as unknown as Record<string, unknown>).offBluetoothDeviceFound
  if (typeof method === 'function') {
    ;(method as (callback?: (result: BluetoothListenerResult) => void) => void)(callback)
  }
}

export function onBLEConnectionStateChange(callback: (result: BluetoothListenerResult) => void) {
  getUniMethod<(callback: (result: BluetoothListenerResult) => void) => void>('onBLEConnectionStateChange')(callback)
}

export function offBLEConnectionStateChange(callback?: (result: BluetoothListenerResult) => void) {
  const method = (uni as unknown as Record<string, unknown>).offBLEConnectionStateChange
  if (typeof method === 'function') {
    ;(method as (callback?: (result: BluetoothListenerResult) => void) => void)(callback)
  }
}

export function onBLECharacteristicValueChange(callback: (result: BluetoothListenerResult) => void) {
  getUniMethod<(callback: (result: BluetoothListenerResult) => void) => void>('onBLECharacteristicValueChange')(callback)
}

export function offBLECharacteristicValueChange(callback?: (result: BluetoothListenerResult) => void) {
  const method = (uni as unknown as Record<string, unknown>).offBLECharacteristicValueChange
  if (typeof method === 'function') {
    ;(method as (callback?: (result: BluetoothListenerResult) => void) => void)(callback)
  }
}

export const uniBluetoothApi = {
  openBluetoothAdapter,
  closeBluetoothAdapter,
  getBluetoothAdapterState,
  startBluetoothDevicesDiscovery,
  stopBluetoothDevicesDiscovery,
  getBluetoothDevices,
  getConnectedBluetoothDevices,
  createBLEConnection,
  closeBLEConnection,
  getBLEDeviceServices,
  getBLEDeviceCharacteristics,
  readBLECharacteristicValue,
  writeBLECharacteristicValue,
  notifyBLECharacteristicValueChange,
  onBluetoothDeviceFound,
  offBluetoothDeviceFound,
  onBLEConnectionStateChange,
  offBLEConnectionStateChange,
  onBLECharacteristicValueChange,
  offBLECharacteristicValueChange
}
