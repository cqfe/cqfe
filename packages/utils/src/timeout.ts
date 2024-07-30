export interface AccuracyTimerRes {
  cancel: () => void;
}

/**
 * 设置精度定时器
 *
 * @param callback 回调函数，在定时器到达指定延迟后执行
 * @param delay 延迟时间，单位毫秒
 * @returns 返回一个 AccuracyTimerRes 对象，包含取消定时器的 cancel 方法
 */
export function setAccuracyTimeout(callback: () => void, delay: number): AccuracyTimerRes {
  let startTime = performance.now();
  let timer: number;

  function loop() {
    if (performance.now() - startTime >= delay) {
      callback();
      return;
    }
    timer = requestAnimationFrame(loop);
  }

  timer = requestAnimationFrame(loop);
  return {
    cancel: function () {
      cancelAnimationFrame(timer);
    },
  };
}

/**
 * 设置精度计时器间隔
 *
 * @param callback 回调函数
 * @param delay 延迟时间（毫秒）
 * @returns 返回AccuracyTimerRes对象，包含取消计时器的方法
 */
export function setAccuracyInterval(callback: () => void, delay: number): AccuracyTimerRes {
  let startTime = performance.now();
  let timer: number;

  function loop() {
    let currentTime = performance.now();
    if (currentTime - startTime >= delay) {
      callback();
      startTime = currentTime;
    }
    timer = requestAnimationFrame(loop);
  }

  timer = requestAnimationFrame(loop);

  return {
    cancel: function () {
      cancelAnimationFrame(timer);
    },
  };
}
