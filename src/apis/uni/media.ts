import { callUniAsync } from './helpers'

type ChooseImageOptions = NonNullable<Parameters<typeof uni.chooseImage>[0]>
type PreviewImageOptions = NonNullable<Parameters<typeof uni.previewImage>[0]>
type SaveImageOptions = NonNullable<Parameters<typeof uni.saveImageToPhotosAlbum>[0]>
type ChooseVideoOptions = NonNullable<Parameters<typeof uni.chooseVideo>[0]>
type PreviewMediaOptions = NonNullable<Parameters<typeof uni.previewMedia>[0]>
type GetImageInfoOptions = NonNullable<Parameters<typeof uni.getImageInfo>[0]>

export function chooseImage(options: Omit<ChooseImageOptions, 'success' | 'fail' | 'complete'> = {}) {
  return callUniAsync<ChooseImageOptions, Record<string, unknown>>(uni.chooseImage, options)
}

export function previewImage(options: string | Omit<PreviewImageOptions, 'success' | 'fail' | 'complete'>) {
  const normalized = typeof options === 'string'
    ? { urls: [options], current: options }
    : options
  return callUniAsync<PreviewImageOptions, unknown>(uni.previewImage, normalized)
}

export function saveImageToPhotosAlbum(filePath: string) {
  return callUniAsync<SaveImageOptions, unknown>(uni.saveImageToPhotosAlbum, { filePath } as SaveImageOptions)
}

export function chooseVideo(options: Omit<ChooseVideoOptions, 'success' | 'fail' | 'complete'> = {}) {
  return callUniAsync<ChooseVideoOptions, Record<string, unknown>>(uni.chooseVideo, options)
}

export function previewMedia(options: Omit<PreviewMediaOptions, 'success' | 'fail' | 'complete'>) {
  return callUniAsync<PreviewMediaOptions, unknown>(uni.previewMedia, options)
}

export function getImageInfo(src: string) {
  return callUniAsync<GetImageInfoOptions, Record<string, unknown>>(uni.getImageInfo, { src } as GetImageInfoOptions)
}

export const uniMediaApi = {
  chooseImage,
  previewImage,
  saveImageToPhotosAlbum,
  chooseVideo,
  previewMedia,
  getImageInfo
}
