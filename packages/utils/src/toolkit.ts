/**
 * 从对象中挑选指定键的值并返回新对象
 *
 * @param obj 原始对象
 * @param keys 需要挑选的键名数组
 * @returns 返回包含指定键的新对象
 */
export function pick(obj: Record<string, unknown>, keys: string[]) {
  return keys.reduce(
    (acc, key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        acc[key] = obj[key]
      }
      return acc
    },
    {} as Record<string, unknown>,
  )
}

/**
 * 去除数组中的假值元素
 *
 * @param arr 待处理的数组
 * @returns 返回去除假值元素后的新数组
 */
export function compact(arr: Array<unknown>) {
  return arr.filter(Boolean)
}

/**
 * 忽略对象中指定键的属性，返回一个新的对象
 *
 * @param obj 需要忽略属性的对象
 * @param keysToOmit 需要忽略的键的数组
 * @returns 返回一个新的对象，其中不包含需要忽略的属性
 */
export function omit(obj: Record<string, unknown>, keysToOmit: string[]) {
  if (!obj || !keysToOmit) {
    return obj
  }
  const result = { ...obj }
  keysToOmit.forEach((key) => {
    delete result[key]
  })
  return result
}
