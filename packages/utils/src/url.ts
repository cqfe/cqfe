/**
 * 根据给定的键从查询字符串中获取对应的值
 *
 * @param key 查询字符串中的键
 * @param query 查询字符串，默认为当前页面的查询字符串（document.location.search）
 *
 * @returns 返回查询字符串中对应键的值，若不存在则返回null
 */
export function getQueryByKey(key: string, query = document.location.search) {
  const queryObj = new URLSearchParams(query);
  return queryObj.get(key);
}

/**
 * 加载并执行JavaScript脚本
 *
 * @param url JavaScript脚本的URL
 * @returns 返回一个Promise，加载成功时resolve为true，加载失败时reject为Error对象
 */
export function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve(true);
    script.onerror = (err) => reject(new Error(`Script load error: ${url}`));
    document.head.appendChild(script);
  });
}
