export type RequestMethod = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

export interface RequestOptions<T = unknown> {
  url: string
  method?: RequestMethod
  data?: string | Record<string, unknown> | ArrayBuffer
  header?: Record<string, string>
  timeout?: number
  baseUrl?: string
  showErrorToast?: boolean
  transform?: (response: unknown) => T
}

export interface RequestConfig {
  baseUrl?: string
  timeout?: number
  header?: Record<string, string>
  getToken?: () => string | undefined
  showErrorToast?: boolean
}

function joinUrl(baseUrl = '', url: string) {
  if (/^https?:\/\//u.test(url)) return url
  return `${baseUrl.replace(/\/$/u, '')}/${url.replace(/^\//u, '')}`
}

function showRequestError(message: string) {
  uni.showToast({
    title: message,
    icon: 'none'
  })
}

export function createRequest(defaultConfig: RequestConfig = {}) {
  return function request<T = unknown>(options: RequestOptions<T>) {
    const token = defaultConfig.getToken?.()
    const header = {
      ...defaultConfig.header,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.header
    }

    return new Promise<T>((resolve, reject) => {
      uni.request({
        url: joinUrl(options.baseUrl || defaultConfig.baseUrl, options.url),
        method: options.method || 'GET',
        data: options.data,
        header,
        timeout: options.timeout || defaultConfig.timeout || 15000,
        success(response) {
          const statusCode = Number(response.statusCode || 0)
          if (statusCode < 200 || statusCode >= 300) {
            const message = `请求失败 ${statusCode || ''}`.trim()
            if (options.showErrorToast ?? defaultConfig.showErrorToast ?? true) showRequestError(message)
            reject(new Error(message))
            return
          }

          const data = options.transform ? options.transform(response.data) : response.data
          resolve(data as T)
        },
        fail(error) {
          const message = error.errMsg || '网络请求失败'
          if (options.showErrorToast ?? defaultConfig.showErrorToast ?? true) showRequestError(message)
          reject(error)
        }
      })
    })
  }
}

export const request = createRequest()
