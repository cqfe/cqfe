---
title: usePlayer
date: 2024-08-07
author: leo
email: <leolichuan@qq.com>
---

<script setup>
    import UsePlayer from '../components/UsePlayer.vue'
    import code from '../componentsCode/UsePlayer.js'
</script>

# useEvent

## 简介

[JessibucaPro](https://jessibuca.com/) 播放器组件的封装，用于播放视频流，可以通过`setRects`方法在播放器上层添加标注（会根据视频尺寸信息和rect中尺寸信息作比例尺缩放）。

## 参数

| 参数名    | 类型   | 必填 | 默认值 | 说明           |
| --------- | ------ | ---- | ------ | -------------- |
| elementId | String | 是   |        | 播放器组件的id |
| decodeUrl | String | 是   |        | 解码器的url    |

## 示例

<UsePlayer />

## 使用代码

```js-vue
{{ code.content }}
```

## 注意事项

1. `decoder-pro-hard.js`,`decoder-pro-simd.js`,`decoder-pro-simd.wasm`,`decoder-pro.js`,`decoder-pro.wasm`文件需要放在同一个目录下
2. 播放器默认初始化配置如下，可通过传入`options`修改

```js
{
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
    ...options
}
```
