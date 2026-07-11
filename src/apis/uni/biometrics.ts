import { callUniMethodAsync } from './helpers'

export type SoterAuthMode = 'fingerPrint' | 'facial'

export function checkIsSupportSoterAuthentication() {
  return callUniMethodAsync<Record<string, never>, { supportMode: SoterAuthMode[] }>('checkIsSupportSoterAuthentication', {})
}

export function checkIsSoterEnrolledInDevice(checkAuthMode: SoterAuthMode) {
  return callUniMethodAsync<{ checkAuthMode: SoterAuthMode }, Record<string, unknown>>('checkIsSoterEnrolledInDevice', {
    checkAuthMode
  })
}

export function startSoterAuthentication(
  requestAuthModes: SoterAuthMode[],
  challenge = 'uniapp-template-auth',
  authContent = '请完成生物认证'
) {
  return callUniMethodAsync<{
    requestAuthModes: SoterAuthMode[]
    challenge: string
    authContent: string
  }, Record<string, unknown>>('startSoterAuthentication', {
    requestAuthModes,
    challenge,
    authContent
  })
}

export async function authenticateByFingerprint(authContent = '请验证指纹') {
  return startSoterAuthentication(['fingerPrint'], 'uniapp-template-fingerprint', authContent)
}

export async function authenticateByFacial(authContent = '请进行人脸识别') {
  return startSoterAuthentication(['facial'], 'uniapp-template-facial', authContent)
}

export const uniBiometricsApi = {
  checkIsSupportSoterAuthentication,
  checkIsSoterEnrolledInDevice,
  startSoterAuthentication,
  authenticateByFingerprint,
  authenticateByFacial
}
