import { createSSRApp } from 'vue'
import App from './App.vue'
import { setupAppPlugins } from './plugins'
import 'virtual:uno.css'
import './styles/index.scss'

export function createApp() {
  const app = createSSRApp(App)
  setupAppPlugins(app)

  return {
    app
  }
}
