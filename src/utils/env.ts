export type AppEnvMode = 'development' | 'test' | 'production'

export const appEnv = {
  mode: (import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development') as AppEnvMode,
  title: import.meta.env.VITE_APP_TITLE || 'UniApp Template',
  apiBaseUrl: import.meta.env.VITE_APP_API_BASE_URL || ''
}
