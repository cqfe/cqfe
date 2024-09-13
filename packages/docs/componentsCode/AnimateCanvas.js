export default { content: `<template>
  <div class="space">
    <div>
      <h1>动画1</h1>
      <canvas id="myCanvas" ref="ref1" width="200" height="200" class="canvas-animate"></canvas>
    </div>
    <div>
      <h1>动画2</h1>
      <canvas id="myCanvas2" ref="ref2" width="200" height="200" class="canvas-animate"></canvas>
    </div>
    <div>
      <h1>动画3</h1>
      <canvas id="myCanvas3" ref="ref3" width="200" height="200" class="canvas-animate"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const ref1 = ref()
const ref2 = ref()
const ref3 = ref()

// Animate1
function drawRectAnimate(x, y, w, h, step, ctx) {
  let width = 0
  let height = 0
  function drawRectangle() {
    ctx.strokeStyle = 'red'
    ctx.strokeRect(x, y, width, height)
  }
  function animate() {
    ctx.clearRect(x, y, width, height)
    width += step
    height += step
    drawRectangle()
    if (width >= w || height >= h) {
      step = 0
    } else {
      requestAnimationFrame(animate)
    }
  }
  animate()
}

// Animate2
function drawLineAnimate(x, y, w, h, step, ctx) {
  // 起点x
  let preX = x
  // 起点y
  let preY = y
  // 当前x
  let currX = x
  // 当前y
  let currY = y
  function drawLine() {
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(preX, preY)
    ctx.lineTo(currX, currY)
    ctx.stroke()
    preX = currX
    preY = currY
  }
  function animate() {
    drawLine()
    if (currX < x + w && currY === y) {
      currX = Math.min(currX + step, x + w)
    } else if (currX === x + w && currY < y + h) {
      currY = Math.min(currY + step, y + h)
    } else if (x < currX && currY <= y + h) {
      currX = Math.max(currX - step, x)
    } else if (currX === x && currY > y) {
      currY = Math.max(currY - step, y)
    }
    if (currX !== x || currY !== y) {
      requestAnimationFrame(animate)
    } else {
      ctx.beginPath()
      ctx.moveTo(preX, preY)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }
  animate()
}

// Animate3
function drawRectAnimateScale(x, y, w, h, step, ctx) {
  const centerX = x + w / 2
  const centerY = y + h / 2
  let topX = x
  let topY = y
  let sideW = 0
  let sideH = 0

  function drawRectangle() {
    ctx.strokeStyle = 'red'
    topX = centerX - sideW / 2
    topY = centerY - sideH / 2
    ctx.strokeRect(topX, topY, sideW, sideH)
  }

  function animate() {
    // 清除画布
    ctx.clearRect(topX, topY, sideW, sideH)
    if (sideH < h) {
      sideH = Math.min(sideH + step, h)
    }
    if (sideW < w) {
      sideW = Math.min(sideW + step, w)
    }
    drawRectangle()
    if (sideH < h || sideW < w) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

onMounted(() => {
  function startAnimate() {
    ref1.value.getContext('2d').clearRect(0, 0, 200, 200)
    drawRectAnimate(50, 50, 100, 50, 1, ref1.value.getContext('2d'))
    ref2.value.getContext('2d').clearRect(0, 0, 200, 200)
    drawLineAnimate(50, 50, 100, 50, 5, ref2.value.getContext('2d'))
    ref3.value.getContext('2d').clearRect(0, 0, 200, 200)
    drawRectAnimateScale(50, 50, 100, 50, 2, ref3.value.getContext('2d'))
  }
  startAnimate()
  setInterval(() => startAnimate(), 3000)
})
</script>

<style lang="scss">
.canvas-animate {
  border: 1px solid gray;
}
.canvas-animate:first-child {
  margin-bottom: 10px;
}
</style>
` }