<script setup>
    import AnimateOffsetPath from '../components/AnimateOffsetPath.vue'
    import code from '../componentsCode/AnimateOffsetPath.js'
</script>

## 示例

<AnimateOffsetPath />

## 说明

`dom` 元素通过 `offsetPath` 属性设置路径动画。元素会根据设定的`svg`路径进行移动，`svg`路径可在[svg-path-editor](https://yqnn.github.io/svg-path-editor/)根据图片描边生成

## 使用代码

```js-vue
{{ code.content }}
```
