import { callUniAsync } from './helpers'

type RequestOptions = NonNullable<Parameters<typeof uni.request>[0]>
type DownloadFileOptions = NonNullable<Parameters<typeof uni.downloadFile>[0]>
type UploadFileOptions = NonNullable<Parameters<typeof uni.uploadFile>[0]>
type ConnectSocketOptions = NonNullable<Parameters<typeof uni.connectSocket>[0]>

export function request<T = unknown>(options: Omit<RequestOptions, 'success' | 'fail' | 'complete'>) {
  return callUniAsync<RequestOptions, {
    data: T
    statusCode: number
    header: Record<string, unknown>
  }>(uni.request, options)
}

export function downloadFile(options: Omit<DownloadFileOptions, 'success' | 'fail' | 'complete'>) {
  return callUniAsync<DownloadFileOptions, Record<string, unknown>>(uni.downloadFile, options)
}

export function uploadFile(options: Omit<UploadFileOptions, 'success' | 'fail' | 'complete'>) {
  return callUniAsync<UploadFileOptions, Record<string, unknown>>(uni.uploadFile, options)
}

export function connectSocket(options: Omit<ConnectSocketOptions, 'success' | 'fail' | 'complete'>) {
  return uni.connectSocket(options as ConnectSocketOptions) as unknown as UniApp.SocketTask
}

export function sendSocketMessage(data: string | ArrayBuffer) {
  return callUniAsync<{ data: string | ArrayBuffer }, unknown>(uni.sendSocketMessage as any, { data })
}

export function closeSocket(code = 1000, reason = 'normal close') {
  return callUniAsync<{ code: number; reason: string }, unknown>(uni.closeSocket as any, { code, reason })
}

export const uniNetworkApi = {
  request,
  downloadFile,
  uploadFile,
  connectSocket,
  sendSocketMessage,
  closeSocket
}
