import { createPinia } from 'pinia'
import type { App as VueApp } from 'vue'
import { createAndroidPlugins } from './android'
import { createH5Plugins } from './h5'
import { createHarmonyOSPlugins } from './harmonyOS'
import { createIOSPlugins } from './ios'
import { createMiniProgramPlugins } from './miniProgram'
import { createPcPlugins } from './pc'
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

export function getHardwareInfo(): string {
  return platformPlugins.device.getInfo()
}

export * from './types'
