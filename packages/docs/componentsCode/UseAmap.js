export default { content: `<template>
  <div ref="mapRef"></div>
</template>

<script setup>
import { useAmap } from '@cqfe/vue-hooks'
import { ref } from 'vue'

const mapRef = ref(null)
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

onMounted(() => {
  initMap()
})
</script>
` }