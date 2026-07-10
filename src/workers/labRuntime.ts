export type WorkerTaskType = 'prime' | 'fibonacci' | 'sort' | 'json' | 'chunk' | 'word'

function countPrimes(limit: number) {
  let count = 0
  const primes: number[] = []
  for (let num = 2; num <= limit; num += 1) {
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
  }
  return {
    count,
    sample: primes
  }
}

function fibonacci(n: number) {
  if (n <= 1) return n
  let prev = 0
  let current = 1
  for (let index = 2; index <= n; index += 1) {
    const next = prev + current
    prev = current
    current = next
  }
  return current
}

function sortNumbers(input: string) {
  const numbers = input
    .split(/[\s,]+/)
    .map(item => Number(item))
    .filter(item => !Number.isNaN(item))
  return {
    sorted: [...numbers].sort((a, b) => a - b),
    count: numbers.length
  }
}

function formatJson(input: string) {
  const parsed = JSON.parse(input)
  return {
    keys: Object.keys(parsed),
    pretty: JSON.stringify(parsed, null, 2)
  }
}

function chunkSum(input: string) {
  const numbers = input
    .split(/[\s,]+/)
    .map(item => Number(item))
    .filter(item => !Number.isNaN(item))
  const total = numbers.reduce((sum, item) => sum + item, 0)
  const chunked: number[] = []
  for (let index = 0; index < numbers.length; index += 5) {
    chunked.push(numbers.slice(index, index + 5).reduce((sum, item) => sum + item, 0))
  }
  return {
    total,
    chunked
  }
}

function wordStats(input: string) {
  const words = input
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fa5]+/i)
    .filter(Boolean)
  const counts = new Map<string, number>()
  words.forEach(word => {
    counts.set(word, (counts.get(word) || 0) + 1)
  })
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

export function executeTask(type: WorkerTaskType, payload: string) {
  switch (type) {
    case 'prime':
      return countPrimes(Math.max(2, Number(payload) || 5000))
    case 'fibonacci':
      return {
        input: Number(payload) || 30,
        value: fibonacci(Math.max(0, Number(payload) || 30))
      }
    case 'sort':
      return sortNumbers(payload)
    case 'json':
      return formatJson(payload)
    case 'chunk':
      return chunkSum(payload)
    case 'word':
      return wordStats(payload)
  }
}
