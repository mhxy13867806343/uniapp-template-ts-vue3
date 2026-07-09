/**
 * Python/Rust 风格高频开发辅助工具函数
 */

/**
 * 1. Python/Rust 风格 zip：将两个数组打包成元组对数组
 * @example zip([1, 2], ['a', 'b']) => [[1, 'a'], [2, 'b']]
 */
export function zip<T, U>(arr1: T[], arr2: U[]): Array<[T, U]> {
  const length = Math.min(arr1.length, arr2.length)
  const result: Array<[T, U]> = []
  for (let i = 0; i < length; i++) {
    result.push([arr1[i], arr2[i]])
  }
  return result
}

/**
 * 2. Python 风格 range：生成数字等差列表
 * @example range(1, 5) => [1, 2, 3, 4]
 * @example range(0, 10, 2) => [0, 2, 4, 6, 8]
 */
export function range(start: number, end?: number, step = 1): number[] {
  const actualStart = end === undefined ? 0 : start
  const actualEnd = end === undefined ? start : end
  const result: number[] = []
  
  if (step === 0) return result
  
  if (step > 0) {
    for (let i = actualStart; i < actualEnd; i += step) {
      result.push(i)
    }
  } else {
    for (let i = actualStart; i > actualEnd; i += step) {
      result.push(i)
    }
  }
  return result
}

/**
 * 3. Rust 风格 chunks：将数组拆分为指定大小的块
 * @example chunk([1, 2, 3, 4, 5], 2) => [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return []
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

/**
 * 4. 集合按键值分组 (GroupBy)
 * @example groupBy([{type: 'a', val: 1}, {type: 'b', val: 2}, {type: 'a', val: 3}], x => x.type)
 */
export function groupBy<T>(arr: T[], fn: (item: T) => string | number): Record<string | number, T[]> {
  return arr.reduce<Record<string | number, T[]>>((acc, item) => {
    const key = fn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}

/**
 * 5. Python 风格 title()：将每个单词的首字母大写，其他小写
 * @example titleCase('hello world FROM typescript') => 'Hello World From Typescript'
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * 6. 字符串 Slugify 化：生成符合 URL 友好的短名
 * @example slugify('Hello World! 2026') => 'hello-world-2026'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/gu, '')
    .replace(/[\s_-]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
}

/**
 * 7. Rust 风格 Result 安全运行：包裹可能抛出异常的同步函数，返回安全的包含 ok 状态的结果集
 * @example const res = safeRun(() => JSON.parse(str))
 */
export type SafeRunResult<T> = { ok: true; value: T } | { ok: false; error: unknown }

export function safeRun<T>(fn: () => T): SafeRunResult<T> {
  try {
    return { ok: true, value: fn() }
  } catch (error) {
    return { ok: false, error }
  }
}

/**
 * 8. 根据特征键值去重
 * @example uniqBy([{id: 1}, {id: 2}, {id: 1}], x => x.id) => [{id: 1}, {id: 2}]
 */
export function uniqBy<T, K>(arr: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>()
  return arr.filter((item) => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * 9. 过滤清除假值 (Compact)
 * @example compact([0, 1, false, 2, '', 3, null]) => [1, 2, 3]
 */
export function compact<T>(arr: Array<T | null | undefined | false | 0 | ''>): T[] {
  return arr.filter(Boolean) as T[]
}

/**
 * 10. 数组扁平化 (Flatten)
 * @example flatten([1, [2, [3, [4]], 5]]) => [1, 2, 3, 4, 5]
 */
export function flatten<T>(arr: any[]): T[] {
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []) as T[]
}

/**
 * 11. 数组差集 (difference)
 * @example difference([1, 2, 3], [2, 3, 4]) => [1]
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2)
  return arr1.filter((item) => !set2.has(item))
}

/**
 * 12. 数组交集 (intersection)
 * @example intersection([1, 2, 3], [2, 3, 4]) => [2, 3]
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2)
  return arr1.filter((item) => set2.has(item))
}

/**
 * 13. 数组并集 (union)
 * @example union([1, 2], [2, 3], [3, 4]) => [1, 2, 3, 4]
 */
export function union<T>(...arrs: T[][]): T[] {
  const set = new Set<T>()
  arrs.forEach((arr) => arr.forEach((item) => set.add(item)))
  return Array.from(set)
}

/**
 * 14. 判定划分 (partition)
 * @example partition([1, 2, 3, 4], x => x % 2 === 0) => [[2, 4], [1, 3]]
 */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = []
  const fail: T[] = []
  arr.forEach((item) => {
    if (predicate(item)) pass.push(item)
    else fail.push(item)
  })
  return [pass, fail]
}

/**
 * 15. 循环重复数组 (cycle)
 * @example cycle([1, 2], 3) => [1, 2, 1, 2, 1, 2]
 */
export function cycle<T>(arr: T[], count: number): T[] {
  if (arr.length === 0 || count <= 0) return []
  const result: T[] = []
  for (let i = 0; i < count; i++) {
    result.push(...arr)
  }
  return result
}

/**
 * 16. 截取前 N 项 (take)
 * @example take([1, 2, 3], 2) => [1, 2]
 */
export function take<T>(arr: T[], n: number): T[] {
  return arr.slice(0, Math.max(0, n))
}

/**
 * 17. 丢弃前 N 项 (drop)
 * @example drop([1, 2, 3], 1) => [2, 3]
 */
export function drop<T>(arr: T[], n: number): T[] {
  return arr.slice(Math.max(0, n))
}

/**
 * 18. 数值钳夹限制 (clamp)
 * @example clamp(10, 0, 5) => 5
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * 19. 随机选取一项 (sample)
 * @example sample([1, 2, 3]) => 随机 1 | 2 | 3
 */
export function sample<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 20. 随机洗牌 (shuffle)
 * @example shuffle([1, 2, 3, 4, 5]) => 随机乱序数组
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

/**
 * 21. 对象键值反转 (invert)
 * @example invert({a: '1', b: '2'}) => { '1': 'a', '2': 'b' }
 */
export function invert(obj: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  Object.entries(obj).forEach(([key, value]) => {
    result[value] = key
  })
  return result
}

/**
 * 22. 链式路径取值 (get)
 * @example get({a: {b: {c: 1}}}, 'a.b.c') => 1
 */
export function get(obj: any, path: string, defaultValue: any = undefined): any {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue
    current = current[key]
  }
  return current === undefined ? defaultValue : current
}

/**
 * 23. 元素计数分类 (countBy)
 * @example countBy(['a', 'b', 'a'], x => x) => { a: 2, b: 1 }
 */
export function countBy<T>(arr: T[], fn: (item: T) => string | number): Record<string | number, number> {
  return arr.reduce<Record<string | number, number>>((acc, item) => {
    const key = fn(item)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

/**
 * 24. 数值求和 (sum)
 * @example sum([1, 2, 3]) => 6
 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0)
}

/**
 * 25. 平均值计算 (mean)
 * @example mean([1, 2, 3]) => 2
 */
export function mean(arr: number[]): number {
  return arr.length === 0 ? 0 : sum(arr) / arr.length
}

/**
 * 26. 异步操作重试 (retry)
 */
export async function retry<T>(fn: () => Promise<T>, retries = 3, delayMs = 500): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    await new Promise((resolve) => setTimeout(resolve, delayMs))
    return retry(fn, retries - 1, delayMs)
  }
}

/**
 * 27. 只执行一次包装 (once)
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false
  let result: any
  return function (this: any, ...args: any[]) {
    if (!called) {
      called = true
      result = fn.apply(this, args)
    }
    return result
  } as any
}

/**
 * 28. 驼峰命名转换 (camelCase)
 * @example camelCase('hello-world') => 'helloWorld'
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-\s_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase())
}

/**
 * 29. 短横线命名转换 (kebabCase)
 * @example kebabCase('helloWorld') => 'hello-world'
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * 30. 函数节流防抖控制 (throttle)
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): T {
  let lastFunc: any
  let lastRan: any
  return function (this: any, ...args: any[]) {
    const context = this
    if (!lastRan) {
      fn.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          fn.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  } as any
}
