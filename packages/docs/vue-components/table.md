<script setup>
    import CqfeTable from '../components/CqfeTable.vue'
    import code from '../componentsCode/CqfeTable.js'
</script>

# Table

## 简介

## 参数

简单的table组件，支持表头、单元格样式自定义，主要用于大屏的Table展示，管理后台请使用[ant-design-vue](https://www.antdv.com/components/table-cn)

### Props

| 参数名      | 类型                                                                         | 必填 | 默认值 | 说明           |
| ----------- | ---------------------------------------------------------------------------- | ---- | ------ | -------------- |
| columns     | `Array<{title: string; dataIndex: string; width?: number;hidden?: boolean}>` | 是   | -      | 表头字段       |
| dataSource  | `Array<Record<string, any>>`                                                 | 是   | -      | 显示数据       |
| bodyTdStyle | `CSSProperties`                                                              | 否   | {}     | 表格单元格样式 |
| headTdStyle | `CSSProperties`                                                              | 否   | {}     | 表头单元格样式 |
| bodyTrStyle | `CSSProperties`                                                              | 否   | {}     | 表格行样式     |
| bodyTdClass | `String`                                                                     | 否   | {}     | 表格单元格类名 |
| headTdClass | `String`                                                                     | 否   | {}     | 表头单元格类名 |

### Emits

| 参数名        | 类型                                  | 必填 | 默认值 | 说明           |
| ------------- | ------------------------------------- | ---- | ------ | -------------- |
| onClickCell   | (record: Record<string, any>) => void | 否   | -      | 点击单元格事件 |
| onDbClickCell | (record: Record<string, any>) => void | 否   | -      | 双击单元格事件 |

### Slots

| 参数名   | 参数                            | 说明           |
| -------- | ------------------------------- | -------------- |
| bodyCell | `{record, column, index, text}` | 表格单元格内容 |
| headCell | `{column}`                      | 表头单元格内容 |

## 示例

<cqfe-table></cqfe-table>

## 使用代码

```js-vue
{{ code.content }}
```
