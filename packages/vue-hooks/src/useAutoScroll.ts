/*
 * @description: 元素自动滚动
 * @author: 李川
 * @update: 2024-08-15 09:05:07
 */
import { Ref, ref } from 'vue'
/**
 * 使用自动滚动函数
 *
 * @param elRef DOM元素引用
 * @param interval 滚动间隔时间，默认为100ms
 * @param step 滚动步长，默认为2px
 * @returns 包含滚动开始、停止、状态的对象
 */
export function useAutoScroll(elRef: Ref<Element>, interval = 100, step = 2) {
  let timer: NodeJS.Timeout
  const status = ref(false)

  // 暂停滚动(鼠标hover时)
  function pause() {
    clearInterval(timer)
    if (!elRef.value) return
    elRef.value.addEventListener('mouseout', start)
    elRef.value.removeEventListener('mouseover', pause)
  }

  // 开始滚动
  function start() {
    if (!elRef.value || elRef.value.scrollHeight === elRef.value.clientHeight) return
    status.value = true
    clearInterval(timer)
    timer = setInterval(() => {
      if (!elRef.value) return
      if (elRef.value.scrollHeight <= elRef.value.scrollTop + elRef.value.clientHeight + step) {
        elRef.value.scrollTop = -90
      } else {
        elRef.value.scrollTo({
          top: elRef.value.scrollTop + step,
          behavior: 'smooth', // 平滑滚动
        })
      }
    }, interval)

    elRef.value.removeEventListener('mouseout', start)
    elRef.value.addEventListener('mouseover', pause)
  }

  // 停止滚动
  function stop() {
    clearInterval(timer)
    status.value = false
    elRef.value.removeEventListener('mouseover', pause)
    elRef.value.removeEventListener('mouseout', start)
  }

  return {
    scrollStart: start,
    scrollStop: stop,
    scrollStatus: status,
  }
}
