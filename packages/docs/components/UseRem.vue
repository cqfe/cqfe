<template>
  <div>
    <p>当前缩放信息(可修改窗口大小进行响应)：</p>
    <pre>{{ JSON.stringify(scaleInfo, null, 2) }}</pre>
  </div>
</template>

<script setup>
import { useRem } from '@cqfe/vue-hooks'

const { scaleInfo } = useRem()
</script>
