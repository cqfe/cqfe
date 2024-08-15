---
title: useAmap
date: 2024-08-14
author: leo
email: <leolichuan@qq.com>
---

<script setup>
    import UseAmap from '../components/UseAmap.vue'
    import code from '../componentsCode/UseAmap.js'
</script>

# useAmap

## 简介

高德地图的初始化封装，支持在线和离线地图初始化，返回高德地图对象、地图实例、初始化方法。

## 参数

| 参数名  | 类型   | 必填 | 默认值            | 说明                              |
| ------- | ------ | ---- | ----------------- | --------------------------------- |
| key     | string | 是   |                   | 高德地图的key                     |
| code    | string | 是   |                   | 高德地图的code                    |
| config  | string | 是   |                   | 高德地图初始化的配置              |
| mapRef  | string | 是   |                   | 挂载容器的ref                     |
| offline | string | 否   | `false`           | 是否离线                          |
| imgUrl  | string | 否   | `location.origin` | 离线地图瓦片图的加载url           |
| jsUrl   | string | 否   | `location.origin` | 离线地图js文件（AMap3.js）加载url |

## 示例

<useAmap />

## 使用代码

```js-vue
{{ code.content }}
```

## 离线地图使用方式

1. 静态资源存放：`{workspace}/public/amap/`文件夹下存放`2.0.1`,`AMap3.js`,`init.js`,`mapsplugin.js`文件
2. 瓦片图命名应该为：`{z}/{x}/{y}/title.png`
3. 根据部署的地址配置`imgUrl`参数，图片加载地址为`${imgUrl}/${z}/${x}/${y}/tile.png`
4. 离线模式时code，key参数无需填写真实值
5. 离线地图只能使用默认主题，如需使用深色模式，参考canvas滤镜

```js
const [layerDom] = document.getElementsByClassName('amap-layers')
if (layerDom && layerDom?.children?.[0]?.nodeName === 'CANVAS') {
    ;(layerDom.children[0] as any).style.filter =
    'grayscale(100%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1600%) brightness(60%) contrast(70%)'
}
```

6. 离线地图插件功能有限，请参考[文章](https://blog.csdn.net/weixin_44640245/article/details/133421126)
