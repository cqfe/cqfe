export default { content: `<template>
  <div class="animate-offset-path">
    <div ref="domRef" class="dot"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const domRef = ref()
onMounted(() => {
  domRef.value.style.offsetPath =
    'path("M 275 180 L 183 150 L 94 197 L 114 291 L 263 400 L 429 294 L 451 190 L 367 138")'
})
</script>

<style scoped lang="scss">
.animate-offset-path {
  width: 500px;
  height: 500px;
  border: 1px solid gray;
}
.dot {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  animation: motion 10s infinite linear;
}
@keyframes motion {
  0% {
    offset-distance: 0%;
  }

  100% {
    offset-distance: 100%;
  }
}
</style>
` }