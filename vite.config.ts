import { defineConfig, loadEnv, type PluginOption } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import uniPlugin from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

const uni = ((uniPlugin as { default?: unknown }).default || uniPlugin) as () => PluginOption | PluginOption[]

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    base: env.VITE_PUBLIC_PATH || '/',
    plugins: [
      uni(),
      AutoImport({
        imports: [
          'vue',
          'pinia',
          {
            '@dcloudio/uni-app': [
              'onLaunch',
              'onShow',
              'onHide',
              'onLoad',
              'onReady',
              'onUnload',
              'onPullDownRefresh',
              'onReachBottom',
              'onShareAppMessage',
              'onPageScroll'
            ]
          },
          {
            'wot-design-uni': [
              'useToast',
              'useMessage',
              'useNotify',
              'useUpload',
              'useCountDown',
              'useConfigProvider'
            ]
          }
        ],
        dts: 'src/types/auto-imports.d.ts',
        vueTemplate: true,
        dirs: [
          'src/hooks',
          'src/store',
          'src/utils'
        ]
      }),
      UnoCSS()
    ],
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV)
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  }
})
