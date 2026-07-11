import { callUniMethodAsync, getUniMethod } from './helpers'

export interface CanvasToTempFilePathOptions extends Record<string, unknown> {
  canvasId?: string
  x?: number
  y?: number
  width?: number
  height?: number
  destWidth?: number
  destHeight?: number
  fileType?: 'jpg' | 'png'
  quality?: number
}

export function createCanvasContext(canvasId: string, componentInstance?: object) {
  if (componentInstance) return uni.createCanvasContext(canvasId, componentInstance)
  return uni.createCanvasContext(canvasId)
}

export function canvasToTempFilePath(options: CanvasToTempFilePathOptions, componentInstance?: object) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    uni.canvasToTempFilePath(
      {
        ...(options as any),
        success: (result: Record<string, unknown>) => resolve(result),
        fail: (error: unknown) => reject(error)
      },
      componentInstance as any
    )
  })
}

export function canvasGetImageData(options: Record<string, unknown>) {
  return callUniMethodAsync<Record<string, unknown>, Record<string, unknown>>('canvasGetImageData', options)
}

export function canvasPutImageData(options: Record<string, unknown>) {
  return callUniMethodAsync<Record<string, unknown>, unknown>('canvasPutImageData', options)
}

export function createOffscreenCanvas(options: Record<string, unknown> = {}) {
  const method = getUniMethod<(options?: Record<string, unknown>) => Record<string, unknown>>('createOffscreenCanvas')
  return method(options)
}

export function getCanvasImageInfo(src: string) {
  return callUniMethodAsync<{ src: string }, Record<string, unknown>>('getImageInfo', { src })
}

export const uniCanvasApi = {
  createCanvasContext,
  canvasToTempFilePath,
  canvasGetImageData,
  canvasPutImageData,
  createOffscreenCanvas,
  getCanvasImageInfo
}
