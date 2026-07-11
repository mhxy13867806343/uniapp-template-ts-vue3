import { callUniMethodAsync, getUniMethod } from './helpers'

export interface FileSystemManagerLike {
  readFile(options: Record<string, unknown>): void
  writeFile(options: Record<string, unknown>): void
  appendFile?(options: Record<string, unknown>): void
  mkdir?(options: Record<string, unknown>): void
  readdir?(options: Record<string, unknown>): void
  rename?(options: Record<string, unknown>): void
  copyFile?(options: Record<string, unknown>): void
  unlink?(options: Record<string, unknown>): void
  getFileInfo?(options: Record<string, unknown>): void
  stat?(options: Record<string, unknown>): void
  access?(options: Record<string, unknown>): void
}

export function hasFileSystemManagerSupport() {
  return typeof (uni as unknown as Record<string, unknown>).getFileSystemManager === 'function'
}

export function getFileSystemManager() {
  const getter = getUniMethod<() => FileSystemManagerLike>('getFileSystemManager')
  return getter()
}

function callManagerAsync<TResult = unknown>(methodName: keyof FileSystemManagerLike, options: Record<string, unknown>) {
  const manager = getFileSystemManager()
  const method = manager[methodName]
  if (typeof method !== 'function') {
    return Promise.reject(new Error(`当前平台不支持 FileSystemManager.${String(methodName)}`))
  }
  return new Promise<TResult>((resolve, reject) => {
    method.call(manager, {
      ...options,
      success: (result: TResult) => resolve(result),
      fail: (error: unknown) => reject(error)
    })
  })
}

export function saveFile(tempFilePath: string) {
  return callUniMethodAsync<{ tempFilePath: string }, { savedFilePath: string }>('saveFile', { tempFilePath })
}

export function getSavedFileList() {
  return callUniMethodAsync<Record<string, never>, { fileList: Array<Record<string, unknown>> }>('getSavedFileList', {})
}

export function getSavedFileInfo(filePath: string) {
  return callUniMethodAsync<{ filePath: string }, Record<string, unknown>>('getSavedFileInfo', { filePath })
}

export function removeSavedFile(filePath: string) {
  return callUniMethodAsync<{ filePath: string }, unknown>('removeSavedFile', { filePath })
}

export function openDocument(filePath: string, fileType?: string) {
  return callUniMethodAsync<{ filePath: string; fileType?: string }, unknown>('openDocument', { filePath, fileType })
}

export function readFile(filePath: string, encoding?: string) {
  return callManagerAsync<{ data: string | ArrayBuffer }>('readFile', { filePath, encoding })
}

export function writeFile(filePath: string, data: string | ArrayBuffer, encoding?: string) {
  return callManagerAsync('writeFile', { filePath, data, encoding })
}

export function appendFile(filePath: string, data: string | ArrayBuffer, encoding?: string) {
  return callManagerAsync('appendFile', { filePath, data, encoding })
}

export function mkdir(dirPath: string, recursive = true) {
  return callManagerAsync('mkdir', { dirPath, recursive })
}

export function readdir(dirPath: string) {
  return callManagerAsync<{ files: string[] }>('readdir', { dirPath })
}

export function rename(oldPath: string, newPath: string) {
  return callManagerAsync('rename', { oldPath, newPath })
}

export function copyFile(srcPath: string, destPath: string) {
  return callManagerAsync('copyFile', { srcPath, destPath })
}

export function unlink(filePath: string) {
  return callManagerAsync('unlink', { filePath })
}

export function getFileInfo(filePath: string, digestAlgorithm?: string) {
  return callManagerAsync<Record<string, unknown>>('getFileInfo', { filePath, digestAlgorithm })
}

export function stat(path: string, recursive = false) {
  return callManagerAsync<Record<string, unknown>>('stat', { path, recursive })
}

export function access(path: string) {
  return callManagerAsync('access', { path })
}

export const uniFileSystemApi = {
  hasFileSystemManagerSupport,
  getFileSystemManager,
  saveFile,
  getSavedFileList,
  getSavedFileInfo,
  removeSavedFile,
  openDocument,
  readFile,
  writeFile,
  appendFile,
  mkdir,
  readdir,
  rename,
  copyFile,
  unlink,
  getFileInfo,
  stat,
  access
}
