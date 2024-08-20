<template>
  <div class="cqfe-table">
    <table>
      <thead>
        <tr>
          <td
            v-for="(item, i) in columns"
            :key="item.dataIndex"
            :class="props.headTdClass"
            :style="{ ...props.headTdStyle, width: item.width ? `${item.width}px` : undefined }"
          >
            <span v-if="!isHeadCellRender(item)">{{ item.title }}</span>
            <slot v-else name="headCell" :column="item" :index="i"></slot>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in props.dataSource"
          :key="index"
          :style="props.bodyTrStyle"
          @click="emit('onClickCell', item)"
          @dblclick="emit('onDbClickCell', item)"
        >
          <td v-for="(each, i) in columns" :key="i" :class="props.bodyTdClass" :style="props.bodyTdStyle">
            <span v-if="!isBodyCellRender(each, item)">{{ item[each.dataIndex] }}</span>
            <slot v-else name="bodyCell" :column="each" :record="item" :index="i" :text="item[each.dataIndex]"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties, computed, useSlots } from 'vue'
// import { TableColumn, TableRow } from '../../index'

export interface TableColumn {
  title: string
  dataIndex: string
  width?: number
  hidden?: boolean
}

export interface TableRow {
  [key: string]: any
}

defineOptions({
  name: 'CTable',
})

const props = defineProps<{
  columns: Array<TableColumn>
  dataSource: Array<TableRow>
  bodyTdStyle?: CSSProperties
  headTdStyle?: CSSProperties
  bodyTrStyle?: CSSProperties
  bodyTdClass?: string
  headTdClass?: string
}>()
const emit = defineEmits(['onClickCell', 'onDbClickCell'])
const slots = useSlots()
const columns = computed(() => {
  return props.columns.filter((item) => !item.hidden)
})

// 判断是否是自定义渲染Body
function isBodyCellRender(column: TableColumn, record: TableRow) {
  if (!slots.bodyCell) return false
  const ret = slots.bodyCell({ column, record, text: record[column.dataIndex] })
  const isExist = !!ret.find((each) => Array.isArray(each.children) || (each.children && each.children !== 'v-if'))
  return isExist
}

// 判断是否是自定义渲染Head
function isHeadCellRender(column: TableColumn) {
  if (!slots.headCell) return false
  const ret = slots.headCell({ column })
  const isExist = !!ret.find((each) => Array.isArray(each.children) || (each.children && each.children !== 'v-if'))
  return isExist
}
</script>

<style scoped lang="scss">
.cqfe-table {
  min-width: 100%;
  color: #dcf4ff;
  font-size: 12px;
  overflow: scroll;

  & > table {
    min-width: 100%;
  }

  & > table > thead > tr > td {
    text-align: left;
    color: #e9bd67;
    font-weight: 500;
    padding: 4px 8px;
    background: #0080a9;
    white-space: nowrap;
  }

  & > table > tbody > tr > td {
    background: rgba(32, 185, 245, 0.12);
    border-bottom: 1px solid rgba(203, 234, 255, 0.24);
    text-align: left;
    padding: 6px 8px;
    white-space: nowrap;
  }

  & > table > tbody > tr > td:first-child {
    border-left: 0;
  }

  & > table > tbody > tr:last-child > td {
    background-color: #0080a9;
  }

  & > table > tbody > tr:hover {
    opacity: 0.7;
  }
}
</style>
