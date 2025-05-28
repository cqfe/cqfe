import signale from 'signale'
import { SdfeOptions } from './types'
import * as path from 'path'
import * as fs from 'fs'
import { CONFIG_NAME, CONFIG_SUFFIX, PROCESS_CWD } from './constants'

export const logger = signale.scope('SDFE')

export function existsConfigFile(dir: string = PROCESS_CWD): string | null {
  let ret: string | null = null
  CONFIG_SUFFIX.forEach((suffix) => {
    const fileName = CONFIG_NAME + suffix
    const filePath = path.join(dir, fileName)
    if (fs.existsSync(filePath) && !ret) ret = filePath
  })
  return ret
}

// 查找配置文件，支持 .cdfe.js 和 .cdfe.cjs，从当前目录递归向上查找
export function findConfigFile(startDir: string = PROCESS_CWD): string | null {
  let dir = startDir
  let filePath: string | null = null
  while (!filePath) {
    filePath = existsConfigFile(dir)
    const parent = path.dirname(dir)
    if (parent === dir) break // 已到根目录
    dir = parent
  }
  return null
}

// 读取合并配置文件
export const getConfig = (): SdfeOptions => {
  const configPath = findConfigFile()
  if (!configPath) {
    logger.warn('未找到配置文件 .cdfe.js 或 .cdfe.cjs')
    return {} as SdfeOptions
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const originConfig = require(configPath) as SdfeOptions
  return originConfig
}
