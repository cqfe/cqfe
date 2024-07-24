
/**
 * 根据给定的键从查询字符串中获取对应的值
 *
 * @param key 查询字符串中的键
 * @param query 查询字符串，默认为当前页面的查询字符串（document.location.search）
 * 
 * @returns 返回查询字符串中对应键的值，若不存在则返回null
 */
export function getQueryByKey(key: string, query = document.location.search) {
    const queryObj = new URLSearchParams(query)
    return queryObj.get(key)
}