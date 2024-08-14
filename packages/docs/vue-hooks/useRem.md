<script setup>
    import UseRem from '../components/UseRem.vue'
    import code from '../componentsCode/UseRem.js'
</script>

# useRem

## 简介

单页面的rem适配方案，支持动态修改根元素字体大小。在项目都需要适配的情况下请使用`postcss-pxtorem`插件方案。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| ------ | ---- | ---- | ------ | ---- |
| 无     |

## 示例

<UseRem />

## 使用代码

```js-vue
{{code.content}}
```
