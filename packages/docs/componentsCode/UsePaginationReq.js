export default { content: `<template>
  <div>
    <label>loading: </label>
    <span>{{ loading }}</span>
  </div>
  <div>
    <label>dataSource: </label>
    <span>{{ JSON.stringify(dataSource, undefined, 2) }}</span>
  </div>
  <div>
    <label>pagination: </label>
    <span>{{ JSON.stringify(pagination, undefined, 2) }}</span>
  </div>
  <div>
    <button @click="resetPage()">重置分页</button>
    <button @click="fetchList()">获取数据</button>
    <button @click="changePage()">修改分页</button>
  </div>
</template>

<script setup>
import { usePaginationReq } from '@/vue-hooks'

const { loading, dataSource, pagination, resetPage, fetchList, changePage } = usePaginationReq(async () => ({
  data: {
    total: parseInt(Math.random() * 100),
    current: 1,
    records: [{ a: 1 }],
  },
}))
</script>

<style scoped lang="scss"></style>
` }