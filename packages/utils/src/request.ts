/**
 * 重试函数
 * @author <李川>
 *
 * @param fn 需要重试的 Promise 函数
 * @param interval 每次重试的间隔时间（毫秒）
 * @param max 最大重试次数
 *
 * @returns 返回一个新的 Promise，当 fn 执行成功时 resolve，当达到最大重试次数时 reject
 */
export function retry<T>(fn: () => Promise<T>, interval: number, max: number) {
  return new Promise((resolve, reject) => {
    let count = 0
    const loop = () => {
      fn()
        .then((res: T) => resolve(res))
        .catch((err) => {
          count++
          if (count >= max) return reject(err)
          setTimeout(loop, interval)
        })
    }
    loop()
  })
}
