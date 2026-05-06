export interface ValidateResult {
  valid: boolean
  message: string
}

export type Validator = (value: unknown) => ValidateResult

export function createValidateResult(valid: boolean, message = ''): ValidateResult {
  return { valid, message }
}

export function isEmpty(value: unknown) {
  if (Array.isArray(value)) return value.length === 0
  return value === undefined || value === null || String(value).trim() === ''
}

export function isPhone(value: string) {
  return /^1[3-9]\d{9}$/u.test(value)
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value)
}

export function isUrl(value: string) {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/iu.test(value)
}

export function isChineseName(value: string) {
  return /^[\u4e00-\u9fa5·]{2,20}$/u.test(value)
}

export function isIdCard(value: string) {
  const code = value.toUpperCase()
  if (!/^\d{17}[\dX]$/u.test(code)) return false

  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checks = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  const sum = weights.reduce((total, weight, index) => total + Number(code[index]) * weight, 0)
  return checks[sum % 11] === code[17]
}

export function isBankCard(value: string) {
  const card = value.replace(/\s+/gu, '')
  if (!/^\d{12,19}$/u.test(card)) return false

  let sum = 0
  let shouldDouble = false
  for (let index = card.length - 1; index >= 0; index -= 1) {
    let digit = Number(card[index])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

export function isPlateNumber(value: string) {
  return /^[\u4e00-\u9fa5][A-Z][A-Z0-9挂学警港澳新能源]{5,6}$/u.test(value)
}

export function isStrongPassword(value: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/u.test(value)
}

export function isNumberLike(value: unknown) {
  return !isEmpty(value) && !Number.isNaN(Number(value))
}

export function required(message = '必填项'): Validator {
  return (value) => createValidateResult(!isEmpty(value), message)
}

export function pattern(regexp: RegExp, message = '格式不正确'): Validator {
  return (value) => createValidateResult(regexp.test(String(value || '')), message)
}

export function minLength(length: number, message = `至少 ${length} 个字符`): Validator {
  return (value) => createValidateResult(String(value || '').length >= length, message)
}

export function maxLength(length: number, message = `最多 ${length} 个字符`): Validator {
  return (value) => createValidateResult(String(value || '').length <= length, message)
}

export function composeValidators(value: unknown, validators: Validator[]) {
  for (const validator of validators) {
    const result = validator(value)
    if (!result.valid) return result
  }
  return createValidateResult(true)
}
