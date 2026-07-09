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
