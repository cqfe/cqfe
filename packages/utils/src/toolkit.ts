/**
 * 从对象中挑选指定键的值并返回新对象
 * @author <李川>
 *
 * @param obj 原始对象
 * @param keys 需要挑选的键名数组
 * @returns 返回包含指定键的新对象
 */
export function pick(obj: Record<string, unknown>, keys: string[]) {
  return keys.reduce(
    (acc, key) => {
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
 * @author <李川>
 *
 * @param arr 待处理的数组
 * @returns 返回去除假值元素后的新数组
 */
export function compact(arr: Array<unknown>) {
  return arr.filter(Boolean)
}

/**
 * 忽略对象中指定键的属性，返回一个新的对象
 * @author <李川>
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

/**
 * 尝试执行一个函数，返回其返回值或错误信息。
 * @author <李川>
 *
 * @param fn 需要执行的函数。
 * @returns 返回一个元组，包含执行结果或错误信息。
 * 如果函数返回值为 Promise，则返回一个 Promise，解析为包含执行结果或错误信息的元组。
 * 如果函数返回值为非 Promise 类型，则直接返回包含执行结果或错误信息的元组。
 *
 * @template Args 函数参数类型。
 * @template Return 函数返回类型。
 */
export function tryIt<Args extends any[], Return>(fn: (...args: Args) => Return) {
  return (
    ...args: Args
  ): Return extends Promise<any>
    ? Promise<[undefined, Error] | [Awaited<Return>, undefined]>
    : [undefined, Error] | [Return, undefined] => {
    try {
      const res = fn(...args)
      if (res instanceof Promise) {
        return res.then((r) => [r, undefined]).catch((err) => [undefined, err]) as Return extends Promise<any>
          ? Promise<[undefined, Error] | [Awaited<Return>, undefined]>
          : [undefined, Error] | [Return, undefined]
      }
      return [res, undefined] as Return extends Promise<any>
        ? Promise<[undefined, Error] | [Awaited<Return>, undefined]>
        : [undefined, Error] | [Return, undefined]
    } catch (err) {
      return [undefined, err] as Return extends Promise<any>
        ? Promise<[undefined, Error] | [Awaited<Return>, undefined]>
        : [undefined, Error] | [Return, undefined]
    }
  }
}
