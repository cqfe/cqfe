export interface AccuracyTimerRes {
  cancel: () => void
}

/**
 * 设置精度定时器
 *
 * @param callback 回调函数，在定时器到达指定延迟后执行
 * @param delay 延迟时间，单位毫秒
 * @returns 返回一个 AccuracyTimerRes 对象，包含取消定时器的 cancel 方法
 */
export function setAccuracyTimeout(callback: () => void, delay: number): AccuracyTimerRes {
  const startTime = performance.now()
  let timer: number

  function loop() {
    if (performance.now() - startTime >= delay) {
      callback()
      return
    }
    timer = requestAnimationFrame(loop)
  }

  timer = requestAnimationFrame(loop)
  return {
    cancel: function () {
      cancelAnimationFrame(timer)
    },
  }
}

/**
 * 设置精度计时器间隔
 *
 * @param callback 回调函数
 * @param delay 延迟时间（毫秒）
 * @returns 返回AccuracyTimerRes对象，包含取消计时器的方法
 */
export function setAccuracyInterval(callback: () => void, delay: number): AccuracyTimerRes {
  let startTime = performance.now()
  let timer: number

  function loop() {
    const currentTime = performance.now()
    if (currentTime - startTime >= delay) {
      callback()
      startTime = currentTime
    }
    timer = requestAnimationFrame(loop)
  }

  timer = requestAnimationFrame(loop)

  return {
    cancel: function () {
      cancelAnimationFrame(timer)
    },
  }
}

/**
 * 节流函数，限制函数在一定时间内只执行一次
 *
 * @param fn 需要节流的函数
 * @param delay 节流时间间隔，单位毫秒
 * @returns 返回节流后的函数
 */
export function throttle<T>(fn: (...args: T[]) => void, delay: number) {
  let timer: NodeJS.Timeout | null
  let lastCallTime = 0

  return function <K extends T>(...args: K[]) {
    const now = Date.now()
    const remaining = delay - (now - lastCallTime)

    if (remaining <= 0) {
      fn(...args)
      lastCallTime = now
    } else if (!timer) {
      timer = setTimeout(() => {
        fn(...args)
        lastCallTime = Date.now()
        timer = null
      }, remaining)
    }
  }
}

/**
 * 防抖函数，用于延迟执行函数，避免高频触发
 *
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 返回防抖后的函数
 */
export function debounce<T>(fn: (...args: T[]) => void, delay: number) {
  let timer: NodeJS.Timeout | null

  return function <K extends T>(...args: K[]) {
    // 清除之前设置的定时器
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      // 延迟结束后执行函数
      fn(...args)
    }, delay)
  }
}
