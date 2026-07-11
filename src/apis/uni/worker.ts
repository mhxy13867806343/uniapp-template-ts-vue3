export function hasUniWorkerSupport() {
  return typeof (uni as any).createWorker === 'function'
}

export function createUniWorker(scriptPath: string) {
  const createWorker = (uni as any).createWorker
  if (typeof createWorker !== 'function') {
    throw new Error('当前平台不支持 uni.createWorker')
  }
  return createWorker(scriptPath)
}

export const uniWorkerApi = {
  hasUniWorkerSupport,
  createUniWorker
}
