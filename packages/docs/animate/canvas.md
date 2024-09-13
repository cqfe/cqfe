<script setup>
    import AnimateCanvas from '../components/AnimateCanvas.vue'
    import code from '../componentsCode/AnimateCanvas.js'
</script>

## 示例

<AnimateCanvas />

## 说明

### 参数

| 参数 | 说明              |
| ---- | ----------------- |
| x    | 矩形框左上角X位置 |
| y    | 矩形框左上角Y位置 |
| w    | 矩形框宽度        |
| h    | 矩形框高度        |
| step | 动画步长          |
| ctx  | 画布对象          |

### ⚠️注意

动画1，动画3都是用的`ctx.strokeRect()`，在有重叠线框时会导致其他框被擦除，动画2使用的`ctx.lineTo()`没有这个问题

## 使用代码

```js-vue
{{ code.content }}
```
