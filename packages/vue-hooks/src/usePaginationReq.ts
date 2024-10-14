import { nextTick, reactive, ref, shallowRef } from 'vue'

export function usePaginationReq(
  req: (query: Record<string, unknown>) => Promise<Record<string, any>>,
  formatResFn: <T>(res: T) => T,
  pageSize = 10,
) {
  // 分页
  const pagination = reactive({ total: 0, current: 1, pageSize })
  // 加载状态
  const loading = ref(false)
  // 表格数据
  const dataSource = shallowRef([])
  // 上次请求的查询参数
  let lastQuery = {}

  function fetchList(query = {}) {
    lastQuery = query
    loading.value = true
    return req({
      size: pagination.pageSize,
      current: pagination.current,
      query,
    })
      .then((res) => {
        const formatRes = formatResFn ? formatResFn(res) : res
        dataSource.value = formatRes.data.records
        pagination.total = formatRes.data.total
        pagination.current = formatRes.data.current
        return res
      })
      .finally(() => {
        loading.value = false
      })
  }

  function changePage(page: Record<string, number>, refresh = true) {
    pagination.current = page.current
    pagination.pageSize = page.pageSize
    pagination.total = page.total
    if (refresh) {
      nextTick(() => {
        fetchList(lastQuery)
      })
    }
  }

  function resetPage() {
    pagination.current = 1
    pagination.pageSize = pageSize
    pagination.total = 0
  }

  return { loading, dataSource, pagination, resetPage, fetchList, changePage }
}
