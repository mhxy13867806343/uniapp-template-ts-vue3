type AnyOptions = Record<string, any>

export type WithoutCallbacks<T> = T extends object
  ? Omit<T, 'success' | 'fail' | 'complete'>
  : never

export interface UniError extends Record<string, any> {
  errMsg?: string
}

export function getUniErrorMessage(error: unknown, fallback = 'uni API 调用失败') {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'errMsg' in error) {
    const errMsg = (error as UniError).errMsg
    if (typeof errMsg === 'string' && errMsg) return errMsg
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function normalizeOptions<T extends AnyOptions>(options: T | undefined) {
  return (options || {}) as T
}

export function getUniMethod<T extends (...args: any[]) => any>(methodName: string) {
  const method = (uni as unknown as Record<string, unknown>)[methodName]
  if (typeof method !== 'function') {
    throw new Error(`当前平台不支持 uni.${methodName}`)
  }
  return method as T
}

export function callUniAsync<TOptions extends AnyOptions, TResult = unknown>(
  method: (options: TOptions) => void,
  options?: WithoutCallbacks<TOptions>
) {
  return new Promise<TResult>((resolve, reject) => {
    method({
      ...(normalizeOptions(options) as TOptions),
      success: (result: TResult) => resolve(result),
      fail: (error: UniError) => reject(error)
    })
  })
}

export function callUniMethodAsync<TOptions extends AnyOptions, TResult = unknown>(
  methodName: string,
  options?: WithoutCallbacks<TOptions>
) {
  const method = getUniMethod<(options: TOptions) => void>(methodName)
  return callUniAsync<TOptions, TResult>(method, options)
}
