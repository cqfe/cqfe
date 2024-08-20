<template>
  <Table
    :head-td-style="{
      fontSize: '20px',
    }"
    :body-td-style="{
      cursor: 'pointer',
    }"
    :columns="columns"
    :data-source="dataSource"
    @on-click-cell="onClickCell"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'name'"> body:{{ record.name }} </template>
    </template>
    <template #headCell="{ column }">
      <template v-if="column.dataIndex === 'name'"> head:{{ column.title }} </template>
    </template>
  </Table>
</template>

<script setup>
import { Table } from '@cqfe/vue-components'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
]
const dataSource = [
  {
    name: 'leo',
    age: 18,
  },
  {
    name: 'jack',
    age: 28,
  },
]

function onClickCell(record) {
  alert('onClickCell, record:\n' + JSON.stringify(record, null, 2))
}
</script>

<style scoped lang="scss"></style>
