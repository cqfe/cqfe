<script setup>
    import UseAutoScroll from '../components/UseAutoScroll.vue'
    import code from '../componentsCode/UseAutoScroll.js'
</script>

# useAutoScroll

## 简介

元素重复自动滚动，可控制暂停，开始。hover时会暂停滚动。

## 参数

| 参数名 | 类型   | 必填 | 默认值 | 说明          |
| ------ | ------ | ---- | ------ | ------------- |
| domRef | string | 是   |        | 挂载容器的ref |

## 示例

<UseAutoScroll />

## 使用代码

```js-vue
{{code.content}}
```
