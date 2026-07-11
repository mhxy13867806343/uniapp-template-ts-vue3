import { callUniMethodAsync } from './helpers'

export interface PhoneContactOptions extends Record<string, unknown> {
  firstName: string
  mobilePhoneNumber?: string
  lastName?: string
  nickName?: string
  remark?: string
  organization?: string
  title?: string
  email?: string
  addressCountry?: string
  addressState?: string
  addressCity?: string
  addressStreet?: string
  addressPostalCode?: string
  weChatNumber?: string
}

export function addPhoneContact(options: PhoneContactOptions) {
  return callUniMethodAsync<PhoneContactOptions, unknown>('addPhoneContact', options)
}

export function chooseContact() {
  return callUniMethodAsync<Record<string, never>, Record<string, unknown>>('chooseContact', {})
}

export const uniContactApi = {
  addPhoneContact,
  chooseContact
}
