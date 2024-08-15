export default { content: `<template>
  <div id="player1" style="width: 500px; height: 400px"></div>
  <button @click="onAddRect">添加方框标注</button>
  <button @click="clearRects()">移除方框标注</button>
</template>

<script setup>
import { usePlayer } from '@cqfe/vue-hooks'
import { onMounted } from 'vue'

const { initPlayer, startPlay, setRects, clearRects } = usePlayer(
  'player1',
  location.origin + '/player/jessibuca-pro.js',
  location.origin + '/player/decoder-pro.js',
)

function onAddRect() {
  setRects([
    [100, 100, 200, 150],
    [200, 300, 200, 150],
  ])
}

onMounted(() => {
  initPlayer({}) // 可以传入播放器的初始化配置
    .then(() => {
      startPlay(
        'https://1500005692.vod2.myqcloud.com/43843706vodtranscq1500005692/62656d94387702300542496289/v.f100240.m3u8',
      )
    })
})
</script>
` }