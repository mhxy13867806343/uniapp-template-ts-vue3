import { callUniAsync } from './helpers'

export function hideKeyboard() {
  const hide = (uni as any).hideKeyboard
  if (typeof hide !== 'function') {
    return Promise.reject(new Error('当前平台不支持 hideKeyboard'))
  }
  return callUniAsync<Record<string, never>, unknown>(hide, {})
}

export function onKeyboardHeightChange(callback: (result: { height: number; duration: number }) => void) {
  const onChange = (uni as any).onKeyboardHeightChange
  if (typeof onChange === 'function') onChange(callback)
}

export function offKeyboardHeightChange(callback?: (result: { height: number; duration: number }) => void) {
  const offChange = (uni as any).offKeyboardHeightChange
  if (typeof offChange === 'function') offChange(callback)
}

export const uniKeyboardApi = {
  hideKeyboard,
  onKeyboardHeightChange,
  offKeyboardHeightChange
}
