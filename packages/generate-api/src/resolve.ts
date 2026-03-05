/**
 * 生成函数名（处理重名）
 */
export function resolveName(method: string, path: string, existingNames?: Set<string>) {
  // handle when function name is repeated
  let name = `${method}${toCamelCase(path)}`
  while (!/^.+[a-z|A-Z|0-9]$/.test(name)) {
    name = name.slice(0, -1)
  }
  name = formatVarName(name)
  if (!existingNames) return name
  // 处理重名
  let finalName = name
  let index = 1
  while (existingNames.has(finalName)) {
    finalName = `${name}V${index}`
    index++
  }
  existingNames.add(finalName)

  return finalName
}

/**
 * split by string and convert to camelCase
 */
export function toCamelCase(str: string) {
  return str
    .replace(/{/g, '')
    .replace(/}/g, '')
    .replace(/[-_/]([a-z|A-Z|0-9])/g, (_match, p1) => p1.toUpperCase())
}

/**
 * format variable name
 * @param str - 要格式化的字符串
 * @param capitalizeFirst - 是否大写首字母，默认 false
 */
export function formatVarName(str: string, capitalizeFirst: boolean = false) {
  // 去除字符串两端的空白字符
  let validStr = str.trim()
  // 将非字母、数字、下划线、美元符号的字符替换为下划线
  validStr = validStr.replace(/[^\w$]/g, '')
  // 如果是以数字开头，在前面添加下划线
  if (/^\d/.test(validStr)) {
    validStr = '_' + validStr
  }
  // 如果 capitalizeFirst 为 true，大写首字母
  if (capitalizeFirst && validStr.length > 0) {
    validStr = validStr.charAt(0).toUpperCase() + validStr.slice(1)
  }
  return validStr
}
