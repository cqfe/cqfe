import { existsSync, rmSync, writeFileSync } from 'fs'

// split by string and convert to camelCase
export function toCamelCase(str: string) {
  return str
    .replace(/{/g, '')
    .replace(/}/g, '')
    .replace(/[-_/]([a-z|A-Z|0-9])/g, (match, p1) => p1.toUpperCase())
}

// init output file in disk
export function initOutPutFile(outPut: string, servicePath: string) {
  const isExits = existsSync(outPut)
  if (isExits) rmSync(outPut, { recursive: true })
  writeFileSync(outPut, `${servicePath}\n`)
}

export function formatVarName(str: string) {
  // 去除字符串两端的空白字符
  let validStr = str.trim()
  // 将非字母、数字、下划线、美元符号的字符替换为下划线
  validStr = validStr.replace(/[^\w$]/g, '')
  // 如果是以数字开头，在前面添加下划线
  if (/^\d/.test(validStr)) {
    validStr = '_' + validStr
  }
  return validStr
}
