/*
 * @description: JessibucaPro播放器封装，可进行标注
 * @author: 李川
 * @update: 2024-08-15 09:03:52
 */
import { onBeforeMount, shallowRef } from 'vue'
import { loadScript } from '@cqfe/utils'

/**
 * 初始化并管理播放器
 *
 * @param elementId 播放器的容器元素ID
 * @param playerUrl 播放器js URL
 * @param decoderUrl 解码器js URL
 *
 * @returns 返回一个包含播放器相关方法和属性的对象
 */
export function usePlayer(elementId: string, jsUrl: string, decoderUrl: string) {
  const controller = shallowRef()
  const player = shallowRef()
  const videoInfo = shallowRef({
    height: 1,
    width: 1,
  })
  const containerInfo = shallowRef({
    height: 1,
    width: 1,
  })
  const scaleInfo = shallowRef({
    height: 1,
    width: 1,
  })
  const ctx = shallowRef()

  // 初始化播放器
  function initPlayer(options: Record<string, any> = {}) {
    return loadScript(jsUrl).then(() => {
      controller.value = new AbortController()
      player.value = new (window as any).JessibucaPro({
        container: document.getElementById(elementId),
        videoBuffer: 0.1,
        videoBufferDelay: 0.2,
        useSIMD: true,
        isFlv: true,
        isResize: false,
        text: '',
        loadingText: '加载中',
        debug: false,
        decoder: decoderUrl,
        showBandwidth: true, // 显示网速
        operateBtns: {
          fullscreen: true,
          screenshot: true,
          play: true,
          audio: true,
          record: true,
        },
        forceNoOffscreen: true,
        isNotMute: false,
        hasAudio: false,
        heartTimeout: 100,
        ...options,
      })
      player.value?.on('videoInfo', (data: { height: number; width: number }) => {
        videoInfo.value = data
        console.debug('videoInfo', data)
        setMarkContainer()
      })
      player.value?.on('fullscreen', function (flag: boolean) {
        const dom = document.getElementById('people-num')
        if (flag && dom) {
          dom.style.transform = 'scale(2)'
        } else if (!flag && dom) {
          dom.style.transform = 'scale(1)'
        }
        setTimeout(() => {
          setMarkContainer()
        }, 1000)
      })
    })
  }

  // 开始播放
  function startPlay(url: string) {
    if (!player.value) return console.error('player is null, please initPlayer first')
    player.value.play(url)
  }

  // 销毁播放器
  async function destroyPlayer() {
    controller.value?.abort()
    await player.value?.destroy()
    controller.value = null
    player.value = null
  }

  // 添加标注层容器
  function setMarkContainer() {
    const playerDom = document.getElementById(elementId)
    if (!playerDom) return console.warn('playerDom is null')
    // 如果存在则移除mark层
    if (playerDom.querySelector('#video-mark-container')) {
      playerDom.removeChild(playerDom.querySelector('#video-mark-container') as Element)
    }
    // 查找video元素获取宽高
    const videoDom = (document.getElementById(elementId) as Element).querySelector('video')
    if (!videoDom) return console.warn('videoDom is null')
    const width = parseInt(videoDom.style.width.replace('px', ''))
    const height = parseInt(videoDom.style.height.replace('px', ''))
    // 设置容器宽高
    containerInfo.value = {
      height,
      width,
    }
    // 设置缩放比例尺
    scaleInfo.value = {
      height: Number((height / videoInfo.value.height).toFixed(4)),
      width: Number((width / videoInfo.value.width).toFixed(4)),
    }
    console.debug('scaleInfo', scaleInfo)
    // 添加mark层
    const markContainer = document.createElement('canvas')
    markContainer.id = 'video-mark-container'
    markContainer.width = width
    markContainer.height = height
    markContainer.style.position = 'absolute'
    markContainer.style.top = '0px'
    markContainer.style.left = '0px'
    markContainer.style.zIndex = '1'
    playerDom.appendChild(markContainer)
    ctx.value = markContainer.getContext('2d', { willReadFrequently: true })
  }

  // 清理标注层
  function clearRects() {
    ctx.value.clearRect(0, 0, containerInfo.value.width, containerInfo.value.height)
  }
  // canvas绘制
  function drawRects(position: Array<number>) {
    // 计算四个点坐标
    const [leftTopX, leftTopY, width, height] = position
    ctx.value.beginPath()
    ctx.value.strokeStyle = 'red'
    ctx.value.lineWidth = 2
    ctx.value.strokeRect(
      leftTopX * scaleInfo.value.width,
      leftTopY * scaleInfo.value.height,
      width * scaleInfo.value.width,
      height * scaleInfo.value.height,
    )
  }
  // 设置标注
  // 标注数组[[leftTopX, leftTopY, width, height]]
  function setRects(marks: Array<Array<number>>) {
    if (!ctx.value) return console.warn('ctx is null')
    clearRects()
    marks.forEach((mark) => {
      drawRects(mark)
    })
  }

  onBeforeMount(() => {
    destroyPlayer()
  })

  return {
    player,
    initPlayer,
    startPlay,
    destroyPlayer,
    setRects,
    clearRects,
  }
}
