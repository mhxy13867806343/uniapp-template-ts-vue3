import { createPinia } from 'pinia'
import type { App as VueApp } from 'vue'

export function setupAppPlugins(app: VueApp) {
  app.use(createPinia())
}
