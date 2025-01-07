<template>
  <div class="space">
    <div>
      <h1>Rect从中心放大</h1>
      <svg width="200" height="200">
        <rect fill="none" class="animate1" x="50" y="50" width="100" height="100" stroke="red"></rect>
      </svg>
    </div>
    <div>
      <h1>Polygon沿路径闭合</h1>
      <svg width="200" height="200">
        <polygon
          class="animate2"
          points="10,10 100,10 100,100 10,100"
          fill="none"
          stroke="red"
          stroke-width="2"
        ></polygon>
      </svg>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
svg {
  border: 1px solid green;
}

.animate1 {
  animation: growRect 2s ease-in;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes growRect {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.animate2 {
  animation: lineMove 3s linear forwards;
}
@keyframes lineMove {
  0% {
    stroke-dasharray: 0 1000;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 1000 1000;
    stroke-dashoffset: 0;
  }
}
</style>
