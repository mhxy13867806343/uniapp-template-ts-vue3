import zhCN from './zh-CN'
import enUS from './en-US'

export type AppLocale = 'zh-CN' | 'en-US'

export const localeOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
] as const

export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

export function getMessage(locale: AppLocale, path: string) {
  const segments = path.split('.')
  let value: unknown = messages[locale]

  for (const segment of segments) {
    if (!value || typeof value !== 'object') return path
    value = (value as Record<string, unknown>)[segment]
  }

  return typeof value === 'string' ? value : path
}
