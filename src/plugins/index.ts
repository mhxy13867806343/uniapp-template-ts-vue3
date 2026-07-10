import { createPinia } from 'pinia'
import type { App as VueApp } from 'vue'

import { createAndroidPlugins, getAndroidHardwareInfo, getAndroidNetworkDetails, pingAndroidHost } from './android'
import { createH5Plugins, getH5HardwareInfo } from './h5'
import { createHarmonyOSPlugins, getHarmonyHardwareInfo } from './harmonyOS'
import { createIOSPlugins, getIosHardwareInfo, getIosNetworkDetails, pingIosHost } from './ios'
import { createMiniProgramPlugins, getMiniProgramHardwareInfo } from './miniProgram'
import { createPcPlugins, getPcHardwareInfo } from './pc'
import { getSharedNetworkDetails, pingSharedHost } from './shared'
import type { PlatformPlugins } from './types'

function resolvePlatformPlugins(): PlatformPlugins {
  const info = uni.getSystemInfoSync()
  const infoRecord = info as unknown as Record<string, unknown>
  const system = String(info.system || '').toLowerCase()
  const platform = String(info.platform || '').toLowerCase()
  const uniPlatform = String(infoRecord.uniPlatform || '').toLowerCase()
  const deviceType = String(infoRecord.deviceType || '').toLowerCase()

  if (uniPlatform.startsWith('mp-')) {
    return createMiniProgramPlugins()
  }

  if (system.includes('harmony')) {
    return createHarmonyOSPlugins()
  }

  if (system.includes('ios') || platform === 'ios') {
    return createIOSPlugins()
  }

  if (system.includes('android') || platform === 'android') {
    return createAndroidPlugins()
  }

  if (deviceType === 'pc') {
    return createPcPlugins()
  }

  return createH5Plugins()
}

export const platformPlugins = resolvePlatformPlugins()

export function usePlatformPlugins() {
  return platformPlugins
}

export function setupAppPlugins(app: VueApp) {
  app.use(createPinia())
  app.provide('platformPlugins', platformPlugins)
  ;(app.config.globalProperties as Record<string, unknown>).$platformPlugins = platformPlugins
}

/**
 * 跨端统一原生硬件网桥接口
 */
export function getHardwareInfo(): string {
  // #ifdef APP-PLUS
  const platform = uni.getSystemInfoSync().platform;
  if (platform === 'android') {
    return getAndroidHardwareInfo();
  } else if (platform === 'ios') {
    return getIosHardwareInfo();
  }
  // #endif

  // #ifdef APP-HARMONY
  return getHarmonyHardwareInfo();
  // #endif

  // #ifdef H5
  return getH5HardwareInfo();
  // #endif

  // #ifdef MP
  return getMiniProgramHardwareInfo();
  // #endif

  return getPcHardwareInfo();
}

/**
 * 跨端统一网络连接详情接口
 */
export function getNetworkDetails(): { type: string; ip: string } {
  // #ifdef APP-PLUS
  const platform = uni.getSystemInfoSync().platform;
  if (platform === 'android') {
    return getAndroidNetworkDetails();
  } else if (platform === 'ios') {
    return getIosNetworkDetails();
  }
  // #endif

  return getSharedNetworkDetails();
}

/**
 * 跨端统一网络延迟诊断测试
 */
export function pingHost(host: string, timeoutMs: number = 3000): Promise<string> {
  // #ifdef APP-PLUS
  const platform = uni.getSystemInfoSync().platform;
  if (platform === 'android') {
    return Promise.resolve(pingAndroidHost(host, timeoutMs));
  } else if (platform === 'ios') {
    return Promise.resolve(pingIosHost(host, timeoutMs));
  }
  // #endif

  return pingSharedHost(host, timeoutMs);
}

export * from './types'
