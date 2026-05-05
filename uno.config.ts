import { defineConfig, presetIcons, presetUno } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni(),
    presetUno(),
    presetIcons({
      scale: 1.1,
      warn: true
    })
  ],
  theme: {
    colors: {
      brand: {
        50: '#eef8ff',
        100: '#d8efff',
        500: '#1e88e5',
        600: '#176ec0',
        700: '#155996'
      },
      ink: '#182230',
      muted: '#667085',
      line: '#e4e7ec',
      canvas: '#f6f8fb'
    }
  },
  shortcuts: {
    'page-root': 'min-h-screen bg-canvas text-ink pb-22',
    'page-section': 'px-4 py-3',
    'panel': 'rounded-2 bg-white border border-line p-4',
    'muted-text': 'text-sm text-muted'
  }
})
