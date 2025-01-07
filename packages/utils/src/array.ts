/**
 * 将选项数组转换为键值对映射对象
 * @author <李川>
 *
 * @param options 选项数组，默认为空数组
 * @param key 用于映射对象中键的字段名，默认为 'label'
 * @param value 用于映射对象中值的字段名，默认为 'value'
 *
 * @returns 返回键值对映射对象
 */
export function options2map(options = [], key = 'label', value = 'value') {
  return options.reduce((pre, curr) => {
    pre[curr[value]] = curr[key]
    return pre
  }, {})
}
