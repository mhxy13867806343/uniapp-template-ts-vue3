export type WorkerTaskType = 'prime' | 'fibonacci' | 'sort' | 'json' | 'chunk' | 'word'
export const TASK_CANCELLED_MESSAGE = '__TASK_CANCELLED__'

export interface TaskControl {
  onProgress?: (progress: number, message?: string) => void
  isCancelled?: () => boolean
}

function reportProgress(control: TaskControl | undefined, progress: number, message?: string) {
  control?.onProgress?.(Math.max(0, Math.min(100, Math.round(progress))), message)
}

function ensureNotCancelled(control: TaskControl | undefined) {
  if (control?.isCancelled?.()) {
    throw new Error(TASK_CANCELLED_MESSAGE)
  }
}

function nextTick() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

async function countPrimes(limit: number, control?: TaskControl) {
  let count = 0
  const primes: number[] = []
  const total = Math.max(1, limit - 1)
  for (let num = 2; num <= limit; num += 1) {
    ensureNotCancelled(control)
    let isPrime = true
    for (let factor = 2; factor * factor <= num; factor += 1) {
      if (num % factor === 0) {
        isPrime = false
        break
      }
    }
    if (isPrime) {
      count += 1
      if (primes.length < 12) primes.push(num)
    }
    if (num % 200 === 0 || num === limit) {
      reportProgress(control, ((num - 1) / total) * 100, `已扫描到 ${num}`)
      await nextTick()
    }
  }
  return {
    count,
    sample: primes
  }
}

async function fibonacci(n: number, control?: TaskControl) {
  if (n <= 1) return n
  let prev = 0
  let current = 1
  for (let index = 2; index <= n; index += 1) {
    ensureNotCancelled(control)
    const next = prev + current
    prev = current
    current = next
    reportProgress(control, (index / n) * 100, `已递推到第 ${index} 项`)
    await nextTick()
  }
  return current
}

async function sortNumbers(input: string, control?: TaskControl) {
  const numbers = input
    .split(/[\s,]+/)
    .map(item => Number(item))
    .filter(item => !Number.isNaN(item))
  reportProgress(control, 25, `已解析 ${numbers.length} 个数字`)
  await nextTick()
  ensureNotCancelled(control)
  reportProgress(control, 60, '正在排序')
  await nextTick()
  return {
    sorted: [...numbers].sort((a, b) => a - b),
    count: numbers.length
  }
}

async function formatJson(input: string, control?: TaskControl) {
  reportProgress(control, 20, '正在解析 JSON')
  await nextTick()
  const parsed = JSON.parse(input)
  ensureNotCancelled(control)
  reportProgress(control, 70, '正在格式化 JSON')
  await nextTick()
  return {
    keys: Object.keys(parsed),
    pretty: JSON.stringify(parsed, null, 2)
  }
}

async function chunkSum(input: string, control?: TaskControl) {
  const numbers = input
    .split(/[\s,]+/)
    .map(item => Number(item))
    .filter(item => !Number.isNaN(item))
  const total = numbers.reduce((sum, item) => sum + item, 0)
  const chunked: number[] = []
  const chunkSize = 5
  const totalChunks = Math.max(1, Math.ceil(numbers.length / chunkSize))
  for (let index = 0; index < numbers.length; index += chunkSize) {
    ensureNotCancelled(control)
    chunked.push(numbers.slice(index, index + 5).reduce((sum, item) => sum + item, 0))
    const currentChunk = Math.floor(index / chunkSize) + 1
    reportProgress(control, (currentChunk / totalChunks) * 100, `已处理 ${currentChunk}/${totalChunks} 个分块`)
    await nextTick()
  }
  return {
    total,
    chunked
  }
}

async function wordStats(input: string, control?: TaskControl) {
  const words = input
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fa5]+/i)
    .filter(Boolean)
  const counts = new Map<string, number>()
  for (let index = 0; index < words.length; index += 1) {
    ensureNotCancelled(control)
    const word = words[index]
    counts.set(word, (counts.get(word) || 0) + 1)
    if ((index + 1) % 3 === 0 || index === words.length - 1) {
      reportProgress(control, ((index + 1) / Math.max(1, words.length)) * 100, `已统计 ${index + 1} 个词`)
      await nextTick()
    }
  }
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }))
  return {
    total: words.length,
    unique: counts.size,
    top
  }
}

export async function executeTask(type: WorkerTaskType, payload: string, control?: TaskControl) {
  switch (type) {
    case 'prime':
      return countPrimes(Math.max(2, Number(payload) || 5000), control)
    case 'fibonacci':
      reportProgress(control, 10, '开始计算 Fibonacci')
      await nextTick()
      return {
        input: Number(payload) || 30,
        value: await fibonacci(Math.max(0, Number(payload) || 30), control)
      }
    case 'sort':
      return sortNumbers(payload, control)
    case 'json':
      return formatJson(payload, control)
    case 'chunk':
      return chunkSum(payload, control)
    case 'word':
      return wordStats(payload, control)
  }
}
