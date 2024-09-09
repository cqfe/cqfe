---
title: usePaginationReq
date: 2024-09-09
author: leo
email: <leolichuan@qq.com>
---

<script setup>
    import UsePaginationReq from '../components/UsePaginationReq.vue'
    import code from '../componentsCode/UsePaginationReq.js'
</script>

# usePaginationReq

## 简介

分页请求的封装，传入请求函数，返回响应式分页信息、列表数据、loading状态，同时提供对分页的修改方法，包括：修改分页信息，重置分页

## 参数

| 参数名      | 类型                                                                               | 必填 | 默认值 | 说明                      |
| ----------- | ---------------------------------------------------------------------------------- | ---- | ------ | ------------------------- |
| request     | `(query: Record<string, any>) => Promise<AxiosResponse>`                           | 是   | -      | 请求函数，返回Promise对象 |
| formatResFn | `(res: AxiosResponse) => {data: {records: any[],total: number, current: number} }` | 否   | -      | 格式化返回数据            |
| pageSize    | `number`                                                                           | 否   | `10`   | 每页显示条数              |

## 示例

<UsePaginationReq />

## 使用代码

```js-vue
{{ code.content }}
```

## ⚠️ 注意

- 需要手动调用`fetchList(query: Record<string, any>)`进行数据初始化
- 默认的处理响应数据格式 === `formatResFn`处理后返回的数据格式 为：

```
{
    data: {
        records: [{}]
        total: 100,
        current: 1
    }
}
```
