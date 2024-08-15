export default { content: `<template>
  <h2>在线</h2>
  <div ref="mapRef" style="width: 500px; height: 400px"></div>
  <h2>离线</h2>
  <div ref="mapRef2" style="width: 500px; height: 400px"></div>
</template>

<script setup>
import { useAmap } from '@cqfe/vue-hooks'
import { ref, onMounted } from 'vue'

// 在线地图ref
const mapRef = ref(null)
// 离线地图ref
const mapRef2 = ref(null)

// 配置在线地图
const { initMap } = useAmap(
  '9f4417f5d54b3d187f8dc3c605fda3fe',
  'fee1445fff5b109cb204894256018c72',
  {
    zoom: 14,
    mapStyle: 'amap://styles/grey',
    resizeEnable: true,
    center: [108.388401, 30.803332],
  },
  mapRef,
)
// 配置离线地图
const { initMap: initMap2 } = useAmap(
  '9f4417f5d54b3d187f8dc3c605fda3fe',
  'fee1445fff5b109cb204894256018c72',
  {
    zoom: 10,
    mapStyle: 'amap://styles/grey',
    resizeEnable: true,
    center: [108.388401, 30.803332],
  },
  mapRef2,
  true,
  location.origin + '/normal',
  location.origin + '/amap/AMap3.js',
)

onMounted(() => {
  // 初始化在线地图
  initMap()
  // 初始化离线地图
  initMap2()
})
</script>
` }