import { existsSync, rmSync, writeFileSync } from 'fs'

// split by string and convert to camelCase
export function toCamelCase(str: string) {
  return str
    .replace(/{/g, '')
    .replace(/}/g, '')
    .replace(/[-_/]([a-z|A-Z])/g, (match, p1) => p1.toUpperCase())
}

// init output file in disk
export function initOutPutFile(outPut: string, servicePath: string) {
  const isExits = existsSync(outPut)
  if (isExits) rmSync(outPut, { recursive: true })
  writeFileSync(outPut, `${servicePath}\n`)
}
