import { onMounted, onUnmounted, ref, onBeforeMount } from 'vue'

/**
 * 将像素值转换为 rem 值
 *
 * @param px 像素值
 * @returns 转换后的 rem 值，保留四位小数
 */
export function px2rem(px: number) {
  return `${(px / 16).toFixed(4)}rem`
}

/**
 * 设置并使用rem单位的辅助函数
 *
 * @param baseFontSize 基础字体大小，默认为16px
 * @param baseWidth 基础宽度，默认为1920px
 * @param baseHeight 基础高度，默认为1080px
 *
 * @returns 包含height、width、fontSize、scale的对象, scale为最终缩放比例(使用宽高更小的),width,hight分别为宽高缩放比例
 */
export function useRem(baseFontSize = 16, baseWidth = 1920, baseHeight = 1080) {
  const scaleInfo = ref({
    height: 1,
    width: 1,
    scale: 1,
    fontSize: baseFontSize,
  })

  // 设置根元素字体大小
  function setRootFontSize() {
    const scaleHeight = Number((document.documentElement.clientHeight / baseHeight).toFixed(4))
    const scaleWidth = Number((document.documentElement.clientWidth / baseWidth).toFixed(4))
    const scale = Math.min(scaleHeight, scaleWidth)
    scaleInfo.value = {
      height: scaleHeight,
      width: scaleWidth,
      scale,
      fontSize: scale * baseFontSize,
    }
    document.documentElement.style.fontSize = scaleInfo.value.fontSize + 'px'
  }

  onBeforeMount(() => {
    setRootFontSize()
  })

  // resize后重新设置rem
  onMounted(() => {
    window.addEventListener('resize', setRootFontSize)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', setRootFontSize)
  })

  return {
    scaleInfo,
  }
}
