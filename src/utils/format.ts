import dayjs, { type ConfigType } from 'dayjs'

export type DateInput = ConfigType

export interface VisualLengthOptions {
  ascii?: number
  cjk?: number
  fullWidth?: number
  emoji?: number
  special?: number
}

const DEFAULT_VISUAL_LENGTH_OPTIONS: Required<VisualLengthOptions> = {
  ascii: 1,
  cjk: 2,
  fullWidth: 2,
  emoji: 2,
  special: 2
}

const CHINESE_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const SECTION_UNITS = ['', '万', '亿', '兆']
const INNER_UNITS = ['', '十', '百', '千']

export function formatDateTime(value: DateInput, template = 'YYYY-MM-DD HH:mm:ss') {
  if (!value) return ''
  const date = dayjs(value)
  return date.isValid() ? date.format(template) : ''
}

export function formatDate(value: DateInput, template = 'YYYY-MM-DD') {
  return formatDateTime(value, template)
}

export function formatTime(value: DateInput, template = 'HH:mm') {
  return formatDateTime(value, template)
}

export function formatNumber(value: number | string, digits = 0) {
  const number = Number(value)
  if (Number.isNaN(number)) return '0'
  return number.toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
}

export function formatCurrency(value: number | string, prefix = '¥') {
  return `${prefix}${formatNumber(value, 2)}`
}

export function formatPercent(value: number | string, digits = 2) {
  const number = Number(value)
  if (Number.isNaN(number)) return '0%'
  return `${(number * 100).toFixed(digits)}%`
}

export function formatCompactNumber(value: number | string, digits = 1) {
  const number = Number(value)
  if (Number.isNaN(number)) return '0'
  const abs = Math.abs(number)
  if (abs >= 100000000) return `${(number / 100000000).toFixed(digits)}亿`
  if (abs >= 10000) return `${(number / 10000).toFixed(digits)}万`
  return formatNumber(number)
}

export function formatFileSize(value: number | string, digits = 2) {
  const bytes = Number(value)
  if (Number.isNaN(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : digits)} ${units[index]}`
}

export function formatDuration(seconds: number | string) {
  const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const restSeconds = totalSeconds % 60
  const values = hours > 0 ? [hours, minutes, restSeconds] : [minutes, restSeconds]
  return values.map((item) => String(item).padStart(2, '0')).join(':')
}

export function formatRelativeTime(value: DateInput, now: DateInput = Date.now()) {
  const date = dayjs(value)
  const current = dayjs(now)
  if (!date.isValid() || !current.isValid()) return ''

  const diffSeconds = current.diff(date, 'second')
  const absSeconds = Math.abs(diffSeconds)
  const suffix = diffSeconds >= 0 ? '前' : '后'

  if (absSeconds < 60) return '刚刚'
  if (absSeconds < 3600) return `${Math.floor(absSeconds / 60)} 分钟${suffix}`
  if (absSeconds < 86400) return `${Math.floor(absSeconds / 3600)} 小时${suffix}`
  if (absSeconds < 2592000) return `${Math.floor(absSeconds / 86400)} 天${suffix}`
  if (absSeconds < 31536000) return `${Math.floor(absSeconds / 2592000)} 个月${suffix}`
  return `${Math.floor(absSeconds / 31536000)} 年${suffix}`
}

export function maskText(value: string, start = 3, end = 4, mask = '****') {
  if (!value) return ''
  if (value.length <= start + end) return value
  return `${value.slice(0, start)}${mask}${value.slice(-end)}`
}

export function maskPhone(value: string) {
  return maskText(value.replace(/\s+/gu, ''), 3, 4)
}

export function maskIdCard(value: string) {
  return maskText(value.replace(/\s+/gu, ''), 6, 4, '********')
}

export function formatBankCard(value: string, separator = ' ') {
  return value.replace(/\s+/gu, '').replace(/(.{4})/gu, `$1${separator}`).trim()
}

export function maskBankCard(value: string) {
  const card = value.replace(/\s+/gu, '')
  if (card.length <= 8) return card
  return `${card.slice(0, 4)} **** **** ${card.slice(-4)}`
}

function convertSectionToChinese(value: number) {
  let section = value
  let unitIndex = 0
  let zero = true
  let result = ''

  while (section > 0) {
    const digit = section % 10
    if (digit === 0) {
      if (!zero) {
        zero = true
        result = CHINESE_DIGITS[0] + result
      }
    } else {
      zero = false
      result = CHINESE_DIGITS[digit] + INNER_UNITS[unitIndex] + result
    }
    unitIndex += 1
    section = Math.floor(section / 10)
  }

  return result.replace(/零+$/u, '')
}

export function numberToChinese(value: number | string) {
  const number = Number(value)
  if (Number.isNaN(number)) return ''
  if (number === 0) return CHINESE_DIGITS[0]

  const isNegative = number < 0
  const [integerPart, decimalPart] = String(Math.abs(number)).split('.')
  let integer = Number(integerPart)
  let unitIndex = 0
  let needZero = false
  let result = ''

  while (integer > 0) {
    const section = integer % 10000
    if (section === 0) {
      needZero = true
    } else {
      let sectionText = convertSectionToChinese(section)
      if (needZero) {
        sectionText = CHINESE_DIGITS[0] + sectionText
        needZero = false
      }
      result = `${sectionText}${SECTION_UNITS[unitIndex]}${result}`
    }
    unitIndex += 1
    integer = Math.floor(integer / 10000)
  }

  result = result.replace(/^一十/u, '十').replace(/零+/gu, '零').replace(/零$/u, '')

  if (decimalPart) {
    const decimalText = Array.from(decimalPart)
      .map((item) => CHINESE_DIGITS[Number(item)] || '')
      .join('')
    result = `${result}点${decimalText}`
  }

  return `${isNegative ? '负' : ''}${result}`
}

export function getSpecialLength(value: string, options: VisualLengthOptions = {}) {
  const weights = { ...DEFAULT_VISUAL_LENGTH_OPTIONS, ...options }

  return Array.from(value).reduce((total, char) => {
    if (/[\u{1f300}-\u{1faff}]/u.test(char)) return total + weights.emoji
    if (/[\u4e00-\u9fa5]/u.test(char)) return total + weights.cjk
    if (/[\uff00-\uffef]/u.test(char)) return total + weights.fullWidth
    if (/^[a-zA-Z0-9\s]$/u.test(char)) return total + weights.ascii
    return total + weights.special
  }, 0)
}

export function truncateBySpecialLength(value: string, maxLength: number, suffix = '...') {
  let length = 0
  let result = ''

  for (const char of Array.from(value)) {
    const nextLength = getSpecialLength(char)
    if (length + nextLength > maxLength) return `${result}${suffix}`
    length += nextLength
    result += char
  }

  return result
}

export function formatEmpty(value: unknown, fallback = '--') {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}
